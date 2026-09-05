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

## Plan de trabajo — qué hizo el apply

Se revalidó Figma, se construyó la sección con escritorio primero y luego tablet y móvil como superficies
propias, más los estados de límite, el vacío, el tablero de estados y las conexiones a Asignar y
Mensajería. La auditoría por ancho de frame se repitió hasta reportar cero fugas. El owner recorrió Present
en dos rondas: la primera devolvió cuatro correcciones —filtros que alternaban entre dos vistas, plantillas
de móvil sin separar por tipo, chips activos inertes y densidad de móvil— y la segunda salió limpia.

## Resumen integral del change

Office pasa de ser tres frames heredados —uno clonado, uno reducido a una tarjeta y uno con la creación
escondida— a treinta y tres superficies aprobadas donde crear es inmediato en cualquier dispositivo y cada
archivo sabe a qué grupo pertenece, dónde se usa y cómo sale de la app. El prototipo no promete lo que no
puede sostener: la descarga con formato real se muestra pero no se simula, y su costo queda trasladado al
futuro change de runtime. El owner aprobó el 2026-09-04; cierra la parte de Office de la deuda de
superficies responsive y no autoriza runtime.
