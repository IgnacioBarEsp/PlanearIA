# Design: adoptar-assign-sheet-contenido

## Contexto

`ContenidoScreen` es una pantalla legacy de 2098 lineas que este change **no rediseña**. Solo toca tres
puntos concretos: la construccion del menu de opciones, el handler de la accion `asignar`, y el anuncio
de resultado de `handleConfirmSelection`. Todo lo demas queda igual, incluida su paleta local.

La capacidad ya existe. `AssignSheet` (#84) es el selector transversal, `useAssignSheet` es su unico
ViewModel y la escritura viaja por los contextos que llaman a `queueEntityOperation`. La adopcion de
referencia es `src/screens/biblioteca/ListaRecursosScreen.tsx`, que monta la hoja con tres piezas:
estado con el `ElementoAsignable`, render condicional de `<AssignSheet visible ... />`, y `onCrearClase`
hacia el hub de Clases. Este design sigue ese patron; no inventa uno nuevo.

## Nota de contextos DDD

Este change cruza tres contextos y la frontera entre ellos es la que evita que la adopcion se convierta
en duplicacion:

| Contexto | Dueño | Que aporta aqui | Que NO puede hacer |
| --- | --- | --- | --- |
| **Contenido** (superficie legacy) | `src/screens/contenido/` | Decide **que** elemento se va a asignar y **cuando** se ofrece la accion. Traduce su modelo de presentacion (`ContenidoItem`) al contrato de entrada de la hoja (`ElementoAsignable`). | Decidir destinos, confirmar, escribir, o inventar copy de sincronizacion. |
| **Asignacion transversal** | `src/components/assign/` + `src/hooks/useAssignSheet.ts` | Resuelve destinos en cascada, confirma nombrando el destino, ejecuta la escritura y afirma el resultado segun el hecho real. | Conocer que pantalla la monto. |
| **Sincronizacion** | `src/sync/` | Encola, reconcilia y sube. Unico dueño de la cola y del almacenamiento. | Nada de esto vive en las otras dos capas. |

La direccion de la dependencia es en un solo sentido: Contenido conoce el contrato de la hoja; la hoja
no conoce Contenido. Por eso el mapeo `ContenidoItem -> ElementoAsignable` vive en la pantalla y no en
la hoja: es una traduccion de contexto, no una responsabilidad del selector.

## Decision 1: el menu se construye por tipo de elemento

**Problema.** El menu de opciones es hoy una lista literal declarada en el JSX (linea 925), identica
para las cuatro categorias. `ElementoAsignable` admite solo `"recurso" | "entregable"`. Ampliar las
entidades soportadas es no objetivo. Entonces la accion se ofrece hoy sobre planeaciones y plantillas,
que no pueden asignarse.

**Decision.** La lista pasa a derivarse del tipo del elemento abierto. Las opciones comunes se
conservan tal cual; `asignar` se incluye solo cuando el elemento se puede mapear a un
`ElementoAsignable`.

**Por que no las alternativas.**

- *Mostrarla deshabilitada con un motivo* conserva un control que nunca hace nada. El issue se titula
  "retirar el boton muerto"; un boton inerte sigue siendo un boton muerto, solo que anunciado.
- *Abrir la hoja con una explicacion* obligaria a ampliar el contrato de un componente transversal para
  un caso que no le corresponde: la hoja recibe elementos asignables por definicion, y enseñarle a
  recibir elementos no asignables la haria responsable de una regla que pertenece a la superficie.

**Precedente.** Es la misma forma del razonamiento que la spec ya aplica un nivel mas abajo: el nivel de
actividad no se ofrece cuando algun elemento no puede referenciarla, porque ofrecerlo dejaria elegir un
destino que la escritura descartaria. Aqui el objeto es el elemento en vez del nivel, y el resultado es
el mismo: no ofrecer lo que no se puede cumplir. La spec se modifica para nombrarlo explicitamente.

**Consecuencia observable.** Un test vigente
(`ContenidoScreen.test.tsx`, "muestra opciones Asignar a grupo, Exportar y Compartir en context menu")
abre el menu del **primer** item, que es una planeacion, y afirma que "Asignar a grupo" esta presente.
Ese test fija el defecto: se reescribe para afirmar lo contrario sobre planeaciones y para cubrir el
caso de recurso, que es donde la accion ahora existe.

## Decision 2: el mapeo `ContenidoItem -> ElementoAsignable`

`ContenidoItem.id` es una cadena con prefijo por tipo (`rec-<n>`, `ent-<n>`, `plan-<id>`, `pla-<id>`) y
`ElementoAsignable.id` es un `number`. El mapeo:

- `tipo === "recursos"` -> `{ id: Number(raw.id), titulo, tipo: "recurso" }`
- `tipo === "entregables"` -> `{ id: Number(raw.id), titulo, tipo: "entregable" }`
- cualquier otro tipo -> `null`, y la accion no se ofrece

El id se toma de `item.raw.id`, que ya es el identificador numerico real de la entidad, y no de parsear
el prefijo de `item.id`. Parsear la cadena de presentacion introduciria una segunda fuente de verdad del
identificador y fallaria en silencio si el prefijo cambiara. Un `raw.id` que no resulte en un numero
finito se trata como no asignable: `useAssignSheet` descarta ids inexistentes, pero es mejor no ofrecer
la accion que ofrecerla y terminar en "no se asigno nada".

**Un elemento a la vez.** La hoja recibe un array porque su contrato es transversal, pero el menu
contextual de Contenido opera sobre un solo elemento. Se pasa un array de uno, igual que
`ListaRecursosScreen`. El modo seleccion multiple de la pantalla es otro camino y no cambia de dueño en
este change.

## Decision 3: `handleConfirmSelection` deja de afirmar exito incondicional

**Problema.** `asignarRecursosAGrupo` y `asignarEntregablesAGrupo` devuelven el numero de documentos que
modificaron de verdad. `handleConfirmSelection` los llama dentro de un `Promise.all`, ignora los valores
devueltos y ejecuta `Alert.alert("Exito", "Elementos asignados correctamente.")`. Con cero escrituras
—ids que ya no existen, o que ya pertenecian al grupo destino— igual afirma exito. El requisito vigente
"El resultado se afirma segun el hecho real" prohibe exactamente eso.

**Decision.** Sumar los conteos devueltos y distinguir dos resultados:

- suma > 0: se informa cuantos elementos se asignaron y se vuelve atras, como hoy.
- suma == 0: no se afirma exito. Se informa que ningun elemento cambio de destino y **no** se navega
  hacia atras, porque volver atras es la señal de que el trabajo se completo.

El caso de error mantiene su alert actual.

**Alcance de esta correccion.** Es conformidad con la spec vigente, no un cambio de contrato: por eso no
aparece como requisito modificado. Se corrige aqui, y no en un issue aparte, porque vive en el mismo
archivo, en la misma capacidad y bajo el mismo criterio de aceptacion que este change tiene que
demostrar. Decision tomada por entrevista humana el 2026-07-25 y registrada en el issue.

**Lo que NO se toca de ese camino.** El modo seleccion sigue usando `grupoAsignacionesService` y no
migra a `AssignSheet`. Migrarlo seria rediseñar un flujo de seleccion multiple que entra desde Clases con
`targetGroupId` ya resuelto, es decir, sin destino que elegir: la hoja no aporta ahi y el cambio seria
mucho mayor que el defecto. El servicio ya encola desde #84, asi que el camino no pierde datos; lo unico
roto era el anuncio.

## Decision 4: frontera con la paleta local `DT` (deuda aceptada)

`src/screens/contenido/ContenidoScreen.tsx#DT` es el item `debt-f7ff020d5dee`: una paleta local de 23
colores desde la que la pantalla pinta en vez de consumir tokens. Esta **aceptado con excepcion valida
hasta 2027-07-24**, porque 13 de esos 23 valores no tienen equivalente en los tokens actuales (entre
ellos el azul de marca `#004580`, a distancia 58 del token `primary` real) y migrarlos exigiria inventar
tokens o remapear a tokens lejanos con cambio visual, ambas prohibidas. Su recuperacion depende de
ampliar los tokens y se rastrea en #148.

**La frontera operativa de este change, en dos reglas:**

1. **No se migra.** La politica fix-on-touch no aplica a `DT` aqui. Ninguna de las 111 referencias
   existentes cambia.
2. **No crece.** Ninguna entrada nueva se agrega a `DT` y ningun hex literal nuevo entra al archivo. La
   UI que este change aporta es `AssignSheet`, que ya consume tokens via `useAppTheme()` internamente y
   tiene una guardia que le prohibe `COLORS` y hex literales
   (`guardarrailesAssign.test.ts`). El mapeo y el menu por tipo no pintan nada nuevo: reutilizan los
   estilos que la pantalla ya tiene.

El resultado practico es que la accion asignada se ve con tokens (porque es la hoja compartida) dentro
de una pantalla que sigue pintada con `DT`. Esa discontinuidad es deliberada y temporal: es lo que la
excepcion vigente describe, y se cierra en #148, no aqui.

## Estados de la accion

Los cuatro estados los resuelve la hoja compartida, que ya los tiene diseñados; la pantalla no los
reimplementa. Lo que este design fija es **cuales son** y que la adopcion los conserva:

| Estado | Quien lo resuelve | Comportamiento |
| --- | --- | --- |
| **Loading** | `AssignSheet` + `useAssignSheet` | Mientras `GruposContext` carga o mientras se piden unidades y actividades, la hoja muestra skeletons y **no** afirma que el docente no tiene clases. |
| **Empty** | `AssignSheet` | Terminada la carga sin ninguna clase, `EmptyState` accionable con salida "Crear clase". En Contenido esa salida navega al hub de Clases, igual que en Biblioteca. |
| **Error** | `AssignSheet` + `useAssignSheet` | Fallo al cargar destinos: banner con reintento, sin cerrar la hoja ni perder el elemento seleccionado. |
| **Offline** | `useSyncPresentation` (#83) | Banner informativo con el vocabulario compartido; **no** deshabilita confirmar. La asignacion se encola y sube al reconectar. La pantalla no escribe copy propio de falta de conexion. |

La micro-interaccion significativa y la accesibilidad (foco atrapado, Escape, `aria-checked` en las
opciones, touch targets de 44 puntos, variante sin movimiento con reduce-motion) tambien viven en la
hoja y en la biblioteca base. La adopcion las hereda; la verificacion las comprueba en esta superficie
en vez de darlas por hechas.

## Riesgos

| Riesgo | Mitigacion |
| --- | --- |
| La hoja necesita `GruposContext`, `RecursosContext` y `EntregablesContext`; si `ContenidoScreen` se monta fuera de ellos, revienta. | **Verificado y descartado**: los tres providers envuelven el navegador entero en `App.tsx:52-70`, asi que toda pantalla los tiene. Queda el caso de los tests, que montan la pantalla suelta: deben proveer los tres o mockearlos. |
| El test vigente que afirma el boton muerto se "arregla" borrandolo, perdiendo cobertura. | Se sustituye por casos que afirman el comportamiento nuevo en ambas direcciones: presente en recurso, ausente en planeacion. |
| Un test nuevo pasa aunque el codigo no cambie (vacuidad). | Cada test nuevo se ejecuta contra el arbol sin el cambio y debe fallar; la salida se guarda como evidencia. |
| Medir el panel de la hoja en web por `[aria-modal="true"]` devuelve el wrapper full-viewport de RN Web y produce falsos positivos (hallazgo de #110, que retracto uno de #84). | La QA visual mide por el `data-testid` del panel. |
