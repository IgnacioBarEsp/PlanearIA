# Revisión adversarial

Fecha: 2026-08-22.

## Alcance

Se revisaron, sin editar durante cada pase, los tres formatos de entrega:

- `B - Para la floreria/deck-maca-final.html`;
- `B - Para la floreria/Deck MACA - FINAL.pdf`;
- `B - Para la floreria/Deck MACA FINAL (imagenes para WhatsApp)/MACA-01.png` a `MACA-15.png`.

La revisión buscó contradicciones entre copy y pantallas, promesas no aprobadas, datos ficticios incoherentes,
recortes, solapamientos, diferencias entre formatos y regresiones después de cada corrección.

## Primer pase

Hallazgos:

1. La lámina 7 prometía dos caminos por presupuesto, pero la pantalla sólo mostraba un ramo desde cero.
2. La lámina 9 relacionaba `Girasol` con modelos cuyas recetas no lo utilizaban.
3. La leyenda de la lámina 5 invadía el recorte del editor.
4. Las pantallas de pedido usaban `Miércoles 15 de octubre`, fecha incompatible con 2026.
5. El cálculo mediante receta y precios estaba implícito, no explicado.
6. Había una coma innecesaria en una transición del guion.

Resolución:

- la lámina 7 pasó a un presupuesto de $800 con Alexia, Renata y Aurora como modelos cercanos, más un
  segundo camino de ajuste guiado de Aurora;
- la actualización de precios pasó de `Girasol` a `Rosa`, con Cynthia y Alexia como únicos modelos
  relacionados y selección avanzada ilustrativa;
- el recorte y la leyenda de la lámina 5 se separaron;
- las dos fechas cambiaron a `Jueves 15 de octubre`;
- la lámina 4 explicó explícitamente cómo receta y precios calculan el total;
- se corrigió la puntuación.

## Segundo pase

Hallazgos:

1. La pantalla de la lámina 7 decía `ellas` mientras el resto del tour hablaba directamente a `ustedes`.
2. La lámina 5 todavía ocultaba parcialmente los controles derechos del editor.
3. El texto alternativo de la lámina 7 conservaba una descripción anterior a la corrección por presupuesto.

Resolución:

- la pantalla pasó a `Ustedes deciden…` y `ustedes eligen…`;
- el recorte se amplió hasta mostrar completos `Guardado`, `+ Agregar` y `Guardar cambios`;
- el texto alternativo pasó a describir el presupuesto de $800, los modelos cercanos y el ajuste guiado de
  Aurora;
- se regeneraron HTML, PDF y las quince imágenes.

## Veredicto final

**READY**

- La lámina 7 usa voz directa coherente en `ustedes`.
- La lámina 5 muestra completos los tres controles revisados, sin recorte ni solapamiento; su leyenda queda
  separada del área recortada.
- El texto alternativo de la lámina 7 corresponde al contenido de $800 y Aurora.
- El HTML contiene quince láminas y diez imágenes cargadas, sin errores.
- El PDF contiene quince páginas y las quince imágenes coinciden con él.
- La frase futura y la CTA aprobadas permanecen exactas; no reapareció lenguaje descartado.
- No quedan inconsistencias visuales o de contenido detectadas por la revisión adversarial.

## Pase posterior: ampliación de la lámina 3

Después de la primera entrega se revisó nuevamente la lámina 3 y su relación con las láminas 10 a 12.

**READY**

- La secuencia se entiende sin conocimientos técnicos: elegir o ajustar el ramo, preparar y compartir la
  cotización, registrar la aceptación, convertir manualmente en pedido y seguirlo hasta entrega y pago.
- `para que puedan compartirla` no promete un envío automático; `la marcarán como aceptada` y `elegirán
  «Convertir en pedido»` conservan el control manual.
- `Módulos y funciones del sistema` agrupa correctamente Catálogo, Cotización, Pedido y Seguimiento sin
  modificar el contenido aprobado de esos cuatro bloques.
- La lámina no presenta recortes ni solapamientos. Su PNG de 1248 × 2949 px coincide con la página 3
  renderizada del PDF y la QA del HTML informa `contentClipped: false` en móvil, escritorio e impresión.
- El copy permanece coherente con compartir por cualquier vía, la aceptación y conversión manuales y el
  seguimiento de entrega y pagos sin procesar cobros.

## Límite de esta evidencia

El veredicto no sustituye la lectura por una persona no técnica ajena al proyecto ni acredita el envío real
por WhatsApp. Ambas acciones permanecen abiertas en `tasks.md`.
