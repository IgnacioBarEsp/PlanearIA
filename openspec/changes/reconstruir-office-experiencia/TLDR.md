# TLDR: reconstruir Office Docente

## Intención — qué problema resuelve el proposal

Office no expresa su trabajo en el prototipo. El frame de tablet es una copia exacta del de escritorio pese
a llamarse tablet, el de móvil queda reducido a una sola tarjeta, y la creación es un botón sin tipos
mientras un bloque ofrece plantillas escolares antes de elegir qué se va a crear. Este change reconstruye
el hub de Office en los tres tamaños como el lugar donde el docente crea material nuevo y vuelve por el que
ya hizo. Cierra además la parte de Office de la deuda de superficies responsive. No toca runtime.

## Enfoque — cómo decide el design construirlo

La creación se despliega dentro de Office: los tres tipos visibles al entrar, sin modal. Es una desviación
declarada de la regla general, acotada a este módulo, porque crear es su tarea principal. Las plantillas
van después del tipo, agrupadas en familias para no repetir estructuras: asistencia, calificaciones y su
combinación son una sola familia. La biblioteca conserva el orden cronológico y los filtros que ya existen.
Los frames nuevos se clonan de Escritorio aprobado para heredar tokens. Los editores, que aún no existen,
entregan un estado que nombra el límite.

## Comportamiento — qué garantizan las specs

Office muestra documento, hoja y presentación desplegados y cada uno abre en blanco. Las plantillas son
atajo opcional y nunca preceden al tipo. La biblioteca ordena por lo reciente y agrupa por tipo. Cada
archivo ofrece cinco acciones sin abrirlo: descargar, asignar, adjuntar, ver dónde se usa y duplicar, todas
con texto visible. Importar funciona con la biblioteca llena y vacía. Los tres tamaños conservan la misma
información y ningún enlace cruza de tamaño. Siete estados negativos tienen salida honesta y la descarga no
se simula.

## Plan de trabajo — qué hará el apply

Primero se revalida Figma y se registra el punto de restauración. Luego se construye la sección candidate:
escritorio para fijar la arquitectura, después tablet y móvil como superficies propias, más el estado de
límite de los editores. Siguen los estados negativos y las conexiones a la hoja Asignar y a Mensajería.
Después se audita el grafo por ancho de frame hasta reportar cero fugas, y se levanta evidencia visual y de
accesibilidad. El ciclo se detiene en Figma Present: sin veredicto humano no hay promoción.

## Resumen integral del change

Office pasa de ser tres frames heredados —uno clonado, uno reducido a una tarjeta y uno con la creación
escondida— a un módulo donde crear es inmediato en cualquier dispositivo y donde cada archivo sabe a qué
grupo pertenece, dónde se está usando y cómo sale de la app. El prototipo no promete lo que no puede
sostener: la descarga con formato real se muestra pero no se simula, y su costo queda trasladado al futuro
change de runtime. Nada de esto se aprueba solo: la sección permanece candidate hasta que el owner la
recorra y emita veredicto.
