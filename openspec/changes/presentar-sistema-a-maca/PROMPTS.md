# Prompts operativos para revisar el deck

Estos prompts gobiernan la revisión del material existente. No se deben regenerar pantallas por costumbre:
primero se reutiliza `prototipo alpha` y sólo se crea una imagen si existe un hueco narrativo real.

## Resultado aplicado

La ejecución del 2026-08-22 produjo quince láminas. La lámina adicional separa el problema actual del mapa
completo, conserva el ritmo móvil y no añade alcance. Los archivos finales son `deck-maca-final.html`,
`Deck MACA - FINAL.pdf` y `Deck MACA FINAL (imagenes para WhatsApp)/`; las fuentes de la sección siguiente
se mantienen como baseline recuperable. La marca final de cada captura es `Ejemplo · prototipo alfa`.

Los bloques siguientes documentan el prompt pre-apply que orientó la reconstrucción; `design.md` y la
evidencia final registran la estructura exacta aplicada.

## Fuentes obligatorias

- `B - Para la floreria/deck-maca-12.html`
- `B - Para la floreria/Deck MACA.pdf`
- `B - Para la floreria/Deck MACA (imagenes para WhatsApp)/`
- `B - Para la floreria/Pantallas de Stitch (renderizadas)/`
- `prototipo alpha/`

No usar la pantalla `clientes`. Para cubrir el tour se prefieren estas pantallas alfa: `flores_e_insumos`,
`mis_modelos`, `ramo_cynthia`, `actualizar_precios`, `de_cu_nto_lo_quiere`, `cotización_libre`,
`cotización_ayudante`, `cotización_detail`, `historial`, `nuevo_pedido`, `pedido_0142` y `registrar_pago`.

## Sistema visual compartido

| Token | Valor | Uso |
|---|---|---|
| Azul MACA | `#4A6D8C` | Acción principal y encabezados |
| Azul profundo | `#2E4A63` | Texto de énfasis |
| Dorado MACA | `#C9A227` | Acentos puntuales |
| Crema | `#F7F3EC` | Fondo general |
| Blanco hueso | `#FFFDF9` | Superficies |
| Verde salvia | `#7A8B6F` | Estados positivos |
| Gris texto | `#4A4A4A` | Cuerpo |

Titulares en Playfair Display o Cormorant y cuerpo en Inter o Source Sans. Sin glass, blur, halos,
gradientes decorativos, bento ornamental, sombras grandes ni estética de dashboard corporativo.

## PROMPT 1 · Curaduría y preparación de capturas

```text
Revisa todas las capturas disponibles del prototipo alfa de MACA D'tallitos antes de crear una nueva.

Objetivo: seleccionar sólo las imágenes necesarias para explicar un recorrido continuo desde el catálogo
hasta la entrega de un pedido. No conviertas el deck en una galería de pantallas.

Reglas:
- Excluye por completo la pantalla o módulo "Clientes". Nombre, teléfono, dirección y notas aparecen dentro
  de la cotización o el pedido correspondiente.
- Prioriza capturas que ya tengan un botón genérico "Compartir". WhatsApp puede aparecer como una opción,
  nunca como el único destino o el único texto del botón principal.
- Cada captura incorporada lleva una banda discreta y legible: "Ejemplo · prototipo alfa".
- Mantén coherentes el número de cotización, nombre del ramo, total, anticipo, saldo, fecha y estado entre
  todas las imágenes usadas. No uses datos reales de clientes.
- Recorta cada captura a la zona que respalda el texto. No muestres navegación o controles irrelevantes.
- La pantalla de actualización de precios sólo demuestra que un cambio puede afectar varios modelos. Si hace
  falta, agrega una acción secundaria "Opciones avanzadas" que permita imaginar la selección de modelos,
  pero no desarrolles ni describas sus reglas.
- La página pública se distingue como posibilidad condicionada, no como pantalla ya construida.
- Si una pantalla existente cubre el concepto con un recorte o rótulo honesto, reutilízala. Genera una nueva
  sólo si ninguna fuente puede explicar el comportamiento sin contradicción.

Entrega una matriz con: concepto, captura elegida, recorte, lámina destino, cambios visuales y motivo.
```

## PROMPT 2 · Reconstrucción del deck

```text
Actúa como diseñador editorial y reconstruye el deck existente de MACA D'tallitos en su HTML fuente.
Después deberá exportarse al mismo PDF y a imágenes verticales para WhatsApp.

LECTORAS Y CONTEXTO
Mayra y Stephanie lo recibirán por WhatsApp y lo leerán solas desde el celular. No habrá presentador.
El deck debe sentirse como un tour cálido por algo que estoy construyendo para ellas: claro, cercano y
emocionante, sin tono corporativo, contractual o demasiado profesional.

VOZ
- Hablo principalmente en primera persona: "estoy construyendo", "voy a cargar", "yo me encargo".
- Usa "el sistema les permitirá" o "podrán" sólo cuando fluya mejor al explicar una acción.
- Usa palabras cotidianas: flores, insumos, precios, ramo, modelo, qué lleva, cotización, pedido, anticipo,
  saldo, entrega y recolección.
- Evita jerga: arquitectura, backend, CRUD, base de datos, despliegue, MVP y términos semejantes.
- No pidas aprobación de alcance, reunión, visita, llenar una plantilla ni capturar las recetas juntos.

FORMATO
- Meta aproximada: 14 o 15 diapositivas. No hay un límite duro; agrega o fusiona sólo si mejora la comprensión.
- Una idea principal por lámina, máximo dos capturas y texto legible a 360 px.
- No hagas una diapositiva formal de exclusiones.
- Toda captura y dato ficticio: "Ejemplo · prototipo alfa" y coherencia entre todas las láminas.
- Usa un botón genérico "Compartir". Explica que la cotización puede enviarse donde la necesiten y en el
  formato conveniente.

GUION BASE

1. PORTADA
Título: "Lo que estoy construyendo para MACA"
Subtítulo: "Un recorrido por cómo sus ramos pasan de la idea a la entrega"
Firma: "Ignacio Barboza · Residencia profesional · 14 de julio al 18 de diciembre de 2026"

2. EL RECORRIDO COMPLETO
Título: "De sus ramos al pedido, todo en un mismo lugar"
Muestra cuatro momentos simples: "Guardar lo que usan" → "Cotizar" → "Confirmar" → "Entregar".
Texto: "Estoy organizando cada parte para que puedan avanzar sin volver a capturar lo mismo."

3. TODO EMPIEZA CON LO QUE YA USAN
Título: "Flores, precios y modelos, bien ordenados"
Texto: "Voy a cargar sus flores e insumos, sus precios y cada modelo con la foto y todo lo que lleva."
Usa `flores_e_insumos` y `mis_modelos`.

4. CUANDO CAMBIA UN PRECIO
Título: "Un cambio puede actualizar los ramos que lo usan"
Texto: "Si cambia una flor o un material, podrán ver qué modelos se ajustan. También habrá una opción
avanzada para elegir cuáles actualizar."
Usa `ramo_cynthia` y `actualizar_precios`. Presenta esta idea como demostrativa, sin explicar reglas finas.

5. EDITAR, PERSONALIZAR O CREAR
Título: "Cada cambio queda donde ustedes decidan"
Explica tres decisiones breves:
"Editar el modelo para siempre" · "Cambiar sólo esta cotización" · "Guardar el especial como modelo nuevo".
Usa un ramo reconocible, como Cynthia.

6. TRES FORMAS DE COTIZAR
Título: "Pueden empezar como llegue el cliente"
Tres opciones: "Elegir un modelo" · "Armarlo desde cero" · "Partir de su presupuesto".
Usa recortes de `mis_modelos`, `cotización_libre` y `de_cu_nto_lo_quiere`.

7. CUANDO EL CLIENTE DICE SU PRESUPUESTO
Título: "Pueden ver qué alcanza y también crear algo especial"
Texto: "El sistema puede mostrar modelos cercanos a ese monto o ayudarles a ajustar flores y materiales
hasta armar una opción."
Usa `de_cu_nto_lo_quiere` y `cotización_ayudante`.

8. SIN CAMBIAR EL ORIGINAL
Título: "Personalizan el ramo sin volver a empezar"
Texto: "Los cambios pueden quedarse sólo en esa cotización. Si el resultado les sirve después, lo guardan
como un modelo nuevo."
Usa `cotización_ayudante` o `cotización_detail`.

9. LISTA PARA COMPARTIR
Título: "La cotización queda lista y también guardada"
Texto: "Con el botón Compartir podrán enviarla donde la necesiten y en el formato que les convenga. Después
pueden encontrarla en el historial."
Usa `cotización_detail` con el botón "Compartir" y `historial`.

10. CUANDO EL CLIENTE DICE QUE SÍ
Título: "Ustedes confirman antes de crear el pedido"
Texto: "Marcan la cotización como aceptada y eligen Convertir en pedido. Ahí completan lo que falte."
Usa `cotización_detail` y `nuevo_pedido`.

11. DEL ANTICIPO A LA ENTREGA
Título: "Cada pedido muestra qué sigue y qué falta"
Texto: "Fecha, entrega o recolección, datos del cliente, anticipo, saldo, pagos y estado quedan juntos en el
pedido. No necesitan una lista separada de clientes."
Usa `pedido_0142` y `registrar_pago`.
Presenta de forma breve los estados de cotización y pedido, agrupados y sin una tabla densa.

12. SI LA PARTE INTERNA QUEDA TERMINADA
Título: "También intentaré incluir una página para sus clientes"
Usa exactamente este texto:
"Si terminamos bien la parte interna, intentaré incluir también una página para que sus clientes vean su
catálogo. Podemos hacer que la solicitud llegue por WhatsApp o que aparezca directamente dentro del
sistema."
Aclara visualmente que son dos posibilidades por decidir y que la solicitud interna requiere confirmación.

13. CÓMO LO VOY A CONSTRUIR
Título: "Se los voy entregando en cuatro pasos"
1. "Primero cargo sus ramos y precios."
2. "Después probamos el cotizador."
3. "Luego agrego el seguimiento de pedidos."
4. "Si la parte interna queda terminada, intentaré incluir la página para sus clientes."
No uses meses rígidos, porcentajes ni una gráfica corporativa.

14. PARA EMPEZAR
Título: "Pueden enviarme lo que ya tengan"
Usa exactamente este texto y no agregues otro llamado a la acción:
"Para empezar a trabajar necesitaré las recetas de sus ramos, su cotizador de Excel y los demás datos,
fotografías o archivos que ya utilicen para sus ramos. Pueden enviarme todo conforme lo tengan y vayan
pudiendo. Yo me encargo de organizarlo y cargarlo al sistema."
No incluyas enlace, formulario, fecha límite, plantilla ni ofrecimiento de llenarlo juntos.

VERIFICACIÓN FINAL
- Se entiende sin presentador y fluye como un tour, no como lista de módulos.
- Explica catálogo, precios, modelos, recetas, tres formas de cotizar, personalización, compartir, historial,
  aceptación manual, pedido, entrega/recolección, anticipos, saldos, pagos y estados.
- No aparece una pantalla independiente de clientes.
- La actualización selectiva de precios se percibe como opción avanzada demostrativa.
- La página pública es condicional, tiene dos vías posibles y no crea pedidos confirmados automáticamente.
- Sólo la última lámina pide algo y conserva exactamente el texto aprobado.
- Todas las capturas y todos los ejemplos están etiquetados.
- HTML, PDF e imágenes para WhatsApp tienen el mismo contenido y orden.
```
