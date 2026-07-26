# Revision adversarial

**Alcance**: issue #152 / change `corregir-defectos-hoja-compartida`
**Fuentes**: `proposal.md`, `design.md`, `specs/cross-surface-assignment/spec.md`, `tasks.md`,
`brownfield-baseline.md`, `readiness.json`, y el diff completo de la rama contra `development`
(`387dee1..28ef5a3`).

## Alineacion spec/tareas

- Los tres items de deuda del alcance tienen cada uno tarea, implementacion, prueba y
  evidencia. Ninguno quedo solo documentado.
- La spec nueva anade una requirement con cinco escenarios; los cinco tienen prueba.
- La SHALL de los 44 puntos **no se modifico**: el codigo se ajusto a ella. Verificado leyendo
  `openspec/specs/cross-surface-assignment/spec.md:182`, intacta.
- No objetivos respetados: no se migraron los 28 usos de `hitSlop` (se corrigieron 3), no se
  toco `ContenidoScreen`, ni la paleta `DT`, ni `src/sync`, ni el backend, ni las cinco
  excepciones del registro.

## Hallazgos

| Severidad | Area | Hallazgo | Evidencia | Arreglo |
| --- | --- | --- | --- | --- |
| **Major** | Codigo | Los tres `elegir*` limpiaban `resultado` pero **no** `errorEscritura`. Tras un fallo parcial hacia la clase A, cambiar a la clase B dejaba el aviso en pantalla diciendo "se guardo 1 elemento y queda 1 pendiente, reintentar continua desde ahi": conteo falso respecto de B, y promesa incumplible porque la clave de destino cambio y el reintento reescribe todo. **Es el mismo defecto que este change corrige, reintroducido un nivel mas abajo.** | Prueba escrita primero, fallando: `Received: {"asignados": 1, ..., "pendientes": 1}` donde se esperaba `null`. | **CERRADO** en `28ef5a3`. Punto unico de olvido (`olvidarResultadoDelDestinoAnterior`) compartido por los tres. Prueba `cambiar de destino retira el aviso de fallo`. |
| **Major** | Codigo (preexistente) | Asignar **dos o mas elementos en una sola pasada pierde localmente el destino de todos menos el ultimo**. `RecursosContext.actualizarRecurso` cierra sobre el `recursos` del render, y dos llamadas seguidas dentro del mismo bucle construyen su `next` desde el mismo snapshot: la segunda pisa a la primera. La cola si recibe los dos documentos, asi que el servidor acaba correcto, pero el almacenamiento local queda con un elemento sin `grupoId` hasta el siguiente pull. En una app offline-first eso es trabajo que el docente ve desaparecer. | Sonda ejecutada sobre el motor real: `local: [{"id":1},{"id":2,"grupoId":7}]` frente a `cola: [{"id":1,"grupoId":7},{"id":2,"grupoId":7}]`. | **NO se corrige aqui.** Es preexistente (`RecursosContext` no se toca desde el commit del motor de sync) y **no alcanzable hoy**: los dos consumidores pasan exactamente un elemento (`ContenidoScreen:1388`, `ListaRecursosScreen:420`). Corregirlo toca el camino de escritura y los contextos, no objetivo declarado. **Registrado como deuda** con esta evidencia. |
| Minor | Codigo (preexistente) | Cerrar la hoja mientras la escritura esta en curso deja el bucle en vuelo: `reiniciar()` pone el progreso en `null` y el destino en vacio, pero el bucle sigue con su referencia y acaba llamando `setResultado`. Al reabrir, la hoja puede entrar directa a la pantalla de resultado con `resumenDestino` nulo. | Lectura del codigo: `cerrar()` no espera a `ejecutando`, y ni el boton Cancelar ni el control de cierre se deshabilitan durante la escritura. | No se corrige: preexistente y de la misma familia que el anterior. Anotado junto a el en el mismo item de deuda. |
| Minor | Evidencia | El alto del `Banner` no se midio antes del cambio, solo despues. El razonamiento de que no cambia es solido (caja 44 con margen -8 aporta los mismos 28 al layout que la caja de 28 anterior, y el icono queda centrado en el mismo punto) y el alto del `Toast` si se midio, pero la comprobacion directa del banner falta. | `evidencia/02-medicion-area-tactil.md`. | Declarado. No justifica rehacer la sesion de medicion. |
| Minor | Evidencia | Los nueve `hitSlop` de `CuentaScreen` no se midieron uno a uno. | `evidencia/03-inventario-hitslop.md`, seccion grupo C. | Ya declarado como pendiente de medicion, no como defecto confirmado. Va en el item de deuda del inventario. |
| Pregunta | Diseno | La justificacion original de la reanudacion ("evitar operaciones duplicadas en la cola") era **falsa**: `enqueueOperation` deduplica los `update` por id. | `src/sync/services/syncEngine.ts:95-104`. | **CERRADO** antes de esta revision: `design.md` D2 lleva una nota de correccion explicita y la spec se reescribio sobre las razones reales (conteo acumulado, coste redundante, reinicio del contador de reintentos). |

## Intentos de refutacion que NO encontraron nada

- **"Los dos errores no estan realmente separados."** Refutado: son dos campos de estado
  distintos con setters distintos, el efecto de carga no tiene acceso al de escritura, y en el
  navegador los dos banners nunca aparecen a la vez (`04-estados-de-error.md`).
- **"Reintentar tras un fallo de escritura recarga destinos."** Refutado con medicion de
  llamadas: `mockGetUnidades.mock.calls.length` no cambia al pulsar Reintentar en el banner de
  escritura, y la hoja llega al resultado.
- **"El control de cierre mide 44 solo en el test, no en web."** Refutado con
  `getBoundingClientRect` y `document.elementFromPoint` en Chrome real: 44x44, alcanza a 21pt en
  los cuatro lados y **no** alcanza a 23pt, lo que prueba que se midio el control y no un
  contenedor.
- **"La caja nueva rompe el encabezado en algun breakpoint o tema."** Refutado: encabezado
  60.6 y panel 520x333.4 (375.4 en movil) **identicos antes y despues**, en 375/768/1280 y en
  ambos temas.
- **"Los casos de vacio y error anadidos son vacuos."** Parcialmente cierto y **declarado**: el
  de error de carga falla contra el codigo viejo; el de estado vacio no, porque el item que lo
  motiva es `optional-improvement` (cobertura faltante), no un defecto. Escrito en
  `05-mutacion.md` en vez de disimulado.
- **"El inventario de `hitSlop` esta incompleto."** Refutado: 28 usos en 13 archivos, todos
  clasificados, y la guardia falla si aparece uno nuevo sin declarar.
- **"La guardia es vacua."** Refutada por mutacion en las **tres** direcciones: uso nuevo sin
  declarar, entrada obsoleta, y regresion de un cierre de la base.

## Deuda nueva generada por este change

**Ninguna.** Los dos hallazgos que quedan abiertos (perdida local en escritura multiple y cierre
durante la escritura) son **preexistentes**, verificados como tales por historia de git, y no
alcanzables desde la interfaz actual. Se registran con evidencia en el mismo assessment de
cierre, no como aviso suelto.

## Veredicto

**PASS CON HUECOS.**

El Major introducido por este change esta cerrado con prueba. El otro Major es preexistente, no
alcanzable en produccion y queda registrado como deuda con evidencia reproducible. Los Minors
estan declarados.

Archivar es aconsejable en el estado actual, **condicionado** a que el assessment de deuda
registre los hallazgos preexistentes antes de `opsx:archive`.
