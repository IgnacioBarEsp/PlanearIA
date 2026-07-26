## Why

La adopcion de `AssignSheet` en Contenido (#114) dejo tres hallazgos verificados en el registro de deuda, todos del plan `uxui-navegacion-global`, que quedo en 3/5 unidades. Dos son defectos reales de la hoja compartida: el ViewModel confunde el fallo de carga de destinos con el fallo de escritura, de modo que el docente ve un titulo equivocado, un reintento que no reintenta lo que fallo y ninguna senal de que parte del trabajo ya quedo guardado; y el control de cierre de la hoja mide 28x28 en web, incumpliendo una SHALL ya publicada en `cross-surface-assignment`. El tercero es cobertura faltante del estado vacio y del error de carga desde esa superficie.

## What Changes

- **Semantica de errores separada en el ViewModel.** `useAssignSheet` deja de exponer un unico `error` y expone el error de carga de destinos y el error de escritura por separado, cada uno con su propia accion de recuperacion. La hoja elige titulo, mensaje y accion segun cual sea.
- **Un fallo parcial se nombra.** Cuando la escritura falla despues de haber escrito y encolado parte de los elementos, la hoja informa cuantos alcanzaron a guardarse y cuantos quedan pendientes. El reintento **reanuda** desde los pendientes en vez de reprocesar todo, para no volver a encolar operaciones ya encoladas.
- **El progreso queda ligado al destino.** Cambiar de destino tras un fallo parcial invalida el progreso, porque lo ya escrito apunta al destino anterior; el reintento reescribe todo hacia el destino nuevo.
- **Area tactil real, no `hitSlop`, en la biblioteca base.** Nuevo helper `minTargetBox()` en `src/components/base/primitives.ts` que devuelve una caja de 44x44 real. Lo adoptan los tres controles de cierre de la biblioteca base que hoy comparten la misma forma defectuosa: `Sheet`, `Banner` y `Toast`.
- **Guardia contra la regresion silenciosa.** Una guardia estructural falla cuando un control interactivo nuevo depende solo de `hitSlop` para alcanzar los 44 puntos, y falla tambien cuando el inventario declarado queda obsoleto.
- **Cobertura del vacio y del error desde Contenido.** La suite de sync ejercita el estado vacio con su salida a `CrearGrupo` y el error de carga de destinos con reintento.
- No hay cambios BREAKING de contrato publico: `AssignSheet` conserva sus props. El contrato interno de `useAssignSheet` si cambia (`error`/`reintentar` se sustituyen), y su unico consumidor es `AssignSheet`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `cross-surface-assignment`: se anade una requirement sobre la semantica del fallo de escritura, que hoy la spec no cubre. La spec describe el fallo de **carga** de destinos ("Falla la carga de destinos") pero no dice nada sobre que ocurre cuando falla la **escritura**, que es justo el vacio que produjo el defecto. La SHALL de los 44 puntos de area tactil ya existe (linea 182) y **no se modifica**: el codigo se ajusta a ella.

## Impact

- `src/hooks/useAssignSheet.ts`: separacion de los dos errores, contador de progreso resistente al fallo, reanudacion ligada al destino.
- `src/components/assign/AssignSheet.tsx`: banner de error con titulo, mensaje y accion derivados de la causa.
- `src/components/base/primitives.ts`: helper `minTargetBox()` junto a `hitSlopToMinTarget`.
- `src/components/base/Sheet.tsx`, `src/components/base/Banner.tsx`, `src/components/base/Toast.tsx`: caja real de 44x44 en el control de cierre.
- `src/screens/mas/CatalogoComponentesScreen.tsx`: `testID` para poder medir los tres cierres en navegador.
- `src/__tests__/`: casos nuevos en la suite de sync, en la del hook, en la del componente y la guardia estructural nueva.
- `openspec/specs/cross-surface-assignment/`: delta con la requirement nueva.
- No se toca `src/sync`, ni el backend, ni `grupoAsignacionesService`, ni `ContenidoScreen`, ni ninguna clave de almacenamiento.

## No objetivos

- **No migrar los 28 usos de `hitSlop` en 13 archivos.** Solo se corrigen los tres controles de cierre de la biblioteca base, que comparten forma y arreglo. Los demas se miden, se clasifican y se rastrean con evidencia; si la medicion concluye que hace falta migrarlos, se propone como change aparte y no se ejecuta aqui.
- No redisenar `AssignSheet` ni `ContenidoScreen`.
- No debilitar la SHALL de los 44 puntos para que el codigo pase.
- No tocar la paleta local `DT` de `ContenidoScreen` (excepcion `debt-f7ff020d5dee` vigente hasta 2027-07-24, recuperacion en #148) ni ninguna de las otras cuatro excepciones vigentes del registro.
- No cambiar el camino de encolado ni crear modal, servicio, cliente HTTP o cola paralelos.
- No ampliar las entidades que la hoja admite.
- No usar `react-doctor --fix` a ciegas. No arreglar la falla local conocida de `spreadsheetDependency`. No subir Expo SDK.

Plan maestro: `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md` (seccion 1.9, Estandar de Excelencia Visual). Issue: #152. Origen: #114 / PR #151.
