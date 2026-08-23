## Contexto

La residencia profesional para MACA D'tallitos ya cuenta con una presentación en HTML, PDF e imágenes para
WhatsApp, pero el deck conserva supuestos que ya no representan la intención final. Mayra y Stephanie lo
leerán solas desde el celular: no habrá un presentador que corrija una frase ambigua o complete una función
omitida.

El material actual pide llenar una hoja de recetas o hacerlo juntos, presenta la página pública como una idea
no prometida, usa sólo una parte de las pantallas alfa disponibles y limita el recorrido a doce láminas. La
entrevista final aclaró que la presentación debe ser un tour cercano y completo, y que MACA puede enviar sus
archivos como ya los tenga y conforme vaya pudiendo.

El change sigue alojado temporalmente en PlanearIA porque el proyecto formal de la residencia aún no existe.
No modifica código, runtime, datos ni build de PlanearIA.

## Historia Original

Como residente responsable del sistema de MACA D'tallitos, quiero mostrar a Mayra y Stephanie una
representación visual de lo que estoy construyendo para que comprendan qué recibirán, confíen en el proyecto
y me compartan la información necesaria para cargar sus ramos.

La primera versión propuso cinco pantallas y un deck autoexplicativo de doce diapositivas. Su única llamada a
la acción pedía llenar una hoja de recetas y ofrecía capturarlas juntos si lo preferían.

## Enriquecida

### Resultado esperado

Revisar el deck existente para convertirlo en un tour cálido, autoexplicativo y principalmente en primera
persona, preparado para WhatsApp y legible en teléfono. La versión final tiene quince diapositivas: el
problema actual y el mapa completo quedan separados para conservar claridad, cobertura y ritmo.

### Alcance que debe explicar

- Catálogo interno de flores, insumos y precios; modelos con fotografía y lo que lleva cada ramo.
- Tres decisiones distintas: editar permanentemente un modelo, personalizar sólo una cotización o guardar el
  ramo especial como un modelo nuevo reutilizable.
- Tres formas de cotizar: elegir un modelo, comenzar desde cero o partir del presupuesto del cliente.
- En la cotización por presupuesto: mostrar modelos cercanos y ayudar a armar una opción especial ajustando
  flores y materiales.
- Acción genérica `Compartir`, formatos o destinos flexibles e historial de cotizaciones.
- La aceptación ocurre fuera del sistema y MACA la registra manualmente; después elige `Convertir en pedido`.
- El pedido reúne fecha, entrega o recolección, datos del cliente, anticipo, saldo, notas, pagos y estados.
- Los datos del cliente viven dentro de la cotización o pedido; no existe un módulo separado de clientes.
- Al actualizar un precio se pueden recalcular los modelos relacionados. Una opción avanzada y discreta
  permitirá elegir cuáles; se mostrará sólo como comportamiento demostrativo sujeto a validación.

### Página para clientes

La promesa aprobada es:

> Si terminamos bien la parte interna, intentaré incluir también una página para que sus clientes vean su
> catálogo. Podemos hacer que la solicitud llegue por WhatsApp o que aparezca directamente dentro del
> sistema.

La solicitud que entra al sistema queda pendiente de confirmación; no se convierte automáticamente en un
pedido confirmado. Las dos vías son posibilidades por elegir, no funcionalidad ya construida.

### Narrativa y fidelidad

- El deck se organiza por momentos del trabajo y agrupa funciones para no saturar.
- La voz es principalmente `estoy construyendo`, `voy a cargar` y `yo me encargo`; se usa `el sistema les
  permitirá` cuando resulte más natural.
- Se reutilizan sólo las pantallas necesarias de `prototipo alpha`, incluida la cobertura de catálogo,
  cotizaciones, historial, pedidos y pagos. La pantalla `clientes` queda excluida.
- Cada captura y dato ilustrativo muestra `Ejemplo · prototipo alfa`.
- No habrá una lámina formal de exclusiones ni tono contractual.

### Recorrido final

1. Portada.
2. Problema actual y beneficio principal.
3. Vista completa del proceso, desde elegir o ajustar el ramo hasta la entrega y el pago, con catálogo,
   cotización, pedido y seguimiento rotulados como módulos y funciones del sistema.
4. Flores, insumos, precios y modelos.
5. Crear o editar permanentemente la receta de un modelo.
6. Tres formas de cotizar.
7. Dos caminos al empezar por presupuesto.
8. Ajustar sin cambiar el original o guardar un modelo nuevo.
9. Actualizar precios y selección avanzada demostrativa.
10. Compartir e historial.
11. Aceptar manualmente y convertir en pedido.
12. Entrega, anticipo, saldo, pagos y estados.
13. Página pública condicionada y sus dos vías.
14. Entrega del sistema en cuatro pasos.
15. Única petición para comenzar.

### Criterios de aceptación

- [ ] Se entiende sin presentador al leerlo en un teléfono desde WhatsApp.
- [ ] El guion cubre todo el alcance interno de forma agrupada y conserva un recorrido continuo.
- [ ] No existe límite rígido de doce; la extensión final se decide por legibilidad y comprensión.
- [ ] No aparece un módulo de clientes ni una pantalla de exclusiones.
- [ ] El botón principal de salida se llama `Compartir` y no ata el sistema a un canal o formato.
- [ ] La cotización aceptada se marca manualmente antes de convertirse en pedido.
- [ ] La actualización selectiva de modelos se trata como opción avanzada demostrativa.
- [ ] La página pública está condicionada al cierre de la parte interna y muestra exactamente dos vías
  posibles sin crear pedidos confirmados automáticamente.
- [ ] Toda captura y dato de ejemplo está etiquetado y no se presenta como funcionalidad existente.
- [ ] HTML, PDF e imágenes para WhatsApp coinciden en copy, orden y contenido.
- [ ] Sólo la última lámina pide algo y usa este texto aprobado:

> Para empezar a trabajar necesitaré las recetas de sus ramos, su cotizador de Excel y los demás datos,
> fotografías o archivos que ya utilicen para sus ramos. Pueden enviarme todo conforme lo tengan y vayan
> pudiendo. Yo me encargo de organizarlo y cargarlo al sistema.

**No objetivos.**

- Construir o declarar funcional el sistema desde este change documental.
- Modificar código, runtime, datos, dependencias o build de PlanearIA.
- Crear un módulo independiente de clientes.
- Prometer la página pública o una fecha para ella.
- Pedir una plantilla específica, preparar archivos de una forma especial o llenar recetas juntos.
- Incluir inventario físico, facturación SAT, cobro con tarjeta, compras o proveedores.
- Obtener una aprobación contractual del alcance mediante el deck.

**Rollback.**

Restaurar el HTML, PDF e imágenes para WhatsApp anteriores desde su copia o historial y revertir mediante un
PR normal únicamente los documentos de `openspec/changes/presentar-sistema-a-maca/`. Las fuentes de
`prototipo alpha` se conservan intactas; no hay datos ni runtime que migrar.

<!-- openspec-readiness:pre-propose
{"schemaVersion":1,"change":"presentar-sistema-a-maca","execution":"versioned","dependencies":[],"currentState":"Revision brownfield del deck HTML/PDF/imagenes, inventario del prototipo alfa y entrevista final de intencion del 2026-08-22","surfaces":["docs","ui"],"manualIntervention":"Revision humana de comprension y legibilidad movil; publicacion en el issue y envio final por WhatsApp","exceptions":[]}
openspec-readiness:pre-propose -->
