# anti-slop-design-guardrail Specification

## Purpose
TBD - created by archiving change fortalecer-guardrail-anti-slop. Update Purpose after archive.
## Requirements
### Requirement: Ruta canónica previa a una decisión visual

Antes de crear o modificar una superficie visible en Figma, código u otra herramienta, la guía universal SHALL dirigir al agente a la guía canónica anti-slop, al plan UX/UI, al contexto IHC y al ground truth disponible. La guía SHALL seguir siendo alcanzable para un harness que no soporte skills.

#### Scenario: Un agente prepara un frame Figma

- **WHEN** el agente va a decidir la composición, color, tipografía, controles o motion de un frame
- **THEN** consulta la guía canónica y registra el preflight de esa superficie antes de tratar el frame como candidato a aprobación

#### Scenario: Un harness no descubre skills

- **WHEN** un agente solo recibe `AGENTS.md` y no tiene soporte de skills o MCP
- **THEN** encuentra la obligación y la ruta de la guía anti-slop desde las instrucciones universales sin depender de una capacidad ausente

### Requirement: Preflight ligado a la tarea docente

Cada superficie visible SHALL declarar antes de diseñarse su tarea docente, zona de intensidad, jerarquía de acción, estructura de información, una firma visual única que aporte comprensión, tokens previstos, estados loading/empty/error/offline o su N/A justificado, y consideraciones de accesibilidad.

#### Scenario: Una pantalla de trabajo diario

- **WHEN** el agente prepara una pantalla de editor, lista, asistencia o calificación
- **THEN** el preflight clasifica la superficie como sobria, prioriza ritmo, densidad y legibilidad, y no gasta espectáculo para compensar una jerarquía débil

### Requirement: Patrones genéricos no son soluciones por defecto

La política SHALL impedir que glass, blur, gradientes ambientales, halos, bento ornamental, cards sin propósito, pills omnipresentes, iconos sin etiqueta, copy intercambiable o sombras blandas se adopten por inercia. Un agente SHALL sustituirlos por una decisión vinculada a tarea, estado o contenido real, o registrar una excepción verificable.

#### Scenario: Un patrón visual no tiene propósito explicado

- **WHEN** la revisión detecta uno de los patrones genéricos sin una relación explícita con una tarea, capa o estado
- **THEN** el frame permanece draft y el agente elimina, reemplaza o justifica el patrón antes de solicitar aprobación

### Requirement: Excepciones visuales seguras y reversibles

Un efecto translúcido, blur, gradiente o profundidad expresiva SHALL usarse únicamente cuando aporta una jerarquía o transición concreta en una zona apropiada. La excepción SHALL documentar propósito, contraste, fallback sólido, comportamiento con reducir movimiento y presupuesto de rendimiento; no SHALL aplicarse por defecto a listas, superficies de trabajo extensas ni controles frecuentes.

#### Scenario: Un overlay de baja frecuencia necesita profundidad

- **WHEN** un modal u overlay requiere separar una decisión delicada del resto de la jornada
- **THEN** puede usar una excepción visual si deja visible su fallback sólido, conserva contraste y no reemplaza la interacción principal ni el estado estático

### Requirement: Evidencia visual no equivale a aprobación humana

Cada frame candidato SHALL incluir o enlazar su preflight, screenshots o evidencia proporcional y el resultado de la revisión anti-slop. La documentación SHALL distinguir draft, aprobado y obsoleto; ningún artefacto versionado SHALL afirmar que #46 o #47 fueron cerrados sin evidencia humana correspondiente.

#### Scenario: El prototipo está listo para revisión interna

- **WHEN** Foundations y los componentes del prototipo fueron creados y validados en Figma
- **THEN** se registran como draft con evidencia técnica y el gate manual de aprobación permanece explícitamente pendiente

### Requirement: Las fuentes de harness permanecen alineadas

Las instrucciones universales y las skills fuente de UX/UI y Awwwards SHALL apuntar a la misma guía canónica. Sus espejos SHALL regenerarse desde `.agents/` y la paridad SHALL verificarse antes del cierre del change.

#### Scenario: Se actualiza la política de diseño

- **WHEN** cambia la guía canónica o una skill fuente relacionada
- **THEN** el renderer actualiza los harnesses soportados y el check de paridad falla si un espejo queda distinto de su fuente

