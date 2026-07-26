## MODIFIED Requirements

### Requirement: Un solo selector resuelve asignar y adjuntar en toda la app

El sistema SHALL resolver la accion de asignar o adjuntar un elemento existente a un destino academico mediante un unico componente selector compartido, alimentado por un unico ViewModel. Ninguna superficie SHALL construir su propio selector de destino, ni su propio dialogo de confirmacion de asignacion, ni duplicar la logica de resolucion de destinos.

El selector SHALL recibir por contrato los elementos a asignar, de modo que cualquier superficie pueda montarlo sin conocer su implementacion interna, y SHALL NOT depender de una pantalla concreta ni obligar a navegar fuera del contexto de trabajo del docente.

Una superficie SHALL ofrecer la accion de asignar unicamente sobre elementos que el selector compartido admite. Cuando un elemento pertenece a un tipo que el selector no puede asignar, la superficie SHALL NOT presentar la accion, ni activa, ni inerte, ni sustituida por un aviso de disponibilidad futura. Ofrecerla produciria un control que no puede cumplir lo que anuncia, que es el mismo defecto que la spec ya prohibe un nivel mas abajo para los niveles de destino.

#### Scenario: Dos superficies distintas ofrecen asignar

- **WHEN** dos superficies distintas de la app ofrecen asignar un elemento
- **THEN** ambas presentan el mismo selector, con la misma estructura de destinos y el mismo lenguaje de confirmacion

#### Scenario: Una superficie intenta construir su propio selector

- **WHEN** se inspecciona el codigo de las superficies que asignan mediante el selector compartido
- **THEN** ninguna declara su propia lista de destinos, su propio dialogo de confirmacion ni su propia ejecucion de la asignacion

#### Scenario: Asignar sin abandonar el trabajo

- **WHEN** el docente inicia una asignacion desde la superficie donde esta trabajando
- **THEN** el selector se abre sobre esa superficie y, al cerrarse, el docente permanece donde estaba

#### Scenario: La superficie lista elementos de un tipo que el selector no admite

- **WHEN** el docente abre las opciones de un elemento cuyo tipo el selector compartido no puede asignar
- **THEN** la accion de asignar no aparece entre esas opciones

#### Scenario: La superficie mezcla tipos admitidos y no admitidos

- **WHEN** una misma superficie lista elementos de tipos que el selector admite junto a elementos de tipos que no admite
- **THEN** la accion de asignar aparece solo en las opciones de los elementos admitidos y abre el selector compartido para ellos

#### Scenario: Un tipo no admitido no se resuelve con un aviso de disponibilidad futura

- **WHEN** se inspeccionan las opciones de un elemento de un tipo que el selector no admite
- **THEN** no existe un control de asignar deshabilitado ni un aviso que prometa la accion para mas adelante
