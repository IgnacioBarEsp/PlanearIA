> **Estado: en pausa.** Las tareas 1.x, 2.x y 3.x están hechas sobre `0.1.5`, pero 1.4 destapó un defecto de esa release que hace fallar el contrato de consumidor. El grupo 4 no puede cerrarse hasta decidir entre publicar `0.1.6` upstream, permanecer en `0.1.4` o aceptar una excepción temporal. La decisión afecta al comportamiento objetivo, así que `brownfield-baseline.md` y `TLDR.md` se actualizan después de tomarla.

## 1. Verificar antes de fijar

- [x] 1.1 Instalar `create-project-engineering-os@0.1.5` sin consolidar el pin y registrar la diferencia de contenido frente a `0.1.4`: binarios expuestos, contratos de `preProposeGate` y `preArchiveGate`, comandos de `--help` y schema de deuda. Evidencia: se descomprimieron ambos tarballs publicados y se compararon los arboles completos. Solo difieren seis archivos: CHANGELOG.md, LICENSE, README.md, package.json, blueprint/manifest.json y blueprint/core/package.json. Ninguno esta en bin/, src/, scripts/ ni schema/: 0.1.5 es una release de identidad sin cambio de comportamiento.
- [x] 1.2 Ejecutar con `0.1.5` instalada `npm run constructor:check`, `npm run test:project-os-contract` y `npm run debt:check`, y clasificar cada diferencia de comportamiento como neutra o bloqueante. Resultado: `debt:check` identico. `constructor:check` y `test:project-os-contract` FALLAN, y el fallo es correcto: destapan un defecto de la propia release 0.1.5, no del consumidor. Ver 1.4.
- [x] 1.3 Comprobar que `.project-os/debt/registry.json` y los assessments conservan su contenido y que `debt:check` reporta el mismo presupuesto por plan que antes de la subida. Resultado: registry.json y config.json byte a byte identicos (sha256 e9b27f54ff0eeb5c y c5bd1b3e280290b0 antes y despues), 26 items, mismo presupuesto por plan. El motor de deuda no cambia con 0.1.5.

- [x] 1.4 **Hallazgo bloqueante.** La release publicada `0.1.5` fija `blueprint/core/package.json` en `0.1.5` pero deja `blueprint/core/package-lock.json` en `0.1.4`. Como el bootstrap escribe ambos en el proyecto generado, todo proyecto arrancado con `0.1.5` falla su propio `release.identity` (`declared 0.1.5`, `installed 0.1.5`, `locked 0.1.4`). El test de contrato lo detecta porque arranca un proyecto de prueba y le exige `doctor` en PASS. El repositorio upstream ya lo corrigió en `0.1.6`, que **no está publicada** en npm. Reportado en [project-engineering-os#16](https://github.com/IgnacioBarEsp/project-engineering-os/issues/16). Decisión del owner pendiente.

## 2. Consolidar el pin

- [x] 2.1 Fijar `"create-project-engineering-os": "0.1.5"` en `package.json`, conservando el pin exacto, y refrescar `package-lock.json` sin abrir el rango ni tocar otras dependencias.
- [x] 2.2 Actualizar `EXPECTED_VERSION` en `scripts/testProjectEngineeringOsConsumer.mjs` y confirmar que las cuatro fuentes que ya compara —manifiesto, lockfile, paquete instalado y `project-os --version`— coinciden en `0.1.5`.
- [x] 2.3 Verificar que ninguna ruta del repositorio siga resolviendo a `0.1.4`: busqueda de la cadena en package.json, lockfile, scripts y documentacion operativa. Los unicos 0.1.4 del lockfile raiz son deep-is e imurmurhash, sin relacion. La documentacion operativa que cita 0.1.4 se actualiza en 4.1 junto con el registro de cadencia.

## 3. Cerrar el hueco que dejó pasar el problema

- [x] 3.1 Añadir al contrato de consumidor la verificación de identidad de la release instalada sobre `repository.url`, `homepage` y `bugs.url`, declarando el upstream esperado una sola vez como constante junto a `EXPECTED_VERSION` y sin consultar la red. Una discrepancia produce `FAIL` nombrando campo y valor. El design se corrigió durante la implementación: no existe una fuente única previa del owner del upstream, y derivarlo del owner de este repositorio haría fallar en falso a un fork legítimo.
- [x] 3.2 Probar la aserción en negativo: simular metadatos con un owner anterior y confirmar que el contrato falla e identifica el campo, en vez de pasar porque la versión coincide.
- [x] 3.3 Confirmar que el upstream esperado aparece una sola vez: `grep -c "IgnacioBarEsp/project-engineering-os" scripts/testProjectEngineeringOsConsumer.mjs` devuelve 1 fuera del fixture negativo, así que cambiar la constante basta para exigir un owner distinto.

## 4. Trazabilidad y cierre

- [ ] 4.1 Registrar el salto `0.1.4` a `0.1.5` conforme al ADR de cadencia de dependencias, con la razón, el bucket que le corresponde y la evidencia de los tres checks.
- [ ] 4.2 Actualizar `brownfield-baseline.md`, creado en propose, si el alcance o el comportamiento objetivo cambian durante la implementación, en particular si 1.2 o 1.3 obligan a conservar `0.1.4`.
- [ ] 4.3 Actualizar el `TLDR.md`, creado en propose, si cambian alcance, archivos, comportamiento o resultado esperado; conservar los cinco bloques en orden y el máximo de 120 palabras.
- [ ] 4.4 Ejecutar `openspec validate --all --strict --no-interactive`, `npm run agent:harness:check`, `npm run constructor:check`, `npm run test:project-os-contract`, `npm run debt:check` y `git diff --check`; registrar resultados reales sin declarar verificaciones que no se corrieron.
- [ ] 4.5 Capturar el assessment de deuda del flujo aunque el resultado sea `clean`, y ejecutar `npm run openspec:ready:archive -- --change actualizar-pin-constructor-a-0-1-5 --run-local` hasta PASS.
- [ ] 4.6 Si 1.2 o 1.3 resultaron bloqueantes, cerrar el change conservando `0.1.4`: documentar la limitación, dejar la verificación de identidad implementada y declarar en el issue por qué no se subió. La verificación de 3.1 aplica igual y hará fallar el contrato hasta que exista una release compatible con identidad corregida.
