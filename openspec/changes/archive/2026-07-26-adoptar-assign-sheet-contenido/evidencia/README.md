# Reporte de evidencia: adoptar-assign-sheet-contenido

Nivel de QA visual declarado: **N1** (`qaVisualNivel` en `readiness.json`).

Justificacion del nivel: el change no altera la estructura de layout ni de navegacion (no es N2) y no
introduce superficie visual nueva: monta la hoja compartida ya validada en #84 sobre una pantalla
existente. Es el mismo nivel que declaro `sanear-breakpoints-uxui`, que tambien toco `ContenidoScreen`.
Aun asi la evidencia excede N1: se midio el DOM en los tres anchos (N1 no lo exige) y se capturo en los
dos temas.

Documentos hermanos en esta carpeta: `01-no-vacuidad-mutacion.md`, `02-react-doctor.md`,
`03-entorno-web.md`, `04-qa-visual.md`.

## Entorno

`expo start --web` en el puerto **8082**, con **HTTP 200 verificado con curl ANTES de navegar**. El
puerto 8081 estaba ocupado por un dev server previo a esta sesion (PID 14424, iniciado a las 01:04); no
se toco y se levanto uno limpio para que el bundle reflejara sin duda el codigo de esta rama. Metro
reporto `Web Bundled 2203ms index.js (1803 modules)`.

Herramienta: **Playwright MCP**, no el panel Browser (su resize es CDP crudo y no despacha el evento DOM
`resize`). Clics y teclas **reales**, no eventos sinteticos. Detalle en `03-entorno-web.md`.

Datos sembrados en `localStorage` con las claves reales de la app (`@planearia:recursos`,
`@planearia:grupos`): la sesion de invitado arranca vacia y sin elementos no hay menu que abrir.

## Medicion por breakpoint

Medido por el `data-testid` del panel, **nunca** por `[aria-modal="true"]`.

| Ancho | Panel por `data-testid` | Wrapper por `[aria-modal]` | Shell |
| --- | --- | --- | --- |
| **375** | 375 x 333, x=0 (bottom sheet a ancho completo) | 375 x 812 | barra inferior, tab de 69 |
| **768** | 520 x 333 | 768 x 1024 | rail de 68 |
| **1280** | 520 x 333 | 1280 x 900 | sidebar de 199 |

Este change **reprodujo en vivo** el falso positivo que documenta #110 y que retracto un hallazgo de
#84: `[aria-modal="true"]` devuelve el contenedor full-viewport de React Native Web. Medir por ahi
habria "demostrado" que el panel ocupa toda la pantalla en los tres anchos.

Densidad correcta: el panel se mantiene en 520 en tablet y escritorio (no es una columna movil
estirada) y pasa a ancho completo solo en movil. Sin desborde horizontal de pagina en ningun ancho
(`documentElement.scrollWidth <= innerWidth`).

## Journeys cubiertos

**arranque-y-alcance-del-shell** (GJ0, vigente) es el unico journey obligatorio en N1 y el unico que
este change toca: su ruta `Contenido` es la pantalla intervenida.

Recorrido real ejecutado en 375, 768 y 1280: arranque de la app -> Escritorio -> pestaña Office ->
Biblioteca -> `ContenidoScreen`. En cada ancho se verifico que el shell conserva su alcance y su forma
(barra inferior en 375, rail de 68 en 768, sidebar de 199 en 1280) y que la pantalla llega con su
contenido. Capturas: `capturas/arranque-y-alcance-del-shell-{375,768,1280}.png`.

El change no altera el shell; el journey se cubre como **no regresion**, que es lo que corresponde a un
change que solo cambia una accion dentro de una de sus pantallas.

Los journeys GJ1, GJ2 y GJ3 estan en estado `parcial` y GJ4/GJ5 en `declarado`; ninguno se exige aqui.
Nota sobre GJ4 ("Trabajar sin conexion y reconectar sin perder nada"): esta reservado y no puede
exigirse como evidencia, pero su propiedad central si quedo probada para esta superficie en
`src/__tests__/sync/asignacionContenidoOfflineReconexion.test.tsx`.

Capturas adicionales del flujo de la accion, fuera de lo que N1 exige, en `capturas/114-*.png`:
apertura, destino elegido y resultado en 1280 claro, mas los tres anchos en ambos temas.

## Checklist Nielsen

**Severidad Nielsen maxima: 2** (umbral de bloqueo: 3).

| # | Heuristica | Observacion | Severidad |
| --- | --- | --- | --- |
| 1 | Visibilidad del estado del sistema | El resultado distingue sincronizado de encolado; el boton pasa a "Asignando" mientras ejecuta. | 0 |
| 2 | Correspondencia con el mundo real | "Asignar a clase", "Unidad", "Actividad": vocabulario docente. | 0 |
| 3 | Control y libertad del usuario | Cancelar, Escape y fondo cierran sin escribir, verificado contra almacenamiento y cola. | 0 |
| 4 | Consistencia y estandares | Misma hoja, mismo lenguaje y mismos destinos que Biblioteca. | 0 |
| 5 | Prevencion de errores | Confirmar deshabilitado sin clase; no se ofrece el nivel de actividad a elementos que no la admiten; no se ofrece la accion a tipos no asignables, ni en el menu ni en el modo seleccion. | 0 |
| 6 | Reconocer antes que recordar | El destino elegido se muestra escrito antes de confirmar. | 0 |
| 7 | Flexibilidad y eficiencia | Unidad y actividad opcionales: con solo la clase la asignacion es valida. | 0 |
| 8 | Diseno estetico y minimalista | 520 en tablet y escritorio; ancho completo solo en movil. | 0 |
| 9 | Reconocer y recuperarse de errores | Error de carga de destinos con reintento, sin cerrar la hoja ni perder el elemento. Ver Limitaciones: no se ejercito en navegador. | 1 |
| 10 | Ayuda y documentacion | La confirmacion nombra destino y cantidad. | 0 |
| — | Accesibilidad: area tactil del cierre | 28x28 en web porque RN Web no implementa `hitSlop`. Preexistente del componente base #82; hay dos caminos alternativos de cierre. | **2** |

## Checklist anti-slop

Seccion 1.9.3 del plan UX/UI.

- [x] No parece plantilla: paleta azul docente, ritmo 4pt y radios propios.
- [x] Cero placeholders genericos: los estados vacios explican y ofrecen salida.
- [x] Tipografia con jerarquia intencional desde tokens (`typography.body`, `caption`, `subtitle`).
- [x] Los cuatro estados estan disenados: skeletons en carga, vacio accionable, error con reintento,
      offline informativo que no bloquea.
- [x] Al menos una micro-interaccion significativa: el radio confirma la eleccion y el boton pasa a
      "Asignando". Comunica estado, no decora.
- [x] Densidad correcta por breakpoint.
- [x] Nielsen sin severidad >= 3.

Se aplica como **no regresion**: la superficie visual es la hoja compartida ya validada en #84; aqui se
verifica que se comporta igual montada desde Contenido.

## Consola

30 errores durante el recorrido, **todos** de la misma familia: CORS del backend desplegado rechazando
el origen `http://localhost:8082` porque su `Access-Control-Allow-Origin` es `https://planearai.com`.
Son de entorno (dev local contra backend de produccion) y preexistentes. **Cero** provienen de este
change: ningun error de React, de render ni de la hoja. La guardia de consola de Jest sigue activa y las
suites pasan sin `console.error` ni `console.warn` no declarados.

## Limitaciones

Se declaran en vez de presentarse como cubiertas:

1. **`cross-device` no se observo contra un backend real.** El backend desplegado rechaza por CORS el
   origen local, asi que no hubo forma de ver la asignacion desde un segundo origen en esta sesion. Lo
   que si se verifico, y es lo unico que este flujo entrega al servidor, es el documento que sale en la
   subida: `asignacionContenidoOfflineReconexion.test.tsx` afirma que tras reconectar se hace **una**
   peticion a `/api/recursos` cuyo cuerpo contiene `{ id: 1, grupoId: 7 }`. Un segundo dispositivo ve
   exactamente eso al bajar. La verificacion contra backend real queda pendiente de un entorno con CORS
   permitido.
2. **El estado de error de la hoja no se ejercito en el navegador.** Esta cubierto por
   `assignSheet.test.tsx` (#84) y su banner con reintento es codigo compartido no modificado aqui, pero
   no hay captura de este change mostrandolo. Por eso Nielsen 9 va en severidad 1 y no en 0.
3. **El estado vacio ("Aun no tienes clases") no tiene captura de este change.** La suite de pantalla
   mockea la hoja y la de sync siembra un grupo, asi que el vacio no llega a renderizarse en las
   pruebas. La salida `onCrearClase` apunta a `ClasesTab/CrearGrupo`, ruta que existe en
   `routeManifest.ts` y es copia literal de la adopcion de referencia.
4. **El control de cierre de 28x28 no se corrige en este change.** Es del componente base compartido y
   afecta a toda hoja de la app; corregirlo exige su propia pasada de regresion visual. Queda
   registrado como deuda verificada con recuperacion, no como hallazgo silenciado.
5. **N1 y no N3.** GJ0 lista `Contenido` entre sus rutas, pero el change no altera el shell ni la
   navegacion. Se declara N1 siguiendo el precedente de `sanear-breakpoints-uxui`, que tambien toco esa
   pantalla. Los anchos de frontera 767 y 1279 que exigiria N3 no se capturaron.
