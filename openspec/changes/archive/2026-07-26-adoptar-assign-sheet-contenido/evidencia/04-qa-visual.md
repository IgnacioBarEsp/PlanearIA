# QA visual por breakpoint y tema

Herramienta: **Playwright MCP** (no el panel Browser, cuyo resize es CDP crudo y no despacha el evento
DOM `resize`). Clics y teclas **reales**, no eventos sinteticos. `expo start --web` en 8082 con HTTP 200
verificado antes de navegar (ver `03-entorno-web.md`).

Ruta real recorrida: Escritorio -> Office -> Biblioteca -> ContenidoScreen. Datos sembrados en
`localStorage` con las claves que la app usa (`@planearia:recursos`, `@planearia:grupos`), porque la
sesion de invitado arranca vacia y sin elementos no hay menu que abrir.

## Capturas

Las ocho tienen md5 distinto, es decir, ninguna es una repeticion de otra.

| Archivo | Breakpoint | Tema | Estado capturado |
| --- | --- | --- | --- |
| `114-1280-claro.png` | 1280 | claro | Hoja recien abierta, sin destino elegido |
| `114-1280-claro-destino.png` | 1280 | claro | Destino elegido, confirmar habilitado |
| `114-1280-claro-resultado.png` | 1280 | claro | Resultado tras asignar |
| `114-768-claro.png` | 768 | claro | Hoja abierta |
| `114-375-claro.png` | 375 | claro | Hoja abierta (bottom sheet a ancho completo) |
| `114-1280-oscuro.png` | 1280 | oscuro | Hoja abierta |
| `114-768-oscuro.png` | 768 | oscuro | Hoja abierta |
| `114-375-oscuro.png` | 375 | oscuro | Hoja abierta |

## Medicion del panel: por `data-testid`, nunca por `aria-modal`

Este change reprodujo en vivo el falso positivo que documenta #110 (y que retracto un hallazgo de #84):

| Viewport | Panel por `[data-testid="contenido-asignar-sheet-panel"]` | Wrapper por `[aria-modal="true"]` |
| --- | --- | --- |
| 1280x900 | 520 x 333 | **1280 x 900** |
| 768x1024 | 520 x 333 | **768 x 1024** |
| 375x812 | 375 x 333 (x=0, a ancho completo) | 375 x 812 |

`aria-modal` devuelve el contenedor full-viewport de React Native Web, no la hoja. Medir por ahi habria
"demostrado" que el panel ocupa toda la pantalla en los tres breakpoints. Todas las medidas de este
informe salen del `data-testid` del panel.

Densidad por breakpoint: el panel se mantiene en 520 de ancho en escritorio y tablet (no es una columna
movil estirada) y pasa a ancho completo anclado abajo en movil. Sin desborde horizontal de la pagina en
ninguno de los tres (`documentElement.scrollWidth <= innerWidth`).

## Flujo real verificado en el navegador

1. **Abrir**: clic real en "Mas opciones" de un recurso -> el menu lista "Asignar a grupo" -> clic real
   -> se monta la hoja compartida con los `testID` esperados.
2. **Elegir destino**: clic real en la clase -> `aria-checked` pasa de `"false"` a `"true"` **solo** en
   la elegida, el resumen muestra "Destino: 3o A - Matematicas" y confirmar se habilita.
3. **Cancelar con Escape**: la hoja cierra, el recurso **sigue sin `grupoId`** y **no hay ninguna
   operacion en cola**. Cancelar no escribe.
4. **Asignar**: el resultado dice
   `"Listo | 1 elemento asignado a 3o A - Matematicas. | Guardado en este dispositivo. Se asignara en el
   servidor cuando vuelva la conexion."`
   - Nombra el destino y la cantidad; no es una formula generica.
   - Distingue **encolado** de **sincronizado** con el vocabulario de la fuente unica (#83), sin copy
     propio de falta de conexion.
5. **Efecto real en almacenamiento**: `@planearia:recursos` deja el recurso 101 con `grupoId: 7` y el
   102 **intacto**; `@planearia:pending_ops_v2_recursos` contiene **una** operacion `update` del id 101
   con `grupoId: 7`. Escritura y encolado, no solo escritura.

## Accesibilidad

- **Foco atrapado, con Tab real.** Primer Tab entra al panel (`contenido-asignar-sheet-close`). Tras
  **nueve** Tab reales consecutivos el foco **sigue dentro** del panel (`contenido-asignar-sheet-cancelar`),
  pese a haber decenas de elementos enfocables en la pantalla detras.
- **Escape cierra** la hoja sin escribir.
- **Sin depender del color**: cada opcion de destino declara `aria-checked` explicito y su
  `aria-label` con el nombre de la clase. React Native Web no lo deriva de `accessibilityState`
  (leccion de #82), por eso el prop es explicito en la hoja.
- **Tema**: la hoja reacciona al tema (fondo `rgb(30, 37, 46)` en oscuro contra superficie clara en
  claro), porque consume tokens via `useAppTheme()`. La pantalla que la contiene sigue pintada con la
  paleta local `DT`, que este change no toca por excepcion vigente. Esa discontinuidad es deliberada y
  esta declarada en `design.md`.

### Hallazgo de accesibilidad: control de cierre por debajo de 44 puntos en web

El boton de cierre de la hoja mide **28 x 28** en web. La spec pide 44 en ambos lados.

Verificado empiricamente, no supuesto: el componente base `Sheet` (#82) resuelve el area tactil con
`hitSlop={hitSlopToMinTarget(...)}`, y **React Native Web no implementa `hitSlop`**. La comprobacion en
runtime lo confirma: `padding` calculado `0px 0px 0px 0px`, y `document.elementFromPoint` a 8px por
fuera del borde **no** alcanza el boton, mientras que en el centro si.

- **No lo introduce este change.** Vive en el componente base compartido y afecta a toda hoja de la app,
  incluida la adopcion de referencia en Biblioteca.
- **No se corrige aqui.** Tocar el componente base que montan todas las hojas excede el alcance
  declarado y exigiria su propia pasada de regresion visual.
- **No es bloqueante**: la hoja tambien cierra desde el fondo y con Escape, y ambos caminos estan
  disponibles.
- Se registra como deuda verificada en el assessment del flujo, con esta evidencia.

## Consola

30 errores en consola durante el recorrido, **todos** de la misma familia: CORS del backend desplegado
rechazando el origen `http://localhost:8082` porque su `Access-Control-Allow-Origin` es
`https://planearai.com`. Son de entorno (dev local contra backend de produccion) y preexistentes; cero
provienen de este change. Ningun error de React, de render ni de la hoja.

## Checklist Nielsen (severidad 0-4, umbral de bloqueo 3)

| # | Heuristica | Observacion | Severidad |
| --- | --- | --- | --- |
| 1 | Visibilidad del estado del sistema | El resultado distingue sincronizado de encolado; el boton pasa a "Asignando" mientras ejecuta. | 0 |
| 2 | Correspondencia con el mundo real | "Asignar a clase", "Unidad", "Actividad": vocabulario docente, no de sistema. | 0 |
| 3 | Control y libertad del usuario | Cancelar, Escape y fondo cierran sin escribir; verificado que no queda nada en cola. | 0 |
| 4 | Consistencia y estandares | Misma hoja, mismo lenguaje y mismos destinos que Biblioteca. | 0 |
| 5 | Prevencion de errores | Confirmar deshabilitado sin clase; el nivel de actividad no se ofrece a elementos que no la admiten; la accion no se ofrece a tipos no asignables. | 0 |
| 6 | Reconocer antes que recordar | El destino elegido se muestra escrito ("Destino: ...") antes de confirmar. | 0 |
| 7 | Flexibilidad y eficiencia | Unidad y actividad opcionales: con solo la clase la asignacion es valida. | 0 |
| 8 | Diseno estetico y minimalista | El panel se mantiene en 520 en escritorio y tablet; ancho completo solo en movil. | 0 |
| 9 | Ayudar a reconocer y recuperarse de errores | Error de carga de destinos con reintento, sin cerrar la hoja ni perder el elemento. | 0 |
| 10 | Ayuda y documentacion | La confirmacion nombra destino y cantidad; no requiere documentacion externa. | 0 |
| — | Accesibilidad: area tactil del cierre | 28x28 en web por `hitSlop` no soportado en RN Web. Preexistente del componente base; hay dos caminos alternativos de cierre. | **2** |

**Severidad maxima: 2**, por debajo del umbral de bloqueo 3.

## Checklist anti-slop (seccion 1.9.3)

- [x] No parece plantilla: paleta azul docente, ritmo 4pt y radios propios del sistema.
- [x] Cero placeholders genericos: los estados vacios explican y ofrecen salida ("Crea una clase").
- [x] Tipografia con jerarquia intencional desde tokens (`typography.body`, `caption`, `subtitle`).
- [x] Los cuatro estados estan disenados: skeletons en carga, vacio accionable, error con reintento,
      offline informativo que no bloquea.
- [x] Micro-interaccion con sentido: el radio de destino confirma la eleccion y el boton pasa a
      "Asignando" durante la ejecucion. Comunica estado, no decora.
- [x] Densidad correcta por breakpoint: 520 en escritorio y tablet, ancho completo en movil.
- [x] Nielsen sin severidad >= 3.

Se aplica como **no regresion**: la superficie visual nueva es la hoja compartida, ya validada en #84;
este change verifica que se comporta igual montada desde Contenido.
