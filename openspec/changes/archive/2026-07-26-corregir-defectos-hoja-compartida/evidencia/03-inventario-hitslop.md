# Inventario de `hitSlop`: lo corregido y lo rastreado

`hitSlop` no existe en react-native-web. Todo control que dependa solo de el conserva su
tamano visual como area efectiva en el navegador. El inventario estructural sobre `dbfb52e`
da **28 usos en 13 archivos de produccion**. Este change corrige **3** y **rastrea el resto**;
migrarlos todos es no objetivo declarado.

## Lo que se midio de verdad

Medido en navegador con `getBoundingClientRect` (Playwright MCP, 1280x900, tema claro),
recorriendo las pantallas alcanzables con clics reales y **excluyendo `[aria-hidden="true"]`**,
porque react-native-web deja montadas las pantallas anteriores y contarlas mezclaria
superficies.

| Control | Archivo | Caja medida | Cumple 44 |
| --- | --- | --- | --- |
| Cierre de la hoja (Contenido) | `components/base/Sheet.tsx` | 28x28 | NO |
| Cierre de la hoja (catalogo) | `components/base/Sheet.tsx` | 28x28 | NO |
| Cierre del aviso | `components/base/Banner.tsx` | 28x28 | NO |
| Cierre del toast | `components/base/Toast.tsx` | 28x28 | NO |
| Chip | `components/base/Chip.tsx` | 103x32 | NO (alto) |
| Cierre del chip | `components/base/Chip.tsx` | **16x16** | NO |
| Chip de sincronizacion | `components/sync/SyncStatusChip.tsx` | 203x28 | NO (alto) |
| "Mas opciones" de un item | `screens/contenido/ContenidoScreen.tsx` | 28x28 | NO |
| "Filtros" | `screens/contenido/ContenidoScreen.tsx` | 60x18 | NO |
| Botones del TopBar (referencia) | `components/AppShell` | 44x44 | SI |
| Tabs (referencia) | `components/AppShell` | 199x54 | SI |

Las dos ultimas filas son el control de la medicion: en la misma pasada hay controles que si
cumplen, asi que el metodo distingue y no marca todo como fallo.

## Los tres patrones estructurales, cada uno con una medicion

Lo no alcanzable en la app corriendo **no se declara medido**. Se clasifica por pertenecer a
un patron del que si hay una medicion directa:

1. **Caja de 28x28 + `hitSlop`** → mide 28x28. Medido cuatro veces (los cuatro cierres).
2. **Sin caja propia, solo el icono** → mide lo que mide el icono. Medido en el cierre del
   chip: icono de 16, caja de 16x16.
3. **Caja explicita >= 44** → cumple, y el `hitSlop` es refuerzo inerte en web. Medido en los
   botones del TopBar.

## Lo corregido en este change (grupo A)

Los tres cierres de la biblioteca base. Comparten forma exacta —`Pressable` con caja de
28x28, icono de 18-20, `hitSlopToMinTarget(28, 28)`— asi que el arreglo es el mismo
reemplazo mecanico, y los tres se observan en una sola pantalla de QA
(`CatalogoComponentesScreen`), de modo que corregirlos no amplia la verificacion.

| Archivo | Antes | Despues |
| --- | --- | --- |
| `components/base/Sheet.tsx` | 28x28 | **44x44** |
| `components/base/Banner.tsx` | 28x28 | **44x44** |
| `components/base/Toast.tsx` | 28x28 | **44x44** |

Detalle de la medicion en `02-medicion-area-tactil.md`.

## Lo rastreado, con su motivo

### Grupo B: un eje ya cumple, el otro se apoya en `hitSlop`

| Archivo | Medida | Por que no aqui |
| --- | --- | --- |
| `components/base/Chip.tsx` (chip) | 103x32 | El alto de 32 es una decision de densidad del control. Subirlo a 44 cambia el ritmo de toda lista de chips. |
| `components/base/Chip.tsx` (cierre) | 16x16 | El peor caso del inventario, pero vive **dentro** de un chip de 32 de alto: una caja de 44 desbordaria su contenedor. Exige rediseno del chip, no un reemplazo. |
| `components/sync/SyncStatusChip.tsx` | 203x28 | Mismo criterio: 28 de alto es deliberado para el chrome. |

### Grupo C: `hitSlop` literal sobre controles legacy

| Archivo | Usos | Patron | Estado |
| --- | --- | --- | --- |
| `components/ScreenBackButton.tsx` | 1 | caja 40x40 declarada en su hoja de estilos | Falla por 4 puntos. El mas barato de corregir del grupo, pero toca el chrome de toda pantalla con retroceso. |
| `components/Toast.tsx` | 1 | icono 18 sin caja | Toast legacy, distinto del de la biblioteca base. |
| `components/SyncStatusBanner.tsx` | 1 | icono 18 sin caja | |
| `components/ExpandedStatsModal.tsx` | 1 | icono 22 sin caja | |
| `screens/biblioteca/ListaRecursosScreen.tsx` | 1 | icono 20 sin caja | |
| `screens/contenido/ContenidoScreen.tsx` | 2 | **medido**: 28x28 y 60x18 | La pantalla tiene ademas una excepcion de deuda vigente sobre su paleta; no se toca en este change. |
| `screens/cuenta/CuentaScreen.tsx` | 9 | `TOGGLE_HIT_SLOP` sobre toggles | **No medido uno a uno**: la pantalla con los toggles no se alcanzo en la sesion de QA. Se declara como pendiente de medicion, no como defecto confirmado. |

Cada uno vive en una pantalla distinta con QA visual propia. Corregirlos aqui convertiria un
saneamiento de tres defectos en una migracion de trece archivos, que es exactamente el no
objetivo declarado.

## Como queda rastreado

Dos mecanismos, no un aviso suelto:

1. **En codigo**: la guardia `src/__tests__/components/base/areaTactilWeb.test.ts` lleva un
   inventario declarado de los nueve archivos que siguen usando `hitSlop`, con el motivo de
   cada uno. Falla si aparece un uso nuevo sin declarar **y** si una entrada declarada deja
   de usar `hitSlop`. Probada por mutacion en las dos direcciones (ver `05-mutacion.md`).
2. **En el registro de deuda**: candidato nuevo con esta medicion como evidencia, para que la
   decision de migrarlos o no sea de alguien y tenga fecha.

## Conclusion sobre migrar el resto

**No se propone migrar los 28 sitios en un solo change.** La medicion muestra tres patrones
con costes muy distintos: el grupo A era mecanico y ya esta hecho; el grupo B es rediseno de
densidad y merece decision de diseno; el grupo C es una pasada por siete pantallas, cada una
con su QA visual. Lo sensato es tratar B y C por separado y con su propio alcance, no
arrastrarlos a un flujo de saneamiento cuyo objetivo eran otros tres defectos.
