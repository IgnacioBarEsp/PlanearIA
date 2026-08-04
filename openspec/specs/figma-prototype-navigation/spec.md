# figma-prototype-navigation Specification

## Purpose
TBD - created by archiving change corregir-navegacion-prototipo-figma. Update Purpose after archive.
## Requirements
### Requirement: Único inicio de la suite
El prototipo Figma SHALL exponer exactamente un punto de inicio activo, `Escritorio Docente`, y todo frame activo SHALL ser alcanzable desde ese grafo mediante una interacción declarada.

#### Scenario: Inicio de presentación
- **WHEN** una persona abre la presentación del prototipo sin seleccionar un frame manualmente
- **THEN** Figma inicia en Escritorio Docente y no ofrece un flow independiente de Office ni de otro módulo

#### Scenario: Frame histórico conservado
- **WHEN** existe un frame previo en el lienzo para referencia o rollback
- **THEN** el frame no tiene punto de inicio ni se presenta como alternativa de entrada al prototipo activo

### Requirement: Navegación global estable
Cada superficie activa SHALL mantener el inventario canónico de experiencias con nombres estables: `Escritorio Docente`, `Office Docente`, `Clases`, `Asistente de IA`, `Diseño de materiales`, `Mensajería`, `Agenda`, `Reportes` y `Cuenta`.

#### Scenario: Módulo seleccionado
- **WHEN** la persona navega a una experiencia distinta
- **THEN** solamente cambia el resaltado de la experiencia activa y los demás módulos continúan visibles o accesibles bajo el mismo nombre canónico

#### Scenario: Adaptación móvil
- **WHEN** la persona usa la variante móvil
- **THEN** Inicio, Office Docente, Clases, Asistente de IA y Más permanecen accesibles, y Más expone las experiencias secundarias con los nombres canónicos

### Requirement: Entrada y retorno semánticos
Toda pantalla de experiencia, objeto, creación, revisión o resultado SHALL ofrecer una salida visible cuyo destino corresponda al origen o al módulo que da contexto a la tarea.

#### Scenario: Crear desde Escritorio
- **WHEN** la persona inicia Crear desde Escritorio Docente y abre un selector, editor o resultado de archivo
- **THEN** una salida visible regresa a Escritorio Docente y el historial no desvía el retorno a Office Docente

#### Scenario: Trabajo contextual de Clases
- **WHEN** la persona abre una actividad, asistencia o material desde Clases
- **THEN** la superficie ofrece una salida explícita a Clases o al objeto contextual y no depende exclusivamente del botón Back del visor de Figma

#### Scenario: Cierre de overlay
- **WHEN** la persona cancela un overlay de creación, importación o confirmación
- **THEN** el overlay se cierra y revela exactamente la superficie que lo abrió

### Requirement: Destinos y resultados honestos
Cada hotspot visible SHALL tener un destino específico de acuerdo con su tipo de acción, y los estados de resultado SHALL describir el estado de prototipo sin fingir una integración externa.

#### Scenario: Acción de módulo
- **WHEN** la persona selecciona una acción global o contextual
- **THEN** llega a la experiencia o al objeto correspondiente, no a un frame genérico reutilizado solo por compartir estructura visual

#### Scenario: Confirmación de Mensajería o IA
- **WHEN** la persona confirma un borrador de Mensajería o revisa una propuesta del Asistente de IA
- **THEN** el prototipo muestra un resultado revisable y declara que no efectuó un envío ni una llamada a proveedor real

#### Scenario: Estado no disponible
- **WHEN** una experiencia depende de una capacidad no implementada como red, proveedor de IA o sincronización
- **THEN** el frame muestra un estado honesto con siguiente paso o recuperación, sin un éxito falso

#### Scenario: Estado de carga o sin contenido
- **WHEN** una ruta representa una lista, una respuesta o un espacio de trabajo que todavía no tiene contenido disponible
- **THEN** el prototipo distingue carga de ausencia de contenido, explica qué puede hacer el docente y conserva una salida semántica al módulo de origen

### Requirement: Evidencia de recorridos navegables
El change SHALL mantener una matriz versionada de hotspots, destinos, retornos y evidencia por breakpoint para los golden journeys del prototipo.

#### Scenario: Verificación de journey
- **WHEN** se valida un journey desde Escritorio, Office, Clases, Asistente de IA, Mensajería, Agenda, Reportes o Cuenta
- **THEN** la matriz registra origen, control, destino, salida esperada, breakpoint y evidencia de reproducción manual

#### Scenario: Revisión de accesibilidad
- **WHEN** se revisa un hotspot en escritorio, tablet o móvil
- **THEN** el control tiene etiqueta legible, contraste gobernado por tokens, área de toque de al menos 44 pt o una justificación documentada, y no depende solo del color para expresar estado

### Requirement: El prototipo de Clases demuestra su arquitectura interna completa

El prototipo Figma SHALL hacer navegables la entrada a Clases, Tablón, Trabajo de clase, Personas y
Seguimiento en desktop, tablet y móvil. Todo hotspot SHALL registrar origen, acción, destino y retorno en la
matriz de navegación. La navegación global canónica y el estado activo de Clases SHALL permanecer visibles
o alcanzables según el breakpoint, sin redirigir una interacción móvil a un frame desktop.

#### Scenario: Se recorre Clases desde el launcher candidate

- **WHEN** el docente abre Clases desde la copia candidate de Escritorio en móvil, tablet o web
- **THEN** aterriza en la entrada de Clases del mismo breakpoint, el módulo aparece activo y puede volver mediante el contrato global vigente sin modificar los destinos cerrados por #156

#### Scenario: Se recorren las cinco superficies por breakpoint

- **WHEN** se ejecutan los journeys de entrada y clase en desktop, tablet y móvil
- **THEN** cada origen llega al frame del mismo breakpoint, conserva labels y objeto activo y ofrece un retorno explícito

#### Scenario: Se cierra un overlay de Clases

- **WHEN** el docente cancela o completa anuncio, actividad, selector o confirmación
- **THEN** el overlay cierra hacia la superficie y objeto que lo abrió, sin depender exclusivamente del Back del visor

### Requirement: El prototipo de Clases conserva historial y aprobación verificable

Los frames de Clases existentes SHALL conservarse como historial draft. Los frames nuevos SHALL permanecer
identificados como candidate hasta que el owner registre aprobación visual explícita después de Present.
Figma API, capturas, Playwright, checklist o tests SHALL NOT cambiar por sí solos el estado a approved ni
cerrar #46.

#### Scenario: Se crea la versión candidata

- **WHEN** se agregan los nuevos frames y conexiones de Clases
- **THEN** los frames históricos siguen disponibles, la versión nueva se identifica como candidate y existe una ruta de rollback por historial

#### Scenario: La evidencia automática queda verde

- **WHEN** la matriz, capturas, recorridos y checklists pasan sin fallos bloqueantes
- **THEN** el prototipo permanece candidate hasta recibir aprobación humana explícita

#### Scenario: El owner rechaza o condiciona la composición

- **WHEN** la revisión humana no aprueba la versión candidata
- **THEN** se itera o restaura el frame previo y no se habilita el handoff al change runtime

### Requirement: El rollback Figma usa mecanismos soportados y verificables

Toda ola del prototipo Figma SHALL conservar una ruta de rollback compuesta por historial automatico del
archivo, frames historicos sin inicio activo, una seccion identificada por modulo, estado y version, y
evidencia enlazada del gate humano y del destino de restauracion. Un checkpoint nombrado SHALL ser
opcional y SHALL registrarse solo cuando la herramienta activa confirme que lo creo; su ausencia no
invalida el rollback si las cuatro condiciones obligatorias estan verificadas.

#### Scenario: La herramienta no soporta un checkpoint nombrado

- **WHEN** el conector rechaza de forma atomica la creacion de una version nombrada
- **THEN** la ola documenta la limitacion, verifica historial automatico, frames historicos, seccion versionada y evidencia enlazada, y no afirma que el checkpoint existe

#### Scenario: Falta una condicion obligatoria de rollback

- **WHEN** no puede demostrarse historial, frame previo, identificacion de version/estado o destino documentado de restauracion
- **THEN** el frame permanece `candidate` y no se promueve hasta restaurar una ruta de rollback verificable

#### Scenario: El owner rechaza una version candidata

- **WHEN** el gate humano rechaza o condiciona la composicion
- **THEN** la ola itera el candidate o restaura el destino historico documentado sin borrar las versiones previas

### Requirement: El handoff Figma-runtime se expresa mediante roles semanticos

El prototipo Figma SHALL identificar colores por rol perceptual de canvas, superficie, texto, borde,
accion, seleccion, estado y elevacion. La evidencia de handoff SHALL asociar cada rol con una familia de
`ColorTokens` consumida mediante `useAppTheme` o documentar que falta un token versionado. El handoff
SHALL NOT ordenar copiar valores hex incidentales ni declarar paridad solo porque dos valores coinciden.

#### Scenario: Un modulo aprobado pasa a un change runtime

- **WHEN** se prepara la implementacion de una superficie aprobada en Figma
- **THEN** el inventario nombra los roles usados, sus familias de tokens candidatas, diferencias conocidas y pruebas requeridas en claro, oscuro, alto contraste y daltonismo

#### Scenario: No existe token equivalente

- **WHEN** un rol aprobado no tiene equivalente semantico en `ColorTokens`
- **THEN** el change runtime propone un token versionado con contraste, compatibilidad y rollback o conserva el drift declarado, y no introduce un literal para aparentar paridad

#### Scenario: El prototipo comunica un estado

- **WHEN** un frame muestra seleccion, riesgo, exito, error, offline o sync pendiente
- **THEN** el estado se entiende tambien por texto, estructura o iconografia y no depende solo del color ni del movimiento

### Requirement: La validacion de daltonismo conserva la frontera Figma-runtime

El prototipo Figma SHALL demostrar señales no dependientes del color y SHALL NOT requerir por defecto
modos de variables para protanopia, deuteranopia o tritanopia. La validacion funcional de esos modos
SHALL pertenecer al runtime mediante `DaltonismoContext` compuesto por `useAppTheme`. Un modo Figma
especifico SHALL reabrirse solo con evidencia de un defecto cromatico que pueda prevenir.

#### Scenario: Figma no tiene modos especificos de daltonismo

- **WHEN** la auditoria confirma contraste y señales textuales, estructurales o iconograficas suficientes
- **THEN** el prototipo puede avanzar a su gate humano sin afirmar que probo el comportamiento funcional de `DaltonismoContext`

#### Scenario: El change runtime implementa el frame aprobado

- **WHEN** la superficie se valida con un modo de daltonismo activo
- **THEN** obtiene los colores filtrados desde `useAppTheme`, conserva todas las señales no-color y no usa una simulacion Figma como sustituto de la prueba

#### Scenario: Aparece evidencia de un defecto no prevenido

- **WHEN** una prueba con docentes, auditoria de contraste o comparacion runtime demuestra una confusion cromatica concreta
- **THEN** se reabre la decision del modo Figma con defecto, superficie, criterio preventivo y owner documentados

