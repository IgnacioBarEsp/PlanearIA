# Proposal: sanear-residuales-post-clases-uxui

Issue: [#161](https://github.com/RitualBoat/PlanearIA/issues/161), saneamiento del plan
`uxui-navegacion-global` gobernado por #101 y por la subepica #157.

## Why

El cierre aprobado de Clases registro cuatro Minors que dejaron el plan UX/UI en 7/5 y pausado, aunque
dos describen fronteras Figma/runtime y otro fue causado por usar un origen distinto al procedimiento de
QA vigente. Debemos convertir esas observaciones en contratos comprobables antes de iniciar Escritorio,
sin editar el registro, fingir capacidades del conector ni ampliar CORS por conveniencia.

## What Changes

- Versionar el contrato minimo de rollback Figma: historial automatico, frames historicos, seccion con
  version/estado y evidencia enlazada; una version nombrada es opcional si la herramienta la soporta.
- Definir el handoff Figma -> runtime por roles semanticos y ownership: los cambios runtime mapean roles a
  `ColorTokens`/`useAppTheme` y no copian hex del prototipo.
- Resolver la frontera de daltonismo: Figma no depende del color para comunicar estado y runtime valida
  los modos funcionales mediante `DaltonismoContext`; un modo Figma se reabre solo con evidencia.
- Fijar `http://localhost:8081` como origen web canonico de QA y exigir preflight del origen exacto antes
  de afirmar evidencia contra backend remoto.
- Capturar un assessment `kind: remediation` que resuelva los cuatro IDs con evidencia y sin candidatos
  nuevos; `debt:check` y `debt:sync` decidiran la reanudacion y el cierre del issue.
- Actualizar el plan UX/UI, el contrato #157, Diseño Anti-Slop y Golden Journeys solo donde deban conservar
  estas reglas transversales.
- Mantener todas las tareas pendientes hasta que el owner apruebe explicitamente estos artefactos y
  ordene `apply`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `figma-prototype-navigation`: precisa el rollback soportado, el uso de roles semanticos y la frontera de
  accesibilidad entre prototipo perceptual y preferencias funcionales del runtime.
- `golden-journeys-qa`: precisa origen local canonico, preflight CORS y limites de las afirmaciones sobre
  backend/sync cuando la validacion usa otro host o no supera el preflight.

## Impact

- Documentacion: `PLAN_UXUI_NAVEGACION_GLOBAL.md`, `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md`,
  `DISENO_ANTI_SLOP.md` y `GOLDEN_JOURNEYS_QA_VISUAL.md`.
- OpenSpec: dos delta specs, evidencia de saneamiento, readiness y assessment inmutable de cierre.
- Deuda: `debt-facadc732321`, `debt-281fc7a2c9b0`, `debt-763ed774bc1e` y `debt-5be12c1b2fa0`.
- Sin cambios en Figma, React Native, backend, APIs, datos, storage, sync, dependencias o costos.

## No objetivos

- No redisenar Escritorio, Office u otro modulo; no implementar Clases runtime.
- No agregar modos Figma, tokens, orígenes CORS, dependencias ni servicios.
- No modificar `openspec/specs/` a mano ni editar assessments o registros inmutables.
- No declarar paridad Figma/runtime, cerrar #46 o sustituir pruebas con docentes.
- No ejecutar `apply`, archive, finish ni cerrar #161 sin los gates y aprobaciones correspondientes.
