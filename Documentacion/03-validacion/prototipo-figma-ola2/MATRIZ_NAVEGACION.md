# Matriz de navegacion del prototipo Figma Ola 2

> **Estado:** grafo implementado y auditado por API Figma; pendiente únicamente la reproducción humana en modo Present antes de archivar.
> **Issue:** [#156](https://github.com/RitualBoat/PlanearIA/issues/156).
> **Ground truth visual:** [archivo Figma Ola 2](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=87-47).
> **Alcance:** prototipo, no runtime ni integraciones reales.

## Contrato canonico

El unico inicio activo es **Escritorio Docente**. La navegacion global conserva estas etiquetas:

1. Escritorio
2. Office Docente
3. Clases
4. Asistente de IA
5. Reportes
6. Diseño de materiales
7. Mensajería
8. Agenda
9. Cuenta

El modulo actual se indica con resaltado. No navega a si mismo. Los demás controles de escritorio tienen un hotspot de
228 x 44 pt y un destino declarado. Los nombres de producto heredados (`AsistePLAN`, `ConectaPLAN`,
`DiseñaPLAN`, `AgendaPLAN`, `ReportaPLAN`) no se usan como etiqueta de navegacion del prototipo activo.

## Matriz de rutas de escritorio

| Origen | Control | Destino | Retorno visible | Estado |
| --- | --- | --- | --- | --- |
| Escritorio | Office Docente | Office | Escritorio en rail | Automatizado en Figma |
| Escritorio | Clases / Asistente / Reportes | Hub respectivo | Escritorio en rail | Automatizado en Figma |
| Escritorio | Diseño / Mensajería / Agenda / Cuenta | Hub respectivo | Escritorio en rail | Automatizado en Figma |
| Office | Escritorio | Escritorio | Rail global | Automatizado en Figma |
| Cualquier hub o detalle | Navegacion global | Cualquier otro hub | Rail global estable | Automatizado en Figma |
| Escritorio | Nuevo archivo | Selector contextual de Escritorio | `← Escritorio Docente` | Automatizado en Figma |
| Selector contextual de Escritorio | Documento / hoja / presentación | Destino contextual de Escritorio | `Escritorio Docente` en cada editor | Automatizado en Figma |
| Office | Nuevo archivo | Selector de Office | `← Office Docente` | Automatizado en Figma |
| Clases, detalle | Crear actividad | Dialogo de actividad de Clases | Cierre al origen | Automatizado en Figma |
| Mensajería, resultado | Volver a Mensajería | Hub Mensajería | Rail global y CTA visible | Automatizado en Figma |

## Patrones tablet y móvil

| Breakpoint | Frame de entrada | Patrón | Accesos y retornos | Límite honesto |
| --- | --- | --- | --- | --- |
| Tablet | [Escritorio tablet](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=162-115) | Rail de nueve módulos | El módulo activo no navega; los ocho restantes tienen hotspot de al menos 176 x 44 pt. `Abrir documento` entrega al flujo detallado. | Es una variante de navegación y handoff; no declara todavía paridad visual de cada editor detallado. |
| Móvil | [Escritorio móvil](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=164-115) | Barra inferior de Inicio, Office, Clases, Asistente y Más | Cada control mide al menos 78 x 72 pt; los módulos secundarios quedan disponibles desde [Más](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=158-200) y el encabezado devuelve a Escritorio. | Cubre navegación compacta y módulos; los objetos detallados conservan por ahora sus superficies de escritorio. |

En las pantallas móviles de Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta el acceso activo es
`Más`; no desaparecen ni se renombran. Cada fila secundaria mide 294 x 44 pt y tiene un único destino.

## Golden journeys

| ID | Recorrido | Evidencia automatica | Evidencia manual pendiente |
| --- | --- | --- | --- |
| GJ-FIG-01 | Inicio → Office → Escritorio | Un inicio, hotspot Office y hotspot Escritorio verificados por API Figma | Reproducir en Present |
| GJ-FIG-02 | Inicio → Nuevo archivo → Documento → Escritorio | Destinos contextuales distintos de Office verificados por API Figma | Reproducir en Present |
| GJ-FIG-03 | Inicio → Clases → Crear actividad → cancelar | Destino del detalle corregido a dialogo de Clases | Reproducir en Present |
| GJ-FIG-04 | Inicio → Asistente → Conversacion → Asistente | No queda ruta al selector de Office | Reproducir en Present |
| GJ-FIG-05 | Inicio → Mensajería → confirmacion → resultado → Mensajería | Resultado y salida semantica verificados por API Figma | Reproducir en Present |
| GJ-FIG-06 | Navegacion global desde Reportes / Cuenta | Nueve etiquetas, ocho destinos y un activo auditados | Reproducir en Present |
| GJ-FIG-07 | Tablet: Escritorio → Office Docente → Escritorio | Rail completo, activo sin enlace y ocho destinos verificados por API Figma | Reproducir en Present |
| GJ-FIG-08 | Móvil: Inicio → Office → Inicio | Barra de cinco accesos, activo y cuatro rutas verificados por API Figma | Reproducir en Present |
| GJ-FIG-09 | Móvil: Más → Reportes → Más → Inicio | Cinco rutas secundarias de Más, retorno por encabezado y barra verificados por API Figma | Reproducir en Present |

## Validaciones y limites honestos

- El API de Figma confirma un solo `flowStartingPoint` (`Escritorio Docente`), cero destinos rotos y ningún
  label heredado en los frames activos. Los 17 frames de escritorio auditados tienen nueve controles de
  navegación: ocho destinos externos y el activo sin enlace redundante.
- Tablet tiene nueve labels y ocho rutas; los diez hubs móviles tienen cinco controles inferiores, uno
  activo y cuatro rutas. Más expone cinco módulos secundarios. La evidencia detallada está en
  [`01-baseline-y-grafo.md`](../../../openspec/changes/corregir-navegacion-prototipo-figma/evidencia/01-baseline-y-grafo.md).
- Las capturas de escritorio, tablet, móvil y Más confirman jerarquía, legibilidad, contraste y áreas de
  toque. No sustituyen el recorrido humano en modo Present.
- La ausencia de datos y carga dinámica es `N/A` en esta navegación estática: ningún hotspot simula una
  consulta dinámica. Los estados no disponibles sí son explícitos: Asistente indica proveedor ausente y
  Mensajería confirma que no se realizó envío real. No se presenta éxito de red, IA o sincronización.
- No se declara paridad responsive de todos los editores y objetos detallados: este change cubre el shell,
  los retornos y los handoffs entre breakpoints.
- Ningun resultado del prototipo confirma envio, IA, red o sincronizacion reales.

## Rollback

No se borraron frames historicos. Si una correccion de enlaces debe revertirse, restaurar la version
anterior desde el historial de Figma mediante un change y PR normal, y actualizar esta matriz con la
evidencia de la restauracion.
