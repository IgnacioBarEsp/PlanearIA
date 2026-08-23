# Prototipo navegable en Google Stitch

Para los issues `maca-cotizador#34` (prototipo) y `#35` (prueba de usabilidad).

> **No confundir con `PROMPTS.md`.** Ese produce cinco imágenes estáticas para el deck que se envía por
> WhatsApp. Este produce un prototipo que Mayra y Stephanie **tocan** para descubrir qué no se entiende.

---

## ⚠️ La regla de costos cambia aquí

En el deck, ninguna imagen puede mostrar costos ni márgenes. **En el prototipo interno, sí — y deben
mostrarse.** Ellas son las dueñas y el sistema es suyo: una pantalla de cotización sin el costo no
representa lo que van a usar.

| Pantalla | ¿Muestra costos? |
|---|---|
| Todas las internas (P0, P6–P20) | **Sí.** Es lo que el sistema hace |
| P3 · Nota del cliente | No. Sale de la florería |
| P5 · Catálogo público | No. Lo ven clientes |

> 🚫 **Nunca metas una captura del prototipo interno en el deck.** Son dos materiales con reglas opuestas.

---

## Mapa de navegación

```
P0 · INICIO
├─ Nueva cotización
│  ├─ P1 · Elegir modelo ──────► P6 · Resultado
│  │                              ├─► P2 · Ajustar ──► vuelve a P6
│  │                              ├─► P7 · Compartir ──► P3 · Nota del cliente
│  │                              └─► P8 · Convertir en pedido ──► P12
│  ├─ P9 · Cotizar desde cero ──► P6
│  └─ P10 · Buscar por presupuesto ──► P1
├─ P4 · Pedidos del día
│  └─ P12 · Detalle del pedido
│     └─ P13 · Registrar pago
├─ P11 · Historial de cotizaciones ──► P6
└─ Mis cosas
   ├─ P14 · Mis modelos ──► P15 · Editar receta
   ├─ P16 · Flores e insumos ──► P17 · Actualizar precios
   └─ P18 · Quién usa el sistema ──► P20 · Vista de la ayudante
```

`P19 · Primera vez` es el estado vacío: se enseña aparte, no cuelga del flujo.

## Orden de generación

Stitch cobra por generación. Genera en este orden y detente cuando tengas lo que necesitas.

| Prioridad | Pantallas | Para qué |
|---|---|---|
| **1 · Indispensables** | P0, P6, P7, P8, P12, P13 | El camino completo: cotizar → compartir → pedido → cobro |
| **2 · Muy valiosas** | P14, P15, P16, P17 | Que carguen sus datos y actualicen precios: lo que más van a usar |
| **3 · Reveladoras** | P9, P10, P11, P19 | Descubren malentendidos que el camino feliz esconde |
| **4 · Si sobra** | P18, P20 | Justifican el módulo de roles ante el jurado |

## Cómo dejarlo navegable

1. Genera cada pantalla con el mismo bloque de **Contexto** para que compartan estilo.
2. Nombra cada una con su código (`P06-resultado`) para no perderte.
3. Enlaza los botones siguiendo el mapa de arriba. Si el enlazado dentro de Stitch te queda corto,
   exporta a Figma y arma ahí las conexiones: lo que importa es que puedan tocar y avanzar.
4. Compárteles **un solo enlace**. Nada de mandar veinte imágenes sueltas por WhatsApp.

---

## Contexto — pégalo al inicio de cada sesión

```
Diseña la interfaz de una aplicación web de uso interno para una florería mexicana llamada
MACA D'tallitos, en Zamora, Michoacán. La usan dos socias desde el celular, de pie en el
mostrador, muchas veces con las manos ocupadas y con un cliente esperando.

Estilo visual:
- Paleta: azul grisáceo #4A6D8C como principal, azul profundo #2E4A63, dorado #C9A227 como
  acento, fondo crema #F7F3EC, superficies #FFFDF9, verde salvia #7A8B6F para flores,
  texto #4A4A4A. Rojo suave #B4534B solo para avisos.
- Titulares en serif editorial elegante. Interfaz en sans serif muy legible.
- Elegante, cálido y artesanal. Cero estética de software corporativo o dashboard financiero.
- Bordes redondeados de 12 px. Sombras casi imperceptibles.
- PROHIBIDO: glassmorphism, blur, gradientes decorativos, halos, íconos sin etiqueta,
  sombras difusas grandes, modo oscuro.

Reglas obligatorias:
- Botones grandes, cómodos de usar con el pulgar de una sola mano.
- Tipografía mínima de 16 px. La información importante nunca por debajo de 18 px.
- Todo el texto en español de México.
- Cada icono lleva su etiqueta escrita al lado.
- En la esquina superior derecha, una etiqueta discreta con el texto "Propuesta preliminar"
  sobre fondo dorado suave.
- Los importes en pesos mexicanos con separador de miles.

Formato: pantalla vertical de celular, 390 x 844.
```

---

# BLOQUE 1 · Indispensables

## P0 · Inicio

```
Pantalla de inicio de la aplicación.

Arriba, un saludo en serif: "Buenos días, Mayra" y debajo, en letra pequeña gris,
"Martes 14 de octubre".

Debajo, un botón grande dorado de ancho completo, con altura generosa, que dice
"Cotizar un ramo". Es el elemento más prominente de la pantalla.

Debajo, una fila de tres tarjetas pequeñas con un número grande y una etiqueta:
- "4" · "entregas hoy"
- "2" · "por cobrar"
- "7" · "cotizaciones esta semana"

Luego un encabezado en serif "Lo que sigue hoy" y dos tarjetas de pedido compactas:
cada una con el nombre del ramo, la hora del turno y una pastilla de estado.

Al fondo, una barra de navegación con cuatro destinos, cada uno con icono Y etiqueta escrita:
"Inicio", "Pedidos", "Historial", "Mis cosas". "Inicio" está activo en azul.
```

## P6 · Resultado de la cotización

```
Pantalla titulada "Cotización" con flecha de regresar.

Arriba, una tarjeta crema con el nombre "Ramo Cynthia" en serif grande y una foto pequeña
redonda a la derecha.

Debajo, un encabezado pequeño "Lo que lleva" y una lista limpia de renglones, cada uno con
el nombre a la izquierda y la cantidad a la derecha:
- Rosa · 48
- Surtido · 2
- Papel · 5 pliegos
- Listón · 1
- Sticker · 1

Una línea divisoria delgada.

Después, un bloque de resumen con tres renglones, el último destacado:
- "Costo de materiales" ......... "$594.50"   (en gris, letra normal)
- "Ganancia aplicada" ........... "2.6"       (en gris, letra normal)
- "PRECIO DE VENTA" ............. "$1,250"    (en serif grande dorado, sobre fondo crema)

Debajo, tres pastillas pequeñas seleccionables en fila: "Normal" (activa),
"Cliente frecuente", "Mayoreo". Al lado, en letra pequeña gris: "cambia el precio final".

Al fondo, dos botones lado a lado:
- Izquierda, contorneado azul: "Ajustar el ramo"
- Derecha, sólido azul: "Compartir"

Y debajo, un botón de texto sin fondo, centrado: "Convertir en pedido".
```

## P7 · Compartir la cotización

```
Una hoja que sube desde abajo cubriendo el 60 por ciento de la pantalla, con las esquinas
superiores redondeadas y fondo #FFFDF9. Detrás se alcanza a ver la pantalla anterior atenuada.

Arriba, una barrita gris corta y centrada, de las que indican que se puede arrastrar.

Título en serif: "Compartir con el cliente".

Debajo, en un recuadro crema con borde delgado, una vista previa reducida de la nota:
"MACA · Cotización 0142 · Ramo Cynthia · $1,250".

Luego, en letra pequeña gris con un pequeño candado al lado:
"El cliente solo ve el total. Sus costos y su ganancia no salen de aquí."

Después, tres opciones en lista, cada una con icono Y etiqueta:
- "Enviar por WhatsApp"
- "Guardar como imagen"
- "Copiar el texto"

Al fondo, un botón de texto centrado: "Cancelar".
```

## P8 · Convertir en pedido

```
Pantalla titulada "Nuevo pedido" con flecha de regresar.

Arriba, una tarjeta compacta que resume la cotización: "Ramo Cynthia · $1,250", con un
pequeño enlace "Ver detalle" a la derecha.

Debajo, un formulario con campos grandes y bien separados, cada uno con su etiqueta arriba:

- "¿Para quién es?" — campo de texto con el ejemplo tenue "Nombre de quien recibe"
- "¿Cuándo?" — campo de fecha mostrando "Miércoles 15 de octubre"
- "¿A qué hora?" — dos pastillas grandes lado a lado: "Matutino" (seleccionada, azul) y
  "Vespertino"
- "¿Cómo lo recibe?" — dos pastillas grandes: "Envío a domicilio" (seleccionada) y
  "Pasa a recoger"
- "Dirección" — campo de texto de dos renglones
- "¿Dejó anticipo?" — campo con el símbolo de pesos mostrando "500"

Debajo del último campo, en un recuadro crema, en serif mediano:
"Resta por cobrar: $750"

Al fondo, botón azul de ancho completo: "Guardar pedido".
```

## P12 · Detalle del pedido

```
Pantalla titulada "Pedido 0142" con flecha de regresar y, a la derecha, un icono de lápiz
con la etiqueta "Editar".

Arriba, una franja de estado ocupando el ancho, fondo dorado suave, con el texto
"Con anticipo" y a la derecha, en letra pequeña, "hace 2 días".

Debajo, la foto del ramo en horizontal con esquinas redondeadas.

Luego, bloques de información separados por líneas delgadas, cada uno con su etiqueta
pequeña en gris arriba y el dato en tamaño normal debajo:
- "Ramo" · "Cynthia · 48 rosas, 2 surtidos"
- "Para" · "Laura Méndez"
- "Entrega" · "Miércoles 15 de octubre · turno matutino"
- "Dirección" · "Amado Nervo Poniente 79, Centro"

Después, un bloque de dinero con fondo crema:
- "Total" ............ "$1,250"
- "Anticipo" ......... "$500"
- "Resta" ............ "$750"   (en serif dorado, más grande)

Debajo, una línea de tiempo vertical simple con cuatro puntos y su etiqueta. Los dos primeros
en dorado sólido, los dos últimos en gris hueco:
"Cotizado" · "Con anticipo" · "En proceso" · "Entregado"

Al fondo, dos botones: contorneado "Registrar pago" y sólido azul "Marcar en proceso".
```

## P13 · Registrar pago

```
Una hoja que sube desde abajo cubriendo la mitad de la pantalla, esquinas superiores
redondeadas, fondo #FFFDF9.

Título en serif: "Registrar pago".
Debajo, en letra pequeña gris: "Pedido 0142 · Laura Méndez".

Un recuadro crema centrado que dice "Resta por cobrar" en pequeño y debajo "$750" en serif
grande dorado.

Luego, la etiqueta "¿Cuánto recibió?" y un campo numérico muy grande, centrado, mostrando
"750" con el símbolo de pesos al frente.

Debajo, dos pastillas de atajo: "La mitad" y "Todo lo que resta" (esta última seleccionada).

Después, la etiqueta "¿Cómo pagó?" y tres pastillas grandes en fila, cada una con icono Y
etiqueta: "Efectivo" (seleccionada), "Transferencia", "Tarjeta".

Al fondo, botón azul de ancho completo: "Guardar pago".
```

---

# BLOQUE 2 · Sus datos

## P14 · Mis modelos de ramo

```
Pantalla titulada "Mis modelos" con un campo de búsqueda debajo.

A la derecha del título, en letra pequeña gris: "12 modelos".

Lista vertical de tarjetas horizontales. Cada tarjeta tiene:
- A la izquierda, una foto cuadrada del ramo con esquinas redondeadas.
- Al centro, el nombre en serif mediano y debajo, en letra pequeña gris, la composición
  resumida: "48 rosas · 2 surtidos".
- A la derecha, el precio en dorado y una flecha pequeña.

Muestra seis tarjetas: Cynthia, Alexia, Aurora, Valentina, Renata, Camila.

Al fondo, un botón circular dorado con el signo de más y la etiqueta "Nuevo modelo".
La barra de navegación de cuatro destinos está presente, con "Mis cosas" activo.
```

## P15 · Editar la receta de un modelo

```
Pantalla titulada "Ramo Cynthia" con flecha de regresar y a la derecha el texto "Guardar"
en azul.

Arriba, la foto del ramo con un botón pequeño encima que dice "Cambiar foto".

Debajo, un campo de texto con la etiqueta "Nombre" y el valor "Cynthia".

Luego un encabezado en serif "Qué lleva este ramo" y, a la derecha, en letra pequeña azul,
"+ Agregar".

Lista de renglones. Cada uno tiene el nombre de la flor o insumo a la izquierda, un control
de cantidad a la derecha con botones redondos de menos y más, y un pequeño icono de bote de
basura al final:
- Rosa · 48
- Surtido · 2
- Papel · 5
- Listón · 1
- Sticker · 1

Debajo de la lista, en letra pequeña gris con un pequeño signo de información:
"Los surtidos y follajes se pueden poner en medios: 0.5, 1.5"

Al fondo, en un recuadro crema fijo:
- "Costo de materiales" ... "$594.50"
- "Precio de venta" ....... "$1,250"   (en serif dorado)
```

## P16 · Flores e insumos

```
Pantalla titulada "Flores e insumos".

Debajo del título, dos pastillas de filtro: "Flores" (activa, verde salvia) e "Insumos".

A la derecha, un botón pequeño contorneado con el texto "Actualizar precios".

Lista de renglones, cada uno con:
- A la izquierda, el nombre en tamaño normal y debajo, en letra pequeña gris, la presentación:
  "paquete de 24".
- A la derecha, el precio del paquete en tamaño normal y debajo, en letra pequeña gris,
  "$8.33 por pieza".

Renglones: Rosa, Gerbera, Tulipán, Mini gerbera, Hortensia, Rosa inglesa, Clavel, Girasol.

Dos de ellos, Rosa y Girasol, llevan un puntito dorado al lado del nombre y, en letra muy
pequeña dorada, "actualizado hoy".

Los renglones sin conteo de piezas, como Surtido y Follaje, muestran en gris
"se usa por paquete" en lugar del precio por pieza.

Al fondo, un botón circular dorado con el signo de más y la etiqueta "Agregar flor".
```

## P17 · Actualizar precios rápido

```
Pantalla titulada "Actualizar precios".

Debajo del título, en un recuadro crema, en letra normal:
"Cambien lo que subió esta semana. Todos sus ramos se recalculan solos."

Lista compacta pensada para capturar rápido. Cada renglón tiene:
- El nombre de la flor a la izquierda.
- A la derecha, un campo numérico editable con el precio actual dentro, con borde visible
  para que se note que se puede escribir.
- Debajo del campo, en letra muy pequeña gris, el precio anterior tachado cuando cambió.

Renglones: Rosa 200, Gerbera 150, Tulipán 800, Mini gerbera 150, Hortensia 60,
Rosa inglesa 650, Clavel 80, Girasol 220.

El renglón de Girasol tiene el campo resaltado en dorado y debajo, tachado, "200".

Arriba de la lista, a la derecha, en letra pequeña dorada: "1 cambio sin guardar".

Al fondo, una barra fija con el texto pequeño "Se actualizarán 4 modelos" a la izquierda y
un botón azul "Guardar cambios" a la derecha.
```

---

# BLOQUE 3 · Las que revelan problemas

## P9 · Cotizar desde cero

```
Pantalla titulada "Cotización libre" con flecha de regresar.

Arriba, en letra pequeña gris: "Para cuando el cliente quiere algo que no está en sus modelos".

Un campo de búsqueda grande con el texto tenue "Buscar flor o insumo".

Debajo, un encabezado pequeño "Lo que va llevando" y una lista de renglones con nombre a la
izquierda, control de cantidad al centro y el subtotal a la derecha:
- Girasol · 12 · "$240.00"
- Follaje · 0.5 · "$70.00"
- Papel · 3 · "$18.00"

Debajo de la lista, un botón de texto azul con signo de más: "Agregar otra cosa".

Al fondo, barra fija con:
- "Costo de materiales" ... "$328.00" en gris pequeño
- "Precio de venta" ....... "$850" en serif dorado grande
- Botón azul de ancho completo: "Guardar cotización"
```

## P10 · Buscar por presupuesto

```
Pantalla titulada "¿De cuánto lo quiere?".

Arriba, centrado y con aire alrededor, un campo numérico muy grande con el símbolo de pesos
mostrando "800".

Debajo, en letra pequeña gris centrada: "Le mostramos qué alcanza con ese presupuesto".

Luego, un encabezado en serif "Le alcanza para" y una lista de tres tarjetas horizontales.
Cada una con foto cuadrada, nombre en serif, precio en dorado y una pastilla pequeña de
cercanía:
- "Aurora" · "$780" · pastilla verde salvia "casi exacto"
- "Renata" · "$850" · pastilla dorada "$50 más"
- "Camila" · "$720" · pastilla gris "$80 menos"

Debajo, separado por una línea, un encabezado más pequeño "O ajustamos uno" y una tarjeta
que dice: "Cynthia con 30 rosas en vez de 48" y a la derecha "$810".

Al fondo, la barra de navegación.
```

## P11 · Historial de cotizaciones

```
Pantalla titulada "Historial" con campo de búsqueda debajo.

Tres pastillas de filtro en fila: "Todas" (activa), "Se vendieron", "No se vendieron".

Lista agrupada por fecha, con encabezados de sección en letra pequeña gris: "Hoy", "Ayer",
"Semana pasada".

Cada renglón tiene:
- A la izquierda, el nombre del ramo en tamaño normal y debajo, en letra pequeña gris, el
  nombre del cliente.
- A la derecha, el precio y debajo una pastilla muy pequeña de estado: "Vendida" en verde
  salvia, "Sin respuesta" en gris, "Es pedido" en dorado.

Muestra dos renglones en "Hoy", tres en "Ayer" y dos en "Semana pasada".

Arriba de la lista, en un recuadro crema discreto y en letra pequeña:
"De cada 10 cotizaciones que mandan, 6 se convierten en venta."
```

## P19 · Primera vez

```
Pantalla de estado vacío, la que verían el primer día.

Centrada verticalmente, con mucho aire alrededor.

Una ilustración sencilla de línea, en azul grisáceo, de un ramo dentro de un recuadro
punteado. Nada de fotografías ni de ilustraciones cargadas.

Debajo, en serif mediano centrado: "Todavía no hay ramos guardados".

Debajo, en letra normal gris centrada, máximo dos renglones:
"Cuando agreguen sus modelos, cotizar será cuestión de elegir uno."

Debajo, un botón dorado que dice "Agregar mi primer ramo".

Y más abajo, un botón de texto sin fondo: "Traerlos de la hoja de cálculo".

Al fondo, la barra de navegación con los otros destinos en gris tenue.
```

---

# BLOQUE 4 · Si sobra tiempo

## P18 · Quién usa el sistema

```
Pantalla titulada "Quién usa el sistema".

Dos tarjetas grandes, una debajo de la otra, con buen espacio entre ellas.

Primera tarjeta, con un borde dorado delgado:
- Un círculo con las iniciales "MC" en dorado.
- "Mayra Cárdenas" en serif.
- Debajo, una pastilla dorada: "Dueña".
- Luego, tres renglones con palomita: "Ve los costos", "Cambia los precios",
  "Da descuentos".

Segunda tarjeta, borde gris:
- Un círculo con iniciales "AL".
- "Ana López" en serif.
- Debajo, una pastilla gris: "Ayudante".
- Tres renglones: dos con palomita, "Cotiza ramos" y "Registra pedidos", y uno con una equis
  en gris: "No ve costos ni ganancias".

Al fondo, un botón contorneado de ancho completo: "Invitar a alguien más".
```

## P20 · Vista de la ayudante

```
La misma pantalla de resultado de cotización que P6, pero con permisos reducidos.

Idéntica en estructura y estilo, con dos diferencias:

1. El bloque de resumen ya no tiene tres renglones sino uno solo:
   "PRECIO DE VENTA" ... "$1,250" en serif grande dorado.
   Los renglones de costo de materiales y ganancia no existen. No están tachados ni
   ocultos tras un candado: simplemente no aparecen.

2. Arriba, junto al título, una pastilla pequeña gris que dice "Ayudante".

Las pastillas de "Normal / Cliente frecuente / Mayoreo" siguen presentes y funcionales.
Los botones del fondo son los mismos.
```

---

## Guion de la prueba con Mayra y Stephanie

No les preguntes si les gusta. Dales tareas y **cállate mientras las intentan**.

1. «Un cliente quiere el ramo Cynthia. Cotícenselo.» → P0 · P1 · P6
2. «Ahora lo quiere con 30 rosas en vez de 48.» → P2 · P6
3. «Mándenle la cotización.» → P7 · P3
4. «Lo aceptó y dejó $500. Háganlo pedido.» → P8 · P12
5. «Vino a pagar lo que restaba.» → P13
6. «Subió el girasol a $220. Actualícenlo.» → P16 · P17
7. «Quieren agregar un ramo nuevo.» → P14 · P15
8. «Alguien quiere algo de $800.» → P10

**Qué anotar en cada tarea:** dónde dudaron, qué tocaron primero, qué palabra no entendieron,
cuántos intentos les tomó. Eso es la evidencia del issue `#35`, y vale más que cualquier
opinión que te den al final.

## Los datos de ejemplo son inventados

Los nombres de modelos —Alexia, Aurora, Valentina, Renata, Camila—, los precios de venta,
«Laura Méndez» y «Ana López» son ficticios. Los únicos datos reales son el ramo Cynthia y los
precios de flores e insumos que se leyeron de su video.

Cuando lleguen las recetas verdaderas, vale la pena regenerar P1, P14 y P10 con sus nombres
reales: reconocer sus propios ramos cambia por completo cómo se prueba un prototipo.
