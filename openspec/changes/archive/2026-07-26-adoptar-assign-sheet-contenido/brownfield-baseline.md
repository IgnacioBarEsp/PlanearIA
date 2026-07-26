# Brownfield baseline: adoptar-assign-sheet-contenido

Documenta unicamente la superficie que este change toca. No inventaria la app ni sustituye la spec.

## Superficies tocadas

- `src/screens/contenido/ContenidoScreen.tsx`, en tres puntos: la construccion de la lista de opciones
  del menu contextual (linea 925), el caso `"asignar"` de `handleMenuAction` (lineas 463-468) y el
  anuncio de resultado de `handleConfirmSelection` (lineas 370-405).
- `src/__tests__/contenido/ContenidoScreen.test.tsx`, en los casos que fijan el comportamiento que este
  change sustituye.

Superficies declaradas para el gate: `ui` y `sync`.

Nada mas se toca. En particular quedan intactos `src/components/assign/`,
`src/hooks/useAssignSheet.ts`, `src/services/grupoAsignacionesService.ts`, `src/sync/`, el backend y la
paleta local `DT` de la pantalla.

## Fuentes de verdad actuales

- `openspec/specs/cross-surface-assignment/spec.md`: contrato vigente de la capacidad, entregado por
  #84. Define selector unico, destino en cascada, escritura siempre encolada, confirmacion explicita,
  resultado afirmado segun el hecho real, estados sin conexion y accesibilidad.
- `src/components/assign/AssignSheet.tsx` y `src/hooks/useAssignSheet.ts`: implementacion vigente del
  selector y su unico ViewModel.
- `src/screens/biblioteca/ListaRecursosScreen.tsx` (lineas 25 y 418): adopcion de referencia ya en
  produccion.
- `src/hooks/useSyncPresentation.ts` (#83): fuente unica del vocabulario de sincronizacion.
- `src/sync/services/entitySync.ts`: `SYNC_ENTITIES` y `queueEntityOperation`, unico camino de encolado.
- `.project-os/debt/registry.json`, item `debt-f7ff020d5dee`: excepcion vigente de la paleta local.

## Comportamiento vigente

- El menu contextual de cualquier elemento ofrece "Asignar a grupo", en una lista literal identica para
  las cuatro categorias (planeaciones, recursos, entregables, plantillas).
- Al pulsarla, la pantalla muestra `Alert.alert("Proximamente", "Asignar a grupo estara disponible en
  una proxima actualizacion.")`. No se abre ningun selector, no se escribe nada y no se encola nada.
- El camino de modo seleccion (`route.params.selectionMode` con `targetGroupId`) si asigna: llama a
  `asignarRecursosAGrupo` y `asignarEntregablesAGrupo`, que desde #84 escriben sobre la clave del
  registro de sincronizacion y **encolan** cada mutacion. Ambas funciones devuelven el numero de
  documentos modificados.
- Ese camino **descarta los conteos** y ejecuta `Alert.alert("Exito", "Elementos asignados
  correctamente.")` de forma incondicional, y despues navega hacia atras. Con cero escrituras afirma un
  exito que no ocurrio.
- La pantalla pinta desde la paleta local `DT` de 23 colores (111 referencias). No importa `COLORS` ni
  consume tokens en runtime.

## Comportamiento objetivo

- "Asignar a grupo" aparece solo en recursos y entregables, y abre el `AssignSheet` canonico con ese
  elemento. Cancelar no escribe ni encola. Confirmar escribe por los contextos que encolan en
  `src/sync` y el resultado distingue sincronizado de encolado con el vocabulario compartido.
- En planeaciones y plantillas la opcion no aparece, y no la sustituye ningun control inerte ni ningun
  aviso de disponibilidad futura.
- `handleConfirmSelection` suma los conteos devueltos: con cero no afirma exito ni navega hacia atras;
  con mas de cero informa cuantos elementos se asignaron y navega, como hoy.
- Los estados loading, empty, error y offline de la accion son los de la hoja compartida, verificados en
  esta superficie.
- La paleta `DT` queda exactamente igual: 23 entradas, ninguna migrada, ninguna nueva.

## Compatibilidad legacy

- `ContenidoScreen` **conserva su estatus legacy** y su acceso actual. No se rediseña, no cambia de
  lugar en la navegacion y no vuelve a ser tab primaria.
- No se crea, renombra ni borra ninguna clave de almacenamiento. No se tocan las claves `@planearia:*`
  ni la lectura legacy de `@planearia:tareas`, que `classroomRepository` sigue fusionando como
  `tareasLegacy` para que los entregables antiguos permanezcan visibles.
- No hay migracion de datos ni cambio de esquema. Las asignaciones escritas antes del change siguen
  siendo validas y las encoladas siguen subiendo por el mismo motor.
- El modo seleccion sigue usando `grupoAsignacionesService` y no migra a la hoja: entra desde Clases con
  el destino ya resuelto, asi que el selector no aporta ahi. Solo cambia su anuncio de resultado.
- La paleta local `DT` permanece por excepcion vigente hasta 2027-07-24 (`debt-f7ff020d5dee`); su
  recuperacion depende de ampliar tokens y se rastrea en #148.

## Owner de spec y contexto

- **Spec owner**: capacidad `cross-surface-assignment`, entregada por #84. Este change la modifica en un
  punto: el requisito "Un solo selector resuelve asignar y adjuntar en toda la app" pasa a fijar que una
  superficie no ofrece la accion sobre elementos que el selector no admite.
- **Contexto de producto**: plan `uxui-navegacion-global`
  (`Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`), activo, 0/5 unidades de deuda, sin
  pausa. Issue #114.
- **Contextos DDD implicados** y sus dueños: Contenido (`src/screens/contenido/`) decide que se asigna y
  cuando se ofrece; Asignacion transversal (`src/components/assign/`, `src/hooks/useAssignSheet.ts`)
  resuelve destinos, confirma y escribe; Sincronizacion (`src/sync/`) es dueña unica de la cola y del
  almacenamiento. La dependencia va en un solo sentido: la pantalla conoce el contrato de la hoja, la
  hoja no conoce la pantalla.

## Evidencia actual

- Boton muerto y lista estatica: `src/screens/contenido/ContenidoScreen.tsx` lineas 463-468 y 928,
  verificado en `development@e23dfc8`.
- Exito incondicional: misma pantalla linea 398, contra
  `src/services/grupoAsignacionesService.ts` lineas 111-155, que devuelven conteo.
- Adopcion de referencia funcionando: `src/screens/biblioteca/ListaRecursosScreen.tsx` lineas 25 y 418.
- Test que hoy fija el defecto: `src/__tests__/contenido/ContenidoScreen.test.tsx` lineas 287-321. El
  caso de las lineas 287-296 abre el menu del primer item, que es una planeacion, y afirma que "Asignar
  a grupo" esta presente.
- Guardia estructural vigente de la capacidad:
  `src/__tests__/components/assign/guardarrailesAssign.test.ts`.
- Providers necesarios ya globales: `App.tsx` lineas 52-70 envuelven el navegador entero con
  `GruposProvider`, `EntregablesProvider` y `RecursosProvider`.
- Estado del harness y de la deuda al iniciar: `npm run harness:doctor` PASS en los 10 checks (unico
  WARN `mcp-smoke` por OAuth interactivo, de entorno); `npm run debt:check` PASS con los cuatro planes en
  0/5.
- Excepcion de la paleta: item `debt-f7ff020d5dee` en `.project-os/debt/registry.json`, vigente hasta
  2027-07-24, con la comparacion de los 23 colores contra los 62 tokens de `lightTheme` como evidencia.

## Fuera de alcance

- Rediseñar `ContenidoScreen` o cambiar su lugar en la navegacion.
- Migrar o ampliar la paleta local `DT` (excepcion vigente; recuperacion en #148).
- Los otros alerts "Proximamente" de la pantalla (lineas ~485, ~556, ~586), que pertenecen a otras
  acciones. Si alguno merece trabajo, va en su propio issue.
- Migrar el modo seleccion completo al `AssignSheet`.
- Ampliar las entidades soportadas por la asignacion: planeaciones y plantillas siguen fuera.
- Modificar el backend, `AssignSheet`, `useAssignSheet`, `grupoAsignacionesService` o `src/sync`, salvo
  que la adopcion revele un defecto en ellos.
- Crear modal, servicio, cliente HTTP, cola o clave de almacenamiento paralelos.
- Arreglar la falla local conocida de `src/__tests__/harness/spreadsheetDependency.test.ts` (tarball
  vendorizado de SheetJS en Windows; pasa en CI).
- Subir Expo SDK o usar `react-doctor --fix` a ciegas.
