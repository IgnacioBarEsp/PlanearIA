# Tasks: restaurar-fixture-estructural-doctor

## 1. Linea base y evidencia de causa raiz

- [x] 1.1 Registrar el estado del indice degradado y del rebuild en `evidencia/`: nodos del simbolo del fixture con y sin `id`, grado entrante por nodo, alcance del blanqueo e `impact` por UID antes y despues.
- [x] 1.2 Registrar en `evidencia/` la refutacion de la hipotesis de version: integridad del tarball instalado frente a `dist.integrity` del registro y fecha unica de publicacion de `1.6.10-rc.23`.
- [x] 1.3 Registrar en `evidencia/` la comprobacion `semver` del rango caret que `npx` escribe en su manifiesto efimero.
- [x] 1.4 Registrar en `evidencia/` el `harness:doctor` de partida (FAIL en `gitnexus`) y el `harness:doctor` tras el rebuild (PASS).

## 2. Recuperacion estructural en `repair`

- [x] 2.1 Anadir a `scripts/gitNexusFts.mjs` la constante de argumentos del rebuild completo (`clean --force`) junto a `REINDEX_ARGS` y `REPAIR_FTS_ARGS`.
- [x] 2.2 Extender `repair` para que, tras confirmar la frescura, ejecute `runStructuralVerification` con el mismo runner inyectado.
- [x] 2.3 Implementar la escalada: si la verificacion estructural falla, ejecutar el rebuild completo y volver a verificar; si sigue fallando, lanzar nombrando el fixture sin resolver.
- [x] 2.4 Comprobar que `FIXTURE_UID`, `FIXTURE_QUERY`, `verifyImpactResult`, `verifyQueryResult` y `runStructuralVerification` quedan sin modificar, y que `scripts/harnessDoctor.mjs` no se toca.

## 3. Regresion

- [x] 3.1 Cubrir en `scripts/testGitNexusFts.mjs` que `repair` escala al rebuild completo cuando la verificacion estructural falla tras un reindex exitoso, afirmando la secuencia de subcomandos emitida.
- [x] 3.2 Cubrir que `repair` lanza si la verificacion estructural sigue fallando tras el rebuild, y que no reporta exito por frescura.
- [x] 3.3 Cubrir que `repair` no ejecuta el rebuild cuando la verificacion estructural pasa a la primera.
- [x] 3.4 Probar la no vacuidad: contra un `target.id` distinto del fixture la verificacion falla; dejar constancia de la corrida mutada en `evidencia/`.
- [x] 3.5 Actualizar las aserciones de secuencia existentes de `repair` sin relajar su intencion (la ruta de solo lectura sigue sin emitir `analyze`).

## 4. Higiene documental

- [x] 4.1 Actualizar en `PLAN_UXUI_NAVEGACION_GLOBAL.md` el estado de `theming-runtime`, `breakpoints-reactivos` y `tokens-completos` al estado real, con su change archivado e issue.
- [x] 4.2 Barrer el resto del documento y corregir solo los estados que se puedan verificar contra `openspec/changes/archive/` o los issues; dejar constancia de lo verificado y lo no modificado.
- [x] 4.3 Actualizar en `.agents/` la descripcion de la recuperacion de GitNexus para que refleje el criterio estructural, y sincronizar los espejos con `npm run agent:harness:sync`.

## 5. Validacion

- [x] 5.1 `npm run test:gitnexus` y `npm run test:harness:doctor`.
- [x] 5.2 `npm run harness:doctor` sin el FAIL de `gitnexus`.
- [x] 5.3 `npm run typecheck` y `npm run lint -- --quiet`.
- [x] 5.4 `npm test -- --runInBand` (verde salvo la falla local conocida de `spreadsheetDependency`).
- [x] 5.5 `npm run test:project-os-contract` (el brief citaba `test:debt-control`, que no existe en package.json), `npm run agent:harness:check` y `npm run openspec:validate`.

## 6. Cierre

- [x] 6.1 Crear `TLDR.md` y `brownfield-baseline.md` con sus ocho secciones.
- [x] 6.2 Crear `readiness.json` con superficies `harness` y `docs`.
- [x] 6.3 Revision adversarial en contexto limpio; corregir Blockers y Majors.
- [x] 6.4 Capturar el assessment de deuda con el duplicado de #148 y los dos `external-risk` (rango caret de npx y degradacion del indice), mas el flujo de aceptacion con sus excepciones aprobadas.
- [x] 6.5 `npm run openspec:ready:archive -- --change restaurar-fixture-estructural-doctor --run-local` en PASS.
