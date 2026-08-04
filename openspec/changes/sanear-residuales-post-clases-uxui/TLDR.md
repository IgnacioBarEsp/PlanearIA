# TLDR: sanear residuales post-Clases UX/UI

## Intención — Proposal

Clases quedó aprobada y cerrada, pero cuatro Minors pausaron el plan UX/UI en 7/5. Este change convierte
esas observaciones en reglas verificables: rollback Figma soportado, handoff por roles semánticos,
daltonismo funcional en runtime y origen QA correcto. No modifica Figma, aplicación ni backend y no puede
entrar a apply sin aprobación explícita del owner.

## Enfoque — Design

El saneamiento preserva los assessments originales y resuelve cada ID mediante evidencia nueva. Figma
expresa intención por roles; `useAppTheme` y los contextos conservan el valor runtime. El prototipo usa
señales no dependientes del color y el runtime prueba daltonismo. QA abre `localhost:8081` y verifica el
preflight exacto antes de afirmar backend o sync.

## Comportamiento — Specs

Las delta specs exigen historial, frames previos, sección versionada y destino de rollback, sin fingir un
checkpoint nombrado. El handoff documenta familias de tokens y prohíbe copiar hex incidentalmente. Un modo
Figma de daltonismo solo se reabre con evidencia. Una sesión desde otro origen queda local-only si CORS no
refleja el host exacto.

## Plan de trabajo — Tasks

Después de la aprobación se actualizarán cuatro documentos, se reunirá evidencia por residual y se
ejecutarán validaciones y revisión adversarial. Solo entonces se capturará un assessment de saneamiento con
cuatro `resolves` y cero deuda nueva. El motor deberá demostrar que el plan queda bajo el umbral antes de
archive, finish, cierre de #161 o inicio de Escritorio.

## Resumen integral

El resultado esperado es un contrato transversal pequeño que impide repetir los residuales de Clases sin
introducir código ni deuda. La reanudación no se declara por criterio humano: la decide `debt:check` tras
evidencia y captura válidas. Escritorio seguirá como siguiente módulo, con artefactos propios y un nuevo
gate humano antes de su apply.
