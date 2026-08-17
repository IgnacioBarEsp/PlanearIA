## 1. Verificar antes de fijar

- [ ] 1.1 Instalar `create-project-engineering-os@0.1.5` sin consolidar el pin y registrar la diferencia de contenido frente a `0.1.4`: binarios expuestos, contratos de `preProposeGate` y `preArchiveGate`, comandos de `--help` y schema de deuda. Evidencia: salida comparada de ambas versiones.
- [ ] 1.2 Ejecutar con `0.1.5` instalada `npm run constructor:check`, `npm run test:project-os-contract` y `npm run debt:check`, y clasificar cada diferencia de comportamiento como neutra o bloqueante. Una diferencia bloqueante detiene la subida.
- [ ] 1.3 Comprobar que `.project-os/debt/registry.json` y los assessments conservan su contenido y que `debt:check` reporta el mismo presupuesto por plan que antes de la subida. Cualquier cambio de estado del motor de deuda es bloqueante.

## 2. Consolidar el pin

- [ ] 2.1 Fijar `"create-project-engineering-os": "0.1.5"` en `package.json`, conservando el pin exacto, y refrescar `package-lock.json` sin abrir el rango ni tocar otras dependencias.
- [ ] 2.2 Actualizar `EXPECTED_VERSION` en `scripts/testProjectEngineeringOsConsumer.mjs` y confirmar que las cuatro fuentes que ya compara —manifiesto, lockfile, paquete instalado y `project-os --version`— coinciden en `0.1.5`.
- [ ] 2.3 Verificar que ninguna ruta del repositorio siga resolviendo a `0.1.4`: búsqueda de la cadena en `package.json`, lockfile, scripts y documentación operativa.

## 3. Cerrar el hueco que dejó pasar el problema

- [ ] 3.1 Añadir al contrato de consumidor la verificación de identidad de la release instalada sobre `repository.url`, `homepage` y `bugs.url`, derivando el owner esperado de una fuente única del repositorio y sin consultar la red. Una discrepancia produce `FAIL`.
- [ ] 3.2 Probar la aserción en negativo: simular metadatos con un owner anterior y confirmar que el contrato falla e identifica el campo, en vez de pasar porque la versión coincide.
- [ ] 3.3 Confirmar que la verificación no depende de literales duplicados: cambiar el owner en la fuente única debe bastar para que el contrato exija el valor nuevo.

## 4. Trazabilidad y cierre

- [ ] 4.1 Registrar el salto `0.1.4` a `0.1.5` conforme al ADR de cadencia de dependencias, con la razón, el bucket que le corresponde y la evidencia de los tres checks.
- [ ] 4.2 Actualizar `brownfield-baseline.md`, creado en propose, si el alcance o el comportamiento objetivo cambian durante la implementación, en particular si 1.2 o 1.3 obligan a conservar `0.1.4`.
- [ ] 4.3 Actualizar el `TLDR.md`, creado en propose, si cambian alcance, archivos, comportamiento o resultado esperado; conservar los cinco bloques en orden y el máximo de 120 palabras.
- [ ] 4.4 Ejecutar `openspec validate --all --strict --no-interactive`, `npm run agent:harness:check`, `npm run constructor:check`, `npm run test:project-os-contract`, `npm run debt:check` y `git diff --check`; registrar resultados reales sin declarar verificaciones que no se corrieron.
- [ ] 4.5 Capturar el assessment de deuda del flujo aunque el resultado sea `clean`, y ejecutar `npm run openspec:ready:archive -- --change actualizar-pin-constructor-a-0-1-5 --run-local` hasta PASS.
- [ ] 4.6 Si 1.2 o 1.3 resultaron bloqueantes, cerrar el change conservando `0.1.4`: documentar la limitación, dejar la verificación de identidad implementada y declarar en el issue por qué no se subió. La verificación de 3.1 aplica igual y hará fallar el contrato hasta que exista una release compatible con identidad corregida.
