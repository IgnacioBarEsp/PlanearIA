## ADDED Requirements

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
