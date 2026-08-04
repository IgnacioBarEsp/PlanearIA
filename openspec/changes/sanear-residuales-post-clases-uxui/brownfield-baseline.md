# Brownfield baseline: residuales post-Clases UX/UI

## Superficies tocadas

- Plan UX/UI global y contrato versionado #157.
- Guías Diseño Anti-Slop y Golden Journeys QA Visual.
- Delta specs `figma-prototype-navigation` y `golden-journeys-qa`.
- Evidencia y assessment del saneamiento de #161.

## Fuentes de verdad actuales

- #161 y assessment inmutable `.project-os/debt/assessments/reconstruir-clases-experiencia.json`.
- `openspec/specs/figma-prototype-navigation/spec.md` y `golden-journeys-qa/spec.md`.
- `src/themes/colors.ts`, `src/themes/useAppTheme.ts`, `ThemeContext` y `DaltonismoContext`.
- `backend/lib/auth.js`, `GOLDEN_JOURNEYS_QA_VISUAL.md` y el contrato CORS documentado.
- Evidencia 06, 07, 09, 13 y 16 del change archivado de Clases.

## Comportamiento vigente

El plan exige tokens, señales no dependientes del color, rollback y QA con HTTP 200, pero no fija en un
solo contrato el mínimo soportado de rollback, la traducción de roles Figma a runtime ni la frontera de
daltonismo. CORS admite `localhost:8081`; la comparación de Clases usó `127.0.0.1:8081` y no validó backend.
Los cuatro residuales permanecen abiertos y el plan está pausado 7/5.

## Comportamiento objetivo

Las olas Figma verifican rollback sin depender de una API opcional, documentan roles semánticos y señales
no-color, y delegan preferencias funcionales al runtime. La QA usa `localhost:8081`, prueba el preflight
del origen exacto antes de afirmar integración y limita honestamente sesiones local-only. El motor resuelve
los cuatro IDs solo tras evidencia y deja el plan sin triggers.

## Compatibilidad legacy

No se cambian frames, colores, tokens, Contexts, endpoints, allowlists, rutas, claves locales ni datos. Las
guías anteriores siguen siendo compatibles; se precisan condiciones que ya respetan el default CORS y los
contratos de theming. Los assessments existentes permanecen inmutables y las specs principales solo se
actualizan mediante archive.

## Owner de spec y contexto

- `figma-prototype-navigation`: owner del grafo, estados, aprobación y rollback del prototipo.
- `golden-journeys-qa`: owner del procedimiento y evidencia QA visual.
- Contexto DDD: Experiencia y Preferencias; Seguridad/autorización conserva CORS como capacidad transversal.
- No hay entidades compartidas, transferencia de ownership ni contrato de datos cruzado.

## Evidencia actual

- Gate `openspec:ready:propose -- --issue 161`: PASS.
- GitNexus reparado y verificado fresco sobre `f1ae5a4`.
- Lectura exacta confirma CORS default para `localhost:8081` y filtros runtime de daltonismo.
- Prueba read-only: localhost se refleja; 127.0.0.1 cae al origen seguro por defecto.
- Clases v1.3 aprobada conserva sección versionada, frames históricos e historial automático.

## Fuera de alcance

Figma, React Native, backend, datos, storage, sync, IA, dependencias, tokens y nuevos orígenes CORS. No se
rediseña ningún módulo, no se implementa Clases runtime, no se cierra #46 ni se abre la ola Escritorio. No
se ejecuta apply sin aprobación humana explícita de estos artefactos.

