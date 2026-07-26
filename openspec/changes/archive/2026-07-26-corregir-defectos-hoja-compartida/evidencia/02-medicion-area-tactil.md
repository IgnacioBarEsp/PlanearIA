# Medicion del area tactil en web: antes y despues

Metodo: `getBoundingClientRect()` para la caja y `document.elementFromPoint()` para la
alcanzabilidad real, en Chrome via **Playwright MCP** (no el panel Browser), sobre
`expo start --web` en el puerto 8082 con **HTTP 200 confirmado antes de navegar**. Clics y
teclas reales. El elemento se lleva a viewport con `scrollIntoView` antes de sondear: fuera
de la vista, `elementFromPoint` devuelve `null` y produce un falso negativo.

Sondeo: desde el centro del control se prueban puntos a **21pt** (justo dentro del borde de
una caja de 44) y a **23pt** (justo fuera). Un control que cumple debe **alcanzar a 21 y no
alcanzar a 23**: si alcanzara tambien a 23 estariamos midiendo un contenedor mayor y no el
control, que es la clase de falso positivo que documenta el change de medicion del Sheet.

## El defecto, reproducido

| Control | Caja | Cumple 44 | 21pt arriba | 21pt abajo | 21pt izq | 21pt der |
| --- | --- | --- | --- | --- | --- | --- |
| `AssignSheet` cierre (Contenido) | **28x28** | NO | no | no | no | no |
| `Sheet` cierre (catalogo) | **28x28** | NO | no | no | no | no |
| `Banner` cierre (catalogo) | **28x28** | NO | no | no | no | no |
| `Toast` cierre (catalogo) | **28x28** | NO | no | no | no | no |

`getComputedStyle` daba `padding: 0px` y `margin: 0px`. El `hitSlop` declarado en el codigo
**no aparece por ningun lado en el DOM**: react-native-web no lo implementa. El centro del
control si responde; cualquier punto del anillo que el `hitSlop` prometia, no.

## Despues del cambio

| Control | Caja | margin | Cumple 44 | 21pt (4 lados) | 23pt (fuera) |
| --- | --- | --- | --- | --- | --- |
| `AssignSheet` cierre | **44x44** | -8px vert. | SI | alcanza | no alcanza |
| `Sheet` cierre (catalogo) | **44x44** | -8px vert. | SI | alcanza | no alcanza |
| `Banner` cierre (catalogo) | **44x44** | -8px vert. | SI | alcanza | no alcanza |
| `Toast` cierre (catalogo) | **44x44** | -8px vert. | SI | alcanza | no alcanza |

El `23pt` que no alcanza es la parte importante: confirma que lo medido es la caja del
control y no un contenedor que lo envuelve.

## El layout no cambio

Esta es la comprobacion que justifica el margen negativo. Mismos numeros antes y despues:

| Medida | Antes | Despues |
| --- | --- | --- |
| Panel de `AssignSheet` (1280) | 520 x 333.4 | **520 x 333.4** |
| Panel de `Sheet` catalogo (1280) | 520 x 211.4 | **520 x 211.4** |
| Alto del encabezado | **60.6** | **60.6** |
| Alto del `Toast` | 61.1 | **61.1** |

El area tactil paso de 28 a 44 puntos sin mover un solo pixel del encabezado. Ademas
`document.elementFromPoint` sobre el texto del titulo sigue devolviendo el titulo y no el
control de cierre: la caja ampliada no lo tapa.

## Por breakpoint y por tema

`AssignSheet` abierta desde Contenido:

| Ancho | Tema | Cierre | 21pt ok | 23pt fuera | Panel | Encabezado |
| --- | --- | --- | --- | --- | --- | --- |
| 1280 | claro | 44x44 | si | si | 520 x 333.4 | 60.6 |
| 768 | claro | 44x44 | si | si | 520 x 333.4 | 60.6 |
| 375 | claro | 44x44 | si | si | 375.4 x 333.4 | 60.6 |
| 1280 | oscuro | 44x44 | si | si | 520 x 333.4 | 60.6 |
| 375 | oscuro | 44x44 | si | si | 375.4 x 333.4 | 60.6 |

En 375 se comprobo ademas que la caja ampliada **no se sale del panel**
(`r.right <= panel.right && r.left >= panel.left`).

## Foco de teclado

Con `Tab` real sobre la hoja abierta, el primer control enfocado es el cierre:

- `document.activeElement` === `[data-testid="sheet-catalogo-close"]`.
- `aria-label` = "Cerrar".
- Caja enfocada: 44x44.
- Anillo visible: `box-shadow: rgb(22, 118, 210) 0px 0px 0px 3px`.

`Escape` cierra la hoja.

## Nota sobre el `Toast` y el borde inferior del viewport

En viewport de 900 de alto, el sondeo a 21pt **por abajo** del cierre del toast daba `null`.
No es un defecto del control: el toast se ancla al borde inferior y ese punto caia **fuera
del viewport**, donde `elementFromPoint` no puede devolver nada. Repetido con viewport de
1000 de alto, los cuatro lados alcanzan y el 23pt no. Se deja escrito porque es justo el tipo
de lectura que se confundiria con un fallo real.

## Herramienta

Playwright MCP, Chrome. `expo start --web --port 8082`, `curl` devolvio **HTTP 200** antes de
navegar en las dos sesiones de medicion (el servidor se reinicio a mitad por una caida
transitoria del bundler mientras se intercambiaban parches de QA; ver
`04-estados-de-error.md`).
