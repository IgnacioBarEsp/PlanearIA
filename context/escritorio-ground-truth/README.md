# Ground truth: Escritorio Docente

> **Estado:** baseline 0.1 aplicado; el prototipo derivado fue aprobado por el owner el 2026-08-13.
> **Ola:** `#157-O2 Escritorio`.
> **Issue:** [#163](https://github.com/IgnacioBarEsp/PlanearIA/issues/163#issuecomment-5286904053).
> **Change:** `reconstruir-escritorio-experiencia`.
> **Superficies aprobadas:** `307:966` escritorio, `307:1046` tablet, `307:1078` móvil, selectores `310:3`,
> `310:69`, `310:106` y estados de límite `345:968`, `345:1006`, en la sección `307:965`. La aprobación no
> incluye runtime, `#46`, entrevistas IHC ni los módulos puente, que siguen `candidate`.

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
4. El `apply` creó la sección `307:965`, conservó los frames históricos y se detuvo en el gate de Figma
   Present. El owner recorrió los tres breakpoints, emitió dos condiciones, se corrigieron y aprobó.
   La sección quedó renombrada `Escritorio · approved v1.0 · #163 · puentes de otros modulos candidate`.
5. Proto-personas y journeys IHC siguen siendo supuestos a validar con docentes reales. Las decisiones de
   visión confirmadas no se degradan por esa falta de validación de campo.
