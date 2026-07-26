import { readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import { MIN_TOUCH_TARGET, minTargetBox, overflowMinTarget } from "../../../components/base/primitives";

/**
 * Guardia de area tactil real en web (#152, debt-c319ed19fe20).
 *
 * El problema que vigila: `hitSlop` NO existe en react-native-web. Un control que se apoya
 * solo en el conserva su tamano visual como area efectiva en el navegador. Medido en #114 y
 * reproducido en #152: los cierres de Sheet, Banner y Toast daban 28x28 reales y un punto a
 * 21pt del centro no los alcanzaba, incumpliendo la SHALL de 44 puntos que
 * `openspec/specs/cross-surface-assignment/spec.md` ya tenia publicada.
 *
 * Por que hace falta una guardia y no basta el arreglo: la leccion de las Olas 2a y 2b de
 * #141 es que una politica sin verificador se degrada en silencio, y que la evasion barata
 * es cambiar de primitiva. Este inventario obliga a declarar cada uso de `hitSlop` que
 * queda, y falla en las DOS direcciones: un uso nuevo sin declarar es deuda nueva, y una
 * entrada declarada que ya no usa `hitSlop` es una lista podrida que nadie limpio.
 *
 * Limite honesto: la guardia detecta la dependencia de `hitSlop`, no mide areas tactiles. Un
 * control que no use `hitSlop` y aun asi mida 20x20 la pasa. Medir cajas exigiria navegador
 * dentro de CI, que este repo no tiene hoy. El limite queda declarado, no disimulado.
 */

const RAIZ = path.join(__dirname, "..", "..", "..");

/**
 * Usos de `hitSlop` que siguen vivos, con su clasificacion medida en navegador el 2026-07-26.
 *
 * Ninguno es un permiso permanente: son los sitios que #152 midio y decidio NO migrar, para
 * no convertir un saneamiento de tres defectos en una migracion de trece archivos. Cada
 * entrada dice por que sigue ahi. Para quitar un archivo de la lista basta dejar de usar
 * `hitSlop` en el; para agregarlo hace falta justificarlo aqui.
 */
const INVENTARIO: Record<string, string> = {
  // Grupo B: un eje ya cumple por caja propia y el otro se apoya en hitSlop. Subir el alto a
  // 44 cambiaria la densidad de un control disenado a 32 y 28 puntos: es decision de diseno
  // con QA propia, no un reemplazo mecanico. Medido: Chip 103x32, cierre del Chip 16x16,
  // SyncStatusChip 203x28.
  "components/base/Chip.tsx": "Chip 103x32 y su cierre 16x16; el alto es decision de densidad",
  "components/sync/SyncStatusChip.tsx": "SyncStatusChip 203x28; mismo criterio de densidad",

  // Grupo C: hitSlop literal sobre controles legacy, cada uno en su propia pantalla y con su
  // propia QA visual. Medidos los alcanzables: ContenidoScreen "Mas opciones" 28x28 y
  // "Filtros" 60x18. Los demas comparten forma estructural con alguno ya medido.
  "components/ScreenBackButton.tsx": "caja propia de 40x40: falla por 4 puntos, no por falta de caja",
  "components/Toast.tsx": "toast legacy, distinto del de la biblioteca base",
  "components/SyncStatusBanner.tsx": "control de reintento sobre icono de 18 sin caja propia",
  "components/ExpandedStatsModal.tsx": "cierre sobre icono de 22 sin caja propia",
  "screens/biblioteca/ListaRecursosScreen.tsx": "menu de recurso sobre icono de 20 sin caja",
  "screens/contenido/ContenidoScreen.tsx": "medido: 'Mas opciones' 28x28 y 'Filtros' 60x18",
  "screens/cuenta/CuentaScreen.tsx": "nueve toggles con TOGGLE_HIT_SLOP; pendiente de medir uno a uno",
};

/** Componentes de la biblioteca base cuyo cierre ya resuelve el minimo con caja real. */
const CIERRES_CON_CAJA_REAL = ["Sheet.tsx", "Banner.tsx", "Toast.tsx"];

const CARPETA_BASE = path.join(RAIZ, "components", "base");

function fuentesDeProduccion(dir: string, acumulado: string[] = []): string[] {
  for (const entrada of readdirSync(dir)) {
    const completa = path.join(dir, entrada);
    // Las pruebas hablan de hitSlop para verificarlo: incluirlas haria fallar la guardia
    // por su propio texto.
    if (entrada === "__tests__" || entrada === "__mocks__") continue;
    if (statSync(completa).isDirectory()) {
      fuentesDeProduccion(completa, acumulado);
      continue;
    }
    if (/\.tsx?$/.test(entrada)) acumulado.push(completa);
  }
  return acumulado;
}

const relativa = (archivo: string): string =>
  path.relative(RAIZ, archivo).split(path.sep).join("/");

/** Codigo sin comentarios: mencionar `hitSlop` al explicar por que no se usa no es usarlo. */
const soloCodigo = (archivo: string): string =>
  readFileSync(archivo, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

const usanHitSlop = (): string[] =>
  fuentesDeProduccion(path.join(RAIZ))
    .filter((archivo) => /\bhitSlop\b/.test(soloCodigo(archivo)))
    .map(relativa)
    .sort();

describe("guardia de area tactil real en web", () => {
  it("ningun control nuevo depende de hitSlop sin declararlo", () => {
    const declarados = Object.keys(INVENTARIO);
    const sinDeclarar = usanHitSlop().filter((archivo) => !declarados.includes(archivo));

    // Si esto falla: react-native-web no implementa hitSlop, asi que el control que acabas
    // de escribir mide en el navegador lo que mide su caja. Usa `minTargetBox()` de
    // components/base/primitives para darle 44x44 reales, y `overflowMinTarget(visual)` como
    // margen negativo si no quieres que el contenedor crezca. Si de verdad no puedes darle
    // caja, agrega el archivo al INVENTARIO explicando por que y registralo como deuda.
    expect(sinDeclarar).toEqual([]);
  });

  it("el inventario no conserva entradas que ya no usan hitSlop", () => {
    const vivos = usanHitSlop();
    const obsoletas = Object.keys(INVENTARIO).filter((archivo) => !vivos.includes(archivo));

    // Si esto falla: corregiste un sitio (bien) y toca borrar su linea del INVENTARIO. Una
    // lista que solo crece se convierte en una lista muerta que nadie vuelve a mirar.
    expect(obsoletas).toEqual([]);
  });

  it("los cierres de la biblioteca base resuelven el minimo con caja, no con hitSlop", () => {
    for (const componente of CIERRES_CON_CAJA_REAL) {
      const codigo = soloCodigo(path.join(CARPETA_BASE, componente));
      expect(codigo).not.toMatch(/\bhitSlop\b/);
      // La caja real es lo que viaja al DOM; sin ella el control vuelve a los 28x28.
      expect(codigo).toMatch(/minTargetBox\(\)/);
    }
  });
});

describe("primitivas de area tactil", () => {
  it("minTargetBox entrega la caja completa en ambos ejes", () => {
    const caja = minTargetBox();
    expect(caja.width).toBe(MIN_TOUCH_TARGET);
    expect(caja.height).toBe(MIN_TOUCH_TARGET);
    // Sin centrado la caja crece pero el icono se pega a una esquina.
    expect(caja.alignItems).toBe("center");
    expect(caja.justifyContent).toBe("center");
  });

  it("overflowMinTarget da el desborde por lado y cero cuando ya se cumple", () => {
    // 44 - 28 = 16, repartidos entre los dos lados.
    expect(overflowMinTarget(28)).toBe(8);
    expect(overflowMinTarget(MIN_TOUCH_TARGET)).toBe(0);
    // Nunca negativo: un control mas grande que el minimo no debe encogerse.
    expect(overflowMinTarget(60)).toBe(0);
  });
});
