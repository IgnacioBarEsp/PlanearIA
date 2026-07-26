# Evidencia - corregir-defectos-hoja-compartida

Nivel de QA visual: **N1** (change con UI visible que no altera estructura de layout ni de
navegacion). Journeys obligatorios del nivel: `arranque-y-alcance-del-shell`.

Documentos de detalle:

- `01-react-doctor.md` - antes y despues por directorio tocado.
- `02-medicion-area-tactil.md` - la medicion decisiva del area tactil.
- `03-inventario-hitslop.md` - los 28 usos: lo corregido y lo rastreado.
- `04-estados-de-error.md` - los dos avisos de error vistos en el navegador.
- `05-mutacion.md` - no vacuidad de cada prueba nueva.
- `06-sincronizacion.md` - offline-reconnect, no-local-loss y cross-device.

## Entorno

- Rama `feat/corregir-defectos-hoja-compartida`, desde `development@dbfb52e`.
- `npx expo start --web --port 8082`. **`curl` devolvio HTTP 200 antes de navegar**, en las dos
  sesiones de medicion. El servidor se reinicio a mitad de sesion por una caida transitoria del
  bundler (`Unable to resolve "../../hooks/useAssignSheet"`) provocada por leer el archivo a
  medio escribir mientras se intercambiaban parches de QA; se relanzo y se reconfirmo HTTP 200
  antes de volver a medir.
- **Playwright MCP** sobre Chrome, no el panel Browser. Clics y teclas reales.
- Al medir el DOM se excluye `[aria-hidden="true"]`: react-native-web deja montadas las
  pantallas anteriores y contarlas mezclaria superficies.
- `npm run backend:dev:local` en el puerto 3000 para la verificacion de CORS de `06`.
- Node v26.4.0, npm 11.17.0. React Doctor v0.9.1.

## Medicion por breakpoint

El panel se ancla por su `data-testid`, nunca por `[aria-modal="true"]`: ese selector devuelve
el contenedor a viewport completo de react-native-web. Reproducido de nuevo aqui como control
del metodo: `[data-testid=...-panel]` da 520x333.4 mientras `[aria-modal="true"]` da 1280x900.

| Ancho | Tema | Panel | Encabezado | Cierre | 21pt (4 lados) | 23pt fuera |
| --- | --- | --- | --- | --- | --- | --- |
| 1280 | claro | 520 x 333.4 | 60.6 | 44x44 | alcanza | no alcanza |
| 768 | claro | 520 x 333.4 | 60.6 | 44x44 | alcanza | no alcanza |
| 375 | claro | 375.4 x 333.4 | 60.6 | 44x44 | alcanza | no alcanza |
| 1280 | oscuro | 520 x 333.4 | 60.6 | 44x44 | alcanza | no alcanza |
| 375 | oscuro | 375.4 x 333.4 | 60.6 | 44x44 | alcanza | no alcanza |

**El encabezado mide 60.6 antes y despues del cambio, en los cinco casos.** El area tactil paso
de 28 a 44 puntos sin mover el layout, que es lo que justifica el margen negativo. En 375 se
comprobo ademas que la caja ampliada no se sale del panel.

## Journeys cubiertos

**`arranque-y-alcance-del-shell`** (obligatorio en N1). Capturas
`arranque-y-alcance-del-shell-375.png`, `-768.png` y `-1280.png`. Recorrido: arranque en frio
de la app en tema claro, aterrizando en Escritorio. En 375 el shell presenta la tab bar con las
cinco entradas (Inicio, Office, Clases, Asistente, Mas) mas los tres controles del TopBar; en
768 y 1280 el mismo alcance con el rail lateral. Los controles del shell miden 44x44 (TopBar) y
199x54 (tabs), es decir cumplen el minimo por su propia caja: sirven de control de la medicion,
porque demuestran que el metodo distingue lo que cumple de lo que no.

Este change **no toca la superficie de ningun otro golden journey**: modifica el ViewModel y la
vista del selector transversal, tres controles de cierre de la biblioteca base y pruebas. Por
eso no se declara ningun journey adicional en `readiness.json`.

Fuera del manifiesto, se recorrieron con clics reales las superficies que el change si toca:
Contenido -> menu del item -> Asignar a grupo -> hoja (los tres breakpoints y los dos temas), y
Mas -> Catalogo de componentes -> Banner, Toast y hoja de ejemplo.

## Checklist Nielsen

Severidad Nielsen maxima: 2

Bajo el umbral de bloqueo 3.

| # | Heuristica | Estado |
| --- | --- | --- |
| 1 | Visibilidad del estado | El fallo de escritura ahora dice cuantos elementos quedaron guardados; antes callaba. Sev. 0 |
| 2 | Correspondencia con el mundo real | Los mensajes nombran el hecho: "Se guardo 1 elemento y queda 1 pendiente". Sev. 0 |
| 3 | Control y libertad | Cierre por control, fondo y Escape; el control mide 44x44. Sev. 0 |
| 4 | Consistencia | Los dos avisos usan `Banner` con tonos semanticos distintos (warning para carga, error para escritura). Sev. 0 |
| 5 | Prevencion de errores | Confirmar sigue deshabilitado sin destino. Reintentar no reescribe lo ya escrito. Sev. 0 |
| 6 | Reconocer antes que recordar | El aviso dice que hara el reintento: "Reintentar continua desde ahi". Sev. 0 |
| 7 | Flexibilidad | Sin cambios. Sev. 0 |
| 8 | Diseno minimalista | No se anadio ningun elemento permanente; los avisos solo existen en su estado. Sev. 0 |
| 9 | Recuperacion de errores | **Cerrado en este change**: cada fallo nombra su causa y su accion repara lo que fallo. Sev. 0 |
| 10 | Ayuda y documentacion | No aplica. Sev. 0 |

**Sev. 2 restante, fuera del alcance:** los controles de los grupos B y C del inventario de
`hitSlop` siguen bajo 44 en web (chip 103x32, cierre del chip 16x16, chip de sincronizacion
203x28, "Mas opciones" 28x28, "Filtros" 60x18). No bloquean: se miden, se registran como deuda
con evidencia y quedan vigilados por la guardia. Detalle en `03-inventario-hitslop.md`.

## Checklist anti-slop

- **No parece plantilla.** No se introdujo layout nuevo. Los avisos usan la biblioteca base con
  la paleta azul docente y los radios propios.
- **Cero placeholders genericos.** Ningun lorem ipsum ni card vacia. Los mensajes de error
  llevan el conteo real.
- **Tipografia intencional.** Titulo y cuerpo del banner salen de los tokens del componente; no
  se anadio ningun tamano suelto ni ningun hex. El guardarrail de color de la biblioteca base
  sigue verde (y de hecho atrapo referencias `#152` en comentarios, que se reescribieron en
  prosa en vez de debilitar la guardia).
- **Estados disenados.** Carga (skeletons), vacio (con salida a crear clase), error de carga y
  error de escritura, cada uno con su tratamiento. El de escritura es nuevo.
- **Micro-interaccion.** La entrada con spring de la hoja y su variante sin movimiento bajo
  reduce-motion no se tocaron.
- **Densidad por breakpoint.** Panel a ancho completo en 375, 520 en 768 y 1280. Verificado.
- **Nielsen sin severidad >= 3.** Ver arriba.

## Consola

16 errores en la sesion del navegador, **todos de la misma clase y ninguno de este change**:
CORS del backend desplegado rechazando el origen `http://localhost:8082` para
`/api/notificaciones`, `/api/grupos` y `/api/mensajes`. Es ruido de entorno de desarrollo con
el backend de produccion, preexistente. En `06-sincronizacion.md` queda medido que la causa es
la lista de puertos permitidos y no "localhost" en general.

Cero errores de React, cero warnings de claves, cero avisos de actualizacion de estado fuera de
`act()`.

En la suite de Jest, la guardia de senal de consola sigue activa: los tres tests nuevos que
provocan un fallo declaran su salida esperada con `expectConsoleError`, y la suite completa
pasa sin `console.error`/`warn` no declarados.

## Limitaciones

1. **La relectura desde el servidor no se ejercito.** El cuerpo que sube lleva el destino y eso
   esta afirmado sobre la cola real, pero no se confirmo que MongoDB lo guarde y lo devuelva.
   Motivo: las rutas exigen clave de API y sesion JWT, y el unico `MONGODB_URI` del repositorio
   apunta al Atlas M0 de **produccion**; ejercitarlo habria escrito registros reales en una base
   compartida. Camino de salida identificado en `06-sincronizacion.md`.
2. **Los nueve `hitSlop` de `CuentaScreen` no se midieron uno a uno.** La pantalla con los
   toggles no se alcanzo en la sesion de QA. Se declaran como pendientes de medicion, no como
   defectos confirmados.
3. **La guardia de area tactil detecta dependencia de `hitSlop`, no mide cajas.** Un control que
   no use `hitSlop` y aun asi mida 20x20 la pasa. Medir en CI exigiria navegador, que este
   repositorio no tiene hoy. Declarado tambien en `design.md` (D6) y en el encabezado del test.
4. **Los estados de error se forzaron con un parche temporal**, revertido y verificado ausente.
   No hay forma de provocarlos desde la interfaz.
5. **`src/__tests__/harness/spreadsheetDependency.test.ts` falla en local** (Windows, tarball
   vendorizado de SheetJS). Falla conocida, ajena a este change, verde en CI.
