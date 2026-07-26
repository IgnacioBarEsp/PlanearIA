## ADDED Requirements

### Requirement: El fallo de escritura se distingue del fallo de carga y nombra lo ya guardado

El selector SHALL distinguir el fallo de carga de destinos del fallo de escritura de la asignacion, y SHALL NOT presentar uno con el titulo, el mensaje o la accion de recuperacion del otro. Presentarlos con el mismo lenguaje produce un aviso que nombra una causa que no ocurrio y una accion que no repara lo que fallo.

La recuperacion que el selector ofrece SHALL corresponder a la causa: recargar los destinos cuando fallo la carga, y reintentar la asignacion cuando fallo la escritura.

Cuando una escritura fallida alcanzo a modificar y encolar parte de los elementos, el selector SHALL informar cuantos quedaron guardados y cuantos siguen pendientes. SHALL NOT presentar el fallo como si no se hubiera guardado nada, porque lo ya escrito quedo encolado y se subira igual.

Un reintento de la escritura SHALL escribir unicamente los elementos que aun no quedaron escritos y encolados hacia el destino vigente, y el conteo informado SHALL acumular los intentos, de modo que el resultado final diga cuantos elementos quedaron asignados y no cuantos entraron en el ultimo intento. Cuando el destino cambia despues de un fallo parcial, el reintento SHALL escribir de nuevo todos los elementos hacia el destino nuevo, porque lo escrito antes apunta al destino anterior.

#### Scenario: Falla la escritura de la asignacion

- **WHEN** el docente confirma y la escritura de la asignacion falla
- **THEN** el selector presenta el error como un fallo de la asignacion y su accion de recuperacion reintenta la asignacion, no la carga de destinos

#### Scenario: Falla la carga de destinos y no se confunde con la escritura

- **WHEN** la carga de destinos falla
- **THEN** el selector presenta el error como un fallo de carga y su accion de recuperacion recarga los destinos, sin usar el lenguaje ni la accion del fallo de escritura

#### Scenario: La escritura falla despues de guardar parte de los elementos

- **WHEN** la escritura falla habiendo modificado y encolado ya algunos de los elementos
- **THEN** el selector informa cuantos elementos quedaron guardados y cuantos siguen pendientes, y no afirma que no se guardo nada

#### Scenario: El docente reintenta tras un fallo parcial

- **WHEN** el docente reintenta la asignacion tras un fallo parcial sin cambiar el destino
- **THEN** solo se escriben y encolan los elementos que quedaban pendientes, y el resultado informa el total acumulado de elementos asignados, no solo los del ultimo intento

#### Scenario: El docente cambia el destino tras un fallo parcial

- **WHEN** el docente cambia el destino elegido despues de un fallo parcial y vuelve a confirmar
- **THEN** todos los elementos se escriben hacia el destino nuevo, incluidos los que ya se habian escrito hacia el destino anterior
