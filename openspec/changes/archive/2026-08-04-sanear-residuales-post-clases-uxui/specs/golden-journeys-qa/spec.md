## ADDED Requirements

### Requirement: La QA local usa un origen canonico y verifica CORS antes de afirmar integracion

El procedimiento de QA web SHALL usar `http://localhost:8081` como origen canonico, confirmar HTTP 200
antes de navegar y abrir la misma URL confirmada. Cuando una validacion consuma un backend remoto, SHALL
verificar primero el preflight del origen exacto y registrar el resultado. Un host, puerto o dominio
distinto SHALL requerir configuracion explicita y autorizada en `ALLOWED_ORIGINS`; de lo contrario la
evidencia SHALL limitarse a UI local y SHALL NOT afirmar backend, datos remotos o sync.

#### Scenario: La QA usa el origen canonico

- **WHEN** Expo web responde HTTP 200 en `http://localhost:8081` y el navegador abre esa misma URL
- **THEN** el reporte registra host, puerto, respuesta HTTP y, si usa backend remoto, el resultado del preflight para `http://localhost:8081`

#### Scenario: La QA abre 127.0.0.1 u otro origen

- **WHEN** el navegador usa un host, puerto o dominio distinto al origen permitido
- **THEN** el reporte configura y verifica ese origen de forma explicita o declara que CORS impidio validar backend/sync, sin atribuir el rechazo al modulo visual

#### Scenario: El preflight no refleja el origen solicitado

- **WHEN** `Access-Control-Allow-Origin` no coincide con el origen exacto del navegador
- **THEN** la QA clasifica la sesion como local-only para afirmaciones funcionales, conserva la evidencia visual util y no declara datos remotos ni sincronizacion verificados

#### Scenario: La ampliacion de CORS no pertenece al change

- **WHEN** resolver la validacion requeriria agregar un origen nuevo al backend desplegado
- **THEN** el change documenta la dependencia y obtiene autorizacion en un alcance de seguridad separado, en vez de ampliar el default de CORS de forma incidental
