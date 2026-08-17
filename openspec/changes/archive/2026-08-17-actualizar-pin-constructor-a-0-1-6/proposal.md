## Why

PlanearIA fija `create-project-engineering-os` en `0.1.4`, y esa release publicada declara `repository`,
`homepage`, `bugs` y `author` con el handle anterior `RitualBoat`. La migración de handle (#165) recorrió el
repositorio, pero no podía tocar los metadatos de un paquete ya publicado en npm, así que el pin quedó como
el último punto de la cadena de herramientas que apunta a una identidad que ya no existe.

Lo que falta es subir el pin de forma deliberada y, sobre todo, cerrar el hueco que dejó pasar el problema:
**ninguna verificación comprueba la identidad declarada por la release fijada**, así que un renombrado futuro
volvería a sobrevivir en silencio.

**El destino se movió durante la implementación.** El change nació apuntando a `0.1.5`, la última versión
publicada al proponerlo. La verificación previa descubrió que esa release tiene su propio defecto:
`blueprint/core/package.json` fija `0.1.5` pero `blueprint/core/package-lock.json` quedó en `0.1.4`, así que
todo proyecto arrancado con ella falla su propio `release.identity`. Se reportó en
[project-engineering-os#16](https://github.com/IgnacioBarEsp/project-engineering-os/issues/16), el owner
publicó `0.1.6` con ambos archivos coherentes y el pin va a esa versión.

## What Changes

- Subir el pin exacto de `create-project-engineering-os` de `0.1.4` a `0.1.6` en `package.json` y refrescar
  el lockfile, conservando el pin exacto y sin abrir el rango.
- Actualizar `EXPECTED_VERSION` en `scripts/testProjectEngineeringOsConsumer.mjs`, que hoy fija `0.1.4` y
  compara manifiesto, lockfile, instalación y `--version`.
- Añadir al test de contrato la verificación que faltaba: `repository.url`, `homepage` y `bugs.url` de la
  release instalada deben resolver al owner vigente del upstream. Una discrepancia es `FAIL`, no un aviso.
- Registrar el salto conforme al ADR de cadencia de dependencias, con la razón y lo verificado.
- Verificar la release antes de fijarla y tratar cualquier cambio de comportamiento en gates, harness o motor
  de deuda como bloqueante. Esa verificación es la que detuvo `0.1.5` y llevó a `0.1.6`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `project-constructor-consumer-updates`: su requisito "Cada consumidor fija e identifica su release" exige
  hoy versión exacta, schema e identidad verificable, pero sus escenarios sólo comprueban que manifiesto,
  lockfile, instalación y state coincidan en el número. No cubre que la identidad **declarada por esa
  release** siga resolviendo al upstream vigente. Se añade esa condición y su escenario negativo.

## Impact

- `package.json` y `package-lock.json`: pin exacto y árbol de dependencias.
- `scripts/testProjectEngineeringOsConsumer.mjs`: constante de versión y aserciones de identidad.
- Documentación de cadencia de dependencias: registro del salto.
- Sin cambios en `src/`, `backend/`, datos, storage, sync ni IA. Sin runtime tocado.
- Riesgo real: el constructor gobierna los gates de readiness, el harness y el motor de deuda. Una subida a
  ciegas puede alterar el comportamiento de cierre, por eso `constructor:check`,
  `test:project-os-contract` y `debt:check` son parte del criterio y no una verificación posterior.
- Issue: [#171](https://github.com/IgnacioBarEsp/PlanearIA/issues/171).
