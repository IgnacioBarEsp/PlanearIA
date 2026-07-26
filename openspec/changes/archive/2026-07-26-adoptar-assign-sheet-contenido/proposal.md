## Why

`ContenidoScreen` ofrece "Asignar a grupo" en el menu de cada elemento y responde con un alert
"Proximamente": un control muerto sobre una capacidad que ya existe, ya esta implementada y ya esta
especificada desde #84 (`openspec/specs/cross-surface-assignment/spec.md`). El docente ve una promesa
que la app no cumple, mientras la misma accion funciona en Biblioteca.

Al inspeccionar la pantalla para adoptar la hoja aparecio un segundo defecto en la misma capacidad y
el mismo archivo: el camino de modo seleccion (`handleConfirmSelection`) llama al servicio que si
encola, descarta el conteo de documentos modificados que ese servicio devuelve y afirma exito de forma
incondicional. Con cero escrituras igual dice "Elementos asignados correctamente", que es exactamente
lo que el requisito "El resultado se afirma segun el hecho real" prohibe.

Plan maestro: `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`. Issue: #114.

## What Changes

- La accion `asignar` del menu de `ContenidoScreen` deja de disparar un alert y monta el `AssignSheet`
  canonico, con el mismo patron de adopcion que `ListaRecursosScreen`: estado con el
  `ElementoAsignable`, hoja renderizada sobre la pantalla y `onCrearClase` hacia el hub de Clases.
- El menu de opciones deja de ser una lista estatica y se construye por tipo de elemento. Planeaciones
  y plantillas dejan de ofrecer "Asignar a grupo", porque el selector no admite esos tipos y ampliar
  las entidades soportadas es no objetivo. No las sustituye ningun control inerte ni ningun alert.
- `handleConfirmSelection` deja de afirmar exito incondicional: usa los conteos que
  `asignarRecursosAGrupo` y `asignarEntregablesAGrupo` ya devuelven y no anuncia una asignacion que no
  ocurrio.
- Toda UI que este change agregue consume tokens via `useAppTheme()`. La paleta local `DT` de la
  pantalla no se migra ni crece.
- No hay cambios BREAKING: ninguna firma publica cambia, ningun dato se migra y ninguna clave de
  almacenamiento se crea, renombra o borra.

## Capabilities

### New Capabilities

Ninguna. La capacidad ya existe: este change la adopta en una superficie mas y corrige una desviacion
de su contrato vigente.

### Modified Capabilities

- `cross-surface-assignment`: se modifica el requisito "Un solo selector resuelve asignar y adjuntar en
  toda la app" para fijar que una superficie SHALL NOT ofrecer la accion de asignar sobre elementos que
  el selector no puede asignar. Hoy la spec regula que no se ofrezca un **nivel de destino** cuya
  eleccion la escritura descartaria, pero no dice nada sobre ofrecer la accion completa sobre un
  **elemento** que la hoja no admite. Ese hueco es justo el que produjo el boton muerto de esta
  pantalla, y sin cerrarlo la siguiente superficie que adopte la hoja lo repite.

No se modifica el requisito "El resultado se afirma segun el hecho real": ya prohibe lo que
`handleConfirmSelection` hace. Esa parte del change es conformidad con la spec vigente, no un cambio de
contrato.

## Impact

Codigo afectado:

- `src/screens/contenido/ContenidoScreen.tsx`: import y montaje de `AssignSheet`, estado del elemento a
  asignar, mapeo de `ContenidoItem` a `ElementoAsignable`, construccion del menu por tipo, y correccion
  del anuncio de resultado en `handleConfirmSelection`.
- `src/__tests__/contenido/ContenidoScreen.test.tsx`: los casos que hoy fijan el boton muerto y el alert
  "Proximamente" describen el comportamiento que este change elimina y se sustituyen por los del
  comportamiento nuevo.

Codigo explicitamente no afectado: `src/components/assign/`, `src/hooks/useAssignSheet.ts`,
`src/services/grupoAsignacionesService.ts`, `src/sync/`, el backend y la paleta local `DT`.

Dependencias: ninguna nueva. La adopcion se apoya en `AssignSheet` (#84), `useSyncPresentation` (#83) y
la biblioteca base (#82), las tres ya en el arbol.

Superficies: `ui` (accion visible en una pantalla) y `sync` (camino de escritura encolado).

## No objetivos

- No redisenar `ContenidoScreen` ni revivirla como tab primaria: conserva su estatus legacy y su acceso
  actual.
- No migrar ni ampliar la paleta local `DT`. El item `debt-f7ff020d5dee` esta aceptado con excepcion
  valida hasta 2027-07-24 y su recuperacion depende de ampliar tokens (#148), asi que fix-on-touch no
  aplica a esa paleta en este change.
- No tocar los otros alerts "Proximamente" de la pantalla (lineas ~485, ~556, ~586), que pertenecen a
  otras acciones.
- No ampliar las entidades soportadas por la asignacion: planeaciones y plantillas siguen fuera.
- No modificar el backend, ni `AssignSheet`, `useAssignSheet` o `grupoAsignacionesService`, salvo que la
  adopcion revele un defecto en ellos.
- No crear modal, servicio, cliente HTTP, cola ni clave de almacenamiento paralelos.
- No usar `react-doctor --fix` a ciegas ni subir Expo SDK.
