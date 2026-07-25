# Evidencia de QA visual: sanear la fuente de breakpoint (Ola 2b)

Change `sanear-breakpoints-uxui`. Issue [#106](https://github.com/RitualBoat/PlanearIA/issues/106).
Epic [#141](https://github.com/RitualBoat/PlanearIA/issues/141). Item de deuda `debt-3d3ea5ba87ac`.

## Entorno

`npm run web` (`expo start --web`) en `http://localhost:8081`. **HTTP 200 confirmado ANTES de navegar**,
como exige la regla del repo; registro literal en `04-entorno-web.txt`.

Herramienta: **Playwright MCP**, no el panel Browser. El `resize_window` del panel es CDP crudo y no
emite el evento DOM `resize`, mientras que `browser_resize` de Playwright usa `page.setViewportSize` y si
lo emite, que es justo lo que esta ola necesita medir. Cada medicion se hizo en una llamada POSTERIOR al
cambio de ancho, porque el re-render de React es asincrono y en el mismo tick se lee el estado anterior.
Se excluyeron los subarboles `[aria-hidden="true"]` que React Navigation deja montados.

Sesion de invitado, sin datos de docente.

## Medicion por breakpoint

**Esta es la afirmacion central del change.** No basta con que una pantalla migrada reaccione al ancho:
ya reaccionaba antes. Lo que el item de deuda pedia es que deje de poder responder a un rango distinto
del shell. Por eso se mide el shell y una pantalla migrada **en el mismo pixel de corte**, en los dos
limites canonicos.

### Limite 768 (barra inferior -> rail)

| Ancho | Shell (`[role="tablist"]`) | NotificacionesScreen (Grupo A, migrada) |
| --- | --- | --- |
| 767 | barra horizontal abajo: `x=4, y=841, w=759, h=55` | contenido SIN capar: 0 contenedores con `max-width: 720px` |
| 768 | rail vertical: `x=12, y=64, w=68, h=830` | contenido capado: 1 contenedor de `w=720, x=24` |

### Limite 1280 (rail -> sidebar)

| Ancho | Shell (ancho del tablist) | ContenidoScreen (Grupo A, migrada) |
| --- | --- | --- |
| 1279 | 68 px (rail) | contenido SIN capar: 0 contenedores con `max-width: 600px` |
| 1280 | 199 px (sidebar) | contenido capado: 1 contenedor de `w=600, x=596` |

Ambos conmutan exactamente en el mismo pixel, en runtime y sin recargar.

### Capturas

| Archivo | Ancho | Que muestra |
| --- | --- | --- |
| `arranque-y-alcance-del-shell-375.png` | 375 | Escritorio, movil |
| `arranque-y-alcance-del-shell-768.png` | 768 | Escritorio, tablet |
| `arranque-y-alcance-del-shell-1280.png` | 1280 | Escritorio, escritorio |
| `limite-768-notificaciones-767.png` | 767 | Notificaciones justo antes del limite |
| `limite-768-notificaciones-768.png` | 768 | Notificaciones justo en el limite |
| `limite-1280-contenido-1279.png` | 1279 | Contenido justo antes del limite |
| `limite-1280-contenido-1280.png` | 1280 | Contenido justo en el limite |

Las siete capturas tienen md5 distinto entre si.

## Journeys cubiertos

**`arranque-y-alcance-del-shell`** (N1). Recorrido real ejecutado con Playwright MCP:

1. `browser_navigate` a `http://localhost:8081`. La app arranca con sesion de invitado y aterriza en el
   Escritorio (`InicioTab`), coherente con el comportamiento posterior a #81.
2. Se verifica el alcance del shell: los cinco destinos primarios (Inicio, Office, Clases, Asistente,
   Mas) estan presentes como `[role="tab"]`, y la barra superior expone el chip "Guardado en este
   dispositivo" mas los botones de notificaciones, ayuda y menu de cuenta.
3. Se recorren los tres anchos (375, 768, 1280) con `browser_resize`, midiendo en una llamada posterior
   y capturando en cada uno. El shell pasa de barra inferior a rail y de rail a sidebar.
4. Con clic real (`browser_click`, no sintetico) se abre Notificaciones desde la campana, y desde
   Office > Biblioteca se abre Contenido, para medir los dos limites contra el shell.

## Checklist Nielsen

Severidad Nielsen maxima: 0, por debajo del umbral de bloqueo 3.

Este change no introduce pantallas, estados ni flujos: el checklist se aplica como **no regresion**.

- **Visibilidad del estado del sistema:** el chip "Guardado en este dispositivo" y el contador de
  notificaciones siguen presentes en los tres anchos.
- **Correspondencia con el mundo real:** sin cambios de copy; el diff no toca ningun texto de usuario.
- **Control y libertad del usuario:** la navegacion de vuelta desde Notificaciones y Contenido funciona
  igual; no se toco navegacion.
- **Consistencia y estandares:** las pantallas migradas ahora conmutan con el mismo criterio que el
  shell, que es mas consistente que antes, no menos.
- **Reconocer antes que recordar:** los cinco destinos conservan etiqueta y orden en los tres anchos.
- **Flexibilidad y eficiencia:** la densidad por breakpoint se conserva; movil respira y escritorio
  aprovecha el ancho con los mismos limites que antes del change.
- **Estetica y diseno minimalista:** cero literales de color, tokens, tipografia o espaciado tocados.
- **Ayuda y documentacion:** el centro de ayuda sigue accesible desde la barra superior.

## Checklist anti-slop

- **No parece plantilla:** sin cambios visuales; la identidad de PlanearIA (paleta azul docente, ritmo,
  radios) queda intacta porque el diff no toca ni un estilo.
- **Cero placeholders genericos:** no se agrego ninguna superficie nueva.
- **Tipografia con jerarquia intencional:** sin cambios; el change no roza `src/themes` ni ningun tamano.
- **Estados disenados:** loading, empty, error y offline se conservan tal cual; ninguna de las 27
  migraciones toca render condicional de estado.
- **Micro-interaccion significativa:** sin cambios; no se agregaron ni retiraron animaciones.
- **Densidad correcta por breakpoint:** verificada en las capturas de 375, 768 y 1280; ninguna es una
  columna movil estirada.
- **Preferencias preservadas:** `ThemeContext`, `FontSizeContext` y `DaltonismoContext` intactos. El diff
  no toca `src/themes` ni ningun consumidor de tema, y `check:theming-rollout` sigue en verde con sus 50
  entradas y su techo sin mover.

## Consola

24 errores, **todos** `401` del backend desplegado (`/api/notificaciones`, `/api/grupos`,
`/api/mensajes`) por navegar sin sesion. Es el ruido benigno esperado y documentado desde #85; se
clasifica en vez de declarar "cero errores". Cero errores nuevos atribuibles al change.

3 advertencias, todas preexistentes: deprecaciones de RN Web (`shadow*` y `props.pointerEvents`) y la
nota de `expo-notifications` sobre push en web.

## Limitaciones

- **El umbral de contenido del Grupo B no se pudo observar en el navegador.**
  `BibliotecaPlantillasScreen` (umbral 900) usa `isDesktop` solo en su hoja de detalle y su barra de
  busqueda, ninguna alcanzable con la biblioteca vacia de una sesion de invitado: medido a 768, 899 y
  900 el DOM visible es identico (146 nodos en los tres anchos). `EscanerPlantillaScreen` (960) e
  `ImportarPlaneacionScreen` (980) si tienen rejilla observable, pero no son alcanzables desde el
  Escritorio sin datos previos. Esa propiedad queda cubierta por el test de componente de
  `CrearNuevoModal` a 899 y 900, que es discriminante y esta probado por mutacion
  (`02-tests-no-vacuos.txt`). Se declara aqui en vez de presentar la QA visual como cobertura total.
- **La QA visual cubre 4 de las 27 pantallas migradas** (Escritorio como shell, Notificaciones,
  Contenido y la medicion de Biblioteca). El resto no es alcanzable sin datos de docente. La cobertura
  del comportamiento migrado se apoya en typecheck sobre los 27, en la guardia que verifica el arbol
  completo y en los tests de reactividad por grupo.
- **La falla local de `spreadsheetDependency`** en Windows es preexistente (#133/#126, tarball
  vendorizado de SheetJS) y ajena a esta superficie; pasa en CI.
