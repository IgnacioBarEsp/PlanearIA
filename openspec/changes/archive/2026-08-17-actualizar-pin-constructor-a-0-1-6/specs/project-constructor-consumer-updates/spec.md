## ADDED Requirements

### Requirement: La identidad declarada por la release fijada resuelve al upstream vigente

El contrato de consumidor SHALL verificar que los metadatos de identidad de la release instalada
—`repository`, `homepage` y `bugs`— apunten al owner vigente del upstream que administra los archivos.
La verificación SHALL ejecutarse sobre el paquete instalado en el árbol de dependencias, sin consultar la
red. El upstream esperado SHALL declararse una sola vez en el contrato de consumidor, junto a la versión
esperada, y SHALL NOT derivarse de la identidad del propio repositorio consumidor, que puede diferir en un
fork legítimo. Una discrepancia SHALL producir `FAIL` nombrando el campo y el valor encontrado. El contrato
SHALL NOT tratar la coincidencia de número de versión entre manifiesto, lockfile, instalación y CLI como
prueba suficiente de identidad.

#### Scenario: La release fijada declara un owner que ya no existe

- **WHEN** el consumidor fija una release cuyos `repository`, `homepage` o `bugs` nombran un owner anterior
  del upstream, aunque manifiesto, lockfile, instalación y `--version` coincidan en el número
- **THEN** el contrato de consumidor falla e identifica el campo y el valor obsoleto
- **AND** no declara sano al consumidor por el solo hecho de que la versión sea consistente

#### Scenario: Renombrado del upstream

- **WHEN** el proyecto que publica el CLI cambia de owner y el consumidor conserva una release anterior a
  ese cambio
- **THEN** la siguiente ejecución del contrato falla y obliga a decidir de forma explícita entre subir a una
  release con la identidad corregida o registrar por qué se conserva la anterior
- **AND** la decisión queda registrada con su razón, sin permitir que el pin obsoleto sobreviva en silencio

#### Scenario: Consumidor con identidad coherente

- **WHEN** la release instalada declara el owner vigente en los tres campos y las cuatro fuentes de versión
  coinciden
- **THEN** el contrato pasa sin excepciones
- **AND** el resultado cubre versión e identidad, no sólo versión
