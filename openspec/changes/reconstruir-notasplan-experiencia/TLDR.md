# TLDR: reconstruir NotasPLAN

## Intención — qué problema resuelve el proposal

El editor de documentos existe en el prototipo sólo en escritorio: sus cuatro frames miden 1440 y en tablet
y móvil no hay nada. Además es un clon de Word, con una cinta de seis pestañas y un índice de secciones que
no coincide con las siete que la app ya implementa. Esta ola reconstruye NotasPLAN en los tres tamaños y
fija la decisión que lo gobierna: el archivo es un documento real desde el primer momento, para que el
docente pueda descargarlo, editarlo en Word y volver a subirlo sin que deje de ser suyo. No toca runtime.

## Enfoque — cómo decide el design construirlo

La estructura viaja dentro del documento: las siete secciones son encabezados con nombre, y el formulario
pasa a ser una proyección sobre ellos en vez de la fuente de verdad. Es la única forma de que la estructura
sobreviva al viaje por Word, porque Word no tiene dónde guardar que un párrafo es el propósito de la sesión
dos. Se retira la cinta y queda una barra compacta que refleja el cursor. Las plantillas ofrecen tres
niveles de andamiaje sin bloquear la creación.

## Comportamiento — qué garantizan las specs

La hoja es la superficie principal en los tres tamaños y declara su formato de página. El índice navega los
siete encabezados. El formulario proyecta la sección activa sin ser fuente de verdad. La IA propone sólo a
petición y el docente acepta o descarta. Seis acciones viven en el editor, y compartir por enlace es de sólo
lectura y revocable: quien quiera editar necesita cuenta y permiso. Nueve estados tienen salida honesta,
incluido uno que declara qué sobrevivió al volver de Word.

## Plan de trabajo — qué hará el apply

Primero se revalida Figma y se confirma que no existe editor fuera de escritorio. Luego se construye la
sección candidate: escritorio para fijar la arquitectura, después tablet y móvil como superficies propias,
más el estado de límite de las familias que aún no existen. Siguen la plantilla por niveles, las acciones,
el compartir con permisos y los nueve estados. Después se audita el grafo por ancho **y por corrección de
destino**. El ciclo se detiene en Figma Present.

## Resumen integral del change

NotasPLAN pasa de cuatro frames de escritorio que imitan Word a un editor que existe en los tres tamaños y
cuyo archivo es un documento de verdad. La decisión de fondo la revisó el owner dos veces hasta llegar a la
única opción que conserva su condición inicial sin tirar los ocho componentes de sección que ya funcionan.
El costo real —migrar el almacenamiento del runtime a documento-primero— queda declarado, no escondido. Y
la promesa de volver desde Word se acota: qué sobrevive y qué degrada está escrito.
