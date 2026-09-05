## ADDED Requirements

### Requirement: El grafo de NotasPLAN resuelve en su ancho y en su destino correcto

El prototipo Figma SHALL hacer navegables la hoja, el índice, la lente de formulario, las herramientas y las
acciones del documento en desktop, tablet y móvil. Todo hotspot SHALL registrar origen, control, destino,
owner, retorno, estado y breakpoint en la matriz de navegación. La auditoría SHALL clasificar el breakpoint
**por ancho de frame**, SHALL contar también las aristas que salen de la sección, y SHALL NOT dar por
cumplido un destino sin verificar el ancho del frame destino.

Además, la auditoría SHALL verificar que **cada control aterrice en el destino que le corresponde**, y no
únicamente en un destino del ancho correcto. Un control cuyo destino tenga el ancho correcto pero la
identidad equivocada SHALL reportarse como fallo.

#### Scenario: Se audita la sección por ancho de frame

- **WHEN** se recorre cada `reactions[].actions[]` de la sección de NotasPLAN resolviendo el frame de nivel superior de origen y destino, excluyendo overlays
- **THEN** cada arista une frames del mismo ancho y el conteo de fugas dispositivo a dispositivo es cero, incluidas las aristas que salen de la sección

#### Scenario: Se audita la corrección del destino

- **WHEN** se recorre cada control de índice, de nivel de plantilla y de acción del documento
- **THEN** cada uno aterriza en la superficie que su etiqueta anuncia, y un destino del ancho correcto pero de identidad equivocada se reporta como fallo

#### Scenario: Se abre una familia de documento que no existe

- **WHEN** el docente activa Instrumento de evaluación o Documento académico desde cualquier breakpoint
- **THEN** llega al estado de límite de su propio ancho y su salida devuelve al origen exacto

### Requirement: La etiqueta draft de los frames de documento no aprueba NotasPLAN

Los nodos `62:3`, `66:40`, `151:77` y `151:123` SHALL conservarse como baseline histórico del editor de
documentos y SHALL NOT tratarse como superficie vigente ni como aprobación del módulo. SHALL reconocerse que
los cuatro miden 1440x960 y que **no existe ninguna superficie de editor en 768 ni en 390**. Los frames
nuevos SHALL vivir en una sección o versión `candidate` identificable y SHALL permanecer candidate hasta que
el owner registre aprobación visual explícita después de Figma Present.

#### Scenario: Se crea la versión candidata de NotasPLAN

- **WHEN** se agregan frames, componentes y conexiones del editor
- **THEN** viven en una sección candidate identificable, los cuatro frames heredados permanecen intactos y ninguno se promueve por inferencia

#### Scenario: Se invoca un draft como evidencia de paridad responsive

- **WHEN** alguien invoca `62:3` o `151:123` como prueba de que el editor ya existe fuera de escritorio
- **THEN** la evidencia se rechaza porque ambos miden 1440x960 y ninguna superficie de editor existe en 768 ni en 390
