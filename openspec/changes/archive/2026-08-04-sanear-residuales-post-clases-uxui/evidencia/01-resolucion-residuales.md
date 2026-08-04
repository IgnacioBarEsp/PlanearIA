# Resolución verificable de residuales post-Clases

**Fecha:** 2026-08-04
**Issue:** [#161](https://github.com/IgnacioBarEsp/PlanearIA/issues/161)
**Change:** `sanear-residuales-post-clases-uxui`
**Tipo:** saneamiento documental/gobernanza; no modifica Figma, runtime ni backend.

## Método y salud estructural

GitNexus se reparó sobre el commit actual mediante `npm run gitnexus:repair`; el primer intento detectó
un `incrementalInProgress` residual y el wrapper forzó una reconstrucción completa. Resultado: `12,779`
nodos, `20,004` aristas, `335` clusters y `300` flows. `npm run gitnexus:verify` terminó en PASS. Las
consultas estructurales y las lecturas directas se limitaron a backend/auth, tokens/contextos y QA.

## `debt-facadc732321` — rollback Figma

La evidencia archivada `reconstruir-clases-experiencia/evidencia/13-aprobacion-promocion-clases.md` registra
que el conector rechazó de forma atómica el checkpoint nombrado antes de promover frames. La misma
evidencia verifica la sección aislada `177:115`, el contrato `179:115`, 83 frames propios promovidos y 22
puentes externos preservados como `candidate`; también declara historial automático Figma y reversión
documental como rollback. No se afirma que exista una versión nombrada.

**Resolución:** el contrato mínimo ahora exige historial automático, frames históricos sin inicio activo,
sección identificada por módulo/estado/versión y destino de restauración enlazado. Un checkpoint nombrado
queda opcional y solo se registra si el conector confirma su creación.

## `debt-281fc7a2c9b0` — roles Figma/runtime

GitNexus resolvió `ThemeProvider`, `DaltonismoProvider`, `useAppTheme`, `ALLOWED_ORIGINS` y los helpers
`getCorsHeaders`/`originMatchesAllowed`. Las lecturas directas confirman que `src/themes/colors.ts` posee
los tokens light/dark y que `src/themes/useAppTheme.ts` compone `ThemeContext`, `FontSizeContext`,
`DaltonismoContext` y `AccessibilityPreferencesContext`; el punto de consumo aplica daltonismo antes de
entregar `ColorTokens`.

La auditoría visual archivada (`evidencia/06-auditoria-visual-accesibilidad.md`) confirma el drift de
roles Figma (`bg/primary` terracota y `bg/ink` verde) frente al primario azul runtime. Las guías ahora
obligan a mapear roles (`canvas`, `surface`, `text`, `border`, `action`, `selection`, estados y elevación)
a familias de tokens, justificar diferencias y no copiar hex.

**Resolución:** ownership explícito: Figma expresa intención perceptual; el futuro change runtime elige o
versiona tokens y valida claro, oscuro, alto contraste y daltonismo mediante `useAppTheme`.

## `debt-763ed774bc1e` — modo Figma para daltonismo

La auditoría archivada no encontró dependencia cromática única: los estados incluyen palabra `actual`,
texto y estructura; se documentó que la simulación funcional de `DaltonismoContext` queda fuera del
prototipo. `src/context/DaltonismoContext.tsx` define los modos `protanopia`, `deuteranopia` y
`tritanopia`, persiste la preferencia y aplica filtros sobre `ColorTokens`.

**Resolución:** no se exige una colección/mode Figma por defecto. El prototipo debe conservar señales de
texto, estructura o iconografía; runtime valida la conducta funcional con `DaltonismoContext`/`useAppTheme`.
La decisión se reabre solo con defecto cromático concreto, superficie afectada y control preventivo
demostrable.

## `debt-5be12c1b2fa0` — origen local y CORS

La prueba read-only ejecutada con `backend/lib/auth.js#getCorsHeaders` y sin red ni secretos produjo:

```text
http://localhost:8081  -> http://localhost:8081
http://127.0.0.1:8081  -> https://planearai.com
https://planearai.com  -> https://planearai.com
```

El default de `ALLOWED_ORIGINS` contiene `http://localhost:8081` y `http://localhost:19006`; no contiene
`127.0.0.1`. La evidencia archivada de Clases usó `http://127.0.0.1:8081`, mientras el runbook vigente
prescribe `http://localhost:8081` y HTTP 200 antes de navegar.

**Resolución:** `localhost:8081` es el origen canónico. La QA que usa otro host/puerto debe configurar y
verificar `ALLOWED_ORIGINS`; si el preflight no refleja el origen exacto, la sesión queda `local-only` y
no afirma backend, datos remotos ni sync. No se amplió el default CORS.

## Cambios de superficie y exclusiones

Los cambios de aplicación están limitados a:

- `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- `Documentacion/01-planes-maestros/PLAN_VISION_CONTRATO_EXPERIENCIA_157.md`.
- `Documentacion/05-context-engineering/DISENO_ANTI_SLOP.md`.
- `Documentacion/03-validacion/GOLDEN_JOURNEYS_QA_VISUAL.md`.
- Esta evidencia y los artefactos del change.

No se modificaron Figma, `src/`, `backend/`, APIs, datos, storage, sync, dependencias ni contenido de
`openspec/specs/`; las specs principales se actualizarán únicamente por `opsx:archive`.
