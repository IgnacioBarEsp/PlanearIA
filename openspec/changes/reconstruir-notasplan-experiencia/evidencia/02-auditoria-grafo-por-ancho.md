# Auditoría del grafo de NotasPLAN por ancho y por corrección de destino

**Fecha:** 2026-09-05
**Issue:** [#180](https://github.com/IgnacioBarEsp/PlanearIA/issues/180)
**Alcance auditado:** sección `516:974` `NotasPLAN · candidate · #180` **y** la sección aprobada de Office
`461:968`, porque este change modifica su cableado de entrada al editor.

## Método

Recorrido read-only por Plugin API de cada `reactions[].actions[]`, resolviendo el frame de nivel superior
de origen y destino. Se aplican las tres reglas de #166 —clasificar por ancho de frame, contar las aristas
que salen de la sección y verificar el ancho del destino— **más** la comprobación que #177 añadió tras
dejar pasar un defecto real: verificar que cada control aterrice en el destino que su etiqueta anuncia, no
sólo en uno del ancho correcto.

El contexto de dispositivo de cada overlay se resuelve por quién lo abre, y los overlays abiertos desde más
de un breakpoint se reportan en vez de silenciarse.

## Resultado

| Métrica | NotasPLAN | Office (tras la integración) |
| --- | ---: | ---: |
| Superficies | 32 | 33 |
| Aristas de navegación | 128 | 290 |
| Aristas de overlay | 49 | 82 |
| **Fugas dispositivo a dispositivo** | **0** | **0** |
| Destinos rotos | 0 | 0 |
| Destinos incorrectos por identidad | 0 | 0 |
| Controles interactivos sin reacción | **0** | 3 (las pestañas `Todos`, aceptadas en #177) |
| Controles bajo 44 pt | 0 | 0 |
| Solapamientos dentro de la hoja | 0 | — |

### Aristas por contexto en NotasPLAN

| Origen → destino | Aristas |
| --- | ---: |
| escritorio → escritorio | 54 |
| tablet → tablet | 35 |
| móvil → móvil | 34 |

## Superficies creadas

| Grupo | Escritorio 1440 | Tablet 768 | Móvil 390 |
| --- | --- | --- | --- |
| Editor | `516:975` | `518:974` | `518:1025` |
| Formato aplicado (la barra refleja el cursor) | `526:980` | `526:1098` | `526:1149` |
| Formulario (lente sobre la sección activa) | `523:980` | `523:1121` | `523:1195` |
| Familia pendiente (estado de límite) | `520:974` | `520:992` | `520:1010` |
| Índice como panel | en el frame | `524:980` | `524:1011` |
| Acciones del documento | en el panel derecho | `524:1042` | `524:1065` |
| Nivel de plantilla | `520:1028` | `520:1028` | `520:1047` |
| Descargar | `521:974` | `521:974` | `521:988` |
| Compartir | `521:1002` | `521:1002` | `521:1022` |
| Historial | `522:974` | `522:974` | `522:991` |
| Solicitud de permiso | `522:1008` | `522:1008` | `522:1025` |
| Asignar a un grupo | `522:1042` | `522:1060` | `522:1078` |
| Propuesta de IA | `526:1196` | `526:1196` | `526:1211` |
| Estados | `525:980` | — | — |

## Integración con Office aprobado

Hasta esta ola, las entradas de documento de Office entregaban el estado de límite, porque el editor no
existía. Ahora existe, así que se recablearon **49 controles** en las trece superficies de Office que los
tienen:

| Control | Antes | Ahora |
| --- | --- | --- |
| `Acción · En blanco · documento` | Estado de límite de Office | Editor de NotasPLAN del mismo ancho |
| `Plantilla · documento · 1..3` | Estado de límite de Office | Selector de nivel de plantilla |
| `Acción · abrir · 1` (la fila del documento) | Estado de límite de Office | Editor de NotasPLAN del mismo ancho |
| Filas de la hoja de plantillas de documento en móvil | Estado de límite de Office | Selector de nivel, ancho móvil |

Esta es una **edición declarada de una sección aprobada**. Se acota a las entradas de tipo documento: las
de hoja y presentación siguen entregando el estado de límite, porque CalcuPLAN y PresentaPLAN pertenecen a
`#157-O5` y `#157-O6`. La spec archivada de Office lo anticipaba: el estado de límite aplicaba "mientras
los editores pertenezcan a olas posteriores".

Verificación específica: **0 errores de destino**. Cada entrada de documento de Office aterriza en el
editor o en el selector de nivel de su propio ancho, comprobado control a control.

## Overlays con contexto múltiple: un defecto encontrado y corregido

La comprobación de contexto múltiple no es decorativa. Encontró un defecto real que **la clasificación por
ancho no puede ver**, porque un overlay no tiene ancho de dispositivo:

> `NotasPLAN · nivel de plantilla` (560 px) se abría desde escritorio y desde tablet, y sus cinco aristas
> apuntaban al **editor de escritorio**. Abierto desde tablet, entregaba un frame de 1440.

Es exactamente la clase de fuga que las tres reglas de #166 no atrapan por sí solas. Se corrigió creando
`NotasPLAN · nivel de plantilla · tablet` (`533:980`, 520 px) con sus cinco aristas apuntando al editor de
tablet, y recableando los doce controles de plantilla de documento de las superficies de Office en tablet.

Estado final:

| Overlay | Se abre desde | Aristas de navegación | Riesgo |
| --- | --- | ---: | --- |
| `Office · importar archivo` (560) | escritorio y tablet | 0 | Ninguno: sólo cierra |
| `NotasPLAN · propuesta de IA` (560) | escritorio y tablet | 0 | Ninguno: sólo cierra |

**Ningún overlay con contexto múltiple emite navegación.** El selector de nivel ya no es ambiguo: tiene una
variante por contexto.

Limitación que queda declarada: un overlay abierto **desde otro overlay** no hereda contexto de forma
transitiva. Los afectados en esta sección emiten únicamente `CLOSE`, por lo que la conclusión no cambia,
pero la cobertura del gate no es total y no se presenta como si lo fuera.

## Controles sin reacción: de dieciséis a cero

La primera pasada encontró dieciséis controles pulsables que no hacían nada. Se resolvieron sin excepción:

| Control | Resolución |
| --- | --- |
| `Formato · A4` y `Formato · Carta` (5 superficies) | Dejaron de fingir un interruptor. El formato de página pasa a ser un **indicador de estado declarado**: "A4 · 794 × 1123 · se elige al crear". El prototipo no puede mostrar dos tamaños de hoja sin duplicar cada superficie, y fingir el cambio habría sido peor que declararlo |
| `Acción · plantilla` | Lleva a Office, que es donde queda la plantilla propia |
| `Acción · IA aceptar` y `Acción · IA descartar` | Abren la propuesta de IA, donde se compara y se decide |
| `Acción · formulario · agregar sesión` | Lleva a la hoja, donde aparece la sesión añadida |

Resultado: **cero controles inertes**, un grado mejor que el cierre de Office, que aceptó tres.
