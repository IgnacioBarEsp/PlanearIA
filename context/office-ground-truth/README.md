# Ground truth: Office Docente

> **Estado:** baseline 0.1 aplicado; el prototipo derivado fue aprobado por el owner el 2026-09-04.
> **Ola:** `#157-O3 Office`.
> **Issue:** [#177](https://github.com/IgnacioBarEsp/PlanearIA/issues/177#issuecomment-5549514143).
> **Change:** `reconstruir-office-experiencia`.
> **Superficies aprobadas:** 33 en la seccion `Office · approved v1.0 · #177` (`461:968`). Entradas
> principales: `461:969` escritorio, `461:1050` tablet, `461:1108` movil. La aprobacion cubre el prototipo;
> no incluye runtime, `#46`, entrevistas IHC ni los modulos puente, que siguen `candidate`.
> **Baseline heredado:** `257:951` escritorio, `277:958` clon de escritorio mal llamado tablet y
> `274:958` móvil de una sola tarjeta. Los tres se conservan intactos y siguen `candidate`.

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

## Resultado de la ola

El gate visual se cerro en dos rondas. La primera produjo dos condiciones -los filtros `Documentos` y
`Presentaciones` alternaban entre dos vistas sin mostrar la suya, y el boton `Plantillas` de movil no
filtraba por tipo- y dos decisiones sobre preguntas abiertas: los chips activos pasan a ser pulsables o a
presentarse como pestana, y las tarjetas de creacion de movil se compactan. Las cuatro se resolvieron
dentro del change y la segunda ronda salio limpia.

Las dos decisiones que este documento marcaba como derivadas por el agente quedaron **confirmadas por el
owner**: importar es accion persistente del hub, y el catalogo de plantillas se agrupa en familias con
presets en vez de plantillas sueltas.

Queda como resultado medible: 320 aristas de navegacion, 0 fugas dispositivo a dispositivo, 0 destinos de
filtro o plantilla incorrectos y 0 controles bajo 44 pt. Cierra la porcion de Office de
`debt-a40b2b029a63` y `debt-b1d35a5b5915`.
