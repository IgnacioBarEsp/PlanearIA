## ADDED Requirements

### Requirement: El grafo de Office resuelve en su propio ancho de frame

El prototipo Figma SHALL hacer navegables creación, biblioteca y acciones sobre el archivo de Office en
desktop, tablet y móvil. Todo hotspot SHALL registrar origen, control, destino, owner, retorno, estado y
breakpoint en la matriz de navegación. La auditoría de la sección de Office SHALL clasificar el breakpoint
**por ancho de frame** y SHALL NOT clasificarlo por nombre de nodo; SHALL contar también las aristas que
salen de la sección hacia otras secciones; y SHALL NOT dar por cumplido un destino de móvil o tablet sin
verificar el ancho del frame destino. La sección SHALL reportar cero fugas dispositivo a dispositivo antes
de cerrarse.

#### Scenario: Se audita la sección de Office por ancho de frame

- **WHEN** se recorre cada `reactions[].actions[]` de la sección de Office resolviendo el frame de nivel superior de origen y destino, excluyendo overlays
- **THEN** cada arista une frames del mismo ancho y el conteo de fugas dispositivo a dispositivo es cero, incluidas las aristas que salen de la sección

#### Scenario: Se recorre crear desde tablet

- **WHEN** el docente elige un tipo desde Office en 768
- **THEN** el destino mide 768 de ancho, o es el estado de límite que nombra la ausencia de editor y devuelve al origen exacto

#### Scenario: Se recorre una acción de archivo desde móvil

- **WHEN** el docente activa asignar o adjuntar desde la fila de un archivo en 390
- **THEN** llega a una superficie del contexto de 390 —la hoja Asignar como overlay dimensionado para ese ancho, o Mensajería en 390— y su retorno vuelve a Office en 390, sin entregar ningún frame de 1440. Cuando el módulo owner todavía no tiene superficie en ese ancho, el destino es el estado de límite de ese mismo ancho

#### Scenario: Un frame mal nombrado no acredita su breakpoint

- **WHEN** un frame de la sección declara tablet en su nombre pero mide 1440 de ancho
- **THEN** la auditoría lo clasifica como escritorio y lo reporta como fuga, sin aceptar el nombre como evidencia

### Requirement: La etiqueta heredada de los frames de Office no aprueba Office

Los nodos `257:951`, `277:958` y `274:958` SHALL conservarse como baseline histórico de los puentes de
Office y SHALL NOT tratarse como superficie vigente ni como aprobación del módulo. `277:958` SHALL
reconocerse como superficie de escritorio pese a declarar tablet en su nombre. Los frames nuevos SHALL
vivir en una sección o versión `candidate` identificable y SHALL permanecer candidate hasta que el owner
registre aprobación visual explícita después de Figma Present.

#### Scenario: Se crea la versión candidata de Office

- **WHEN** se agregan frames, componentes y conexiones de Office
- **THEN** viven en una sección candidate identificable, los tres frames heredados permanecen intactos y ninguno se promueve por inferencia

#### Scenario: Se intenta acreditar tablet por el nombre del nodo

- **WHEN** alguien invoca `277:958` como evidencia de que Office ya tiene superficie de tablet
- **THEN** la evidencia se rechaza porque el nodo mide 1440x960 y es un clon del frame de escritorio

#### Scenario: Se cierra la ola sin aprobación humana

- **WHEN** la auditoría automática, las capturas y la matriz de navegación están completas pero el owner no ha emitido veredicto tras Present
- **THEN** los frames permanecen candidate y la ola no se declara aprobada
