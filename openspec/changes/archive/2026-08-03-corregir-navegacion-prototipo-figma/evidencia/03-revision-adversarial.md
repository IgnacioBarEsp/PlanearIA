# Revisión adversarial del grafo de navegación

> **Alcance:** issue #156 y change `corregir-navegacion-prototipo-figma`.
> **Fuentes:** `proposal.md`, `design.md`, delta spec, `tasks.md`, matriz de navegación, auditoría API Figma y capturas de este change.

## Intentos de refutación

| Riesgo probado | Resultado | Evidencia |
| --- | --- | --- |
| Dos inicios de Present o subflujo de Office | Refutado | La API Figma devuelve solo `87:47` como `flowStartingPoint`. |
| Navegación que parece válida pero apunta a un nodo inexistente | Refutado | Auditoría final: cero `destinationId` ausentes. |
| Módulo activo sin salida o con nombre oculto | Refutado para la superficie auditada | 17 rails de escritorio: 9 labels visibles, 8 rutas, 1 activo; tablet 9/8/1; móvil 5/4/1. |
| Retorno rápido de Escritorio que cae en Office | Refutado | Selector y editores contextuales de Escritorio tienen retorno propio; Office conserva su selector separado. |
| Overlay que navega a otro módulo al cerrar | Refutado | Diálogos inspeccionados usan overlay y el cierre revela el origen. |
| Falso éxito de IA, envío, red o sincronización | Refutado | Copy de Asistente y Mensajería aclara proveedor no configurado o resultado de prototipo. |

## Hallazgos

| Severidad | Área | Hallazgo | Tratamiento |
| --- | --- | --- | --- |
| Minor, resuelto | Estado visual de navegación | Algunos labels activos estaban invisibles aunque sus hotspots existían. | Se restauraron 24 labels y se volvió a auditar visual y estructuralmente. #157 exige guardia de regresión al rediseñar módulos. |
| Pregunta | Fidelidad por módulo | La navegación es coherente, pero el grado en que cada módulo expresa su ground truth docente excede los no objetivos de #156. | Gobernar en epic #157, con visión transversal y cambios por módulo; no es una deuda nueva de este fix. |

## Veredicto

**PASS CON HUECOS GOBERNADOS.** No hay Blockers ni Majors abiertos para el alcance de #156. El hallazgo
minor visual fue corregido antes de archivar. La reconstrucción semántica de los módulos es trabajo futuro
planificado en #157, no una condición oculta de cierre de navegación.
