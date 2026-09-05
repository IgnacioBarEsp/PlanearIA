# Ground truth: NotasPLAN

> **Estado:** baseline 0.1 aplicado; el prototipo derivado fue aprobado por el owner el 2026-09-05.
> **Ola:** `#157-O4 NotasPLAN`.
> **Issue:** [#180](https://github.com/IgnacioBarEsp/PlanearIA/issues/180#issuecomment-5551089735).
> **Change:** `reconstruir-notasplan-experiencia`.
> **Superficies aprobadas:** 51 en la sección `NotasPLAN · approved v1.0 · #180` (`516:974`). Entradas
> principales: `516:975` escritorio, `518:974` tablet, `518:1025` móvil.
> **Baseline heredado:** `62:3`, `66:40`, `151:77` y `151:123`, los cuatro en 1440x960 y los cuatro
> conservados intactos como `draft`. Antes de esta ola no existía ninguna superficie de editor en 768 ni
> en 390.

Esta carpeta acota la evidencia necesaria para reconstruir NotasPLAN como el editor donde el docente
escribe la planeación que va a entregar. No convierte Word ni Google Docs en UX objetivo: aportan patrones
contrastables. La visión aprobada de PlanearIA conserva la precedencia.

## Contenido

- `01-decisiones/MATRIZ_DECISIONES_NOTASPLAN_157_O4.md`: doce decisiones confirmadas, tres derivadas, el
  recorrido de la decisión de fondo con sus dos revisiones, el límite honesto de la promesa de integridad,
  el drift heredado y los riesgos trasladados al runtime.
- `02-baseline/BASELINE_NOTASPLAN_PLANEARIA_157_O4.md`: contrato candidato en cuatro capas, adaptación por
  breakpoint, nueve estados mínimos y fronteras con otros módulos.
- `03-inventario/INVENTARIO_FIGMA_RUNTIME_2026-09-05.md`: estado as-is verificado por ancho de frame en
  Figma y por CodeGraph en runtime, con la tensión entre modelo tipado y documento-primero explicada.
- `04-preflight/PREFLIGHT_VISUAL_NOTASPLAN_157_O4.md`: preflight Anti-Slop previo a cualquier escritura
  visible, con el arte generado evaluado y descartado.

## La decisión que gobierna todo lo demás

NotasPLAN es **documento-primero con lente de formulario**. El archivo es un documento real desde el primer
momento; las siete secciones viajan dentro como encabezados con nombre; la vista formulario es una
proyección sobre ellos.

Esto no es una preferencia estética. Es lo único que cumple la condición que el owner puso desde el
principio: que el docente pueda descargar el documento, editarlo en Word o Docs y volver a subirlo sin que
deje de ser el suyo. Un modelo tipado no sobrevive ese viaje, porque Word no tiene dónde guardar que un
párrafo es el propósito de la sesión 2.

El owner llegó aquí tras revisar su respuesta dos veces, y la decisión está registrada con ese recorrido
para que se entienda por qué.

## Regla de uso

1. Código y `openspec/specs/` describen el comportamiento runtime actual.
2. El plan UX/UI #101, `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` y este baseline definen el destino.
3. Los frames `62:3`, `66:40`, `151:77` y `151:123` son inventario heredado. Su etiqueta `draft` es
   correcta y no deben promoverse por inferencia.
4. La clasificación de breakpoint es **por ancho de frame**, nunca por nombre, se cuentan también las
   aristas que salen de la sección, y se comprueba que cada destino sea el correcto y no sólo del ancho
   correcto. Esta última comprobación se añadió tras el defecto que #177 dejó pasar.
5. El runtime informa la evolución; no se copia. Pero el candidate **no puede prometer menos** de lo que la
   app ya hace: formato de página, alternancia de vistas, borrador y guardia de cambios sin guardar existen.
6. El candidate tampoco puede prometer lo que nadie ha medido: historial con versiones, enlace revocable y
   viaje de vuelta desde Word se representan y se declaran con su costo en el handoff.
7. Proto-personas y journeys IHC siguen siendo supuestos. Las entrevistas con docentes están pausadas por
   decisión del owner (#47), y `context/planeaciones-reales/` está externalizado, así que el andamiaje de la
   plantilla no se ha contrastado contra planeaciones reales desde el repositorio.

## Resultado de la ola

El gate visual se cerró en tres rondas. La primera devolvió tres fallos de navegación que compartían causa
—controles que prometían una acción y entregaban otra— más tres correcciones de detalle. La segunda
encontró un fallo conceptual: el índice desplazaba el contenido dentro de la hoja y el texto se salía del
papel, cuando la página entera ya cabía en pantalla y no había nada que desplazar. La tercera salió limpia.

Las tres decisiones que este documento marcaba como derivadas quedaron confirmadas: el nivel de plantilla
con valor por defecto, el formulario alcanzable pero no por defecto en móvil, y las siete secciones como
encabezados dentro del documento.

El owner además retiró de la interfaz el aviso sobre qué degrada al editar el documento fuera de la app,
por considerar que no le corresponde al docente. El límite técnico sigue declarado aquí y en el handoff:
retirar el aviso no es negar el límite.

Resultado medible: 352 aristas de navegación, 0 fugas dispositivo a dispositivo, 0 destinos incorrectos, 0
overlays sin salida, 0 contenido fuera del margen de la hoja y 0 controles bajo 44 pt.
