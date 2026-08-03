# QA visual y de interacciones declaradas

> **Fecha:** 2026-08-02.
> **Método:** inspección de capturas Figma + auditoría de propiedades y reacciones mediante API Figma.
> **No sustituye:** recorrido manual en modo Present.

## Resultado

| Control | Resultado | Evidencia |
| --- | --- | --- |
| Inicio único | PASS | `Escritorio Docente` (`87:47`) es el único `flowStartingPoint`. |
| Retornos semánticos | PASS | Office y todos los hubs conservan rail; crear desde Escritorio abre selector propio con `← Escritorio Docente`. |
| Etiquetas de rail | PASS | Tras encontrar labels ocultos en Clases, Asistente, Reportes, Cuenta y algunos detalles, se restauraron 24 labels. La auditoría final muestra 9 visibles en los 17 frames de escritorio. |
| Rutas globales | PASS | En cada frame de escritorio: 9 hotspots de 228 x 44 pt, 8 rutas y 1 activo. Tablet: 9/8/1 con 176 x 44 pt. Móvil: 5/4/1 con 78 x 72 pt. |
| Más móvil | PASS | Cinco destinos secundarios, cada uno con fila de 294 x 44 pt y retorno explícito. |
| Tipografía | PASS | 820 segmentos revisados en frames activos: únicamente IBM Plex Sans Regular, SemiBold y Bold. |
| Nomenclatura | PASS | Sin labels activos heredados; se usan Office Docente, Asistente de IA, Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta. |
| Honestidad del prototipo | PASS | Mensajería no afirma un envío real y Asistente explica ausencia de proveedor. |
| Callejones sin salida | PASS por grafo | Cero destinos ausentes. Cada módulo tiene salida global o contextual visible. |

## Capturas inspeccionadas

| Superficie | Archivo | Observación |
| --- | --- | --- |
| Escritorio | `capturas-figma/escritorio.png` | Inicio, rail completo, acciones rápidas y continuidad visibles. |
| Office Docente | `capturas-figma/office.png` | Regreso a Escritorio, formatos y creación en contexto. |
| Crear desde Escritorio | `capturas-figma/selector-escritorio.png` | DOCX, XLSX y PPTX alineados; retorno explícito correcto. |
| Clases | `capturas-figma/clases.png` | Label activo visible y acceso de actividad contextual. |
| Reportes | `capturas-figma/reportes.png` | Captura de baseline que hizo visible el label activo oculto. |
| Reportes corregido | `capturas-figma/reportes-corregido.png` | Label Reportes visible, rail estable y contenido sin solapamientos. |
| Cuenta | `capturas-figma/cuenta.png` | Label Cuenta visible, rail completo y estado activo inequívoco. |
| Mensajería | `capturas-figma/mensajeria-conversacion.png` | Borrador, confirmación y resultado no fingen comunicación real. |
| Tablet | `capturas-figma/tablet.png` | Rail compacto legible; no se afirma paridad de los editores detallados. |
| Móvil | `capturas-figma/movil-escritorio.png` | Barra compacta, jerarquía y área de toque legibles. |
| Más móvil | `capturas-figma/movil-mas.png` | Los módulos secundarios siguen estando disponibles con sus nombres canónicos. |

## Casos N/A y límite de evidencia

No existe una fuente dinámica en este prototipo; por tanto, una animación de carga o una lista vacía
dinámica es `N/A`, no una validación verde. La evidencia sí cubre capacidad no disponible y la
recuperación por retorno visible. El siguiente paso obligatorio es que una persona ejecute los nueve
golden journeys en modo Present y deje su resultado en `02-recorridos-manuales.md`.
