## Context

El plan UX/UI concentra un checklist anti-slop en la sección 1.9.3, pero la misma sección conserva vocabulario que un agente puede tratar como receta: paleta azul, bento premium y glass. El archivo Figma de Ola 2 no tenía biblioteca previa; la dirección v1 aprobó erróneamente varios de esos patrones y se archivó de forma reversible. La dirección v2 aprobada (tinta, mineral, señal, IBM Plex Sans y geometría precisa) confirma la necesidad de una política de decisión, no de una paleta copiable.

El único bounded context afectado es experiencia docente/UI. No se comparten datos ni se modifica ningún contrato entre contextos.

## Goals / Non-Goals

**Goals:**

- Dar a cada agente una ruta canónica, corta y previa a toda decisión visual.
- Convertir “anti-slop” en preguntas y evidencia observables, no en gusto subjetivo ni una lista de prohibiciones ciegas.
- Separar las zonas de intensidad: escritorio expresivo pero calmo; trabajo diario sobrio; onboarding y marketing con margen de espectáculo.
- Mantener las skills y las instrucciones universales alineadas por la fuente `.agents/` y el renderer existente.

**Non-Goals:**

- Implementar el rediseño RN, añadir fuentes, modificar `src/themes`, crear dependencias o aprobar el prototipo final.
- Imponer la estética editorial v2 a una futura landing o impedir una excepción visual bien justificada.
- Automatizar el juicio humano de calidad visual ni reemplazar Figma, QA, Nielsen o entrevistas docentes.

## Decisions

### Una guía canónica con resúmenes enlazados

La guía vivirá en `Documentacion/05-context-engineering/DISEÑO_ANTI_SLOP.md`. Context Engineering, el plan y las skills la enlazan sin copiar su contenido completo.

Alternativa descartada: repetir un checklist extenso en cada skill y documento. Generaría drift y no resolvería qué lectura es vigente.

### Preflight semántico, no “lint” estético falso

Antes de crear o modificar una superficie visible, el agente registra tarea docente, zona de intensidad, jerarquía, estructura, firma visual única, tokens, estados negativos, accesibilidad y evidencia. Si detecta un patrón genérico, lo sustituye por una decisión ligada a la tarea o documenta una excepción.

Alternativa descartada: un test que intente declarar que una pantalla no es slop. La señal no sería fiable; el contrato exige revisión humana y evidencia visual, sin verdes falsos.

### Efectos costosos como excepción, no firma por defecto

Glass, blur, gradientes ambientales, bento ornamental, pills masivas, halos y sombras blandas no son una base de diseño. Un efecto puede usarse solo si explica una capa/estado, aparece en una zona apropiada y ofrece contraste, fallback sólido, reduce-motion y presupuesto de rendimiento.

Alternativa descartada: prohibición total. Un overlay de baja frecuencia o una landing separada puede justificar un efecto con mejor resultado que una superficie plana.

### Fuente de harness y degradación explícita

La instrucción mínima queda en `.agents/instructions/core.md`; las rutas y el preflight detallado viven en la guía. `.agents/skills/ux-ui-design` y `.agents/skills/awwwards` se actualizan como fuente; `npm run agent:harness:sync` genera los espejos. Un agente sin skills conserva la obligación desde `AGENTS.md`.

Alternativa descartada: editar `AGENTS.md`, `CLAUDE.md` o `.codex/skills` directamente. Son espejos y crearían drift.

## Risks / Trade-offs

- [Rigidez estética] → La guía evalúa intención, zona y tarea; admite excepciones con evidencia.
- [Checklists rituales] → El preflight exige una decisión específica y un estado negativo por superficie; no basta marcar casillas.
- [Contradicciones históricas] → La sección 1.9 se alinea y el change conserva baseline de la redacción previa.
- [Efectos incompatibles con RN] → La guía exige traducción al stack, fallback estático y validación de rendimiento antes de implementación.
- [Aprobación visual simulada] → Los frames siguen `draft` hasta la evidencia humana del gate #46; #47 permanece independiente.

## Migration Plan

1. Crear la guía, su spec y los enlaces de entrada.
2. Sustituir los pasajes contradictorios del estándar visual por la política de excepción y preflight.
3. Actualizar únicamente fuentes `.agents/`, renderizar espejos y verificar paridad.
4. Anotar el preflight en los próximos frames de Figma v2 antes de seguir la construcción.
5. Si la política necesita revertirse, revertir el PR y ejecutar el renderer; la biblioteca/frames rechazados en Figma no se destruyen.

## Open Questions

- Ninguna para esta política. La aceptación o rechazo de frames concretos y las entrevistas docentes continúan como gates humanos separados.
