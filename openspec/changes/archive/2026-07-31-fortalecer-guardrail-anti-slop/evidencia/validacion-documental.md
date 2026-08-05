# Validación documental

> Change: `fortalecer-guardrail-anti-slop` · Issue: [#86](https://github.com/IgnacioBarEsp/PlanearIA/issues/86) · Fecha: 2026-07-31.

## Alcance comprobado

La política canónica quedó en `Documentacion/05-context-engineering/DISENO_ANTI_SLOP.md`. Define un preflight de tarea, intensidad, jerarquía, estructura, firma útil, patrón refutado, tokens, estados, accesibilidad y evidencia; no prescribe una estética ni convierte Figma en aprobación humana.

Las rutas de entrada que exponen la política son:

| Punto de entrada | Evidencia |
| --- | --- |
| Documentación raíz | `Documentacion/README.md` exige leer la guía antes de componer UI o editar Figma. |
| Context engineering | `Documentacion/05-context-engineering/README.md` sitúa la guía como primera ruta UI y añade la pregunta de encontrabilidad. |
| Plan activo | `PLAN_UXUI_NAVEGACION_GLOBAL.md` enlaza la guía desde el estándar de excelencia y conserva los gates manuales R1/R2. |
| Instrucción universal | `.agents/instructions/core.md` exige la guía antes de cualquier decisión de UI visible. |

## Comandos ejecutados

| Comando | Resultado |
| --- | --- |
| `npm run openspec:ready:propose -- --issue 86` | `PASS`; issue enriquecido, preflight y plan UX/UI sin trigger de deuda activo. |
| `npm run openspec:validate` | `52 specs passed, 0 failed`; también pasa el checker TLDR. |
| Verificación local de enlaces Markdown de los cuatro documentos cambiados | `document-links: OK (4 archivos)`. |
| `git diff --check` | Sin errores de whitespace. |

## Ground truth Figma registrado

La dirección v2 se conserva como borrador reversible y no como aprobación de producto:

- Foundations v2: [Figma node 18:4](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=18-4).
- Button v2: [Figma node 21:33](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=21-33).
- La v1 rechazada se preserva oculta/archivada en Figma; no fue borrada.

El checklist visual posterior, las entrevistas IHC, los gates R1/R2 y la aprobación humana siguen pendientes donde el plan los declara manuales.
