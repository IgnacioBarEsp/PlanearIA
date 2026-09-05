## ADDED Requirements

### Requirement: La hoja es el archivo y lleva su estructura dentro

El prototipo de NotasPLAN SHALL presentar la hoja del documento como superficie principal en los tres
breakpoints, declarando su formato de página real. Las siete secciones —información institucional, datos
generales, curricular, sesiones, evaluación, observaciones y firmas— SHALL materializarse **dentro del
documento** como encabezados con nombre, y SHALL NOT vivir en un modelo paralelo a él. El índice del
documento SHALL reflejar esos encabezados y navegar a ellos. La hoja SHALL NOT presentarse como vista
previa de un formulario.

#### Scenario: El docente abre una planeación

- **WHEN** el docente abre un documento en 1440, 768 o 390
- **THEN** ve la hoja con su formato de página declarado, con las siete secciones presentes como encabezados con nombre, y puede escribir sobre ella

#### Scenario: El docente navega por el índice

- **WHEN** el docente activa una sección en el índice
- **THEN** la hoja se sitúa en ese encabezado sin cambiar de superficie ni perder lo escrito

#### Scenario: La estructura no vive fuera del documento

- **WHEN** se audita cómo se representa la estructura del documento
- **THEN** cada sección corresponde a un encabezado con nombre dentro de la hoja, y ninguna existe únicamente como campo de un formulario

### Requirement: Las herramientas son una barra compacta contextual

Las herramientas de formato SHALL presentarse como una barra compacta que refleja el estado del cursor, con
los comandos de negrita, cursiva, lista, lista numerada, título, checklist y tabla. El prototipo SHALL NOT
usar una cinta de pestañas. En móvil la barra SHALL NOT tapar la línea que se está escribiendo.

#### Scenario: La barra refleja dónde está el cursor

- **WHEN** el docente coloca el cursor dentro de una lista
- **THEN** la barra muestra activo el comando de lista, sin abrir ninguna pestaña ni menú adicional

#### Scenario: No hay cinta de pestañas

- **WHEN** se recorre la sección candidate completa
- **THEN** no existe ninguna cinta con pestañas de Archivo, Inicio, Insertar, Diseño, Revisar o Vista

### Requirement: La lente de formulario proyecta la sección activa

El prototipo SHALL ofrecer una vista de formulario sobre la sección activa, alcanzable en los tres
breakpoints. Esa vista SHALL presentarse como proyección de los encabezados del documento y SHALL NOT
presentarse como la fuente de verdad del contenido. En móvil la hoja SHALL ser la vista por defecto y el
formulario SHALL estar a un toque.

#### Scenario: El docente usa el formulario en una sección con estructura

- **WHEN** el docente abre la lente de formulario estando en sesiones o en evaluación
- **THEN** ve los campos de esa sección y al volver a la hoja el contenido aparece bajo el encabezado correspondiente

#### Scenario: Móvil abre la hoja

- **WHEN** el docente abre un documento en 390
- **THEN** ve la hoja y puede escribir en línea sobre ella, y un control con label visible lleva al formulario de la sección activa

### Requirement: Crear desde plantilla ofrece tres niveles sin bloquear

Crear desde la plantilla Planeación didáctica SHALL ofrecer los niveles `sencillo`, `moderado` y
`autocompletado`. `sencillo` SHALL entregar los siete encabezados; `moderado` SHALL añadir el andamiaje
interno de cada sección; `autocompletado` SHALL prellenar además los datos que la app ya conoce. El nivel
SHALL tener valor por defecto y SHALL NOT bloquear la creación ni preceder a la decisión de crear. Los datos
prellenados SHALL marcarse como editables y SHALL NOT presentarse como definitivos.

#### Scenario: El docente crea sin elegir nivel

- **WHEN** el docente crea desde la plantilla sin tocar el selector de nivel
- **THEN** el documento se abre con el nivel por defecto y el nivel sigue siendo cambiable después

#### Scenario: El docente elige autocompletado

- **WHEN** el docente elige el nivel autocompletado
- **THEN** escuela, docente, ciclo, grupo y asignatura aparecen rellenados y visiblemente marcados como editables

### Requirement: La IA propone sobre la sección activa y el docente decide

La IA SHALL actuar únicamente a petición del docente y sobre la sección activa. Su resultado SHALL
presentarse como un cambio revisable que el docente acepta o descarta, y SHALL NOT sobrescribir el contenido
original sin confirmación. Sin proveedor disponible, el flujo manual SHALL permanecer completo. El
prototipo SHALL NOT ofrecer una sugerencia automática al entrar a una sección vacía.

#### Scenario: El docente pide ayuda a la IA

- **WHEN** el docente solicita una propuesta estando en una sección
- **THEN** el prototipo muestra el cambio propuesto junto al contenido actual, y ofrece aceptarlo o descartarlo

#### Scenario: No hay proveedor de IA

- **WHEN** el prototipo representa la ausencia de proveedor
- **THEN** lo declara y el docente conserva todas las acciones de escritura, formato y guardado

### Requirement: El documento ofrece seis acciones sin salir del editor

El editor SHALL ofrecer guardar en la biblioteca, descargar, asignar a un grupo, guardar como plantilla
propia, ver historial y compartir, todas alcanzables sin abandonar el documento y con label textual visible.
Asignar SHALL devolver el control a Clases y retornar declarando qué ocurrió. La descarga SHALL nombrar el
formato de salida y SHALL NOT simular progreso ni archivo generado. El historial SHALL presentar puntos de
guardado con nombre, previsualizables y restaurables.

#### Scenario: El docente asigna la planeación

- **WHEN** el docente activa asignar desde el editor
- **THEN** llega a la hoja Asignar del mismo ancho y al confirmar o cancelar vuelve al documento sin perder lo escrito

#### Scenario: El docente consulta el historial

- **WHEN** el docente abre el historial
- **THEN** ve puntos de guardado con nombre y fecha, puede previsualizar uno y restaurarlo

#### Scenario: La descarga no finge haber ocurrido

- **WHEN** el docente activa descargar
- **THEN** el prototipo nombra el formato y declara que la descarga real no ocurre en el prototipo

### Requirement: Compartir protege los datos del documento

Compartir SHALL ofrecer copia en PDF o `.docx` y enlace al documento, por la ruta interna hacia Mensajería y
por la ruta externa. El enlace SHALL declararse de sólo lectura y revocable por el docente. Editar un
documento compartido SHALL exigir cuenta en PlanearIA y una solicitud de permiso que el docente concede o
rechaza. El prototipo SHALL NOT ofrecer edición anónima ni un enlace sin revocación.

#### Scenario: El docente comparte un enlace

- **WHEN** el docente comparte el documento por enlace
- **THEN** el prototipo declara que el enlace es de sólo lectura y que puede revocarse, y ofrece revocarlo

#### Scenario: Alguien quiere editar el documento compartido

- **WHEN** quien recibió el enlace intenta editar
- **THEN** el prototipo le pide crear cuenta en PlanearIA y solicitar permiso, y el docente decide

### Requirement: NotasPLAN conserva su arquitectura en tres breakpoints

La hoja, las herramientas, el índice, la lente de formulario y las acciones del documento SHALL existir en
móvil menor a 768, tablet entre 768 y 1279 y web desde 1280. Cambiar de breakpoint SHALL cambiar densidad y
disposición, no la arquitectura. Ninguna superficie SHALL resolverse con un frame de otro tamaño. Abrir
Instrumento de evaluación o Documento académico SHALL entregar el estado honesto de límite del mismo ancho.

#### Scenario: El editor en tablet

- **WHEN** se recorre el editor en 768
- **THEN** conserva hoja, herramientas, índice y acciones con densidad reducida, y ningún control entrega un frame de 1440

#### Scenario: Una familia de documento que aún no existe

- **WHEN** el docente intenta crear un Instrumento de evaluación o un Documento académico
- **THEN** recibe un estado que nombra el límite, no un editor simulado, y su salida devuelve al origen exacto

### Requirement: NotasPLAN representa estados y recuperación honestos

El prototipo SHALL diseñar documento nuevo vacío, guardando y guardado, cambios sin guardar al salir, error
al guardar, offline, sync pendiente, sync en conflicto e IA no disponible. Cada estado SHALL ofrecer salida
o recuperación. Sync pendiente y sync en conflicto SHALL distinguirse entre sí y SHALL NOT presentarse como
éxito remoto. Ningún estado SHALL simular guardado remoto, envío, descarga real ni sincronización, y los
datos de ejemplo SHALL ir rotulados.

La interfaz SHALL NOT explicar al docente qué elementos degradan al editar el documento fuera de la app: es
un problema de ingeniería que no le corresponde, y la descarga SHALL limitarse a ofrecer el formato. El
límite técnico del viaje de ida y vuelta SHALL declararse en el handoff de runtime y en el ground truth, que
son documentación para quien implementa. Retirar el aviso de la interfaz SHALL NOT interpretarse como que el
límite no existe.

#### Scenario: El docente sale con cambios sin guardar

- **WHEN** el docente intenta salir del editor con cambios sin guardar
- **THEN** el prototipo nombra qué se perdería y ofrece guardar, descartar o seguir editando

#### Scenario: El docente descarga el documento

- **WHEN** el docente abre la superficie de descarga
- **THEN** se le ofrece elegir entre `.docx` y PDF, y no se le explica qué elementos podrían degradar al editarlo fuera de la app

#### Scenario: Sin conexión

- **WHEN** el prototipo representa el estado offline
- **THEN** declara que se sigue escribiendo en local, no promete envío ni sincronización, y la escritura permanece disponible

### Requirement: NotasPLAN usa el lenguaje visual accesible de PlanearIA

El editor SHALL usar los tokens vigentes de color, espaciado, radios, tipografía y elevación, SHALL alcanzar
el objetivo táctil de 44 puntos sin depender de `hitSlop` incluida la barra compacta, y SHALL exponer label
accesible en cada icono de formato. Foco visible y orden de recorrido lógico SHALL cubrir índice, hoja y
barra. Fuente ampliada SHALL NOT romper la hoja ni desbordar la barra, reducir movimiento SHALL producir un
resultado equivalente, y ningún significado SHALL codificarse sólo por color. El editor SHALL NOT usar
glass, blur, gradientes, halos, bento, hero ni animación ornamental.

#### Scenario: Fuente ampliada sobre la hoja

- **WHEN** se recorre el editor con la fuente ampliada máxima
- **THEN** la hoja sigue legible, la barra no desborda y ningún control queda inalcanzable

#### Scenario: Auditoría anti-slop de la composición

- **WHEN** se audita la sección candidate contra el preflight
- **THEN** no aparece clon de Word, formulario con vista previa, IA al frente ni ornamento que sustituya contenido
