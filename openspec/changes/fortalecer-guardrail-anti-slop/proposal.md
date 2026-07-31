## Why

Issue de origen: [#86 — Preparar prototipos Figma Ola 2](https://github.com/RitualBoat/PlanearIA/issues/86).

El estándar visual de PlanearIA ya nombraba el riesgo de diseño genérico, pero permitía interpretaciones contradictorias: paleta azul, bento y glass podían leerse como soluciones por defecto. La dirección Figma v2 aprobada demuestra que el producto necesita un criterio operativo, encontrable y verificable antes de que un agente diseñe en Figma, código u otra herramienta.

## What Changes

- Crear una guía canónica de diseño anti-slop orientada a una suite docente de trabajo diario.
- Enlazarla desde Context Engineering y la guía universal de agentes para que sea una lectura previa obligatoria de decisiones visuales.
- Corregir el estándar UX/UI: la expresividad depende de tarea y zona; glass, gradientes, bento y pills dejan de ser vocabulario por defecto.
- Actualizar las skills fuente UX/UI y Awwwards y regenerar sus espejos con el harness.
- Registrar un preflight por frame que exige tarea docente, zona, firma visual única, estados negativos, accesibilidad y excepción explícita para efectos costosos.

## Capabilities

### New Capabilities

- `anti-slop-design-guardrail`: guía y contrato operativo que previene decisiones visuales genéricas antes de diseñar y aporta evidencia revisable en Figma o UI implementada.

### Modified Capabilities

- Ninguna. La cronología UX/IHC, la biblioteca base y la QA visual conservan sus contratos; este change les aporta una fuente de decisión más precisa.

## Impact

- Documentación: Context Engineering, estándar del plan UX/UI y nueva guía canónica.
- Harness: instrucciones universales y skills fuente/espejos de UX/UI y Awwwards.
- Figma: el prototipo Ola 2 adopta el preflight, sin declarar aún la aprobación manual de sus frames.
- No hay cambios de runtime, dependencias, APIs, datos, backend ni navegación.
