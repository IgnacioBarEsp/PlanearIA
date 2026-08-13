# teacher-home-prototype-experience Specification

## Purpose
TBD - created by archiving change reconstruir-escritorio-experiencia. Update Purpose after archive.
## Requirements
### Requirement: Escritorio combina herramientas, atención y continuidad

El prototipo SHALL presentar Escritorio como ruta inicial con tres capas reconocibles: launcher de
herramientas, objetos que requieren atención y continuidad de trabajo propio. Cada objeto SHALL incluir
owner, contexto, estado y próxima acción. Escritorio SHALL NOT ser feed, landing promocional, hero,
tablero de KPIs, bento genérico ni catálogo de cards inertes.

#### Scenario: El docente inicia con jornada activa

- **WHEN** el docente abre el prototipo con datos sintéticos suficientes
- **THEN** encuentra herramientas, prioridades accionables y objetos para continuar, y cada elemento explica qué abre y por qué es relevante

#### Scenario: No hay nada urgente

- **WHEN** existen herramientas y trabajo previo pero ninguna acción requiere atención inmediata
- **THEN** Escritorio distingue “sin pendientes urgentes” de “sin datos”, conserva continuidad y no inventa métricas o alertas

#### Scenario: El docente es nuevo

- **WHEN** termina la carga representada y no existen clases, documentos ni actividad previa
- **THEN** Escritorio ofrece crear clase, crear o importar un documento y probar el Asistente de IA sin contenido ficticio

### Requirement: El launcher abre experiencias y creación tipo-primero

El launcher SHALL distinguir NotasPLAN, CalcuPLAN, PresentaPLAN, Diseño de materiales, Clases y Asistente
de IA con labels visibles. “Nuevo archivo” SHALL abrir un selector con documento, hoja, presentación,
diseño y preguntar a la IA. La intención escolar SHALL aparecer sólo después como sugerencia descartable y
SHALL NOT bloquear la creación mediante un modal obligatorio.

#### Scenario: El docente abre una herramienta

- **WHEN** activa una herramienta del launcher
- **THEN** llega al módulo o herramienta correspondiente del mismo breakpoint y dispone de un retorno visible a Escritorio

#### Scenario: El docente crea por tipo

- **WHEN** activa “Nuevo archivo”
- **THEN** puede elegir uno de los cinco tipos antes de declarar una intención escolar y el destino conserva el origen Escritorio

#### Scenario: El docente cancela la creación

- **WHEN** cierra el selector o descarta el chip de intención
- **THEN** vuelve al mismo disparador de Escritorio sin crear un artefacto ni perder el foco conceptual

### Requirement: Las prioridades y continuidades abren objetos propietarios

Cada prioridad o continuidad SHALL abrir el objeto y filtro del módulo owner, no un home genérico. El
prototipo SHALL conservar clase, tarea, alumno, fecha, conversación o artefacto cuando sean necesarios para
comprender el destino y SHALL ofrecer retorno a la posición/origen de Escritorio.

#### Scenario: El docente atiende una tarea por revisar

- **WHEN** activa una prioridad de revisión
- **THEN** abre Seguimiento en la clase, tarea y filtro representados y volver devuelve a la jornada de Escritorio

#### Scenario: El docente retoma un borrador

- **WHEN** activa un documento, material o mensaje en Continuidad
- **THEN** abre el objeto editable que lo posee y volver no crea una copia ni desvía al home genérico del módulo

#### Scenario: Falta evidencia para una señal

- **WHEN** el prototipo no puede representar fuente suficiente para un promedio, riesgo o urgencia
- **THEN** muestra datos insuficientes o elimina la señal y no inventa un valor, clasificación o acción

### Requirement: Escritorio conserva la misma arquitectura en tres breakpoints

El prototipo SHALL mantener launcher, atención y continuidad en móvil `<768`, tablet `768–1279` y web
`>=1280`. Móvil SHALL conservar cinco hubs, tablet SHALL usar rail y web SHALL usar sidebar/panel IA
alcanzable. SHALL cambiar densidad y disposición, no labels, owner, estado, destino o retorno; ningún
hotspot SHALL llevar a un frame de otro breakpoint.

#### Scenario: Se recorre la jornada en móvil

- **WHEN** el docente usa el frame móvil de 390×844
- **THEN** encuentra launcher compacto, más de una salida útil y continuidad, y todo destino permanece en móvil

#### Scenario: Se recorre la jornada en tablet

- **WHEN** el docente usa el frame tablet de 768×1024
- **THEN** el rail y las tres capas permanecen presentes sin reducir la experiencia a una tarjeta

#### Scenario: Se recorre la jornada en web

- **WHEN** el docente usa el frame desktop de 1440×960
- **THEN** sidebar, dock, lista priorizada y continuidad usan el espacio adicional sin crear un bento o dashboard de relleno

### Requirement: Escritorio representa estados y recuperación honestos

Launcher, atención y continuidad SHALL cubrir de forma verificable loading, empty, error y offline. Las
acciones con escritura SHALL distinguir guardado local, sync pendiente, conflicto y confirmación remota.
Un error parcial SHALL conservar las zonas locales disponibles; ningún hotspot SHALL presentar navegación
de prototipo como persistencia, envío o sync real.

#### Scenario: Una fuente falla parcialmente

- **WHEN** falla la carga representada de una zona pero existen herramientas u objetos locales
- **THEN** Escritorio conserva lo disponible, identifica la zona afectada y ofrece reintentar o abrir el owner manualmente

#### Scenario: El dispositivo está offline

- **WHEN** se recorre Escritorio sin conexión
- **THEN** los objetos locales permanecen legibles, las acciones remotas explican su limitación y el docente puede revisar pendientes de sync

#### Scenario: Existe un conflicto o sync pendiente

- **WHEN** un objeto local no está confirmado remotamente
- **THEN** Escritorio nombra el objeto y diferencia revisar, reintentar o resolver sin afirmar éxito remoto

### Requirement: La IA permanece secundaria y bajo control docente

Una sugerencia IA SHALL aparecer sólo como elemento secundario, contextual, descartable y revisable. Toda
acción importante SHALL requerir confirmación docente y el resultado SHALL ser borrador, copia, diff o
resumen que no sobrescribe el original. El launcher y la jornada SHALL funcionar completos sin proveedor.

#### Scenario: Existe una sugerencia contextual

- **WHEN** el prototipo representa contexto suficiente para una ayuda IA
- **THEN** la sugerencia aparece después de las acciones docentes y permite revisar, confirmar o descartar sin ejecutar la acción sola

#### Scenario: No hay proveedor configurado

- **WHEN** la IA no está disponible o no está configurada
- **THEN** Escritorio conserva todas las tareas manuales y no muestra un éxito, respuesta o bloqueo ficticio

#### Scenario: La solicitud IA falla

- **WHEN** la ayuda representada encuentra un error temporal
- **THEN** conserva el trabajo y contexto, ofrece reintentar o continuar manualmente y no modifica el original

### Requirement: Escritorio usa el lenguaje visual accesible de PlanearIA

El prototipo SHALL usar labels canónicos, tokens y componentes PlanearIA. Todo control SHALL documentar
nombre accesible, estado, foco visible y objetivo mínimo de 44 pt. El orden SHALL seguir contexto,
launcher, atención, continuidad y acciones auxiliares. Color, posición o movimiento SHALL NOT ser la única
señal; fuente ampliada y reducir movimiento SHALL conservar contenido, destino y resultado.

#### Scenario: El docente usa teclado o lector de pantalla

- **WHEN** se auditan labels, orden de foco y estados de los recorridos candidate
- **THEN** cada herramienta, objeto y acción se comprende y opera sin depender de ratón, color, icono o posición

#### Scenario: Cambian tema o tamaño de fuente

- **WHEN** se inspecciona el candidate con tema, fuente ampliada o señal no-color
- **THEN** labels, verbos, owners y estados críticos permanecen legibles sin truncamiento bloqueante ni scroll horizontal

#### Scenario: Reducir movimiento está activo

- **WHEN** los recorridos se evalúan sin transición animada
- **THEN** alcanzan los mismos destinos, confirmaciones y retornos sin perder información

