# Enlazar el prototipo sin renombrar las pantallas

## La cuenta correcta

No son 20 sino **21**: van de P0 a P20, y ese rango incluye el cero.

| Archivo | Pantallas | Códigos |
|---|---:|---|
| `PROMPTS.md` (deck) | 5 | P1 P2 P3 P4 P5 |
| `PROTOTIPO.md` | 16 | P0 · P6 a P20 |
| **Total** | **21** | |

Generaste las 16 de `PROTOTIPO.md`. **Te faltan las 5 de `PROMPTS.md`** — pero no todas hacen falta para
el prototipo:

| Pantalla | ¿La necesitas para el prototipo? |
|---|---|
| **P1 · Elegir modelo** | ✅ Sí. Es el paso 2 del flujo principal |
| **P2 · Ajustar el ramo** | ✅ Sí. Es la tarea 2 de la prueba |
| **P4 · Pedidos del día** | ✅ Sí. Cuelga de la barra de navegación |
| P3 · Nota del cliente | ⭕ Útil. No es pantalla de app: es la tarjeta que se manda por WhatsApp |
| P5 · Catálogo público | No forma parte del flujo interno. Es una posibilidad condicionada a terminar esa parte y puede enviar la solicitud por WhatsApp o al sistema para confirmación |

**Si ya las generaste para el deck, reutilízalas.** Si no, genéralas con los prompts de `PROMPTS.md` antes
de enlazar. Sin P1, P2 y P4 el prototipo no se puede recorrer.

---

## ⚠️ Cuatro pantallas quedaron huérfanas — error mío

Al trazar el enlazado me di cuenta de que **P9, P10, P16 y P18 no tienen ningún botón que lleve a ellas**.
Las diseñé como destinos pero no puse la puerta de entrada en las pantallas que las anteceden.

Se arregla regenerando dos pantallas. Son dos generaciones y destraba las cuatro.

### Parche 1 · Regenera P1 con dos accesos más

```
Toma la pantalla "Nueva cotización" y agrégale, justo debajo del campo de búsqueda
"Buscar modelo de ramo", una fila de tres pastillas seleccionables:

- "Mis modelos" (activa, azul)
- "Desde cero"
- "Por presupuesto"

Todo lo demás se queda exactamente igual: la cuadrícula de tarjetas de ramos, la tarjeta
Cynthia seleccionada con borde dorado, y la barra inferior con el precio y el botón
"Ver cotización".
```

### Parche 2 · Regenera P14 con las otras secciones

```
Toma la pantalla "Mis modelos" y cambia el título por "Mis cosas".

Debajo del título, agrega una fila de tres pastillas seleccionables:

- "Modelos" (activa, azul)
- "Flores e insumos"
- "Quién usa"

Debajo va el campo de búsqueda y la lista de tarjetas de ramos, igual que ya está.
Conserva el botón circular dorado con el signo de más y la barra de navegación.
```

---

## Prompt para armar el prototipo

> Selecciona todas las pantallas en Stitch y pega esto. Identifica cada pantalla **por el texto que se ve
> en ella**, no por su nombre de archivo — por eso no necesitas renombrar nada.

```
Quiero convertir estas pantallas en un prototipo navegable que dos dueñas de una florería
puedan recorrer tocando la pantalla de su celular. No cambies el diseño de ninguna pantalla:
solamente conéctalas entre sí.

CÓMO IDENTIFICAR CADA PANTALLA

No uso nombres de archivo. Identifica cada pantalla por el texto que aparece en ella:

- INICIO: dice "Buenos días, Mayra" y tiene un botón dorado "Cotizar un ramo".
- ELEGIR MODELO: se titula "Nueva cotización" y tiene tarjetas de ramos con fotos.
- AJUSTAR: se titula "Ramo Cynthia" y dice "Personalizar este ramo", con botones de más y
  menos y un botón "Guardar cambios" abajo.
- RESULTADO: se titula "Cotización" y muestra tres renglones de resumen, uno de ellos dice
  "Ganancia aplicada".
- COMPARTIR: es una hoja que sube desde abajo y se titula "Compartir con el cliente".
- NOTA: es una tarjeta elegante con marco dorado que dice "MACA" arriba y "Cotización N.º 0142".
  No tiene barra de navegación.
- NUEVO PEDIDO: se titula "Nuevo pedido" y tiene un formulario con "¿Para quién es?".
- PEDIDOS DEL DÍA: se titula "Hoy · 14 de octubre" y tiene secciones de turno matutino y
  vespertino.
- DETALLE DEL PEDIDO: se titula "Pedido 0142" y tiene una línea de tiempo con cuatro puntos.
- REGISTRAR PAGO: es una hoja que sube desde abajo y se titula "Registrar pago".
- COTIZAR LIBRE: se titula "Cotización libre".
- POR PRESUPUESTO: se titula "¿De cuánto lo quiere?".
- HISTORIAL: se titula "Historial" y tiene pastillas "Todas", "Se vendieron", "No se vendieron".
- MIS COSAS: se titula "Mis cosas" y tiene pastillas "Modelos", "Flores e insumos", "Quién usa".
- EDITAR RECETA: se titula "Ramo Cynthia" y dice "Qué lleva este ramo", con iconos de bote de
  basura y un botón "Cambiar foto".
- FLORES E INSUMOS: se titula "Flores e insumos".
- ACTUALIZAR PRECIOS: se titula "Actualizar precios".
- QUIÉN USA: se titula "Quién usa el sistema" y muestra dos tarjetas de persona.
- PRIMERA VEZ: dice "Todavía no hay ramos guardados".
- VISTA AYUDANTE: se titula "Cotización" pero solo tiene un renglón de resumen y una pastilla
  gris que dice "Ayudante".

OJO CON DOS PARES QUE SE PARECEN:
- Hay dos pantallas tituladas "Ramo Cynthia". La de AJUSTAR dice "Personalizar este ramo".
  La de EDITAR RECETA dice "Qué lleva este ramo" y tiene botes de basura.
- Hay dos pantallas tituladas "Cotización". La de RESULTADO tiene tres renglones e incluye
  "Ganancia aplicada". La de VISTA AYUDANTE tiene un solo renglón y la pastilla "Ayudante".

PANTALLA DE INICIO DEL PROTOTIPO
El recorrido empieza en INICIO.

CONEXIONES

Desde INICIO:
- El botón dorado "Cotizar un ramo" abre ELEGIR MODELO.
- Las tarjetas de "Lo que sigue hoy" abren DETALLE DEL PEDIDO.
- En la barra de abajo: "Pedidos" abre PEDIDOS DEL DÍA, "Historial" abre HISTORIAL,
  "Mis cosas" abre MIS COSAS.

Desde ELEGIR MODELO:
- Cualquier tarjeta de ramo y el botón "Ver cotización" abren RESULTADO.
- La pastilla "Desde cero" abre COTIZAR LIBRE.
- La pastilla "Por presupuesto" abre POR PRESUPUESTO.
- La flecha de regresar vuelve a INICIO.

Desde RESULTADO:
- "Ajustar el ramo" abre AJUSTAR.
- "Compartir" abre COMPARTIR.
- "Convertir en pedido" abre NUEVO PEDIDO.
- La flecha de regresar vuelve a ELEGIR MODELO.

Desde AJUSTAR:
- "Guardar cambios" vuelve a RESULTADO.
- La flecha de regresar vuelve a RESULTADO.

Desde COMPARTIR:
- "Enviar por WhatsApp" abre NOTA.
- "Guardar como imagen" abre NOTA.
- "Cancelar" vuelve a RESULTADO.

Desde NOTA:
- Tocar cualquier parte vuelve a RESULTADO.

Desde NUEVO PEDIDO:
- "Guardar pedido" abre DETALLE DEL PEDIDO.
- La flecha de regresar vuelve a RESULTADO.

Desde PEDIDOS DEL DÍA:
- Cualquier tarjeta de pedido abre DETALLE DEL PEDIDO.
- El botón redondo "Nuevo pedido" abre ELEGIR MODELO.
- En la barra de abajo: "Inicio" abre INICIO, "Historial" abre HISTORIAL, "Mis cosas" abre
  MIS COSAS.

Desde DETALLE DEL PEDIDO:
- "Registrar pago" abre REGISTRAR PAGO.
- La flecha de regresar vuelve a PEDIDOS DEL DÍA.

Desde REGISTRAR PAGO:
- "Guardar pago" vuelve a DETALLE DEL PEDIDO.

Desde COTIZAR LIBRE:
- "Guardar cotización" abre RESULTADO.
- La flecha de regresar vuelve a ELEGIR MODELO.

Desde POR PRESUPUESTO:
- Cualquier tarjeta de ramo abre RESULTADO.
- En la barra de abajo: "Inicio" abre INICIO.

Desde HISTORIAL:
- Cualquier renglón abre RESULTADO.
- En la barra de abajo: "Inicio" abre INICIO, "Pedidos" abre PEDIDOS DEL DÍA, "Mis cosas"
  abre MIS COSAS.

Desde MIS COSAS:
- Cualquier tarjeta de ramo y el botón redondo "Nuevo modelo" abren EDITAR RECETA.
- La pastilla "Flores e insumos" abre FLORES E INSUMOS.
- La pastilla "Quién usa" abre QUIÉN USA.
- En la barra de abajo: "Inicio" abre INICIO, "Pedidos" abre PEDIDOS DEL DÍA, "Historial"
  abre HISTORIAL.

Desde EDITAR RECETA:
- "Guardar" y la flecha de regresar vuelven a MIS COSAS.

Desde FLORES E INSUMOS:
- El botón "Actualizar precios" abre ACTUALIZAR PRECIOS.
- La flecha de regresar vuelve a MIS COSAS.

Desde ACTUALIZAR PRECIOS:
- "Guardar cambios" vuelve a FLORES E INSUMOS.
- La flecha de regresar vuelve a FLORES E INSUMOS.

Desde QUIÉN USA:
- La flecha de regresar vuelve a MIS COSAS.

FUERA DEL RECORRIDO
PRIMERA VEZ y VISTA AYUDANTE no se conectan a nada. Se muestran por separado para explicar
cómo se ve el sistema vacío y qué ve alguien que no es dueña.

REGLAS
- No modifiques el diseño, los colores, los textos ni la distribución de ninguna pantalla.
- Si un botón que menciono no existe en una pantalla, ignóralo y sigue con los demás.
- Todas las transiciones son simples y rápidas. Las hojas que suben desde abajo entran
  deslizándose hacia arriba.
```

---

## Comprobación antes de enseñárselo

Recorre tú mismo las 8 tareas de la prueba antes de compartir el enlace. Si una se atora, arréglala; no
descubras el hueco con Mayra y Stephanie enfrente.

| # | Tarea | Ruta que debe funcionar |
|---|---|---|
| 1 | Cotizar el ramo Cynthia | INICIO → ELEGIR MODELO → RESULTADO |
| 2 | Cambiarlo a 30 rosas | RESULTADO → AJUSTAR → RESULTADO |
| 3 | Mandárselo al cliente | RESULTADO → COMPARTIR → NOTA |
| 4 | Convertirlo en pedido | RESULTADO → NUEVO PEDIDO → DETALLE |
| 5 | Cobrar lo que restaba | DETALLE → REGISTRAR PAGO → DETALLE |
| 6 | Actualizar el precio del girasol | INICIO → MIS COSAS → FLORES E INSUMOS → ACTUALIZAR PRECIOS |
| 7 | Agregar un ramo nuevo | INICIO → MIS COSAS → EDITAR RECETA |
| 8 | Ver qué alcanza con $800 | ELEGIR MODELO → POR PRESUPUESTO → RESULTADO |

Si las ocho se recorren sin atorarse, el prototipo está listo.
