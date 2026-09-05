# office-prototype-experience Specification

## Purpose
TBD - created by archiving change reconstruir-office-experiencia. Update Purpose after archive.
## Requirements
### Requirement: Office pone la creación al frente con los tres tipos desplegados

El prototipo de Office SHALL presentar documento, hoja y presentación como zona de mayor jerarquía al
entrar al módulo, visibles sin modal intermedio y sin scroll en cualquiera de los tres breakpoints. Cada
tipo SHALL abrir el objeto en blanco por defecto. Office SHALL NOT ofrecer diseño ni preguntar a la IA como
tipos creables. Esta disposición SHALL declararse como desviación acotada de D3, y el selector tipo-primero
global de Escritorio SHALL permanecer intacto y alcanzable.

#### Scenario: El docente entra a Office

- **WHEN** el docente abre Office Docente en 1440, 768 o 390
- **THEN** ve documento, hoja y presentación desplegados como zona principal, sin abrir ningún modal y sin desplazarse

#### Scenario: El docente elige un tipo sin plantilla

- **WHEN** el docente activa documento, hoja o presentación sin elegir plantilla
- **THEN** el prototipo entrega la superficie de ese tipo en el mismo ancho, sin que ninguna decisión escolar preceda a la elección; mientras los editores pertenezcan a olas posteriores, esa superficie es el estado honesto de límite y nunca un editor simulado

#### Scenario: El selector global de Escritorio no se degrada

- **WHEN** se recorre "Nuevo archivo" desde Escritorio tras construir la sección candidate de Office
- **THEN** los selectores tipo-primero aprobados en #163 siguen existiendo, conservan sus cinco tipos y son alcanzables

### Requirement: Las plantillas docentes son un atajo opcional posterior al tipo

Office SHALL ofrecer plantillas docentes junto a cada tipo como atajo visible y opcional. Ninguna plantilla
SHALL bloquear, preceder ni sustituir la elección de tipo. El catálogo SHALL organizarse en familias con
presets y SHALL NOT presentar plantillas redundantes que compartan estructura. Office SHALL NOT ofrecer
creación por intención escolar antes del tipo.

#### Scenario: El docente usa una plantilla

- **WHEN** el docente elige un tipo y activa una de sus plantillas
- **THEN** el prototipo entrega la superficie de ese tipo en el mismo ancho, declarando qué plantilla se eligió, y una salida visible devuelve al origen para poder empezar en blanco

#### Scenario: El catálogo no duplica estructura

- **WHEN** se revisa el catálogo de plantillas de hoja
- **THEN** asistencia, calificaciones y concentrado aparecen como presets de la familia Control del grupo y no como tres plantillas independientes

#### Scenario: No hay creación por intención antes del tipo

- **WHEN** se recorre la sección candidate de Office completa
- **THEN** ningún bloque ofrece Planeación, Material de lectura, Rúbrica o Bibliografía como punto de entrada previo a la elección de tipo

### Requirement: La biblioteca ordena por lo reciente y agrupa por tipo

Office SHALL presentar la biblioteca con eje primario cronológico y agrupación secundaria por tipo mediante
filtros de documento, hoja y presentación. El grupo o la materia SHALL aparecer como etiqueta del objeto y
SHALL NOT estructurar la biblioteca en carpetas. En esta ola la biblioteca SHALL contener únicamente
archivos de Office y SHALL NOT representar recursos didácticos ni materiales heredados de ContenidoTab.

#### Scenario: El docente busca lo último que tocó

- **WHEN** el docente abre Office con archivos existentes
- **THEN** lo más reciente encabeza la biblioteca y cada archivo declara tipo, nombre, grupo y último uso

#### Scenario: El docente filtra por tipo

- **WHEN** el docente aplica el filtro de hojas de cálculo
- **THEN** la biblioteca muestra sólo hojas conservando el orden cronológico, y el filtro aplicado permanece visible

#### Scenario: La biblioteca no promete materiales que no existen

- **WHEN** se recorre la biblioteca de la sección candidate
- **THEN** no aparecen recursos didácticos ni materiales de ContenidoTab, ni como contenido ni como filtro con datos simulados

### Requirement: El archivo ofrece cinco acciones sin abrirlo y conserva ownership

Cada archivo de la biblioteca SHALL ofrecer descargar en su extensión real, asignar a un grupo, adjuntar a
una conversación, ver dónde se está usando y duplicar para otro grupo, todas alcanzables sin abrir el
objeto. Cada acción SHALL llevar label textual visible y SHALL NOT depender de un icono mudo como único
portador de significado. Asignar SHALL partir de la hoja Asignar aprobada y conservar su diseño; el
prototipo SHALL usar una copia con el cableado heredado limpiado, porque el original encadena `SWAP` hacia
el flujo interno de Clases y rompería el retorno exigido aquí, y el runtime SHALL reutilizar el componente
único que posee `cross-surface-assignment` en vez de duplicarlo. Adjuntar SHALL devolver el control a
Mensajería. Ambas SHALL retornar a Office declarando qué ocurrió con el
archivo. La descarga SHALL representarse como afordancia y SHALL NOT simular progreso, archivo generado ni
confirmación de formato preservado.

#### Scenario: El docente asigna un archivo a un grupo

- **WHEN** el docente activa asignar desde la fila de un archivo
- **THEN** llega a la hoja Asignar del mismo breakpoint y al confirmar o cancelar vuelve a Office con el filtro y la posición conservados

#### Scenario: El docente consulta dónde se usa un archivo

- **WHEN** el docente activa ver dónde se está usando
- **THEN** el prototipo declara grupos, tareas y último uso del archivo, y ofrece volver sin alterar la biblioteca

#### Scenario: La descarga no finge haber ocurrido

- **WHEN** el docente activa descargar
- **THEN** el prototipo nombra el formato de salida y declara que la descarga real no ocurre en el prototipo, sin mostrar progreso ni archivo generado

#### Scenario: Las acciones no dependen de un icono mudo

- **WHEN** se auditan las cinco acciones en 1440, 768 y 390
- **THEN** cada una expone texto visible en su superficie o tras un control con label visible, y ninguna se identifica sólo por icono

### Requirement: Importar es alcanzable con la biblioteca llena y vacía

Office SHALL ofrecer importar un archivo existente como acción persistente del hub. Importar SHALL ser
alcanzable tanto en el estado vacío como con la biblioteca poblada, y SHALL NOT presentarse como un tipo
creable.

#### Scenario: Docente nuevo sin archivos

- **WHEN** un docente sin archivos abre Office
- **THEN** ve la zona de creación con sus plantillas y una entrada de importación, sin ejemplos falsos ni tarjetas inertes

#### Scenario: Docente con biblioteca poblada

- **WHEN** un docente con archivos abre Office
- **THEN** importar sigue siendo alcanzable sin vaciar la biblioteca ni entrar a un submenú de creación

### Requirement: Office conserva la misma arquitectura en tres breakpoints

Office SHALL mantener creación, biblioteca y acciones sobre el archivo en móvil menor a 768, tablet entre
768 y 1279 y web desde 1280. Cambiar de breakpoint SHALL cambiar densidad y disposición, no la arquitectura
de información. Ninguna superficie SHALL reducirse a una tarjeta única ni resolverse con un frame de otro
tamaño.

#### Scenario: Office en tablet

- **WHEN** se recorre Office en 768
- **THEN** conserva las tres capas con densidad reducida y ningún control entrega un frame de 1440

#### Scenario: Office en móvil

- **WHEN** se recorre Office en 390
- **THEN** los tres tipos permanecen visibles sin scroll, la biblioteca lista recientes con filtros y las acciones llegan por hoja desde la fila del archivo

#### Scenario: Abrir un editor que aún no existe

- **WHEN** el docente intenta abrir un documento, hoja o presentación desde cualquier breakpoint
- **THEN** recibe un estado que nombra el límite, no simula editor, y su salida devuelve al origen exacto sin cruzar de tamaño

### Requirement: Office representa estados y recuperación honestos

Office SHALL diseñar vacío, cargando, error, offline, sync pendiente, sync en conflicto y editor no
disponible en este tamaño. Cada estado SHALL ofrecer salida o recuperación. Sync pendiente y sync en
conflicto SHALL distinguirse entre sí y SHALL NOT presentarse como éxito remoto. Ningún estado SHALL
simular guardado, envío, red, autenticación, IA o descarga real, y los datos de ejemplo SHALL ir rotulados.

#### Scenario: Office sin conexión

- **WHEN** el prototipo representa el estado offline
- **THEN** declara qué trabajo permanece disponible en local, no promete sincronización ni descarga remota y la creación sigue siendo alcanzable

#### Scenario: Sync en conflicto

- **WHEN** el prototipo representa un conflicto de sincronización sobre un archivo
- **THEN** lo distingue de sync pendiente, nombra qué versión está en disputa y ofrece resolución manual

#### Scenario: Cargando no bloquea crear

- **WHEN** la biblioteca está cargando
- **THEN** la zona de creación permanece usable y sólo la biblioteca indica carga

### Requirement: Office usa el lenguaje visual accesible de PlanearIA

Office SHALL usar los tokens vigentes de color, espaciado, radios, tipografía y elevación, SHALL conservar
labels globales, foco visible y orden de recorrido lógico, y SHALL alcanzar el objetivo táctil de 44 puntos
sin depender de hitSlop. Fuente ampliada y alto contraste SHALL NOT romper la fila de archivo ni la zona de
creación, y reducir movimiento SHALL producir un resultado equivalente. Office SHALL NOT usar glass, blur,
gradientes, halos, bento, hero, KPIs de relleno ni animación ornamental para sustituir jerarquía.

#### Scenario: Fuente ampliada en la fila de archivo

- **WHEN** se recorre Office con la fuente ampliada máxima
- **THEN** tipo, nombre, grupo y acciones siguen siendo legibles y alcanzables sin recorte de texto

#### Scenario: Auditoría anti-slop de la composición

- **WHEN** se audita la sección candidate contra el preflight
- **THEN** no aparece gestor de archivos genérico, mosaico de plantillas como portada, hero, bento ni ornamento que sustituya contenido

