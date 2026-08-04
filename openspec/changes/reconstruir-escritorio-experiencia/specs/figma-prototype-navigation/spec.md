## ADDED Requirements

### Requirement: El grafo de Escritorio demuestra sus tres capas y retornos

El prototipo Figma SHALL hacer navegables launcher, atención y continuidad de Escritorio en desktop,
tablet y móvil. Todo hotspot SHALL registrar origen, control, destino, owner, retorno, estado y breakpoint
en la matriz de navegación. “Nuevo archivo” SHALL recorrer el selector tipo-primero y cada objeto SHALL
abrir un destino específico del mismo breakpoint, no un frame genérico por semejanza visual.

#### Scenario: Se recorre una prioridad desde Escritorio

- **WHEN** el docente activa una tarea, asistencia, mensaje, evento o borrador desde Escritorio
- **THEN** llega al objeto/filtro owner del mismo breakpoint y una salida visible vuelve al origen de Escritorio

#### Scenario: Se recorre creación tipo-primero

- **WHEN** el docente abre “Nuevo archivo”, elige un tipo y entra al handoff representado
- **THEN** llega al destino correspondiente, puede cancelar o volver a Escritorio y no aterriza primero en un Office Home genérico

#### Scenario: Se verifican los tres breakpoints

- **WHEN** se ejecutan E-01 iniciar/atender, E-02 crear, E-03 continuar/volver y E-04 offline/sync en móvil, tablet y web
- **THEN** cada recorrido conserva labels, owner, estado, destino y retorno sin hotspots cruzados entre breakpoints

### Requirement: La aprobación previa de puentes no aprueba Escritorio

Los nodos `198:695`, `198:776` y `198:809` SHALL conservarse como baseline histórico de los puentes hacia
Clases y SHALL NOT tratarse como aprobación de Escritorio por contener `approved` en su nombre. Los nuevos
frames SHALL vivir en una sección/version `candidate` identificable y SHALL permanecer candidate hasta que
el owner registre aprobación visual explícita después de Figma Present.

#### Scenario: Se crea la versión candidata de Escritorio

- **WHEN** se agregan frames, componentes y conexiones de Escritorio
- **THEN** los nodos previos siguen disponibles, la nueva sección identifica módulo, versión y estado, y existe destino documentado de rollback

#### Scenario: La evidencia automática pasa

- **WHEN** API, matriz, capturas, recorridos y checklists no presentan fallos bloqueantes
- **THEN** Escritorio permanece candidate y no se declara aprobado ni listo para runtime sin decisión humana explícita

#### Scenario: El owner rechaza o condiciona el candidate

- **WHEN** la revisión humana no reconoce launcher y jornada o detecta pérdida de contexto
- **THEN** se itera o restaura la composición, no se promueven frames y no se habilita un issue/change runtime
