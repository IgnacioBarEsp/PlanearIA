# Brownfield baseline - corregir-defectos-hoja-compartida

Documenta solo la superficie que este change toca. No inventaria la app.

## Superficies tocadas

- `src/hooks/useAssignSheet.ts` - ViewModel del selector transversal de asignacion.
- `src/components/assign/AssignSheet.tsx` - vista del selector.
- `src/components/base/primitives.ts` - primitivas internas de la biblioteca base (area tactil, anillo de foco).
- `src/components/base/Sheet.tsx`, `src/components/base/Banner.tsx`, `src/components/base/Toast.tsx` - controles de cierre de la biblioteca base.
- `src/screens/mas/CatalogoComponentesScreen.tsx` - unico consumidor de `Sheet` fuera de `AssignSheet`; superficie de medicion de la biblioteca base en navegador.
- `src/__tests__/` - suites de hook, componente, guardarrailes base y sync.
- `openspec/specs/cross-surface-assignment/` - contrato de la capacidad.

**No tocadas y explicitamente fuera:** `src/sync`, `backend/`, `src/services/grupoAsignacionesService.ts`, `src/screens/contenido/ContenidoScreen.tsx`, `src/screens/biblioteca/ListaRecursosScreen.tsx`.

## Fuentes de verdad actuales

- Comportamiento de la capacidad: `openspec/specs/cross-surface-assignment/spec.md` (entregada por #84, sin deltas pendientes).
- Area tactil minima: `src/components/base/primitives.ts:18`, `MIN_TOUCH_TARGET = 44`, con la justificacion escrita (mas estricto que WCAG 2.2 SC 2.5.8, coincide con SC 2.5.5).
- Vocabulario de estado de sincronizacion: `src/hooks/useSyncPresentation.ts` (fuente unica desde #83).
- Camino de escritura encolado: contextos `RecursosContext` y `EntregablesContext`, que llaman `queueEntityOperation` (sancionado por #84).
- Estandar visual y de accesibilidad: `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`, seccion 1.9.
- Deuda vigente: `.project-os/debt/registry.json`, items `debt-9f9d7019d927`, `debt-c319ed19fe20`, `debt-7f36f0586032`.

## Comportamiento vigente

- `useAssignSheet` expone un unico `error: string | null` que escriben dos caminos: el efecto de carga de destinos (`:118`) y el `catch` de `asignar` (`:255-257`). Expone `reintentar()`, que solo recarga destinos.
- `AssignSheet:184-192` pinta ese campo siempre con el titulo fijo "No se pudieron cargar los destinos" y accion `vm.reintentar()`.
- El contador `asignados` es local al `try` de `asignar` (`:228`): un fallo a mitad del bucle lo destruye, aunque los elementos anteriores ya quedaron escritos y encolados.
- Un reintento tras un fallo de escritura no existe: la unica accion ofrecida recarga destinos.
- `Sheet.tsx:108` da al control de cierre `hitSlop={hitSlopToMinTarget(28, 28)}` sobre una caja real de 28x28. React Native Web no implementa `hitSlop`, asi que el area efectiva en web es 28x28. Lo mismo en `Banner.tsx:80` y `Toast.tsx:84`.
- El repositorio tiene 28 usos de `hitSlop` en 13 archivos de produccion, sin ninguna guardia que los detecte.
- `src/__tests__/sync/asignacionContenidoEncolada.test.tsx` cubre abrir, elegir destino, confirmar y cancelar desde Contenido; no cubre el estado vacio ni el error de carga.

## Comportamiento objetivo

- Dos errores separados en el ViewModel, cada uno con la accion de recuperacion que corresponde a su causa.
- Un fallo parcial de escritura informa cuantos elementos quedaron guardados y cuantos siguen pendientes.
- Reintentar la escritura reanuda desde los pendientes y no duplica operaciones en la cola; cambiar de destino invalida el progreso y reescribe todo.
- Los tres controles de cierre de la biblioteca base miden 44x44 reales en web, sin que crezca el alto del encabezado.
- Una guardia estructural falla cuando un control nuevo depende solo de `hitSlop`, y falla tambien cuando su inventario declarado queda obsoleto.
- La suite de sync ejercita, desde Contenido, el estado vacio con su salida a `CrearGrupo` y el error de carga con reintento.

## Compatibilidad legacy

- **Contrato publico intacto.** `AssignSheetProps` no cambia: las dos superficies que montan la hoja (`ContenidoScreen`, `ListaRecursosScreen`) no requieren edicion.
- **Contrato interno cambiado.** `AssignSheetViewModel` sustituye `error` y `reintentar` por `errorCarga`, `reintentarCarga` y `errorEscritura`. Su unico consumidor es `AssignSheet`, verificado por busqueda; `typecheck` cubre el residuo.
- **`hitSlopToMinTarget` se conserva.** No se borra ni se marca deprecado: sigue siendo correcto en nativo y sigue usandolo el grupo de controles que este change no toca. Lo que cambia es que deja de ser el unico mecanismo en los tres controles de cierre de la base.
- **Sin migracion de datos.** No se crean, renombran ni borran claves `@planearia:*`; no cambia esquema ni formato de la cola. Lo escrito y encolado antes del change sigue siendo valido.
- **Sin cambio de navegacion ni de rutas.**

## Owner de spec y contexto

- Spec: `cross-surface-assignment`, propiedad del plan `uxui-navegacion-global`. Owner del change: issue #152, child del epic #101.
- Contexto de la biblioteca base: change `componentes-base` (#82), archivado; `primitives.ts` es su superficie interna.
- Contexto del motor de sincronizacion: `src/sync`, propiedad de los changes de sync; este change **no lo modifica**, solo lo usa a traves de los contextos.
- Motor de deuda: `uxui-navegacion-global` en 3/5 unidades; este flujo es `kind: remediation`.

## Evidencia actual

- Medicion del defecto de area tactil en `dbfb52e`: `openspec/changes/archive/2026-07-26-adoptar-assign-sheet-contenido/evidencia/04-qa-visual.md` (28x28 con `getBoundingClientRect`, `padding` en cero, `document.elementFromPoint` a 8px fuera del borde no alcanza el control).
- Los tres items en `.project-os/debt/registry.json` con su evidencia fechada el 2026-07-25.
- `npm run debt:check` PASS con el plan en 3/5.
- `npm run harness:doctor` PASS con el WARN conocido de `mcp-smoke`.
- Cobertura vigente de la hoja: `src/__tests__/components/assign/assignSheet.test.tsx`, `src/__tests__/hooks/useAssignSheet.test.tsx`, `src/__tests__/components/assign/guardarrailesAssign.test.ts`.

## Fuera de alcance

- Migrar los 28 usos de `hitSlop`: solo se corrigen los tres controles de cierre de la biblioteca base. Los grupos B (`Chip`, `SyncStatusChip`) y C (siete pantallas y componentes legacy) se miden, se clasifican y se registran, pero no se editan.
- Redisenar `AssignSheet`, `ContenidoScreen` o la biblioteca base.
- Modificar la SHALL de los 44 puntos, el camino de encolado, `src/sync`, el backend o `grupoAsignacionesService`.
- La paleta local `DT` de `ContenidoScreen` (`debt-f7ff020d5dee`, excepcion vigente hasta 2027-07-24, recuperacion en #148) y las otras cuatro excepciones del registro.
- La falla local conocida de `src/__tests__/harness/spreadsheetDependency.test.ts` en Windows (tarball vendorizado de SheetJS; pasa en CI).
- Medir areas tactiles dentro de CI: la guardia detecta dependencia de `hitSlop`, no mide cajas en navegador. Limite declarado en `design.md` D6.
