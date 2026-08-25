# Línea base brownfield de la presentación para MACA

## Superficies tocadas

- Documentación del change SDD temporal en `openspec/changes/presentar-sistema-a-maca/`.
- Deck HTML, PDF e imágenes verticales para WhatsApp en `B - Para la floreria/`.
- Selección y renderizado de capturas estáticas desde `prototipo alpha/` y `Pantallas de Stitch
  (renderizadas)/`.
- No se modifica código, runtime, datos, dependencias o configuración de PlanearIA.

## Fuentes de verdad actuales

- Issue PlanearIA [#173](https://github.com/IgnacioBarEsp/PlanearIA/issues/173).
- Entrevista de intención cerrada el 22 de agosto de 2026 en esta tarea de Codex.
- `B - Para la floreria/deck-maca-12.html`, `B - Para la floreria/Deck MACA.pdf` y
  `B - Para la floreria/Deck MACA (imagenes para WhatsApp)/`.
- Capturas y HTML fuente en `prototipo alpha/`; cinco capturas anteriores en `Pantallas de Stitch
  (renderizadas)/`.
- Este change define el contrato narrativo; no sustituye la futura spec funcional del sistema de la
  residencia.

## Comportamiento vigente

- El deck tiene doce diapositivas y fue preparado para leerse por WhatsApp.
- La última lámina pide llenar una hoja de recetas y ofrece hacerlo juntos, contrario a la intención final.
- La página pública aparece como idea no prometida en vez de una posibilidad condicionada al avance interno.
- Se aprovechan sólo algunas capturas, aunque el prototipo alfa ya contiene catálogo, modelos, distintas
  cotizaciones, historial, pedidos y pagos.
- Algunas pantallas alfa contienen un módulo de clientes que ya fue descartado para el alcance mostrado.

## Comportamiento objetivo

- Un tour cálido, autoexplicativo y principalmente en primera persona, de aproximadamente catorce láminas y
  sin límite duro de doce.
- Funciones agrupadas con continuidad: catálogo y precios; modelos y recetas; edición o creación de ramos;
  cotización por modelo, desde cero o por presupuesto; compartir e historial; conversión manual a pedido;
  entrega, estados, anticipos, saldos y pagos.
- Los datos del cliente aparecen dentro de la cotización o pedido; no aparece un módulo de clientes.
- La página pública se presenta como intento condicionado y explica sus dos vías posibles.
- Un solo cierre flexible que solicita recetas, Excel, datos, fotos y archivos como ya los tengan.

## Compatibilidad legacy

Los formatos de entrega se conservan: HTML editable, PDF y secuencia de imágenes para WhatsApp. Las capturas
anteriores pueden reutilizarse si coinciden con el contrato; las demás permanecen intactas como material de
prototipo. No se renombra ni elimina ningún archivo fuente. El deck anterior debe poder restaurarse desde el
historial o una copia previa al reemplazo.

## Owner de spec y contexto

- Owner de intención y entrega: Ignacio Barboza, residente responsable.
- Receptoras: Mayra y Stephanie, MACA D'tallitos.
- Owner temporal de la spec: issue PlanearIA #173 y este change.
- Owner futuro: proyecto formal de la residencia cuando sea creado; en ese momento se migrará el contexto
  sin convertir esta narrativa en una spec funcional automática.

## Evidencia actual

- Deck existente en los tres formatos de entrega.
- Inventario local de pantallas alfa, incluidos `flores_e_insumos`, `mis_modelos`, `ramo_cynthia`,
  `de_cu_nto_lo_quiere`, `cotización_libre`, `cotización_detail`, `historial`, `pedido_0142` y
  `registrar_pago`.
- Respuestas finales de la entrevista incorporadas en `proposal.md`, `design.md`, la delta spec y
  `PROMPTS.md`.
- La evidencia visual comparativa, revisión móvil y prueba de comprensión siguen pendientes de apply.

## Fuera de alcance

Construcción del sistema, módulo independiente de clientes, inventario físico, facturación SAT,
procesamiento de pagos con tarjeta, compras, proveedores y cualquier promesa firme de página pública. También
quedan fuera la aprobación contractual del alcance y la obligación de que MACA adapte sus archivos a una
plantilla.
