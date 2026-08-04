## ADDED Requirements

### Requirement: La entrada a Clases prioriza decisiones entre clases

El prototipo SHALL presentar una entrada clases-primero con “Lo que sigue”, clases activas y las acciones
Crear clase e Importar clase. Cada señal SHALL identificar la clase u objeto que la sustenta y SHALL abrir
el filtro correspondiente de Seguimiento. La entrada SHALL NOT ser un feed, una galería de archivos, un
hero promocional ni un tablero de KPIs sin acción.

#### Scenario: El docente entra con clases y trabajo pendiente

- **WHEN** el docente abre Clases en el prototipo con datos sintéticos suficientes
- **THEN** encuentra tareas por revisar, entregas vencidas y clases activas, y cada señal abre una clase y filtro de Seguimiento identificables

#### Scenario: No hay datos suficientes para promedio o riesgo

- **WHEN** el dataset representado no permite calcular un promedio o riesgo explicable
- **THEN** el prototipo muestra “datos insuficientes” con una salida útil y no inventa un número, urgencia o clasificación

#### Scenario: El docente no tiene clases

- **WHEN** termina la carga representada y no existen clases
- **THEN** la entrada muestra un vacío específico con Crear clase e Importar clase y no muestra tarjetas o métricas ficticias

### Requirement: Una clase mantiene cuatro áreas estables

El prototipo SHALL presentar Tablón, Trabajo de clase, Personas y Seguimiento dentro de una clase
seleccionada. La entrada normal SHALL abrir Tablón; un deep link SHALL abrir el área y objeto de origen sin
perder la identidad de la clase. Calificaciones SHALL vivir dentro de Seguimiento y SHALL NOT aparecer
como quinta área equivalente.

#### Scenario: El docente abre una clase desde la lista

- **WHEN** el docente activa una clase desde la entrada
- **THEN** abre Tablón con nombre/contexto de la clase y puede alcanzar las otras tres áreas sin volver al hub

#### Scenario: El docente sigue una señal cross-class

- **WHEN** el docente activa una señal de tarea por revisar o entrega vencida
- **THEN** abre Seguimiento en la clase, filtro y objeto correspondientes, y volver conserva un retorno comprensible

#### Scenario: El docente cambia de breakpoint

- **WHEN** el mismo recorrido se inspecciona en móvil, tablet y web
- **THEN** conserva las cuatro áreas, labels, objeto activo y retornos aunque cambien densidad y patrón de presentación

### Requirement: Tablón representa comunicación de clase y no un feed social

Tablón SHALL priorizar anuncios y novedades verificables de la clase, con autor, fecha y estado. El
recorrido candidato SHALL permitir redactar un anuncio breve con adjunto opcional y mostrar
borrador/programación/publicación de forma honesta. Tablón SHALL NOT mostrar métricas, gamificación,
conversación social abierta ni una copia completa de Trabajo de clase.

#### Scenario: El docente publica un anuncio candidato

- **WHEN** el docente redacta un anuncio, confirma la acción y elige el estado representado
- **THEN** vuelve a Tablón y ve el anuncio con autor, fecha y estado, sin afirmar una entrega remota no representada

#### Scenario: El docente cancela un anuncio

- **WHEN** el docente cierra el editor de anuncio sin confirmar
- **THEN** vuelve al disparador de Tablón, no aparece un anuncio nuevo y el foco retorna al control que abrió el editor

#### Scenario: Tablón está vacío u offline

- **WHEN** no existen anuncios o el dispositivo representado está sin conexión
- **THEN** el prototipo muestra el vacío o estado offline específico, conserva una acción local disponible y no duplica actividades para llenar la superficie

### Requirement: Trabajo de clase permite una actividad sin archivo

Trabajo de clase SHALL organizar actividades, preguntas y materiales por Unidad/Tema y SHALL ofrecer una
creación académica breve. El título SHALL bastar para continuar el recorrido candidato; instrucciones,
destinatarios, puntos, fecha, Unidad/Tema y adjuntos SHALL ser opcionales según el tipo. El prototipo SHALL
NOT exigir abrir Office o adjuntar un archivo para guardar borrador, programar o asignar.

#### Scenario: El docente crea una actividad sin adjunto

- **WHEN** el docente captura un título válido sin archivo y confirma Guardar borrador, Programar o Asignar
- **THEN** el prototipo vuelve a Trabajo de clase y muestra la actividad con el estado elegido y el estado de sync diferenciado

#### Scenario: El docente intenta continuar sin título

- **WHEN** el docente deja vacío el título requerido
- **THEN** el prototipo mantiene el contexto, identifica el campo y explica cómo corregirlo sin borrar los demás valores

#### Scenario: La creación está cargando, falla o queda pendiente offline

- **WHEN** se recorren los estados loading, error y offline de la creación
- **THEN** cada estado nombra la tarea, preserva el borrador y ofrece cancelar o reintentar sin afirmar éxito remoto

### Requirement: Adjuntar o crear un recurso conserva ownership y retorno

El prototipo SHALL presentar Adjuntar existente y Crear recurso como acciones secundarias opcionales.
Adjuntar SHALL identificar tipo y owner del artefacto; Crear recurso SHALL ofrecer destinos explícitos a
Office Docente y Diseño de materiales y SHALL representar la entrega de control sin incrustar ni duplicar
sus editores. Ambos recorridos SHALL volver a la actividad y requerir confirmación antes de asociar la
referencia. Cancelar SHALL volver sin perder el borrador ni crear una asociación.

#### Scenario: El docente adjunta un recurso existente

- **WHEN** el docente elige un artefacto y vuelve a la actividad
- **THEN** ve el artefacto como referencia pendiente y solo se asocia después de una confirmación explícita

#### Scenario: El docente crea un recurso en otra experiencia

- **WHEN** el docente elige Office Docente o Diseño de materiales desde la actividad y atraviesa el handoff representado
- **THEN** regresa a la misma clase y borrador de actividad, con tipo y owner correctos y el recurso aún pendiente de confirmación

#### Scenario: El docente cancela el handoff

- **WHEN** el docente cancela el selector o la creación externa
- **THEN** vuelve al borrador intacto, sin recurso asociado ni mensaje de éxito

### Requirement: Personas presenta membresía académica con privacidad

Personas SHALL distinguir docentes y alumnos, rol, estado e incorporación dentro de la clase. SHALL NOT
convertirse en Cuenta, perfil público, red social o directorio global, ni mostrar datos personales reales
en la evidencia del prototipo.

#### Scenario: El docente revisa el roster

- **WHEN** el docente abre Personas con integrantes sintéticos
- **THEN** identifica secciones, roles y estados, y las acciones disponibles permanecen dentro del contexto de la clase

#### Scenario: No hay integrantes o falla la carga

- **WHEN** Personas representa estado vacío, loading o error
- **THEN** cada variante explica la situación, ofrece la acción pertinente y conserva la navegación de la clase

#### Scenario: El docente trabaja sin conexión

- **WHEN** Personas representa falta de conexión
- **THEN** el roster local permanece legible, las acciones remotas explican su limitación y la falta de red no se presenta como pérdida de datos

### Requirement: Seguimiento parte de evidencia accionable

Seguimiento SHALL integrar tareas por revisar, entregas vencidas, asistencia y calificación con clase,
tarea y alumno identificables. Los estados de entrega SHALL distinguir pendiente, entregada, vencida,
revisada/devuelta y sync. Promedio o riesgo SHALL mostrar fuente, explicación y acción, y SHALL NOT depender
solo de color ni presentarse con datos insuficientes.

#### Scenario: El docente revisa y devuelve una entrega

- **WHEN** el docente abre una tarea por revisar, consulta evidencia sintética, agrega retroalimentación y confirma devolver
- **THEN** vuelve al mismo filtro de Seguimiento con el estado actualizado y sin perder clase, tarea o alumno activos

#### Scenario: El docente abre asistencia o calificación

- **WHEN** el docente selecciona evidencia de asistencia o calificación
- **THEN** el prototipo mantiene a Seguimiento como contexto y ofrece retorno al mismo alumno, tarea o filtro

#### Scenario: Seguimiento no tiene evidencia o está offline

- **WHEN** no hay entregas/datos suficientes o se representa falta de conexión
- **THEN** el prototipo muestra un estado específico y accionable, conserva datos locales representados y no crea KPIs de relleno

### Requirement: Las superficies de Clases diseñan estados y recuperación honestos

La entrada, Tablón, Trabajo de clase, Personas y Seguimiento SHALL tener variantes verificables de loading,
empty, error y offline. Las acciones de escritura SHALL distinguir borrador local, pendiente de sync,
conflicto y confirmación remota. Una capacidad no configurada, incluida IA, SHALL conservar un flujo manual
completo. Ningún hotspot SHALL convertir una navegación de prototipo en éxito de datos real.

#### Scenario: Se audita la matriz de estados

- **WHEN** se compara cada superficie con la matriz de navegación y el preflight
- **THEN** existen estados loading, empty, error y offline con salida o recuperación, sin etiquetas de éxito falso

#### Scenario: Una propuesta de IA está disponible

- **WHEN** el docente solicita ayuda IA en un recorrido candidato
- **THEN** recibe un borrador, copia, diff o resumen revisable y debe confirmar cualquier asociación, publicación, asignación o devolución

#### Scenario: La IA no está configurada o falla temporalmente

- **WHEN** no hay proveedor configurado o la solicitud representada falla
- **THEN** el prototipo explica la capacidad no disponible, conserva el trabajo y permite completar la tarea manualmente

### Requirement: Clases es accesible y usa el lenguaje visual vigente

El prototipo SHALL usar etiquetas canónicas, tokens y componentes PlanearIA; SHALL NOT copiar la marca o
paleta de Google. Todo control SHALL documentar nombre accesible, estado seleccionado/deshabilitado, foco
visible y objetivo mínimo de 44 pt. El orden SHALL seguir contexto, área, objeto, estado y acción. Color o
movimiento SHALL NOT ser la única señal, y reducir movimiento SHALL conservar el mismo resultado.

#### Scenario: El docente usa lector de pantalla o teclado

- **WHEN** se auditan labels, orden de foco y estados de controles en los recorridos candidatos
- **THEN** cada destino y acción se comprende y opera sin depender de posición, color, icono o ratón

#### Scenario: Cambian tema, fuente o modo de daltonismo

- **WHEN** se revisan los estados candidatos con preferencias visuales distintas
- **THEN** jerarquía, contraste, contenido y acciones críticas permanecen legibles sin truncamiento bloqueante

#### Scenario: Reducir movimiento está activo

- **WHEN** el recorrido se evalúa sin transiciones animadas
- **THEN** alcanza los mismos destinos, estados y retornos sin perder información
