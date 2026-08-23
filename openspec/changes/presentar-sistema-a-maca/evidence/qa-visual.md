# QA visual y revisión Nielsen

Fecha: 2026-08-22.

## Verificación técnica

- El HTML respondió HTTP 200 desde un servidor local.
- Breakpoints revisados con Playwright: 360 × 800, 390 × 844 y 1440 × 1000.
- En 360 y 390 px, `bodyWidth` coincide con `viewportWidth`; no existe scroll horizontal del documento.
- Se detectaron quince láminas en los tres breakpoints y en media print.
- Ningún hijo directo queda fuera del área de su lámina en media print.
- El PDF tiene quince páginas de 312 × 737.04 pt, equivalentes a 110 × 260 mm.
- Las quince imágenes de WhatsApp se renderizaron a 1248 × 2949 px.
- Se inspeccionó un contact sheet y después cada una de las quince páginas a tamaño completo.

La evidencia instrumental local quedó en `tmp/maca-deck-build/qa/metrics.json`,
`tmp/maca-deck-build/qa/mobile360.png`, `tmp/maca-deck-build/qa/mobile390.png`,
`tmp/maca-deck-build/qa/desktop1440.png` y `tmp/maca-deck-build/qa/pdf-contact-sheet.png`.

## Revisión Nielsen aplicada al tour

| Heurística | Resultado |
|---|---|
| Correspondencia con el mundo real | Usa ramo, receta, cotización, pedido, anticipo, entrega y resta por cobrar |
| Visibilidad del estado | Cotizaciones y pedidos muestran estados reconocibles y separados |
| Control y libertad | Distingue editar un modelo, cambiar sólo una cotización y guardar otro modelo |
| Consistencia | Marca, Cynthia, COT/PED-0142, total, anticipo y saldo permanecen coherentes |
| Prevención de errores | La aceptación es manual; la página pública es condicional; los costos internos quedan fuera |
| Reconocer en vez de recordar | El mapa inicial y el historial conectan cada paso del recorrido |
| Diseño minimalista | Una idea principal por lámina; nueve pantallas sostienen once láminas funcionales |
| Ayuda y cierre | Una sola CTA explica qué enviar y aclara que el residente lo organizará |

## Hallazgos corregidos durante QA

- La primera exportación de la lámina 5 cortaba palabras del encabezado interno del editor. Se ajustó el
  recorte y después se separó la ventana recortada de su `figcaption` para evitar cualquier superposición.
- La lámina 7 mostraba sólo un ramo desde cero aunque el copy prometía dos caminos por presupuesto. Se
  sustituyó por una composición con presupuesto de $800, modelos cercanos y ajuste guiado.
- La lámina 9 relacionaba `Girasol` con modelos que no lo usaban. Ahora actualiza `Rosa`, enumera únicamente
  Cynthia y Alexia y permite excluir a Alexia en la selección avanzada.
- Las pantallas de pedido decían `Miércoles 15 de octubre`; se corrigieron a `Jueves 15 de octubre`, fecha
  compatible con 2026.
- La lámina 4 ahora dice de forma explícita que la receta y los precios cargados calculan el total.
- La lámina 5 ahora deja visibles completos los controles `Guardado`, `+ Agregar` y `Guardar cambios`;
  el recorte ya no oculta acciones del editor.
- La pantalla de la lámina 7 cambió la voz indirecta `ellas` por `ustedes` y su texto alternativo ahora
  describe el presupuesto de $800, los modelos cercanos y el ajuste guiado de Aurora.

Después de estas correcciones se regeneraron HTML, PDF y PNG, se repitió Playwright y se inspeccionaron otra
vez el contact sheet y las páginas afectadas a tamaño completo. No quedan hallazgos visuales mayores abiertos.

## Validación humana pendiente

La prueba con una persona no técnica ajena al proyecto permanece pendiente y no se sustituye con esta
revisión. También queda pendiente el envío real por WhatsApp, que corresponde al residente.

## Gates de repositorio

- `npm run openspec:validate`: PASS, 56 de 56 elementos.
- `npm run agent:harness:check`: PASS, 36 espejos en paridad.
- Revisión adversarial: READY; detalle en `adversarial-review.md`.
- `git diff --cached --check`: PASS, sin errores de espacios ni marcadores de conflicto.
