# Restaurar la verificacion estructural del doctor de GitNexus

## Why

`npm run harness:doctor` reporta FAIL en el check `gitnexus` con el indice **fresco**: la verificacion
estructural no resuelve su fixture (#149). La hipotesis del issue era que el indexador habia
reclasificado el simbolo de `Function:` a `Const:` y que el fixture estaba desactualizado. La
investigacion la refuta: el binario fijado no cambio, el simbolo no cambio, y el fixture describe la
verdad. Lo que se degrado fue el indice local, donde 2272 de 2298 nodos `Function` perdieron su
propiedad `id` conservando sus aristas.

El defecto de fondo es otro y es del repositorio, no del proveedor: `npm run gitnexus:repair` mide su
exito **solo** por la frescura del indice. Sobre un indice fresco y estructuralmente degradado termina
en 0 con `Already up to date` sin cambiar nada, es decir declara exito dejando rota la ruta de code
intelligence primaria. La unica secuencia de recuperacion documentada no recupera el estado que
efectivamente se produjo.

Importa ahora porque el fixture es el unico verificador estructural del doctor y el doctor es el gate
de arranque de todo flujo SDD. Mientras la recuperacion no cubra esta dimension, el arranque queda
bloqueado sin salida documentada.

## What Changes

- `repair` deja de medir su exito solo por frescura: tras restaurar la frescura verifica la
  **estructura** con la misma implementacion compartida que usan `verify` y el doctor.
- Cuando un indice fresco no resuelve el fixture, `repair` escala a un rebuild completo
  (`clean --force` seguido de `analyze --index-only`) y vuelve a verificar. Si tras el rebuild sigue sin
  resolver, falla con causa accionable en vez de declarar exito.
- `FIXTURE_UID` **no cambia**. Se conserva
  `Function:src/hooks/useCrearPlaneacionViewModel.ts:useCrearPlaneacionViewModel` porque describe el
  nodo que realmente porta las aristas del grafo.
- Regresion en `scripts/testGitNexusFts.mjs` que habria atrapado este estado, probada por mutacion.
- Higiene documental: tres changes archivados del backlog de Ola 0 que el plan UX/UI seguia declarando
  `pendiente`, y la descripcion de la recuperacion en los espejos de agente.

No hay cambios BREAKING: la superficie de comandos y el contrato del fixture se conservan; el contrato
de la recuperacion se endurece.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `gitnexus-index-health`: la requirement de recuperacion hoy solo se define contra la staleness
  (`SHALL NOT report success while leaving the index classified as stale`). Se amplia para cubrir la
  degradacion estructural de un indice fresco: la recuperacion no puede reportar exito mientras el
  fixture estructural siga sin resolver, y debe escalar a un rebuild completo antes de rendirse. Es un
  endurecimiento del contrato, no una relajacion: no toca la desambiguacion por UID, ni
  `epistemic === 'exact'`, ni degrada ningun FAIL a WARN.

## Impact

- `scripts/gitNexusFts.mjs`: solo `repair` y la constante de argumentos del rebuild. `FIXTURE_UID`,
  `FIXTURE_QUERY`, `verifyImpactResult`, `verifyQueryResult`, `classifyIndexFreshness` y
  `runStructuralVerification` quedan intactos.
- `scripts/testGitNexusFts.mjs`: nueva cobertura de la escalada; se actualizan las aserciones de
  secuencia de `repair` que hoy fijan la lista exacta de subcomandos.
- `scripts/harnessDoctor.mjs`: **sin cambios**. Su orden frescura-antes-que-estructura lo exige la spec
  vigente y es correcto.
- `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`: tres estados obsoletos.
- `.agents/` y sus espejos `CLAUDE.md` / `AGENTS.md`: descripcion de la recuperacion.
- Sin impacto en codigo de producto, almacenamiento, backend, sync, IA ni UI. Sin QA Playwright.
- Riesgo registrado aparte, sin corregir aqui: `npx -y gitnexus@<version>` escribe un rango caret en su
  manifiesto efimero, de modo que la version fijada solo esta garantizada mientras sobreviva el
  lockfile de esa cache.
