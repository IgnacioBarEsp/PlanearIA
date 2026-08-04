# Clases / Classroom Ground Truth

> **Estado:** baseline oficial 0.1 y prototipo visual v1.3 aprobados por el owner; última aprobación 2026-08-04.
> **Owner del destino:** plan `#157-O1 Clases`, issue #159.
> **Uso:** contrato de reconocimiento, arquitectura de información y flujos antes de diseñar Clases.
> **No usar para:** copiar Google Classroom, inferir paridad visual aprobada o imponer el runtime legacy.

El respaldo histórico de capturas fue externalizado durante
`repo-max-clean-context-externalization`. A petición del owner, la brecha se cubre primero con referencias
oficiales públicas de Google Classroom y una adaptación explícita para PlanearIA.

## Índice vigente

1. [`01-errores-actuales/INVENTARIO_DRIFT_FIGMA_RUNTIME_2026-08.md`](01-errores-actuales/INVENTARIO_DRIFT_FIGMA_RUNTIME_2026-08.md): inventario brownfield, drifts y qué puede conservarse.
2. [`03-referencias-reales/BASELINE_OFICIAL_GOOGLE_CLASSROOM_2026-08.md`](03-referencias-reales/BASELINE_OFICIAL_GOOGLE_CLASSROOM_2026-08.md): evidencia primaria, patrones observados, límites y diferencias deliberadas.
3. [`04-flujos-deseados/BASELINE_CLASES_PLANEARIA_157_O1.md`](04-flujos-deseados/BASELINE_CLASES_PLANEARIA_157_O1.md): arquitectura y recorridos objetivo derivados de la evidencia y de las decisiones del owner.
4. [`04-flujos-deseados/PREFLIGHT_VISUAL_CLASES_157_O1.md`](04-flujos-deseados/PREFLIGHT_VISUAL_CLASES_157_O1.md): contrato Anti-Slop por superficie antes de componer frames.
5. [`05-notas-del-desarrollador/DECISIONES_ENTREVISTA_2026-08-03.md`](05-notas-del-desarrollador/DECISIONES_ENTREVISTA_2026-08-03.md): trazabilidad de la entrevista específica de Clases.

## Suficiencia del baseline

| Uso | Estado | Motivo |
| --- | --- | --- |
| Arquitectura de información y nomenclatura | Aprobada para el prototipo de Clases | Las fuentes oficiales describen la portada, las cuatro áreas internas y las tareas docentes principales; el owner aprobó la adaptación 0.1 y la composición v1.3. |
| Flujos de clase, actividad, personas y seguimiento | Aprobados para el prototipo de Clases | Existen fuentes oficiales por tarea, decisiones humanas aprobadas para las diferencias de PlanearIA y recorridos Present por breakpoint. |
| Accesibilidad estructural | Suficiente para requisitos iniciales | La guía oficial para lectores de pantalla expone regiones, navegación y tareas; PlanearIA conserva además su contrato WCAG/táctil. |
| Paridad visual alta | Aprobada para Figma, no validada en campo | La v1.3 fue recorrida en desktop, tablet y móvil y aprobada explícitamente por el owner. Las entrevistas docentes de #47 siguen pendientes y pueden ajustar el backlog. |
| Implementación runtime | Fuera de alcance de #159 | El baseline define destino; código y `openspec/specs/` describen el comportamiento real actual. Requiere issue/change propio y nueva aprobación de artefactos antes de `apply`. |

## Evidencia de aprobación visual

- Gate humano: [comentario de aprobación en #159](https://github.com/IgnacioBarEsp/PlanearIA/issues/159#issuecomment-5182823974).
- Contrato promovido: Figma `179:115`, con 83 frames propios de Clases en estado `approved`.
- Office y los 22 puentes/fallbacks de otros hubs permanecen `candidate`; no son ground truth de esos módulos.
- #46, entrevistas docentes y runtime no se cierran ni se aprueban por inferencia.

No se copiaron capturas, textos extensos, iconos, marcas ni assets de Google. Los enlaces se conservan
como atribución y deben revisarse de nuevo si una fuente cambia.
