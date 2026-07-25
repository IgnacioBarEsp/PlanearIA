import assert from 'node:assert/strict';
import {
  FIXTURE_UID,
  FRESH,
  GITNEXUS_VERSION,
  STALE,
  UNCLASSIFIABLE,
  assertDiagnosticStatusHealthy,
  buildWindowsGitNexusInvocation,
  classifyIndexFreshness,
  findUnexpectedAgentChanges,
  hasFtsDiagnostic,
  hasRepositoryDiagnostic,
  repair,
  runStructuralVerification,
  verifyImpactResult,
  verifyQueryResult,
} from './gitNexusFts.mjs';

// Salidas reales del CLI fijado, capturadas el 2026-07-19 (evidencia 02-cadenas-estado.txt).
const STALE_STATUS = [
  'Repository: C:\\Planear IA\\PlanearIA',
  "Workspace index: last analyzed on 'development' (re-run gitnexus analyze to follow the current branch)",
  'Indexed commit: cca8116',
  'Current commit: 6b6e23c',
  'Status: ⚠️ stale (re-run gitnexus analyze)',
].join('\n');
const FRESH_STATUS = [
  'Repository: C:\\Planear IA\\PlanearIA',
  'Indexed commit: 1d4dcb0',
  'Current commit: 1d4dcb0',
  'Status: ✅ up-to-date',
].join('\n');

assert.equal(hasFtsDiagnostic('FTS indexes missing — keyword search degraded.'), true);
assert.equal(hasFtsDiagnostic('Status: up-to-date'), false);
assert.equal(hasRepositoryDiagnostic('Not a git repository.'), true);
assert.equal(hasRepositoryDiagnostic('Repository: C:\\repo'), false);
assert.throws(() => assertDiagnosticStatusHealthy('Not a git repository.'), /repository root/i);

// La clasificacion se ancla a la linea Status: y tolera la decoracion del CLI.
assert.equal(classifyIndexFreshness(FRESH_STATUS), FRESH);
assert.equal(classifyIndexFreshness(STALE_STATUS), STALE);
assert.equal(classifyIndexFreshness(''), UNCLASSIFIABLE);
assert.equal(classifyIndexFreshness('Repository: C:\\repo\nIndexed commit: abc1234'), UNCLASSIFIABLE);
assert.equal(classifyIndexFreshness('Status: reindexing in progress'), UNCLASSIFIABLE);
// Afirmar las dos cosas a la vez no es evidencia de nada.
assert.equal(classifyIndexFreshness('Status: up-to-date but stale'), UNCLASSIFIABLE);
// La palabra fuera de la linea de estado no clasifica: una ruta puede contener "stale".
assert.equal(classifyIndexFreshness('Repository: C:\\stale-repo\nStatus: ✅ up-to-date'), FRESH);
assert.equal(
  classifyIndexFreshness('Repository: C:\\up-to-date-backup\nStatus: ⚠️ stale (re-run gitnexus analyze)'),
  STALE,
);

// Un indice stale NO es sano: antes de #112 esta misma ruta con espacios afirmaba lo contrario y
// blindaba el falso verde del doctor.
assert.throws(() => assertDiagnosticStatusHealthy(STALE_STATUS), /stale/i);
assert.throws(() => assertDiagnosticStatusHealthy('Repository: C:\\Planear IA\\PlanearIA'), /classifiable/i);
assert.doesNotThrow(() => assertDiagnosticStatusHealthy(FRESH_STATUS));

const windowsInvocation = buildWindowsGitNexusInvocation(['status']);
assert.equal(windowsInvocation.command, 'C:\\Program Files\\nodejs\\node.exe');
assert.deepEqual(windowsInvocation.args, [
  'C:\\Program Files\\nodejs\\node_modules\\npm\\bin\\npx-cli.js',
  '-y',
  `gitnexus@${GITNEXUS_VERSION}`,
  'status',
]);

verifyQueryResult({ definitions: [{ id: 'File:src/hooks/useCrearPlaneacionViewModel.ts' }] });
assert.throws(() => verifyQueryResult({ definitions: [], process_symbols: [] }), /no structural context/i);

verifyImpactResult({ target: { id: FIXTURE_UID }, epistemic: 'exact' });
assert.throws(
  () => verifyImpactResult({ target: { id: FIXTURE_UID }, epistemic: 'estimated' }),
  /must be exact/i,
);

// La verificacion estructural solo puede leer: si algun dia emitiera analyze o una reparacion, la
// promesa read-only del doctor seria falsa sin que ninguna asercion lo notara.
const QUERY_OK = JSON.stringify({ definitions: [{ id: 'File:src/hooks/useCrearPlaneacionViewModel.ts' }] });
const IMPACT_OK = JSON.stringify({ target: { id: FIXTURE_UID }, epistemic: 'exact' });

function spyRunner(responses) {
  const issued = [];
  const runner = (args) => {
    issued.push(args);
    return responses[issued.length - 1];
  };
  return { issued, runner };
}

const readOnly = spyRunner([QUERY_OK, IMPACT_OK]);
assert.deepEqual(runStructuralVerification({}, readOnly.runner), { ok: true, reason: null });
assert.deepEqual(readOnly.issued.map((args) => args[0]), ['query', 'impact']);
for (const args of readOnly.issued) {
  assert.equal(args.some((arg) => /^(analyze|--repair-fts|--index-only)$/.test(arg)), false, args.join(' '));
}

// Los desenlaces de fallo devuelven un motivo clasificado en vez de lanzar, y no siguen adelante.
const emptyQuery = spyRunner([JSON.stringify({ definitions: [], process_symbols: [] })]);
const emptyResult = runStructuralVerification({}, emptyQuery.runner);
assert.equal(emptyResult.ok, false);
assert.match(emptyResult.reason, /no structural context/i);
assert.equal(emptyQuery.issued.length, 1);

const degradedFts = spyRunner(['FTS indexes missing']);
assert.equal(runStructuralVerification({}, degradedFts.runner).ok, false);

const badImpact = spyRunner([QUERY_OK, JSON.stringify({ target: { id: FIXTURE_UID }, epistemic: 'estimated' })]);
const badImpactResult = runStructuralVerification({}, badImpact.runner);
assert.equal(badImpactResult.ok, false);
assert.match(badImpactResult.reason, /must be exact/i);

// El impact que devolvia el indice degradado de #149: el nodo Const resuelve exacto porque conservo su
// UID, mientras el nodo Function que porta las aristas quedo sin UID y dejo de ser direccionable. Es la
// carga util que hace no vacuas las pruebas de abajo: si la verificacion la aceptara, el doctor pasaria
// en verde apuntando a un nodo sin radio de impacto.
const IMPACT_UID_DEGRADADO = JSON.stringify({
  target: { id: 'Const:src/hooks/useCrearPlaneacionViewModel.ts:useCrearPlaneacionViewModel' },
  epistemic: 'exact',
});
assert.notEqual(IMPACT_UID_DEGRADADO, IMPACT_OK);
assert.throws(
  () => verifyImpactResult(JSON.parse(IMPACT_UID_DEGRADADO)),
  /did not resolve the expected ViewModel UID/i,
  'el UID degradado debe ser rechazado; si pasara, la verificacion seria vacua',
);

// La recuperacion escala por los estados observados en #112: un analyze interrumpido deja el indice
// mid-incremental-recovery (donde --repair-fts se niega a correr y pide un analyze previo) y un FTS
// inconsistente hace fallar el reindex. Un solo intento no recupera ninguno de los dos.
// `structuralVerdicts` modela rondas sucesivas de verificacion estructural: 'ok' resuelve el fixture,
// 'uid-degradado' reproduce #149 (la query responde, el impact resuelve otro nodo).
function repairRunner(outcomes, structuralVerdicts = []) {
  const issued = [];
  let verdict = 'ok';
  const runner = (args) => {
    issued.push(args.join(' '));
    if (args[0] === 'status') return FRESH_STATUS;
    if (args[0] === 'query') {
      verdict = structuralVerdicts.length > 0 ? structuralVerdicts.shift() : 'ok';
      return QUERY_OK;
    }
    if (args[0] === 'impact') return verdict === 'ok' ? IMPACT_OK : IMPACT_UID_DEGRADADO;
    // `clean` no consume la cola de desenlaces: esa cola modela los reindex, que son los que fallan.
    if (args[0] === 'clean') return 'Deleted index';
    const outcome = outcomes.shift();
    if (outcome instanceof Error) throw outcome;
    return outcome ?? 'Repository indexed successfully';
  };
  return { issued, runner };
}

const subcomandos = (issued) => issued.map((entry) => entry.split(' ')[0]);

const firstTry = repairRunner([]);
repair({}, firstTry.runner);
assert.deepEqual(firstTry.issued.slice(0, 2), ['analyze --index-only --name PlanearIA .', 'status']);
// La frescura ya no cierra la recuperacion por si sola: despues comprueba que el grafo resuelva.
assert.deepEqual(subcomandos(firstTry.issued), ['analyze', 'status', 'query', 'impact']);
// Un indice que resuelve a la primera no se reconstruye: la escalada cuesta un rebuild completo.
assert.equal(firstTry.issued.some((entry) => entry.startsWith('clean')), false);

// Segundo intento: el reindex recupera el estado sucio que dejo un analyze interrumpido.
const retry = repairRunner([new Error('mid-incremental-recovery')]);
repair({}, retry.runner);
assert.deepEqual(retry.issued.slice(0, 2), [
  'analyze --index-only --name PlanearIA .',
  'analyze --index-only --name PlanearIA .',
]);

// Escalada: dos reindex fallidos llevan a --repair-fts y a un reindex final.
const escalated = repairRunner([
  new Error("FTS index 'file_fts' is inconsistent: term 'salud' is missing during delete."),
  new Error("FTS index 'file_fts' is inconsistent"),
]);
repair({}, escalated.runner);
assert.deepEqual(escalated.issued.slice(0, 5), [
  'analyze --index-only --name PlanearIA .',
  'analyze --index-only --name PlanearIA .',
  'analyze --repair-fts --index-only --name PlanearIA .',
  'analyze --index-only --name PlanearIA .',
  'status',
]);
assert.deepEqual(subcomandos(escalated.issued).slice(5), ['query', 'impact']);

// Si nada recupera, falla en vez de declarar exito.
const hopeless = repairRunner([new Error('boom'), new Error('boom'), new Error('boom'), new Error('boom')]);
assert.throws(() => repair({}, hopeless.runner), /could not rebuild the index/i);

// La recuperacion no puede declarar exito dejando el indice stale.
const stillStale = {
  issued: [],
  runner: (args) => (args[0] === 'status' ? STALE_STATUS : 'Repository indexed successfully'),
};
assert.throws(() => repair({}, stillStale.runner), /still not fresh/i);

// #149: el indice queda fresco pero el fixture estructural no resuelve. Sobre ese estado el reindex es
// un no-op ("Already up to date"), asi que medir el exito solo por frescura declaraba recuperada una
// ruta estructural rota. La recuperacion escala a un rebuild completo y vuelve a verificar.
const degradado = repairRunner([], ['uid-degradado', 'ok']);
repair({}, degradado.runner);
assert.deepEqual(subcomandos(degradado.issued), [
  'analyze', 'status', 'query', 'impact', 'clean', 'analyze', 'query', 'impact',
]);
assert.equal(degradado.issued[4], 'clean --force');
// El reindex del rebuild conserva --index-only: es lo que impide que analyze escriba archivos de agente.
assert.equal(degradado.issued[5], 'analyze --index-only --name PlanearIA .');

// Si el rebuild tampoco restaura el fixture, la recuperacion falla nombrando la causa en vez de
// aprobar por frescura.
const irrecuperable = repairRunner([], ['uid-degradado', 'uid-degradado']);
assert.throws(
  () => repair({}, irrecuperable.runner),
  /structural verification still fails/i,
);
assert.equal(irrecuperable.issued.filter((entry) => entry.startsWith('clean')).length, 1);

// El rebuild tampoco puede declarar exito si su propio reindex falla. El primer reindex si funciona:
// la cola entrega exito y despues el error, para que el fallo caiga en el reindex del rebuild.
const rebuildRoto = repairRunner([null, new Error('rebuild boom')], ['uid-degradado']);
assert.throws(
  () => repair({}, rebuildRoto.runner),
  /could not rebuild the index after a failed structural verification/i,
);

const unexpected = findUnexpectedAgentChanges(
  ' M AGENTS.md\n M .agents/instructions/core.md\n M src/hooks/example.ts',
  ['AGENTS.md'],
);
assert.deepEqual(unexpected, ['.agents/instructions/core.md']);

process.stdout.write('GitNexus FTS verifier unit smoke passed.\n');
