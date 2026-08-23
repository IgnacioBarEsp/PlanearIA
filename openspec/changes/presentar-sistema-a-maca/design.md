# Diseño narrativo del deck

## Contexto y restricciones

| Restricción | Decisión de diseño |
|---|---|
| Se envía por WhatsApp y se lee sin presentador | Cada lámina debe entenderse por sí sola y también enlazar naturalmente con la siguiente |
| Las lectoras no son técnicas | Se usan sus palabras: ramo, modelo, cotización, pedido, anticipo y entrega; se explican acciones, no arquitectura |
| La lectura ocurre en teléfono | Tipografía grande, párrafos cortos, una idea principal y como máximo dos capturas por lámina |
| Debe explicar el alcance completo sin saturar | Las funciones se agrupan por momento del trabajo, no se enumera una pantalla por función |
| La intención es cercana | La voz es principalmente la del residente: “estoy construyendo”, “voy a cargar”, “yo me encargo”; “el sistema les permitirá” se usa sólo cuando resulta más natural |
| Las capturas todavía no son producto | Todas llevan `Ejemplo · prototipo alfa` |
| No existe un proyecto formal de residencia | El change vive temporalmente en PlanearIA y no autoriza cambios al runtime de este repositorio |

## Decisión 1 · Un tour de principio a fin

La narrativa sigue un día reconocible para MACA: guardar lo que llevan sus ramos, cotizar de distintas
formas, compartir, recibir la aceptación, convertirla en pedido y darle seguimiento hasta la entrega. El
deck no se organiza como manual ni como inventario de pantallas.

La meta inicial era alrededor de catorce diapositivas. La versión aplicada usa quince: separa el problema
actual del mapa completo para que ambas ideas se entiendan a primera lectura. Lo que no se permite es
esconder comportamiento, amontonar capturas o reducir letra para cumplir un conteo.

## Decisión 2 · Arquitectura narrativa propuesta

| Lámina | Momento del tour | Contenido agrupado | Recurso final |
|---:|---|---|---|
| 1 | Bienvenida | Qué estoy construyendo para MACA y periodo de residencia | Portada floral, sin UI |
| 2 | Problema actual | Reducir la parte repetitiva de cotizar | Ilustración editorial de hoja de cálculo |
| 3 | Vista completa | Proceso explicado desde elegir o ajustar el ramo hasta registrar la aceptación, convertir en pedido y seguir entrega y pago; catálogo, cotización, pedido y seguimiento se rotulan como módulos y funciones | Diagrama editorial de cuatro momentos |
| 4 | Catálogo interno | Flores, insumos, precios, modelos y recetas | `01-catalogo-y-editor.png` completo |
| 5 | Crear o editar | Cambiar permanentemente foto, receta o precio de un modelo | Recorte limpio del editor en `01-catalogo-y-editor.png` |
| 6 | Tres formas de empezar | Desde modelo, desde cero o por presupuesto | `02-tres-formas-de-cotizar.png` |
| 7 | Trabajar con un presupuesto | Ver modelos cercanos o ajustar una opción especial | `03-ramo-especial.png` |
| 8 | Ajustar sin perder el original | Usar el cambio una vez o guardarlo como modelo nuevo | `04-personalizar-y-guardar-modelo.png` |
| 9 | Actualizar precios | Recalcular relacionados y mostrar una selección avanzada demostrativa | `05-actualizar-precios-opcion-avanzada.png` |
| 10 | Compartir y recordar | Botón genérico `Compartir`, contenido para el cliente e historial | `06-cotizacion-compartir-historial.png` |
| 11 | Cuando el cliente acepta | Aceptación manual, conversión y datos de entrega | `07-nuevo-pedido.png` |
| 12 | Dar seguimiento | Anticipo, saldo, pagos y estados | `08-pedido-pagos-estados.png` |
| 13 | Una posibilidad adicional | Página pública condicionada y dos rutas de solicitud | `09-catalogo-publico-futuro.png` |
| 14 | Cómo lo voy a construir | Cuatro pasos de entrega, sin fechas rígidas por mes | Recurso editorial, sin UI |
| 15 | Qué necesito para empezar | Única llamada a la acción, con el texto aprobado | Cierre de marca, sin formulario ni enlace |

La pantalla `clientes` se excluye. Los datos de cada persona aparecen sólo donde hacen falta: dentro de su
cotización o pedido. No se fuerza el uso de todas las capturas; una imagen que no añade comprensión queda
fuera aunque ya esté renderizada.

## Decisión 3 · Alcance funcional contado en lenguaje cotidiano

El deck debe dejar claras estas relaciones sin mostrar especificaciones técnicas:

```text
flores e insumos + precios
          ↓
modelos + lo que lleva cada ramo
          ↓
cotizar por modelo / desde cero / por presupuesto
          ↓
personalizar → compartir → conservar en historial
          ↓
aceptar manualmente → convertir a pedido
          ↓
fecha + entrega/recolección + anticipo/saldo + estado
```

Para cotizar por presupuesto se muestran dos ayudas: sugerir modelos cercanos y construir una composición
especial ajustando materiales. Para modificar un ramo se distinguen tres efectos: cambiar permanentemente
el modelo, cambiar sólo la cotización actual y guardar el resultado como un modelo nuevo reutilizable.

## Decisión 4 · Precios sin sobreprometer el prototipo

La actualización de precios se explica en una frase: al cambiar el precio de una flor o insumo, el sistema
puede recalcular los modelos que la utilizan. Una acción secundaria del tipo `Opciones avanzadas` permite
elegir cuáles modelos actualizar. Esa elección no ocupa una lámina propia ni se describe con reglas finas,
porque por ahora la pantalla es demostrativa, no funcional.

## Decisión 5 · Compartir sin atar el canal

La acción visible se llama `Compartir`. El deck explica que la cotización podrá enviarse donde la necesiten
y en el formato conveniente, sin prometer una integración específica. WhatsApp puede aparecer como ejemplo
del canal cotidiano, pero no como el único botón ni el único destino.

La respuesta del cliente sigue ocurriendo fuera del sistema. Mayra o Stephanie marcan la cotización como
aceptada y después eligen `Convertir en pedido`. En ese paso completan fecha, entrega o recolección,
anticipo, saldo y notas.

## Decisión 6 · Página pública condicionada

La página no se presenta como producto prometido ni como idea indefinida. Se usa exactamente esta intención:

> Si terminamos bien la parte interna, intentaré incluir también una página para que sus clientes vean el
> catálogo. Podemos hacer que la solicitud llegue por WhatsApp o que aparezca directamente dentro del
> sistema.

La ruta que entra al sistema crea una solicitud pendiente de revisión, no un pedido confirmado. La decisión
entre ambas vías se deja abierta para validación con MACA.

## Decisión 7 · Cierre único y flexible

La última diapositiva contiene una sola petición, sin formulario, plantilla obligatoria, fecha límite ni
ofrecimiento de captura conjunta:

> Para empezar a trabajar necesitaré las recetas de sus ramos, su cotizador de Excel y los demás datos,
> fotografías o archivos que ya utilicen para sus ramos. Pueden enviarme todo conforme lo tengan y vayan
> pudiendo. Yo me encargo de organizarlo y cargarlo al sistema.

## Sistema visual y anti-slop

- **Tarea:** comprender qué estoy construyendo, cómo acompaña el trabajo diario y qué pueden enviarme.
- **Zona de intensidad:** portada y cierre expresivos; recorrido central sobrio y legible.
- **Jerarquía:** una idea principal por lámina; las capturas respaldan el texto y nunca compiten con él.
- **Firma útil:** continuidad visual de un ramo desde su modelo hasta su pedido, no decoración tecnológica.
- **Patrón genérico refutado:** no se usa dashboard denso, bento ornamental, glass, halos, gradientes ni una
  colección de tarjetas sin relato.
- **Accesibilidad:** contraste AA, texto legible en una imagen final de 1248 × 2949 vista a 360 px, significado no
  dependiente sólo del color y capturas recortadas a la zona relevante.
- **Estados negativos:** no aplican al deck estático. Las capturas no se describen como UI funcional y llevan
  una marca persistente de alfa.
- **Datos:** ejemplos ficticios y consistentes; ningún nombre, teléfono o dirección real.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Se percibe como lista larga de funciones | Agrupar por momentos del trabajo y sostener un mismo caso de principio a fin |
| Una captura parece una promesa terminada | Marca uniforme de prototipo alfa y etiqueta `Ejemplo` en datos |
| La pantalla de clientes contradice el alcance | Excluirla de la selección y mostrar los datos dentro de cotización/pedido |
| La página pública se interpreta como compromiso | Condicionarla explícitamente al cierre de la parte interna y mostrar las dos vías como decisiones abiertas |
| La actualización selectiva de precios se toma como función lista | Tratarla como opción avanzada demostrativa y no profundizar |
| El deck no se termina de leer | Probar continuidad y legibilidad móvil; ajustar el conteo en lugar de encoger el contenido |
| La petición final suena como tarea escolar | Usar el texto aprobado: pueden enviar lo que ya tengan, cuando puedan; el residente lo organiza |

## Rollback

Restaurar el HTML, PDF e imágenes para WhatsApp anteriores desde su copia o historial y revertir los
documentos de este change mediante un PR normal. Las capturas de `prototipo alpha` no se borran ni se
renombran. No se elimina el change para ejecutar rollback y no hay datos o runtime que migrar.
