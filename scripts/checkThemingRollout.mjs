#!/usr/bin/env node

/**
 * Guardia del registro del rollout de theming (spec: theming-runtime-propagation).
 *
 * La lista LEGACY_COLORS_ROLLOUT de .eslintrc.cjs es el registro del rollout
 * pendiente, y su spec exige que la validacion del repositorio la mantenga
 * sincronizada con el codigo real. Esa validacion no existia: la lista acumulo
 * cuatro entradas invalidas (dos archivos borrados y dos ya migrados) sin que
 * nada fallara.
 *
 * La regla de ESLint no puede cubrir esto. Una entrada muerta es, por
 * definicion, un archivo que la regla ya no marca (no existe, o ya no importa
 * COLORS), asi que su silencio es indistinguible del exito. Verificar el
 * registro exige tratarlo como dato y compararlo contra el arbol real.
 *
 * Se lee la lista desde .eslintrc.cjs y no se copia a un archivo paralelo:
 * duplicar la fuente de verdad es justo el fallo que esta guardia corrige.
 */

import { createRequire } from "node:module";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

/**
 * Techo del registro. Solo puede bajar: bajarlo es parte de migrar una pantalla,
 * y subirlo obliga a editar este archivo, lo que un review ve. No pretende ser
 * infalsificable, sino que crecer el pendiente sea deliberado y visible en vez
 * del default silencioso que permitio el drift.
 */
export const ROLLOUT_CEILING = 50;

const DEFAULT_CONFIG = ".eslintrc.cjs";

// Mismo alcance que restringe la regla: el especificador COLORS en un named
// import, venga de themes/colors o del barrel types. Tolera imports multilinea.
const COLORS_IMPORT = /import\s*\{[^}]*\bCOLORS\b[^}]*\}\s*from\s*["'][^"']+["']/;

export function readRolloutList(configPath) {
  const resolved = path.resolve(configPath);
  if (!existsSync(resolved)) {
    throw new Error(`No existe el archivo de configuracion ${configPath}.`);
  }
  delete require.cache[resolved];
  const config = require(resolved);
  const overrides = Array.isArray(config?.overrides) ? config.overrides : [];
  // El registro es el unico override que APAGA la restriccion: ese es el que
  // autoriza el color estatico legacy. Anclar por posicion o por longitud de la
  // lista haria que un reordenamiento silenciara la guardia.
  const matches = overrides.filter((override) => override?.rules?.["no-restricted-imports"] === "off");
  if (matches.length !== 1) {
    throw new Error(
      `Se esperaba exactamente un override que apague no-restricted-imports en ${configPath}; se encontraron ${matches.length}.`,
    );
  }
  const files = matches[0].files;
  if (!Array.isArray(files)) {
    throw new Error(`El override del registro en ${configPath} no declara una lista de archivos.`);
  }
  return files;
}

export function checkThemingRollout({
  configPath = DEFAULT_CONFIG,
  root = null,
  ceiling = ROLLOUT_CEILING,
} = {}) {
  const entries = readRolloutList(configPath);
  // Las entradas son rutas relativas a la ubicacion del config, igual que las
  // interpreta ESLint.
  const base = root ?? path.dirname(path.resolve(configPath));
  const findings = [];

  for (const entry of entries) {
    const full = path.resolve(base, entry);
    if (!existsSync(full) || !statSync(full).isFile()) {
      findings.push({ kind: "huerfana", entry, detail: "la entrada no corresponde a ningun archivo del repositorio" });
      continue;
    }
    if (!COLORS_IMPORT.test(readFileSync(full, "utf8"))) {
      findings.push({ kind: "muerta", entry, detail: "el archivo ya no importa COLORS: la migracion no se registro" });
    }
  }

  if (entries.length > ceiling) {
    findings.push({
      kind: "techo",
      entry: `${entries.length} entradas`,
      detail: `el registro supera su techo de ${ceiling}; solo puede encoger`,
    });
  }

  return { entries: entries.length, ceiling, findings };
}

function parseArgs(argv) {
  const options = { configPath: DEFAULT_CONFIG };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--ceiling") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 0) throw new Error("--ceiling requiere un entero no negativo.");
      options.ceiling = value;
      index += 1;
    } else {
      options.configPath = argv[index];
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
    report = checkThemingRollout(parseArgs(process.argv.slice(2)));
  } catch (error) {
    console.error(`No se pudo leer el registro del rollout: ${error.message}`);
    process.exit(1);
  }

  if (report.findings.length) {
    console.error(`Registro del rollout de theming invalido: ${report.findings.length} hallazgo(s).`);
    for (const finding of report.findings) {
      console.error(`  [${finding.kind}] ${finding.entry}: ${finding.detail}`);
    }
    process.exit(1);
  }
  console.log(`Registro del rollout de theming valido: ${report.entries} entrada(s) vivas, techo ${report.ceiling}.`);
}
