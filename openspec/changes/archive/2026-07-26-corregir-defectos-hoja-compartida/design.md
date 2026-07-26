## Context

`AssignSheet` y `useAssignSheet` son el selector transversal de asignacion entregado por #84. Su spec vigente es `openspec/specs/cross-surface-assignment/spec.md`. La adopcion en Contenido (#114) los ejercito por primera vez desde una segunda superficie y dejo tres hallazgos verificados en `.project-os/debt/registry.json`, todos con `planOwner: uxui-navegacion-global`, que quedo en 3/5 unidades.

Estado del codigo en `dbfb52e`:

- `useAssignSheet` declara `error: string | null` (`:80`) y lo escriben dos caminos independientes: el efecto de carga de destinos (`:118`) y el `catch` de `asignar` (`:255-257`). `AssignSheet` (`:184-192`) lo pinta con el titulo fijo "No se pudieron cargar los destinos" y accion `vm.reintentar()`, que incrementa `intento` y vuelve a disparar el efecto de carga.
- El contador `asignados` vive dentro del `try` de `asignar` (`:228`), asi que un fallo a mitad del bucle lo destruye. Los elementos escritos antes del fallo quedan escritos **y encolados** por `actualizarRecurso` / `actualizarEntregable`, que es el camino sancionado por #84.
- `Sheet.tsx:108` da al control de cierre `hitSlop={hitSlopToMinTarget(28, 28)}` sobre `styles.cerrar` de 28x28 (`:172-178`). React Native Web no implementa `hitSlop`; el area efectiva en web es la caja.

Restricciones del entorno: React Native 0.81 con react-native-web; la app es offline-first y toda escritura academica pasa por `src/sync`; el plan UX/UI seccion 1.9 es gate para toda UI nueva.

### Nota de contextos (DDD)

Tres contextos se tocan y **no se mezclan**:

1. **Presentacion del selector** (`AssignSheet`): decide titulo, mensaje y accion a partir de lo que el ViewModel expone. No conoce almacenamiento ni cola.
2. **ViewModel de la asignacion** (`useAssignSheet`): resuelve destinos, orquesta la escritura y clasifica sus fallos. No escribe: delega en los contextos de `Recursos` y `Entregables`.
3. **Motor de sincronizacion** (`src/sync`, via los contextos): encola y drena. **No se toca en este change.** La reanudacion del reintento vive enteramente en el ViewModel; el motor no aprende nada nuevo.

El vocabulario de estado de sincronizacion sigue siendo propiedad de `useSyncPresentation` (#83). Este change no introduce texto propio de falta de conexion.

## Goals / Non-Goals

**Goals:**

- Que cada fallo de la hoja diga su causa y que su accion repare lo que fallo.
- Que un fallo parcial nombre lo que ya quedo guardado, y que reintentar no duplique operaciones en la cola.
- Que el control de cierre de la biblioteca base mida 44x44 reales en web, cumpliendo la SHALL vigente.
- Que exista un verificador que impida reintroducir el patron `hitSlop`-solo.
- Que el estado vacio y el de error se ejerciten desde la superficie Contenido.

**Non-Goals:**

- Migrar los 28 usos de `hitSlop` de los 13 archivos de produccion.
- Redisenar la hoja, cambiar el camino de encolado o modificar `src/sync`.
- Modificar la SHALL de los 44 puntos.

## Decisions

### D1 - Dos campos de error, no un discriminante sobre uno solo

**Decision.** `useAssignSheet` expone `errorCarga: string | null` y `errorEscritura: ErrorEscritura | null`, donde `ErrorEscritura` lleva `{ mensaje, asignados, pendientes }`.

**Por que, y no un `{ tipo, mensaje }` unico.** Un campo con discriminante obliga a la vista a ramificar sobre un valor de cadena y permite que un camino pise el error del otro por descuido, que es exactamente el defecto que se corrige. Dos campos hacen la separacion estructural: el efecto de carga no puede escribir en el de escritura porque no tiene el setter, y ambos pueden coexistir sin que uno borre al otro. Ademas los dos errores tienen forma distinta: el de escritura lleva conteos que el de carga no tiene, asi que un tipo comun seria una union con campos opcionales inertes en la mitad de los casos.

**Alternativa descartada.** Reutilizar `error` y anadir `causaError`. Mismo riesgo de pisado, y obliga a mantener dos estados sincronizados a mano.

### D2 - El reintento de escritura reanuda; no reprocesa

**Decision.** `asignar()` mantiene un registro de progreso con los elementos ya procesados. Un segundo `asignar()` sobre el mismo destino solo recorre los pendientes. La accion "Reintentar" del banner de escritura es literalmente `asignar()`.

**Por que, en orden de peso.** Primero, **el conteo honesto**: `asignados` acumula a traves de intentos, asi que el resultado final dice cuantos elementos quedaron asignados en total y no cuantos entraron en el ultimo intento. Reprocesando, un reintento que escribe el ultimo elemento reportaria "1 elemento asignado" cuando en realidad hay tres. Segundo, **el costo redundante**: cada `actualizarRecurso` persiste y llama `queueEntityOperation`, que a su vez intenta un `flushQueue` si hay red; repetirlo por cada elemento ya escrito paga escrituras y flushes por trabajo ya hecho. Tercero, **el historial de la cola**: `enqueueOperation` deduplica los `update` del mismo id, pero lo hace **eliminando la operacion anterior y empujando una nueva** con `opId` distinto, `createdAt` nuevo y `retries` en cero. Reencolar un elemento que ya esperaba lo manda al final de la cola y le borra el contador de reintentos, que es justo la senal de que una operacion viene fallando.

**Correccion respecto de la lectura inicial.** La primera version de este diseno justificaba la reanudacion diciendo que reprocesar "duplicaria operaciones en la cola". Es **falso**: `src/sync/services/syncEngine.ts` deduplica por id para los `update`, asi que nunca habria dos operaciones para el mismo elemento. La razon real es la de los tres puntos de arriba, y la spec se escribio sobre esa razon y no sobre la duplicacion.

**Por que no un `reintentarAsignacion()` aparte.** Seria un alias de `asignar()` con otro nombre: mas superficie de API para el mismo comportamiento. La hoja llama `asignar()` desde el boton de confirmar y desde el banner de error, y ambas cosas son la misma operacion.

### D3 - El progreso se invalida por clave de destino, no por reset manual

**Decision.** El registro de progreso guarda la clave del destino con el que se escribio (`grupoId|unidadId|tareaId`). Al entrar en `asignar()`, si la clave vigente no coincide con la guardada, el progreso se descarta y se escribe todo de nuevo. `reiniciar()` ademas lo limpia explicitamente.

**Por que estructural y no solo por reset.** Depender de acordarse de limpiar el progreso en `elegirClase`, `elegirUnidad` y `elegirActividad` es una invariante que se rompe la primera vez que alguien anade un cuarto nivel de destino. Con la clave, el progreso **no puede** aplicarse a un destino distinto del que lo produjo, aunque alguien olvide el reset. El reset de `reiniciar()` se conserva porque cubre un caso que la clave no distingue: cerrar la hoja y volver a abrirla eligiendo el mismo destino debe empezar de cero, no arrastrar el conteo de la sesion anterior.

**Alternativa descartada.** Bloquear el cambio de destino mientras haya un fallo pendiente. Deja al docente atrapado en un destino que quiza eligio por error.

### D4 - Caja real de 44x44 en `primitives.ts`, absorbida por el padding del encabezado

**Decision.** Nuevo helper `minTargetBox()` en `src/components/base/primitives.ts` que devuelve `{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }`. Lo adoptan `Sheet`, `Banner` y `Toast`. Cada consumidor compensa el crecimiento con un margen negativo propio de `-(44 - visual) / 2`, calculado desde su constante de tamano visual.

**Por que el helper no incluye el margen negativo.** El margen solo es correcto cuando el contenedor tiene padding que absorba el desborde. Meterlo en el helper esconderia esa suposicion y produciria solapes en un contenedor sin padding. `primitives.ts` es duena de la invariante de accesibilidad (44 puntos); el layout es del componente.

**Por que margen negativo y no dejar crecer el encabezado.** El encabezado de `Sheet` tiene `padding: spacing.lg` (16) y `alignItems: "center"`, con el titulo en `typography.subtitle` (lineHeight 24). Hoy la altura de contenido es `max(24, 28) = 28`. Con una caja de 44 sin compensar, pasaria a 44 y el encabezado de **todas** las hojas de la app creceria 16 puntos sin ningun beneficio para el docente: el beneficio es el area tactil, que el margen negativo entrega igual. `-8` es multiplo de 4 y respeta el ritmo del sistema. El desborde cae dentro del padding, que es espacio vacio, asi que no puede solaparse con el titulo.

**Por que se retira `hitSlop` en vez de conservarlo como refuerzo nativo.** Con una caja de 44x44, `hitSlopToMinTarget(44, 44)` devuelve `undefined` por contrato: no hay nada que reforzar. Dejar la llamada seria una prop inerte, que es justo lo que el comentario de `hitSlopToMinTarget` dice evitar. El registro de deuda sugeria conservarlo; se desvia a proposito y se documenta aqui.

### D5 - Alcance del arreglo: el grupo A, con criterio objetivo

**Decision.** Se corrigen los tres controles de cierre de la biblioteca base (`Sheet`, `Banner`, `Toast`), que comparten forma exacta: `Pressable` con caja de 28x28, icono de 18-20 y `hitSlopToMinTarget(28, 28)`. No se tocan `Chip`, `SyncStatusChip` ni los siete sitios legacy.

**Por que ese corte.** Es el conjunto donde el arreglo es un reemplazo mecanico verificable y donde la QA no crece: los tres se renderizan en `CatalogoComponentesScreen`, asi que una sola pantalla los mide. `Chip` y `SyncStatusChip` no son mecanicos: subir su alto a 44 cambia la densidad de un control disenado a 32 y 28 puntos, y eso es decision de diseno con QA propia. Los sitios legacy viven en siete pantallas distintas con QA visual independiente cada una.

**Que pasa con lo no corregido.** Se mide en navegador, se clasifica y se registra como deuda con evidencia, ademas de quedar rastreado en el inventario de la guardia. No queda como aviso suelto.

### D6 - La guardia es un inventario declarado que falla en las dos direcciones

**Decision.** Un test estructural recorre las fuentes de produccion buscando `hitSlop` y compara contra un inventario declarado en el propio test. Falla si un archivo usa `hitSlop` y no esta en el inventario (patron nuevo), y falla si una entrada del inventario ya no usa `hitSlop` (lista podrida).

**Por que asi.** La leccion de las Olas 2a/2b de #141 es que una politica sin verificador se degrada en silencio, y que la evasion barata es cambiar de primitiva. Un inventario que solo falla hacia arriba se convierte en una lista muerta que nadie limpia; fallar tambien hacia abajo obliga a actualizarlo cuando se corrige un sitio, que es cuando conviene mirarlo. El mensaje de fallo nombra la causa real (react-native-web no implementa `hitSlop`) y la salida (`minTargetBox()`), para que quien lo encuentre no lo silencie por no saber que hacer.

**Limite honesto.** La guardia detecta la dependencia de `hitSlop`, no mide areas tactiles. Un control que no use `hitSlop` y aun asi mida 20x20 pasa la guardia. Cubrir eso exigiria medir en navegador dentro de CI, que no existe hoy en este repo; el limite queda declarado y no se presenta como cobertura total.

## Risks / Trade-offs

- **La caja de 44 con margen negativo rompe el encabezado en algun breakpoint o tema.** → Se mide con `getBoundingClientRect` sobre el panel y sobre el control de cierre en 375/768/1280 y en ambos temas, en `AssignSheet` y en `CatalogoComponentesScreen`, comparando la altura del encabezado antes y despues.
- **El margen negativo hace que el area tactil invada el titulo.** → El desborde es vertical (`marginVertical`), no horizontal, y cae dentro del `padding` del encabezado. Se verifica con `document.elementFromPoint` en el borde superior e inferior de la caja ampliada y sobre el texto del titulo.
- **La reanudacion salta elementos que deberia reescribir.** → Es el riesgo central de D2/D3. Se cubre con la clave de destino (D3) y con casos de prueba para las dos direcciones: reintento con el mismo destino escribe solo pendientes; reintento tras cambiar destino escribe todo.
- **El conteo acumulado confunde si el docente reintenta muchas veces.** → El conteo es "cuantos elementos quedaron asignados", no "cuantas escrituras se hicieron", que es lo que el docente necesita saber. `reiniciar()` lo devuelve a cero al cerrar la hoja.
- **Cambiar el contrato de `useAssignSheet` rompe consumidores.** → `AssignSheet` es su unico consumidor, verificado por busqueda; `typecheck` cierra el riesgo residual.
- **La guardia se vuelve ruido y alguien la borra.** → Su mensaje explica causa y salida, y el inventario se prueba por mutacion en ambos sentidos para demostrar que no es vacua.

## Migration Plan

No hay migracion de datos: no se crean, renombran ni borran claves de almacenamiento, no cambia esquema, no se toca `src/sync`, el backend, configuracion remota ni proyecto nativo.

Rollback: revertir el commit del PR devuelve el campo `error` unico, el titulo fijo, el reintento cableado a la recarga y las cajas de 28x28. Las asignaciones escritas y encoladas antes del rollback siguen siendo validas y se suben igual, porque viajan por el motor vigente y no por nada que este change introduzca; revertir la reanudacion no desencola nada, solo devuelve el reintento a reprocesar desde el principio. Los tres arreglos viven en archivos distintos y se revierten por separado.

## Open Questions

Ninguna abierta. Las dos decisiones de ingenieria no triviales (D2 reanudar y D3 clave de destino) se derivan de restricciones vigentes (`la cola unica de #84`, `el destino define lo escrito`) y quedan resueltas arriba; no requieren decision de producto.
