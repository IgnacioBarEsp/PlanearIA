/**
 * Gate permanente del registro del rollout de theming (spec: theming-runtime-propagation).
 *
 * Ejercita el CLI real scripts/checkThemingRollout.mjs via spawnSync, igual que
 * el gate de codificacion: asi se prueba el contrato completo (codigo de salida
 * y reporte por entrada) sin depender de transforms de Jest para .mjs.
 *
 * Los fixtures negativos existen para que el gate no pueda pasar por vacuidad:
 * afirmar solo que el arbol actual esta sano no distingue una guardia que
 * funciona de una que no mira nada.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";

const SCRIPT = path.resolve(__dirname, "../../../scripts/checkThemingRollout.mjs");
const FIXTURES = path.resolve(__dirname, "fixtures/theming-rollout");

interface CliResult {
  status: number;
  output: string;
}

function runCheck(configPath: string, ceiling?: number): CliResult {
  const args = [SCRIPT, configPath];
  if (ceiling !== undefined) args.push("--ceiling", String(ceiling));
  const execution = spawnSync(process.execPath, args, { encoding: "utf8" });
  if (execution.error) throw execution.error;
  return {
    status: execution.status ?? 1,
    output: `${execution.stdout ?? ""}${execution.stderr ?? ""}`,
  };
}

describe("checkThemingRollout", () => {
  it("acepta un registro sano dentro de su techo", () => {
    const result = runCheck(path.join(FIXTURES, "eslintrc-valido.cjs"), 1);
    expect(result.status).toBe(0);
    expect(result.output).toContain("1 entrada(s) vivas");
  });

  it("detecta una entrada huerfana: el archivo listado ya no existe", () => {
    const result = runCheck(path.join(FIXTURES, "eslintrc-huerfana.cjs"), 2);
    expect(result.status).toBe(1);
    expect(result.output).toContain("[huerfana] pantalla-borrada.sample.tsx");
    // La entrada viva del mismo registro no se reporta: la guardia distingue.
    expect(result.output).not.toContain("[huerfana] con-colors.sample.tsx");
  });

  it("detecta una entrada muerta: el archivo existe pero ya no importa COLORS", () => {
    const result = runCheck(path.join(FIXTURES, "eslintrc-muerta.cjs"), 2);
    expect(result.status).toBe(1);
    expect(result.output).toContain("[muerta] sin-colors.sample.tsx");
    expect(result.output).not.toContain("[muerta] con-colors.sample.tsx");
  });

  it("detecta el crecimiento del registro aunque todas sus entradas esten vivas", () => {
    const result = runCheck(path.join(FIXTURES, "eslintrc-crecida.cjs"), 1);
    expect(result.status).toBe(1);
    expect(result.output).toContain("[techo] 2 entradas");
    expect(result.output).toContain("solo puede encoger");
    // Ninguna entrada es invalida: el unico hallazgo debe ser el techo.
    expect(result.output).toContain("1 hallazgo(s)");
  });

  it("no crece de forma silenciosa: el mismo registro pasa si el techo lo admite", () => {
    const result = runCheck(path.join(FIXTURES, "eslintrc-crecida.cjs"), 2);
    expect(result.status).toBe(0);
  });

  it("falla de forma explicita cuando no puede leer el registro", () => {
    const result = runCheck(path.join(FIXTURES, "eslintrc-ilegible.cjs"));
    expect(result.status).toBe(1);
    expect(result.output).toContain("No se pudo leer el registro del rollout");
    expect(result.output).toContain("se encontraron 0");
  });

  it("gate del repo: el registro real esta sano y dentro de su techo", () => {
    const result = runCheck(path.resolve(__dirname, "../../../.eslintrc.cjs"));
    expect(result.status).toBe(0);
  });
});
