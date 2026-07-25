#!/usr/bin/env node

/**
 * Guardia de la fuente unica de dimensiones (spec: reactive-breakpoints).
 *
 * `useBreakpoint()` es la fuente reactiva unica de ancho, alto y rango desde
 * #79, y el shell la consume desde #81. Pero nada impedia que un archivo
 * leyera `useWindowDimensions()` por su cuenta: 27 lo hacian al abrir #106.
 *
 * Por que un script y no una regla de ESLint. El issue proponia
 * `no-restricted-imports`, "el mismo mecanismo que #78 uso para COLORS". Seria
 * vacuo en 10 de esos 27 archivos: el override del registro
 * LEGACY_COLORS_ROLLOUT de .eslintrc.cjs apaga esa regla ENTERA para sus 50
 * entradas, y 10 consumidores de ancho estan ahi. ESLint apaga por nombre de
 * regla, no por restriccion individual, asi que no hay forma de conservar una
 * restriccion y apagar la otra si comparten nombre. Y checkThemingRollout.mjs
 * exige exactamente un override que la apague, asi que separarlos romperia la
 * guardia de la Ola 2a.
 *
 * Ademas, una regla de lint nunca puede ver una entrada muerta del registro:
 * esa es justo la que ya no marca, y su silencio es indistinguible del exito.
 * Esa mitad del contrato exige tratar el registro como dato y compararlo
 * contra el arbol real. Mismo patron que checkSourceEncoding.mjs (#132) y
 * checkThemingRollout.mjs (#145).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Unicos archivos de produccion autorizados a leer la primitiva de la
 * plataforma. La lista vive aqui y en ningun otro lugar: duplicar la fuente de
 * verdad es el fallo que esta guardia corrige.
 */
export const AUTHORIZED_SOURCES = ["src/hooks/useBreakpoint.ts"];

/**
 * Techo de la lista autorizada. Solo puede bajar. No pretende ser
 * infalsificable, sino que autorizar una segunda fuente exija editar este
 * archivo, lo que un review ve, en vez de ser el default silencioso.
 */
export const SOURCE_CEILING = 1;

const PRODUCTION_ROOT = "src";
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

/**
 * Archivos de produccion que viven fuera de `src/`. La lista sale del propio
 * `.eslintrc.cjs`, que declara la superficie de producto como
 * `["src/**\/*.ts", "src/**\/*.tsx", "App.tsx"]`. Omitir `App.tsx` dejaba un
 * punto ciego: es el arranque de la app y podia reintroducir la lectura directa
 * sin que la guardia dijera nada.
 */
const EXTRA_PRODUCTION_FILES = ["App.tsx"];

/**
 * Los tests quedan fuera por regla estructural, no por lista: necesitan nombrar
 * la primitiva para simular anchos (src/__tests__/hooks/useBreakpoint.test.tsx
 * ya lo hace) y no son superficie de producto. Al ser una regla y no una lista,
 * no puede pudrirse como una entrada muerta.
 */
const EXCLUDED_DIRECTORIES = new Set(["__tests__"]);

const SYMBOL = "useWindowDimensions";

// Un import con nombre, tolerando multilinea, igual que el patron de #145.
const NAMED_IMPORT = new RegExp(`import\\s*\\{[^}]*\\b${SYMBOL}\\b[^}]*\\}\\s*from\\s*["'][^"']+["']`);
// Un sitio de llamada, que cubre la forma de namespace (`RN.useWindowDimensions()`)
// que el import con nombre no ve.
const CALL_SITE = new RegExp(`\\b${SYMBOL}\\s*\\(`);

/**
 * La otra forma de reintroducir una segunda fuente de ancho, y la peor: una
 * lectura instantanea que congela el valor al importar el modulo. La spec
 * `reactive-breakpoints` ya la prohibe desde #79 ("no aparece ninguna
 * ocurrencia en src/"), pero ninguna verificacion lo comprobaba.
 *
 * Sin esto la guardia es evadible: basta escribir `Dimensions.get("window").width`
 * en vez de `useWindowDimensions()` para obtener un ancho congelado sin que nada
 * falle, que es exactamente el bug que #79 elimino.
 *
 * Ningun archivo esta autorizado: `useBreakpoint` tampoco la usa. Por eso no
 * participa de la lista autorizada ni de su techo.
 */
const FROZEN_READ = /\bDimensions\s*\.\s*get\s*\(/;

/**
 * Los comentarios se retiran antes de comparar: esta guardia describe
 * comportamiento, y una nota de diseno que nombre la primitiva no es un
 * consumidor. Sin esto, documentar la regla la violaria.
 */
export function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
}

export function readsWindowDimensions(source) {
  const code = stripComments(source);
  return NAMED_IMPORT.test(code) || CALL_SITE.test(code);
}

export function readsFrozenDimensions(source) {
  return FROZEN_READ.test(stripComments(source));
}

export function collectSourceFiles(root) {
  const files = [];
  const walk = (directory) => {
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name)) continue;
        walk(full);
      } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
        files.push(full);
      }
    }
  };
  walk(root);
  return files.sort();
}

export function checkBreakpointSource({
  root = process.cwd(),
  authorized = AUTHORIZED_SOURCES,
  ceiling = SOURCE_CEILING,
} = {}) {
  const findings = [];
  const authorizedSet = new Set(authorized.map((entry) => entry.split(path.sep).join("/")));

  // Invariantes 1 y 2 sobre toda la superficie de produccion: `src/` mas los
  // archivos sueltos que `.eslintrc.cjs` tambien trata como producto.
  const productionRoot = path.join(root, PRODUCTION_ROOT);
  const extras = EXTRA_PRODUCTION_FILES.map((entry) => path.resolve(root, entry)).filter(
    (full) => existsSync(full) && statSync(full).isFile(),
  );
  let scanned = 0;
  for (const file of [...collectSourceFiles(productionRoot), ...extras]) {
    const relative = path.relative(root, file).split(path.sep).join("/");
    const source = readFileSync(file, "utf8");
    scanned += 1;

    // Invariante 1: ningun consumidor de la primitiva fuera de la lista.
    if (!authorizedSet.has(relative) && readsWindowDimensions(source)) {
      findings.push({
        kind: "no-autorizado",
        entry: relative,
        detail: `lee ${SYMBOL} directo; usa useBreakpoint() de src/hooks/useBreakpoint, que ya expone width, height, fontScale y el rango`,
      });
    }

    // Invariante 2: ninguna lectura congelada, en ningun archivo, ni siquiera
    // en la fuente autorizada. Es la via de evasion mas barata de la
    // invariante 1 y la spec ya la prohibia sin verificador.
    if (readsFrozenDimensions(source)) {
      findings.push({
        kind: "congelada",
        entry: relative,
        detail: "usa Dimensions.get(), que fija el ancho al importar el modulo; usa useBreakpoint(), que es reactivo",
      });
    }
  }

  // Invariante 3: ninguna entrada muerta ni huerfana en la lista autorizada.
  for (const entry of authorized) {
    const full = path.resolve(root, entry);
    if (!existsSync(full) || !statSync(full).isFile()) {
      findings.push({ kind: "huerfana", entry, detail: "la entrada no corresponde a ningun archivo del repositorio" });
      continue;
    }
    if (!readsWindowDimensions(readFileSync(full, "utf8"))) {
      findings.push({
        kind: "muerta",
        entry,
        detail: `el archivo ya no lee ${SYMBOL}: la autorizacion sobra y debe retirarse`,
      });
    }
  }

  // Invariante 4: la lista no crece por encima de su techo.
  if (authorized.length > ceiling) {
    findings.push({
      kind: "techo",
      entry: `${authorized.length} entradas`,
      detail: `la lista autorizada supera su techo de ${ceiling}; solo puede encoger`,
    });
  }

  return { authorized: authorized.length, ceiling, scanned, findings };
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--ceiling") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 0) throw new Error("--ceiling requiere un entero no negativo.");
      options.ceiling = value;
      index += 1;
    } else if (argv[index] === "--root") {
      options.root = argv[index + 1];
      index += 1;
    }
  }
  return options;
}

// Entrypoint independiente de plataforma: en POSIX process.argv[1] empieza con
// "/" y una plantilla `file:///${...}` produce cuatro barras, con lo que el
// bloque CLI no corre en Linux/CI y el gate pasa en vacio (bug real de #132).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let report;
  try {
    report = checkBreakpointSource(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(`No se pudo verificar la fuente de dimensiones: ${error.message}`);
    process.exit(1);
  }

  if (report.findings.length) {
    console.error(`Fuente de dimensiones invalida: ${report.findings.length} hallazgo(s).`);
    for (const finding of report.findings) {
      console.error(`  [${finding.kind}] ${finding.entry}: ${finding.detail}`);
    }
    process.exit(1);
  }
  console.log(
    `Fuente de dimensiones valida: ${report.scanned} archivo(s) de produccion revisados, ${report.authorized} autorizado(s), techo ${report.ceiling}.`,
  );
}
