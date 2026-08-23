## Why

El deck actual de MACA D'tallitos ya existe en HTML, PDF e imágenes para WhatsApp, pero conserva decisiones
que no representan la intención final del residente. Pide que Mayra y Stephanie llenen una plantilla o que
las recetas se capturen juntas, describe la página pública como algo no prometido sin explicar la nueva
condición, limita la historia a doce diapositivas y aprovecha pocas de las pantallas disponibles del
prototipo alfa.

Como el material se enviará por WhatsApp y ellas lo leerán sin presentador, cualquier ambigüedad queda sin
una explicación oral que la corrija. El deck debe funcionar como un tour: enseñar de forma sencilla todo lo
que llevará la parte interna, generar confianza y entusiasmo, y cerrar con una petición flexible que no les
imponga formatos ni trabajo adicional.

Trazabilidad: issue [#173](https://github.com/IgnacioBarEsp/PlanearIA/issues/173).

## What Changes

- Revisar el deck existente como una narración autoexplicativa, cálida y principalmente en primera persona,
  legible en teléfono y entregable por WhatsApp.
- Sustituir el límite duro de doce por un tour final de quince diapositivas. El problema actual y el mapa
  completo reciben láminas separadas para mejorar la lectura, sin ocultar alcance ni reducir tipografía.
- Agrupar y explicar el recorrido interno completo:
  - catálogo de flores, insumos y precios;
  - modelos de ramo y lo que lleva cada uno;
  - editar un modelo, personalizar sólo una cotización o guardar un ramo especial como modelo nuevo;
  - cotizar desde un modelo, desde cero o a partir del presupuesto del cliente;
  - sugerir modelos que caben en un presupuesto y ayudar a armar una opción especial;
  - compartir de forma genérica, conservar historial y marcar manualmente una cotización como aceptada;
  - convertirla en pedido y registrar fecha, entrega o recolección, anticipo, saldo, pagos y estados.
- Guardar nombre, teléfono, dirección y demás datos necesarios dentro de cada cotización o pedido, sin crear
  una pantalla ni módulo independiente de clientes.
- Mostrar de forma breve y demostrativa que al actualizar un precio se recalculan los modelos relacionados y
  existe una opción avanzada, poco prominente, para elegir cuáles se actualizan. No presentarlo como función
  ya construida ni profundizar en sus reglas todavía.
- Presentar la página pública sólo como una posibilidad condicionada a terminar bien la parte interna dentro
  de la residencia. Mostrar dos rutas posibles: preparar la solicitud en WhatsApp o hacer que llegue al
  sistema para que MACA la confirme.
- Reutilizar las capturas necesarias de `prototipo alpha`, excluyendo la pantalla de clientes, y renderizar o
  ajustar únicamente las que hagan falta para que el recorrido sea coherente.
- Marcar toda captura y dato ilustrativo con `Ejemplo · prototipo alfa`.
- Terminar con una sola llamada a la acción y el texto aprobado en la entrevista, sin enlace obligatorio a
  una plantilla ni ofrecimiento de llenar las recetas juntos.

## Non-Goals

- No se construye funcionalidad del cotizador, no se toca el código de PlanearIA y no se declara funcional
  ninguna pantalla alfa.
- No se crea un módulo de clientes: sus datos sólo forman parte de la cotización o del pedido correspondiente.
- No se promete la página pública ni una fecha para ella; se intentará únicamente si la parte interna queda
  terminada.
- No se pide a MACA llenar una hoja específica, adaptar sus archivos, capturar las recetas en una sesión ni
  aprobar formalmente el alcance desde el deck.
- No se añade una diapositiva formal de exclusiones. Inventario físico, facturación SAT, procesamiento de
  tarjetas, compras y proveedores permanecen fuera del sistema sin cargar el tono del tour.
- No se crea una identidad nueva para MACA ni se utilizan datos reales de clientes en los ejemplos.

## Impact

- **Superficies:** documentación SDD y material visual estático (`docs`, `ui`). No hay impacto en runtime,
  datos, dependencias ni build de PlanearIA.
- **Artefactos de entrega:** `deck-maca-final.html`, `Deck MACA - FINAL.pdf` y las quince imágenes de
  `Deck MACA FINAL (imagenes para WhatsApp)` ubicadas en la carpeta de la residencia. Los archivos anteriores
  se conservan sin cambios como referencia recuperable.
- **Ubicación temporal:** el change vive en PlanearIA porque aún no existe el proyecto local formal de la
  residencia. Se migra cuando se cree su repositorio o carpeta de proyecto.
- **Reversibilidad:** se pueden restaurar los tres formatos previos del deck y revertir sólo los documentos de
  este change. No existe estado de aplicación que migrar.
