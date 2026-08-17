# Brownfield baseline: actualizar el pin del constructor

## Superficies tocadas

- `package.json`: entrada `devDependencies["create-project-engineering-os"]`, hoy `0.1.4`.
- `package-lock.json`: entrada `node_modules/create-project-engineering-os`.
- `scripts/testProjectEngineeringOsConsumer.mjs`: constante `EXPECTED_VERSION` y aserciones sobre el paquete
  instalado.
- Documentación de cadencia de dependencias: registro del salto.

No se tocan `src/`, `backend/`, `openspec/specs/` a mano, `.project-os/debt/` ni ninguna otra dependencia.

## Fuentes de verdad actuales

- `openspec/specs/project-constructor-consumer-updates/spec.md`, requisito "Cada consumidor fija e
  identifica su release".
- `openspec/specs/dependency-update-cadence/spec.md` y el ADR de cadencia de dependencias.
- `scripts/testProjectEngineeringOsConsumer.mjs` como contrato ejecutable del consumidor.
- Upstream `IgnacioBarEsp/project-engineering-os` y el registro npm como estado real de las releases.

## Comportamiento vigente

El contrato de consumidor compara cuatro fuentes de versión —manifiesto, lockfile, paquete instalado y
`project-os --version`— y exige que coincidan en `0.1.4`. Pasa en verde.

Ninguna comprobación mira `repository`, `homepage`, `bugs` ni `author` del paquete instalado. La release
`0.1.4` declara los cuatro con el owner anterior `RitualBoat`, y como el número es consistente en las cuatro
fuentes, el contrato no lo detecta. El renombrado de handle del repositorio atravesó el proyecto sin que
nada señalara la discrepancia.

## Comportamiento objetivo

El pin queda en `0.1.5`, cuya identidad publicada corresponde al owner vigente. El contrato de consumidor
verifica, además de la versión, que `repository.url`, `homepage` y `bugs.url` del paquete instalado resuelvan
al owner vigente, derivando el valor esperado de una fuente única y sin consultar la red. Una discrepancia
produce `FAIL`.

Si `0.1.5` altera el comportamiento de gates, harness o motor de deuda, el objetivo válido es conservar
`0.1.4` con la limitación documentada y la verificación de identidad igualmente implementada.

## Compatibilidad legacy

El pin exacto se conserva como práctica: no se abre a rango ni a `latest`, que el contrato prohíbe como
identidad reproducible. No se salta a `0.1.6`, presente en el repositorio upstream pero no publicada en npm.
El estado de `.project-os/` no se migra ni se reescribe; los assessments y el registro de deuda permanecen
tal cual. Los archivos administrados por el constructor conservan su ownership.

## Owner de spec y contexto

- Spec: `project-constructor-consumer-updates`.
- Plan: `Documentacion/01-planes-maestros/PLAN_CONSTRUCTOR_PROYECTOS_NUEVOS.md`.
- Plan de deuda que enruta el flujo: `preparacion-operativa-sdd-harness`.
- Issue: [#171](https://github.com/IgnacioBarEsp/PlanearIA/issues/171).

## Evidencia actual

- `package.json:141` declara `"create-project-engineering-os": "0.1.4"`.
- `node_modules/create-project-engineering-os/package.json` declara `repository`, `homepage` y `bugs` con
  `RitualBoat`, y `author: "RitualBoat contributors"`.
- `npm view create-project-engineering-os versions` devuelve `0.0.0, 0.1.1, 0.1.2, 0.1.3, 0.1.4, 0.1.5`.
- La versión `0.1.5` publicada declara `IgnacioBarEsp` en los tres campos y `author: "Ignacio Barboza
  Espinoza"`.
- El repositorio upstream va en `0.1.6` y una búsqueda de código no devuelve referencias a `RitualBoat`.
- Gate `npm run openspec:ready:propose -- --issue 171`: PASS 10/10.

## Fuera de alcance

Runtime, backend, datos, storage, sync, IA y cualquier otra dependencia. No se modifica el upstream, que ya
está corregido. No se cambia configuración del motor de deuda ni de los gates. No se verifica identidad
consultando la red. No se generaliza la verificación a todas las dependencias del proyecto: el contrato
cubre la release que administra archivos, no el árbol completo.
