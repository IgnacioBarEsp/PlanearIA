# Auditoría del grafo de Office por ancho de frame

**Fecha:** 2026-09-04
**Issue:** [#177](https://github.com/IgnacioBarEsp/PlanearIA/issues/177)
**Alcance:** sección `461:968` `Office · candidate · #177` en la página `60:2`. No se tocó la sección de
Escritorio `307:965`, la de Clases `177:115`, el draft raíz de #156 ni los puentes de otros módulos.

## Método

Recorrido read-only por Plugin API de cada `reactions[].actions[]` de la sección, resolviendo el frame de
nivel superior de origen y de destino. Se aplican las tres reglas que #166 impone a toda ola posterior:

1. Clasificar el breakpoint **por ancho de frame**, nunca por nombre de nodo.
2. Contar también las aristas que **salen** de la sección hacia otras secciones.
3. No dar por cumplido un destino de móvil o tablet sin verificar el ancho del frame destino.

### Corrección al clasificador

La primera pasada reportó una fuga falsa: `Acción · adjuntar · menú tablet` viajaba de un frame de 420 px
—el menú de acciones, que es un overlay— a la superficie pendiente de tablet. Un overlay no tiene ancho de
dispositivo, así que clasificarlo por su propio ancho es incorrecto.

El clasificador definitivo resuelve el **contexto de dispositivo de cada overlay** por quién lo abre: se
recorren todas las aristas `navigation: 'OVERLAY'` de la página, se acumulan los breakpoints de origen y el
overlay hereda ese contexto. Un overlay abierto desde dos breakpoints distintos se reporta como
`ambiguousOverlaySource` en vez de pasar en silencio.

Resultado del control: **0 overlays ambiguos**. Cada overlay de Office tiene un único contexto de
dispositivo o es alcanzado sólo desde el suyo.

## Resultado

| Métrica | Valor |
| --- | ---: |
| Superficies en la sección | 25 |
| Aristas de navegación | 177 |
| Aristas de overlay | 36 |
| **Fugas dispositivo a dispositivo** | **0** |
| Destinos rotos o inexistentes | 0 |
| Overlays con contexto ambiguo | 0 |
| Controles bajo 44 pt | 0 |

### Aristas por contexto

| Origen → destino | Aristas |
| --- | ---: |
| escritorio → escritorio | 79 |
| tablet → tablet | 54 |
| móvil → móvil | 44 |

No existe ninguna arista que cruce de contexto. Es el criterio de cierre que #166 fija para la porción de
Office de `debt-a40b2b029a63` (tablet) y `debt-b1d35a5b5915` (móvil).

## Superficies creadas

| Superficie | Nodo | Tamaño | Contexto |
| --- | --- | ---: | --- |
| Office Docente · escritorio | `461:969` | 1440x1240 | escritorio |
| Office Docente · tablet | `461:1050` | 768x1920 | tablet |
| Office Docente · móvil | `461:1108` | 390x1440 | móvil |
| Office · biblioteca filtrada · escritorio | `473:974` | 1440x1240 | escritorio |
| Office · biblioteca filtrada · tablet | `473:1114` | 768x1920 | tablet |
| Office · biblioteca filtrada · móvil | `473:1221` | 390x1440 | móvil |
| Office · superficie pendiente · escritorio | `467:968` | 1440x960 | escritorio |
| Office · superficie pendiente · tablet | `467:986` | 768x1024 | tablet |
| Office · superficie pendiente · móvil | `467:1004` | 390x844 | móvil |
| Office · vacío · escritorio | `468:1013` | 1440x1240 | escritorio |
| Office · estados · escritorio | `469:968` | 1440x700 | escritorio |
| Office · acciones de archivo · hoja · móvil | `468:968` | 390x844 | móvil |
| Office · plantillas · móvil | `477:974` | 390x844 | móvil |
| Office · acciones de archivo · menú · tablet | `468:992` | 420x512 | overlay (tablet) |
| Office · asignar a un grupo · escritorio / tablet / móvil | `471:968` / `471:986` / `471:1004` | 720x660 / 520x660 / 358x650 | overlay |
| Office · importar / descargar / dónde se usa / duplicar | `470:968` / `470:984` / `470:1000` / `470:1016` | 560x420-460 | overlay (escritorio y tablet) |
| Los mismos cuatro en ancho móvil | `475:974` / `475:990` / `475:1006` / `475:1022` | 358x488-501 | overlay (móvil) |

Las variantes móviles de los cuatro overlays existen precisamente porque uno de 560 px no cabe en una
superficie de 390 px. Aunque un overlay no cuenta como fuga de breakpoint, entregarlo desbordado sería la
misma falta de fidelidad que #166 corrige.

## Estado heredado que esta ola sustituye

| Nodo heredado | Qué era | Qué lo sustituye |
| --- | --- | --- |
| `257:951` | Office escritorio con creación sin tipos e intención-primero al fondo | `461:969` |
| `277:958` | Clon exacto del escritorio a 1440x960 llamado tablet | `461:1050`, superficie propia de 768 |
| `274:958` | Una sola tarjeta de prioridad en 390 | `461:1108`, superficie propia de 390 |

Los tres se conservan intactos como baseline histórico y siguen etiquetados `candidate`.

## Verificación de la desviación de D3 (tarea 5.4)

La creación desplegada dentro de Office **no** degradó el selector tipo-primero global de Escritorio:

| Selector | Estado | Tamaño |
| --- | --- | ---: |
| `310:3` Nuevo archivo · selector · escritorio · approved · #163 | intacto | 1440x1360 |
| `310:69` Nuevo archivo · selector · tablet · approved · #163 | intacto | 768x1120 |
| `310:106` Nuevo archivo · selector · móvil · approved · #163 | intacto | 390x930 |

Los tres conservan sus aristas de entrada: **3 aristas entrantes** desde Escritorio siguen apuntando a
ellos. Office no las duplica ni las intercepta.

## Controles sin reacción

Seis, y los seis son el chip de filtro activo de su propia superficie: `Todos` en las tres superficies
principales y `Hojas de cálculo` / `Hojas` en las tres filtradas. No son controles muertos: son el
indicador del estado actual, y Figma rechaza por diseño una navegación de un frame a sí mismo. Es el mismo
criterio con el que #163 dejó sin reacción el elemento de navegación activo.

Queda como observación para Present: si el owner considera que un chip activo se lee como pulsable, se
diferencia visualmente sin volverlo navegable.
