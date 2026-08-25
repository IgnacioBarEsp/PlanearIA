## ADDED Requirements

### Requirement: El deck SHALL ser un tour autónomo y cercano

El deck SHALL poder leerse sin presentador en un teléfono desde WhatsApp. SHALL usar lenguaje cotidiano,
una voz cálida principalmente en primera persona y una continuidad de principio a fin; MUST NOT depender de
notas de orador, vocabulario de ingeniería ni una explicación posterior para comprender el alcance.

#### Scenario: Lectura autónoma
- **WHEN** una persona no técnica lee el deck en orden desde un teléfono
- **THEN** puede explicar qué estoy construyendo desde el catálogo hasta la entrega de un pedido
- **AND** entiende que las pantallas son un prototipo sujeto a validación

### Requirement: El alcance SHALL explicarse completo pero agrupado

El deck SHALL agrupar las funciones por momento del trabajo y apuntar a aproximadamente catorce o quince
diapositivas. Ese conteo MUST NOT ser un límite duro: la continuidad y legibilidad SHALL prevalecer
sobre el conteo, sin ocultar funciones ni reducir el tamaño del texto.

#### Scenario: Una función necesita contexto adicional
- **WHEN** el guion no puede explicar una relación importante de forma legible en la lámina prevista
- **THEN** el contenido se divide o reordena aunque cambie el conteo aproximado
- **AND** la revisión móvil confirma que el resultado sigue sintiéndose como un tour breve

### Requirement: El catálogo y los ramos SHALL distinguir tres tipos de cambio

El tour SHALL mostrar flores, insumos, precios, modelos y lo que lleva cada ramo. SHALL distinguir entre
editar permanentemente un modelo, personalizar sólo la cotización actual y guardar un ramo especial como un
modelo nuevo reutilizable.

#### Scenario: El cliente pide un ramo especial
- **WHEN** se ilustra un ajuste que no debe cambiar el modelo original
- **THEN** el deck muestra que el cambio aplica sólo a esa cotización
- **AND** presenta como decisión separada la opción de guardarlo como modelo nuevo

### Requirement: El cotizador SHALL mostrar tres puntos de entrada

El tour SHALL explicar que una cotización puede comenzar desde un modelo, desde cero o a partir del
presupuesto del cliente. En el caso del presupuesto, SHALL mostrar tanto modelos que caben aproximadamente
como la ayuda para construir un ramo especial acercándose al monto.

#### Scenario: El cliente indica cuánto quiere gastar
- **WHEN** se muestra la cotización por presupuesto
- **THEN** aparecen las dos posibilidades sin presentarlas como procesos separados o excluyentes
- **AND** los importes y nombres usados están marcados como `Ejemplo`

### Requirement: Compartir e historial SHALL conservar un flujo agnóstico al canal

La acción primaria de salida SHALL llamarse `Compartir`, sin limitarse a WhatsApp ni a un formato. El tour
SHALL mostrar que la cotización queda en el historial y que la respuesta del cliente se registra manualmente.

#### Scenario: El cliente acepta fuera del sistema
- **WHEN** Mayra o Stephanie reciben la aceptación por el canal que utilizaron
- **THEN** marcan la cotización como aceptada
- **AND** eligen `Convertir en pedido`

### Requirement: El pedido SHALL concentrar sus datos y seguimiento

Al convertir una cotización aceptada, el tour SHALL mostrar fecha, entrega o recolección, anticipo, saldo,
notas, pagos y estados. Nombre, teléfono, dirección y demás datos necesarios del cliente SHALL guardarse
dentro de la cotización o pedido; MUST NOT mostrarse un módulo separado de clientes.

#### Scenario: Se prepara el pedido aceptado
- **WHEN** se convierte la cotización en pedido
- **THEN** se completan los datos operativos que falten
- **AND** el pedido puede recorrer los estados pendiente de anticipo, confirmado, en proceso, listo,
  entregado o cancelado

#### Scenario: Se revisa una cotización antes de convertirla
- **WHEN** la cotización aún no es pedido
- **THEN** puede conservarse como borrador, enviada, aceptada, rechazada o vencida
- **AND** aceptar o rechazarla requiere una acción manual de MACA

### Requirement: La actualización selectiva de precios SHALL declararse demostrativa

El deck SHALL explicar brevemente que cambiar el precio de una flor o insumo puede recalcular los modelos
que lo utilizan. SHALL presentar una opción avanzada y poco prominente para elegir cuáles modelos actualizar,
pero MUST NOT describirla como funcionalidad ya construida ni detallar reglas todavía no validadas.

#### Scenario: Se muestra la pantalla de actualización de precios
- **WHEN** una captura indica cuántos modelos serán actualizados
- **THEN** una referencia secundaria comunica que la selección podrá ajustarse en opciones avanzadas
- **AND** la lámina conserva la marca de prototipo alfa sujeto a validación

### Requirement: La página pública SHALL permanecer condicionada

El deck SHALL decir que se intentará incluir una página pública sólo si la parte interna queda terminada.
SHALL mostrar como posibilidades una solicitud preparada para WhatsApp o una solicitud que aparece dentro
del sistema para que MACA la confirme; MUST NOT crear la expectativa de un pedido confirmado automáticamente.

#### Scenario: Se presenta la página a futuro
- **WHEN** la lectora llega a esa lámina
- **THEN** entiende que no tiene fecha ni garantía y depende de terminar bien la parte interna
- **AND** reconoce las dos vías como opciones todavía por elegir

### Requirement: Capturas y ejemplos SHALL declarar su fidelidad

Cada captura SHALL mostrar `Ejemplo · prototipo alfa`. Todo nombre, importe, teléfono, dirección o
composición ilustrativa SHALL ser ficticio y coherente entre láminas. El deck MUST NOT usar la pantalla alfa
de clientes.

#### Scenario: Una captura se integra al deck
- **WHEN** se renderiza una pantalla existente o nueva
- **THEN** se recorta a la parte necesaria, conserva la marca alfa y etiqueta los datos de ejemplo
- **AND** no expone datos reales de clientes

### Requirement: El deck SHALL cerrar con una sola petición flexible

El material SHALL solicitar una sola acción: enviar recetas, cotizador de Excel y demás datos, fotografías o
archivos que ya utilicen, conforme los tengan y puedan. MUST NOT pedir llenar una plantilla, abrir un enlace,
preparar los archivos de una forma especial ni ofrecer hacerlo juntos.

#### Scenario: Última diapositiva
- **WHEN** la lectora llega al cierre
- **THEN** encuentra el texto aprobado que indica que puede enviar todo como ya lo tenga y poco a poco
- **AND** entiende que el residente se encargará de organizarlo y cargarlo al sistema
- **AND** ninguna otra lámina contiene una llamada a la acción competidora
