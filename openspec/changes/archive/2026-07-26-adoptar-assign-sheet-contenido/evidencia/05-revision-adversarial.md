# Revision adversarial

Ejecutada el 2026-07-25 en **contexto limpio**, por un agente que no implemento el change, con el
encargo explicito de refutar y no de aprobar. Alcance: issue #114, change
`adoptar-assign-sheet-contenido`, diff `development...feat/adoptar-assign-sheet-contenido`.

**Veredicto inicial: FAIL** (6 Majors, 4 Minors, 1 Pregunta). Ningun Blocker.
**Estado tras las correcciones: los 6 Majors cerrados dentro del change.**

## Majors y como se cerraron

### Major 1 - El resultado del modo seleccion no distinguia encolado de sincronizado

El texto nuevo `"Listo | N elementos asignados al grupo."` omitia la primera mitad del requisito
"El resultado se afirma segun el hecho real", que exige distinguir lo que ya subio de lo que quedo
guardado a la espera. Falla concreta: docente sin conexion asigna 3 recursos, lee "3 elementos
asignados", vuelve atras y no sabe que nada subio. Agrava que el texto lo escribio este change.

**Corregido.** `ContenidoScreen` consume `useSyncPresentation()` (#83), la misma fuente unica que usa la
hoja, y añade al resultado `"<titulo de la fuente>. Se asignara en el servidor cuando vuelva la
conexion."` o `"La asignacion ya esta sincronizada."`. No se introduce copy propio de falta de conexion
ni se cambia la firma de `grupoAsignacionesService`, que habria rippleado a otros dos consumidores fuera
de alcance. Cubierto por dos pruebas nuevas, ambas fallan sin el cambio.

### Major 2 - El modo seleccion seguia ofreciendo tipos no asignables

El delta de spec de este change publica una SHALL sin calificar ("una superficie SHALL ofrecer la accion
de asignar unicamente sobre elementos que el selector compartido admite") que el propio archivo
incumplia por su otro camino: toda tarjeta recibia casilla en modo seleccion y `handleConfirmSelection`
descartaba en silencio los ids que no fueran `rec-`/`ent-`. Seleccionar solo planeaciones terminaba
siempre en "No se asigno nada", un callejon sin salida creado por el change que retira botones muertos.

**Corregido en el codigo, no debilitando la spec.** La casilla solo aparece en elementos asignables, y
`handleItemPress` (el otro camino de seleccion, tocar la tarjeta) aplica la misma regla. Cubierto por
`no deja elegir tipos que la asignacion no puede escribir`.

### Major 3 - Evidencia `offline-reconnect` y `cross-device` declarada y no entregada

Ambas decian literalmente "PENDIENTE" en `readiness.json`. El gate las daba por PASS porque solo
comprueba que el id exista con una cadena no vacia: un PASS vacuo.

**Corregido.** Se escribio `src/__tests__/sync/asignacionContenidoOfflineReconexion.test.tsx`, que
recorre el ciclo completo desde la pantalla real: sin conexion la hoja informa y no bloquea, la
asignacion queda escrita y encolada, el resultado no afirma que subio; al reconectar `flushQueue`
procesa una operacion, la cola queda vacia y sale una unica peticion a `/api/recursos` con
`{ id: 1, grupoId: 7 }`. Un segundo caso comprueba que un flush con la red aun caida no consume la
operacion ni altera el dato local. Para `cross-device` se declara el limite con franqueza: no se
observo contra un backend real porque el desplegado rechaza el origen local por CORS; lo verificado es
el documento que sale en la subida, que es lo unico que este flujo entrega al servidor.

### Major 4 - `qa:visual:check --change` en FAIL

El verde del criterio 11 se habia obtenido corriendo el checker **sin** `--change`, modo en el que solo
valida el manifiesto y lo dice en su propia salida. Con `--change` fallaba por falta de
`evidencia/README.md`.

**Corregido.** Se creo `evidencia/README.md` con las siete secciones obligatorias, incluidas las dos que
faltaban en el contenido previo ("Journeys cubiertos" y "Limitaciones"), y las tres capturas del journey
`arranque-y-alcance-del-shell` en 375/768/1280 con el patron de nombre del manifiesto.
`npm run qa:visual:check -- --change adoptar-assign-sheet-contenido` ahora da **PASS** en sus 12 checks.

### Major 5 - `tasks.md` con 0 de 30 tareas marcadas

**Corregido.** Cada tarea marcada con la evidencia que la respalda.

### Major 6 - Sin assessment de deuda, con un hallazgo verificado sin rastrear

El control de cierre de la hoja mide 28x28 en web contra la SHALL de 44 puntos, y no estaba en ningun
registro.

**Corregido.** `debt:capture` del flujo incluye ese item y los dos Minors de codigo que quedan abiertos,
cada uno con verificacion y recuperacion.

## Minors

| # | Hallazgo | Resolucion |
| --- | --- | --- |
| 1 | El procedimiento de no vacuidad usaba `git checkout -- <archivo>`, que restaura desde el indice y por tanto era un no-op con el cambio ya commiteado. | **Corregido.** Se rehizo con `git checkout development -- <archivo>`. El resultado afirmado se sostuvo: 23 pruebas fallan sin el cambio. `01-no-vacuidad-mutacion.md` documenta el error y la correccion en vez de borrarlos. |
| 2 | `design.md` afirmaba verificar los cuatro estados "en esta superficie", pero la QA solo recorrio abrir, destino y resultado. | **Declarado, no maquillado.** Los estados de error y vacio se listan en la seccion Limitaciones de `evidencia/README.md`, y Nielsen 9 baja a severidad 1 en vez de 0. |
| 3 | La hoja compartida usa el mismo `error` para el fallo de carga de destinos y para el de escritura, y lo pinta siempre como "No se pudieron cargar los destinos" con un reintento que recarga destinos en vez de reintentar la asignacion. | **Capturado como deuda** (`defect`, minor). Es de `useAssignSheet`/`AssignSheet` (#84), fuera del alcance declarado; corregirlo toca el componente transversal y merece su propio flujo. |
| 4 | `Number(null)` y `Number("")` valen 0 y son finitos, asi que un registro corrupto pasaba el filtro de `aElementoAsignable` y terminaba en "no se asigno nada". | **Corregido.** El filtro exige entero positivo y acepta ids numericos entregados como cadena. Cinco casos cubiertos por `it.each`, todos fallan sin el cambio. |
| Pregunta | El guard `if (elemento) setItemParaAsignar(elemento)` es un no-op silencioso. | Resuelto por la correccion del Minor 4: con el filtro estricto el unico camino que llegaba a ese guard era un id corrupto, y ahora esos elementos ya no ofrecen la accion. El guard queda como defensa de una llamada por otra via. |

## Hallazgo adicional encontrado al corregir

Al corregir el Major 2 aparecio un defecto **preexistente** en el mismo camino: `DetalleGrupo` navega
con `targetGroupId: String(grupoId)` y `handleConfirmSelection` lo pasaba sin convertir a
`asignarRecursosAGrupo(grupoId: number, ...)`. El documento quedaba con `grupoId: "7"` mientras el resto
de la app compara contra `7`, asi que la asignacion se guardaba y el grupo no la mostraba nunca. Con la
correccion del Major 1 el resultado habria afirmado "1 elemento asignado" sobre una asignacion invisible,
es decir, exactamente lo que el requisito prohibe.

**Corregido**, con prueba dedicada (`convierte el grupo destino a numero antes de escribir`). Tambien se
completaron las dependencias de `handleItemPress`, que leia `isSelectionMode` desde un cierre congelado
del primer render: con la regla nueva de tipos, un cierre viejo decidiria mal quien puede seleccionarse.
Eso ademas retira uno de los warnings de react-doctor del baseline.

## Refutaciones que no prosperaron

El revisor intento y no logro refutar: que la escritura encola y sobrevive al pull (verificado en el
camino real, sin mocks del motor); que no hay ruta de exito sin escritura en la hoja; que no se
introdujo cliente, cola, servicio, modal ni clave paralelos; que la medicion del panel evito el wrapper
de RN Web; que la no vacuidad se sostiene; que la paleta `DT` sigue en 23 entradas sin ningun hex nuevo;
y que el estado offline es real y no un placeholder.

Limite declarado por el propio revisor: no pudo reejecutar el foco y Escape en navegador (requiere
`expo start --web` mas Playwright MCP), asi que esa parte la tomo de la evidencia narrada y no la
verifico de primera mano.
