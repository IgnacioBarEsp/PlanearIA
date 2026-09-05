# Ground truth: Office Docente

> **Estado:** baseline 0.1 candidate. Sin aprobación visual.
> **Ola:** `#157-O3 Office`.
> **Change previsto:** `reconstruir-office-experiencia`.
> **Superficies actuales:** `257:951` escritorio, `277:958` clon de escritorio mal llamado tablet y
> `274:958` móvil de una sola tarjeta. Ninguna está aprobada; las tres son `candidate` heredadas de
> #156 y #159.

Esta carpeta acota la evidencia necesaria para reconstruir Office Docente como el módulo donde el docente
crea material nuevo y vuelve por el que ya hizo. No convierte Microsoft 365, Google Drive ni el runtime
legacy en UX objetivo: esas fuentes sólo aportan patrones contrastables. La visión aprobada de PlanearIA
conserva la precedencia.

Inaugura el ground truth de Office, que no existía. **No cierra el issue #87**, que además pide índices de
Asistente y un registro de frames aprobados.

## Contenido

- `01-decisiones/MATRIZ_DECISIONES_OFFICE_157_O3.md`: doce decisiones confirmadas en la entrevista del
  2026-09-04, dos derivadas marcadas, el catálogo de plantillas organizado en familias, una desviación
  registrada frente a D3 y el drift heredado que el change debe cerrar.
- `02-baseline/BASELINE_OFFICE_PLANEARIA_157_O3.md`: contrato funcional y perceptual candidato en tres
  capas, adaptación por breakpoint, estados mínimos y fronteras con otros módulos.
- `03-inventario/INVENTARIO_FIGMA_RUNTIME_2026-09-04.md`: estado as-is verificado en Figma por ancho de
  frame y en runtime por CodeGraph, con la brecha explícita entre lo que existe y lo decidido.
- `04-preflight/PREFLIGHT_VISUAL_OFFICE_157_O3.md`: preflight Anti-Slop previo a cualquier escritura
  visible.

## Regla de uso

1. Código y `openspec/specs/` describen el comportamiento runtime actual.
2. El plan UX/UI #101, `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` y este baseline definen el destino
   candidato.
3. Los frames `257:951`, `277:958` y `274:958` son inventario de puentes heredados. Su etiqueta
   `candidate` es correcta y no deben promoverse por inferencia.
4. La clasificación de breakpoint es **por ancho de frame**, nunca por nombre, y se cuentan también las
   aristas que salen de la sección. Regla impuesta por #166 a toda ola posterior.
5. El runtime informa la evolución; no se copia. `Contenido` y `BibliotecaPlantillas` ya existen en
   `OfficeStack` y el candidate no puede prometer menos de lo que la app ya hace.
6. Proto-personas y journeys IHC siguen siendo supuestos. Las entrevistas con docentes están pausadas por
   decisión del owner (2026-09-04); esa pausa no degrada las decisiones de visión confirmadas, pero sí
   mantiene abiertos los supuestos declarados en cada documento.
