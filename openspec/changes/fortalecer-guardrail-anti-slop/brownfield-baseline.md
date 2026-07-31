## Superficies tocadas

- `Documentacion/05-context-engineering/README.md` y nueva guía anti-slop.
- `Documentacion/README.md` y `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- `.agents/instructions/core.md`, `.agents/skills/ux-ui-design/SKILL.md` y `.agents/skills/awwwards/SKILL.md`, más sus espejos generados.
- Archivo Figma de Ola 2 solo como evidencia/manual ground truth; no como archivo versionado.

## Fuentes de verdad actuales

- `AGENTS.md` generado desde `.agents/instructions/` es la entrada universal.
- `Documentacion/05-context-engineering/README.md` enruta el contexto por tarea.
- El plan UX/UI §1.9 contiene el estándar y `IHC_DISCOVERY_DOCENTE.md` mantiene Nielsen/personas.
- Las skills fuente viven en `.agents/skills/`; los espejos son propiedad de `scripts/syncAgentHarness.mjs`.

## Comportamiento vigente

Existe un checklist anti-slop breve. El plan todavía menciona paleta azul docente, bento y glass dentro del vocabulario premium. Las skills advierten sobre intensidad, pero no obligan a un preflight canónico ni explican qué hacer ante patrones genéricos cuando no hay Figma o skill disponible.

## Comportamiento objetivo

Toda decisión visual parte de una guía canónica y de un preflight ligado a tarea docente. Las zonas de intensidad y las excepciones visuales quedan explícitas. Los agentes sin skills reciben la misma obligación desde instrucciones universales; los harnesses con skills usan la guía detallada.

## Compatibilidad legacy

No se modifica runtime ni se invalida evidencia histórica. La dirección Figma v1 se conserva como rechazada y reversible; el estado de gates #46/#47 no cambia. La landing futura puede usar un vocabulario distinto si documenta su zona y excepción.

## Owner de spec y contexto

Owner: plan maestro UX/UI, issue #86. Contexto: `Documentacion/05-context-engineering/`. Spec nueva: `anti-slop-design-guardrail`. Fuentes del harness: `.agents/` y renderer `scripts/syncAgentHarness.mjs`.

## Evidencia actual

- Gate pre-propose de #86: PASS el 2026-07-31.
- Figma Foundations v2 (`18:4`) y Button v2 (`21:33`) validados visualmente; siguen draft.
- Búsqueda documental confirma checklist existente y contradicciones de vocabulario en §1.9.

## Fuera de alcance

Implementación de pantallas RN, cambios de tokens runtime, fuentes o dependencias, cierre de #46/#47, entrevistas IHC, cambios de navegación, backend, datos y sincronización.
