# TLDR: reconstruir la experiencia de Clases

## Intención — Proposal

Clases parecía un área de archivos y no demostraba una jerarquía docente propia. El change transformó el
contrato aprobado de #159 en un prototipo Figma reconocible: entrada clases-primero, cuatro áreas internas,
actividad sin archivo, handoffs opcionales y estados honestos. El owner aprobó la v1.3; runtime no se tocó.

## Enfoque — Design

Se construyó una versión separada y reversible. Los frames históricos permanecen draft. La
misma arquitectura se adapta a móvil, tablet y web; señales y handoffs conservan objeto y retorno. El
prototipo usa tokens PlanearIA, datos sintéticos, accesibilidad y Anti-Slop. Present y aprobación visual
humana cerraron el gate de Clases; los puentes de otros módulos siguen candidate.

## Comportamiento — Spec

La entrada muestra “Lo que sigue”, clases y Crear/Importar. Cada clase contiene Tablón, Trabajo de clase,
Personas y Seguimiento. Una actividad se completa sin adjunto; Office/Diseño solo intervienen de forma
opcional y retornan al borrador. Loading, empty, error, offline, sync pendiente, datos insuficientes y
fallback sin IA son recorribles sin éxitos simulados.

## Plan de trabajo — Tasks

Apply preservó historial, creó componentes/estados y cinco superficies por breakpoint, conectó journeys y
actualizó la matriz. Se ejecutaron Anti-Slop, Nielsen, accesibilidad, comparación runtime read-only,
Present y revisión adversarial. Tras la aprobación se promovieron 83 frames de Clases y se documentó el
handoff runtime sin iniciarlo.

## Resumen integral

Este change entrega el prototipo aprobado y gobernado de Clases con evidencia versionada. Separa
familiaridad Classroom de copia literal y demuestra conexión nativa sin modificar datos, sync o código.
El runtime queda como change posterior, condicionado a artefactos propios aprobados y a resolver anuncios,
EntregaTarea y compatibilidad de rutas.
