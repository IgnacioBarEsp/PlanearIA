# Tasks: sanear-residuales-post-clases-uxui

Las tareas de implementación permanecieron pendientes hasta la aprobación explícita del owner y la orden
de `apply`. Cada `[x]` requiere evidencia; no se modifica el registro de deuda a mano.

## 1. Gate humano y contratos documentales

- [x] 1.1 Registrar en #161 la aprobacion explicita de proposal, design, delta specs, tasks, TLDR,
  brownfield baseline y readiness antes de iniciar cualquier mutacion de apply.
- [x] 1.2 Actualizar `PLAN_UXUI_NAVEGACION_GLOBAL.md` con el contrato transversal de rollback Figma,
  handoff por roles semanticos y frontera de daltonismo.
- [x] 1.3 Actualizar `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` para que las olas posteriores hereden el
  contrato y mantengan aprobación separada antes de cada apply.
- [x] 1.4 Actualizar `DISENO_ANTI_SLOP.md` con la tabla de roles/familias runtime y la condicion concreta
  para reabrir modos Figma de daltonismo.
- [x] 1.5 Actualizar `GOLDEN_JOURNEYS_QA_VISUAL.md` con `http://localhost:8081`, origen exacto, preflight
  CORS y limites de las afirmaciones local-only.

## 2. Evidencia por residual

- [x] 2.1 Documentar para `debt-facadc732321` el fallo atomico del checkpoint nombrado y verificar las
  cuatro condiciones del rollback soportado en la version aprobada de Clases.
- [x] 2.2 Documentar para `debt-281fc7a2c9b0` el inventario GitNexus/directo de `ColorTokens`,
  `ThemeContext`, `DaltonismoContext` y `useAppTheme`, junto con la tabla Figma -> familia runtime.
- [x] 2.3 Documentar para `debt-763ed774bc1e` que los estados Figma conservan señal no-color y que la
  simulacion funcional pertenece al runtime, incluida la condicion de reapertura.
- [x] 2.4 Reproducir para `debt-5be12c1b2fa0` la matriz `localhost:8081` / `127.0.0.1:8081` contra
  `getCorsHeaders`, sin secretos ni red, y contrastarla con el runbook vigente.
- [x] 2.5 Verificar que el diff no toca Figma, `src/`, `backend/`, datos, storage, sync, dependencias ni
  `openspec/specs/` antes de archive.

## 3. Revision y validaciones

- [x] 3.1 Ejecutar `npm run openspec:validate` y validacion estricta del change; conservar salida en
  evidencia.
- [x] 3.2 Ejecutar `npm run agent:harness:check`, `git diff --check` y las validaciones documentales del
  perfil; corregir fallos sin ampliar alcance.
- [x] 3.3 Ejecutar revision adversarial independiente y resolver todo Blocker/Major; clasificar cada
  residual sin convertir warnings en deuda automaticamente.
- [x] 3.4 Actualizar `TLDR.md`, `brownfield-baseline.md` y `readiness.json` si cambian alcance, archivos,
  comportamiento o evidencia esperada.

## 4. Debt Control Loop y cierre posterior

- [x] 4.1 Preparar un assessment `kind: remediation`, `result: clean`, sin candidatos nuevos y con
  `resolves` separados para los cuatro IDs, cada uno respaldado por evidencia.
- [x] 4.2 Ejecutar `npm run debt:capture` solo despues de la revision; confirmar con `npm run debt:check`
  que el plan queda bajo 5 unidades y sin triggers.
- [x] 4.3 Ejecutar `npm run openspec:ready:archive -- --change sanear-residuales-post-clases-uxui
  --run-local` y exigir PASS sin excepciones silenciosas.
- [x] 4.4 Ejecutar `debt:sync`, publicar en #161 la evidencia y dejar el change listo para el flujo de
  archive/finish separado; el registro, no una edicion manual, decide el estado del issue.
