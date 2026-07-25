# Brownfield baseline: restaurar la verificacion estructural del doctor

Levantado sobre `development@b967275` el 2026-07-25. Documenta solo la superficie que este change toca.

## Superficies tocadas

- `scripts/gitNexusFts.mjs`: exclusivamente la funcion `repair` (`:209-240`) y la zona de constantes de
  argumentos (`:196-197`). Todo lo demas del archivo se lee pero no se modifica.
- `scripts/testGitNexusFts.mjs`: bloque de pruebas de `repair` (`:116-166`), que hoy fija la secuencia
  exacta de subcomandos emitidos.
- `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`: tres lineas de estado del backlog
  de Ola 0 (`:263`, `:282`, `:301`).
- `.agents/` y sus espejos generados `CLAUDE.md` y `AGENTS.md`: el parrafo que describe la recuperacion
  de GitNexus dentro de la seccion MCPs.
- `openspec/specs/gitnexus-index-health/spec.md`: via delta, la requirement de recuperacion.

`scripts/harnessDoctor.mjs` **no se toca**. El indice local `.gitnexus/` es estado generado e ignorado
por git: se reconstruye, no se versiona.

## Fuentes de verdad actuales

- `openspec/specs/gitnexus-index-health/spec.md`: verdad de comportamiento vigente. Define la
  clasificacion de frescura en tres estados, la verificacion estructural compartida, el fixture
  UID-desambiguado que debe resolver `exactly`, y la requirement de recuperacion cuyo unico criterio de
  exito hoy es la frescura.
- `scripts/gitNexusFts.mjs`: implementacion unica. `FIXTURE_UID` y `FIXTURE_QUERY` (`:6-8`),
  `classifyIndexFreshness` (`:23`), `verifyImpactResult` (`:78`), `runStructuralVerification` (`:247`),
  `repair` (`:209`).
- `scripts/harnessDoctor.mjs`: consumidor. `checkGitNexus` (`:104`) clasifica la frescura y solo despues
  ejecuta la verificacion estructural como subproceso.
- `Documentacion/03-validacion/reparar-gitnexus-fts/README.md`: evidencia original del fixture
  (2026-07-14), con el `impact` por UID resolviendo `Function:` y un dependiente directo.
- `openspec/changes/archive/2026-07-19-gitnexus-frescura-doctor/evidencia/06-validacion-final.txt`:
  ultimo `PASS gitnexus` registrado con ese mismo fixture.

## Comportamiento vigente

`npm run gitnexus:repair` ejecuta `analyze --index-only`, reintenta una vez, escala a `--repair-fts` mas
un reindex final, y **cierra comprobando unicamente la frescura**: si `classifyIndexFreshness` sobre
`status` devuelve `fresh`, imprime la salida y termina en 0.

Sobre un indice fresco eso lo convierte en un no-op: `analyze --index-only` responde `Already up to
date`, la frescura sigue siendo `fresh` y la recuperacion reporta exito sin haber tocado nada. Es
exactamente lo que ocurrio en #149: el indice estaba fresco en `b967275` y estructuralmente degradado, y
dos `gitnexus:repair` consecutivos no cambiaron el resultado.

Estado degradado medido: el nodo `Function` del simbolo del fixture conservaba sus 2 aristas entrantes
pero tenia la propiedad `id` vacia, de modo que `impact --uid Function:...` respondia `not found`;
`impact` por nombre devolvia dos candidatos, uno con `uid` vacio y 202 impactados y otro `Const:` con 0.
El dano alcanzaba 2272 de 2298 nodos `Function` (solo 26 con `id` utilizable) mas 973 nodos `Section`.

`npm run harness:doctor` reportaba `FAIL gitnexus: El indice esta fresco pero la verificacion
estructural no resolvio su fixture`, sin ruta de recuperacion documentada que lo resolviera.

## Comportamiento objetivo

`repair` mide su exito por frescura **y** por resolucion estructural. Tras restaurar la frescura ejecuta
`runStructuralVerification`; si falla, o si no puede siquiera producir un veredicto porque el CLI muere,
escala a un rebuild completo (`clean --force` seguido de `analyze --index-only --name PlanearIA .`). El
rebuild se somete a las mismas post-condiciones que el reindex inicial: sin diagnostico FTS, indice
fresco y fixture resuelto. Si alguna sigue incumplida, o si el borrado o el reindex no se pueden
ejecutar, lanza nombrando ese paso, en vez de declarar exito por frescura.

`FIXTURE_UID` no cambia. La desambiguacion por UID y `epistemic === 'exact'` se conservan, y ningun FAIL
se degrada a WARN.

## Compatibilidad legacy

No hay formato, clave ni contrato legacy en juego. El change no toca AsyncStorage, claves
`@planearia:*`, `src/sync`, esquemas de datos, backend ni proyecto nativo.

La superficie de comandos npm se conserva intacta: `gitnexus:diagnose`, `gitnexus:repair` y
`gitnexus:verify` siguen siendo los mismos tres puntos de entrada, con la misma semantica externa. No se
expone un cuarto comando: la spec prohibe una segunda ruta de recuperacion paralela, asi que el rebuild
completo vive **dentro** de `repair` y no como script propio.

El camino feliz de `repair` conserva su forma actual y solo suma la verificacion de lectura; un indice
sano ve el mismo resultado que hoy, con unos segundos mas de comprobacion.

## Owner de spec y contexto

Spec: `openspec/specs/gitnexus-index-health/spec.md`, creada por #50 (`reparar-gitnexus-fts`) y ampliada
por #112 (`gitnexus-frescura-doctor`). Plan owner: `preparacion-operativa-sdd-harness`. Issue: #149.
Detectado al cerrar #106 (Ola 2b del epic #141), fuera de su alcance.

Contexto DDD: contexto de soporte *Harness y operacion SDD*. No cruza Planeaciones, Classroom, Sync, IA
ni Cuenta. El simbolo del fixture pertenece a Planeaciones pero se usa como dato de prueba de solo
lectura, nunca como codigo bajo cambio.

## Evidencia actual

- `npm run debt:check` PASS: los cuatro planes en 0/5 unidades, cero deuda abierta, cero pausas.
- `npm run agent:harness:check` OK con 36 espejos en paridad.
- `npm run harness:doctor` FAIL unicamente en `gitnexus` al levantar la baseline; PASS completo tras el
  rebuild completo manual, con el fixture `Function:` resolviendo `epistemic: exact` y 1 dependiente
  directo.
- Integridad del tarball instalado igual a `dist.integrity` del registro para `1.6.10-rc.23`, con una
  sola fecha de publicacion (`2026-07-14T16:28:07Z`): descarta la hipotesis de rc republicado.
- Un commit seguido de `analyze --index-only` sobre el indice sano **no** reprodujo el blanqueo
  (2298/2298 conservaron su `id`): el mecanismo de acumulacion queda sin probar y se registra como tal.

## Fuera de alcance

- Cambiar `FIXTURE_UID`, `FIXTURE_QUERY` o la version fijada de GitNexus.
- Hacer el fixture agnostico al kind, relajar `epistemic === 'exact'` o degradar el FAIL a WARN.
- Modificar `scripts/harnessDoctor.mjs` o el orden frescura-antes-que-estructura que exige la spec.
- Corregir el rango caret que `npx` escribe en su manifiesto efimero: se registra como `external-risk`
  con evidencia, sin tocar el wrapper.
- Anadir a la escalada un peldano no verificado como `analyze --force`.
- Reabrir #141, #129 o #126; tocar `debt-f7ff020d5dee`, `debt-5862d25288fa` o `debt-770acc1e9d53`.
- La falla local preexistente de `src/__tests__/harness/spreadsheetDependency.test.ts` en Windows
  (tarball vendorizado de SheetJS, de #133/#126; pasa en CI) y los `<button>` anidados del menu de
  cuenta.
- Cualquier trabajo de producto UX/UI: la higiene documental del plan solo corrige estados, no altera
  alcance ni prioridad de ningun change.
