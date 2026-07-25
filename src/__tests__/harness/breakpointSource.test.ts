/**
 * Gate permanente de la fuente unica de dimensiones (spec: reactive-breakpoints).
 *
 * Ejercita el CLI real scripts/checkBreakpointSource.mjs via spawnSync, igual
 * que los gates de codificacion y de theming: asi se prueba el contrato completo
 * (codigo de salida y reporte por entrada) sin depender de transforms de Jest
 * para .mjs.
 *
 * Los fixtures negativos existen para que el gate no pueda pasar por vacuidad:
 * afirmar solo que el arbol actual esta sano no distingue una guardia que
 * funciona de una que no mira nada.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const SCRIPT = path.resolve(__dirname, "../../../scripts/checkBreakpointSource.mjs");
const FIXTURES = path.resolve(__dirname, "fixtures/breakpoint-source");
const REPO_ROOT = path.resolve(__dirname, "../../..");

interface CliResult {
  status: number;
  output: string;
}

function runCheck(root: string, ceiling?: number): CliResult {
  const args = [SCRIPT, "--root", root];
  if (ceiling !== undefined) args.push("--ceiling", String(ceiling));
  const execution = spawnSync(process.execPath, args, { encoding: "utf8" });
  if (execution.error) throw execution.error;
  return {
    status: execution.status ?? 1,
    output: `${execution.stdout ?? ""}${execution.stderr ?? ""}`,
  };
}

describe("checkBreakpointSource", () => {
  it("acepta un arbol donde solo la fuente autorizada lee la primitiva", () => {
    const result = runCheck(path.join(FIXTURES, "valido"));
    expect(result.status).toBe(0);
    expect(result.output).toContain("1 autorizado(s)");
  });

  it("no cuenta como consumo el comentario que nombra la primitiva", () => {
    // El fixture valido incluye una pantalla migrada cuyo comentario menciona
    // useWindowDimensions(). Si la guardia mirara prosa, documentar la regla
    // la violaria y este caso fallaria.
    const result = runCheck(path.join(FIXTURES, "valido"));
    expect(result.status).toBe(0);
    expect(result.output).not.toContain("Migrada.sample.tsx");
  });

  it("detecta un consumidor no autorizado y no arrastra a los migrados", () => {
    const result = runCheck(path.join(FIXTURES, "no-autorizado"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("[no-autorizado] src/screens/Directa.sample.tsx");
    expect(result.output).toContain("1 hallazgo(s)");
    // La pantalla ya migrada del mismo arbol no se reporta: la guardia distingue.
    expect(result.output).not.toContain("Migrada.sample.tsx");
  });

  it("detecta la elusion por import de namespace, que el import con nombre no ve", () => {
    const result = runCheck(path.join(FIXTURES, "namespace"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("[no-autorizado] src/screens/Namespace.sample.tsx");
  });

  // Los dos casos siguientes salieron de la revision adversarial: la guardia
  // original solo miraba src/ y solo la primitiva, asi que dos vias de evasion
  // pasaban en silencio.
  it("detecta la lectura congelada, que no toca la primitiva y la spec ya prohibia", () => {
    const result = runCheck(path.join(FIXTURES, "congelada"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("[congelada] src/screens/Congelada.sample.tsx");
    expect(result.output).toContain("fija el ancho al importar");
    // No se reporta como consumidor no autorizado: es otra invariante.
    expect(result.output).not.toContain("[no-autorizado] src/screens/Congelada.sample.tsx");
  });

  it("cubre la superficie de produccion fuera de src/, como App.tsx", () => {
    const result = runCheck(path.join(FIXTURES, "fuera-de-src"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("[no-autorizado] App.tsx");
  });

  it("detecta una entrada muerta: la fuente autorizada ya no lee la primitiva", () => {
    const result = runCheck(path.join(FIXTURES, "muerta"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("[muerta] src/hooks/useBreakpoint.ts");
    expect(result.output).toContain("la autorizacion sobra");
  });

  it("detecta una entrada huerfana: la fuente autorizada no existe en el arbol", () => {
    const result = runCheck(path.join(FIXTURES, "huerfana"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("[huerfana] src/hooks/useBreakpoint.ts");
  });

  it("detecta el crecimiento de la lista aunque todas sus entradas esten vivas", () => {
    const result = runCheck(path.join(FIXTURES, "valido"), 0);
    expect(result.status).toBe(1);
    expect(result.output).toContain("[techo] 1 entradas");
    expect(result.output).toContain("solo puede encoger");
    // Ninguna entrada es invalida: el unico hallazgo debe ser el techo.
    expect(result.output).toContain("1 hallazgo(s)");
  });

  it("gate del repo: ningun archivo de produccion lee la primitiva por su cuenta", () => {
    const result = runCheck(REPO_ROOT);
    expect(result.status).toBe(0);
  });
});
