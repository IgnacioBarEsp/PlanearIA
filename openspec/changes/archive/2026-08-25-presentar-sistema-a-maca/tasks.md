# Tareas

## 1. Enrich y preparación

- [x] 1.1 Publicar en el issue #173 el cuerpo enriquecido de `evidence/issue-173-body.md` y ejecutar el gate
  pre-propose.
  - Evidencia: URL del issue y salida `OpenSpec readiness: PASS`.
- [x] 1.2 Inventariar el deck vigente y las pantallas de `prototipo alpha`; registrar qué captura respalda cada
  parte del tour y excluir `clientes`.
  - Evidencia: matriz de selección en `evidence/`.
- [x] 1.3 Guardar una referencia recuperable del HTML, PDF e imágenes para WhatsApp anteriores.
  - Evidencia: ruta o commit de restauración, sin duplicar archivos sensibles dentro del repositorio.

## 2. Guion y copy

- [x] 2.1 Montar un guion final de quince láminas conforme a la arquitectura de `design.md`,
  ajustando el conteo sólo si mejora el tour móvil.
  - Evidencia: índice final con propósito y transición de cada lámina.
- [x] 2.2 Explicar catálogo/precios, modelos/recetas, tres formas de cotizar, personalización, compartir,
  historial, conversión a pedido, entrega, pagos y estados sin saturar ni crear una lámina de exclusiones.
  - Evidencia: checklist de cobertura contra la delta spec.
- [x] 2.3 Usar principalmente la voz personal del residente y mantener la página pública condicionada con las
  dos posibles vías aprobadas.
  - Evidencia: revisión de copy sin promesas absolutas.
- [x] 2.4 Dejar una sola llamada a la acción con el texto aprobado; eliminar toda invitación a llenar una hoja,
  preparar formatos o capturar las recetas juntos.
  - Evidencia: búsqueda de frases contradictorias y conteo de CTA igual a uno.

## 3. Pantallas y montaje

- [x] 3.1 Reutilizar y renderizar sólo las capturas necesarias del prototipo alfa; crear una nueva únicamente
  cuando ninguna existente pueda explicar el comportamiento sin engañar.
  - Evidencia: capturas fuente y justificación de cualquier pantalla nueva.
- [x] 3.2 Aplicar `Ejemplo · prototipo alfa` a todas las capturas y datos ilustrativos; mantener nombres e
  importes ficticios coherentes.
  - Evidencia: revisión visual página por página.
- [x] 3.3 Usar un botón genérico `Compartir`, conservar WhatsApp sólo como canal posible y no mostrar un módulo
  separado de clientes.
  - Evidencia: capturas de las láminas de cotización y pedido.
- [x] 3.4 Crear `deck-maca-final.html`, `Deck MACA - FINAL.pdf` y la secuencia de quince imágenes para WhatsApp,
  conservando intactas las versiones anteriores.
  - Evidencia: los tres formatos coinciden en copy, orden y número de láminas.

## 4. Verificación

- [x] 4.1 Revisar el HTML por viewport móvil y las imágenes finales a 360 px de ancho.
  - Evidencia: capturas de breakpoint sin texto cortado, solapamientos ni escalas ilegibles.
- [x] 4.2 Ejecutar una revisión Nielsen y comprobar continuidad, jerarquía, consistencia de ejemplos y ausencia
  de controles o promesas contradictorias.
  - Evidencia: informe en `evidence/` sin hallazgos mayores abiertos.
- [x] 4.3 Comprobar la lectura autónoma con las destinatarias no técnicas del deck.
  - Evidencia: Mayra y Stephanie lo leyeron sin explicación en vivo, dijeron que les gustó mucho y
    agradecieron el compromiso; `evidence/delivery-feedback-and-handoff.md` registra el resultado.
- [x] 4.4 Ejecutar validación OpenSpec estricta, paridad de harness, revisión adversarial y `git diff --check`.
  - Evidencia: salidas y veredicto registrados en `readiness.json`.

## 5. Entrega y cierre

- [x] 5.1 Enviar por WhatsApp el PDF o secuencia final a Mayra y Stephanie sin agregar una segunda petición en
  el mensaje acompañante.
  - Evidencia: confirmación de entrega y respuesta registrada en `evidence/delivery-feedback-and-handoff.md`;
    no se conserva una captura de la conversación con datos personales.
- [x] 5.2 Registrar los archivos que MACA envió y organizar su carga sin exigir una plantilla.
  - Evidencia: `C:/Users/RitualBoatLaptop/Desktop/residencias/Informacion proporcionada por la floreria/LEEME.md`.
- [x] 5.3 Registrar el handoff en la fuente de verdad actual y cerrar el flujo SDD documental en PlanearIA.
  - Evidencia: el proyecto formal de la residencia todavía no existe; el estado y los insumos quedaron
    organizados en `C:/Users/RitualBoatLaptop/Desktop/residencias/` y el usuario pidió archivar este issue.
- [x] 5.4 Capturar el assessment de deuda limpio y preparar los gates de cierre.
  - Evidencia: `debt:capture` y `debt:check` PASS; assessment en
    `evidence/debt-assessment-input.json`; OpenSpec estricto 56/56 PASS. El archive y el finish se ejecutan
    después de que todas las tareas están completas.

## 6. Ajuste posterior de claridad

- [x] 6.1 Ampliar la lámina 3 para explicar el proceso desde elegir o ajustar el ramo hasta la entrega y el
  pago, sin prometer automatizaciones inexistentes y conservando los cuatro bloques originales.
  - Evidencia: `B - Para la floreria/deck-maca-final.html` y `evidence/copy-audit.md`.
- [x] 6.2 Rotular los cuatro bloques como `Módulos y funciones del sistema`, regenerar HTML, PDF e imágenes y
  repetir la revisión visual móvil y de impresión.
  - Evidencia: `evidence/qa-visual.md` y veredicto posterior en `evidence/adversarial-review.md`.
