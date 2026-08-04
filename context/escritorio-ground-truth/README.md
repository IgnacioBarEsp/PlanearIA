# Ground truth: Escritorio Docente

> **Estado:** baseline 0.1 candidato; pendiente de aprobación humana antes de `apply`.
> **Ola:** `#157-O2 Escritorio`.
> **Issue:** [#163](https://github.com/IgnacioBarEsp/PlanearIA/issues/163).
> **Change previsto:** `reconstruir-escritorio-experiencia`.

Esta carpeta acota la evidencia necesaria para reconstruir Escritorio como launcher de herramientas y
jornada docente accionable. No convierte Microsoft 365, Windows, Material o el runtime legacy en UX
objetivo; esas fuentes sólo aportan patrones contrastables. La visión aprobada de PlanearIA conserva la
precedencia.

## Contenido

- `01-decisiones/MATRIZ_DECISIONES_ESCRITORIO_157_O2.md`: decisiones confirmadas, supuestos, drift y
  condiciones concretas para reabrirlos.
- `02-baseline/BASELINE_ESCRITORIO_PLANEARIA_157_O2.md`: contrato funcional y perceptual candidato.
- `03-inventario/INVENTARIO_FIGMA_RUNTIME_2026-08-04.md`: estado as-is verificado en Figma y runtime.
- `04-preflight/PREFLIGHT_VISUAL_ESCRITORIO_157_O2.md`: preflight Anti-Slop previo a cualquier escritura
  visible.

## Regla de uso

1. Código y `openspec/specs/` describen el comportamiento runtime actual.
2. `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md`, el plan UX/UI y este baseline definen el destino candidato.
3. Los frames `198:695`, `198:776` y `198:809` son inventario de puentes; su nombre `approved` no aprueba
   Escritorio.
4. Durante `apply` se deberá crear una sección/version `candidate`, conservar historial y detenerse en un
   gate de Figma Present y aprobación humana.
5. Proto-personas y journeys IHC siguen siendo supuestos a validar con docentes reales. Las decisiones de
   visión confirmadas no se degradan por esa falta de validación de campo.
