## ADDED Requirements

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

