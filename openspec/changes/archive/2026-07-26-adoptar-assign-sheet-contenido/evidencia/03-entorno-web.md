# Entorno web verificado antes de navegar

Fecha: 2026-07-25

Puerto 8081 estaba ocupado por un dev server de expo previo a esta sesion (PID 14424, iniciado 01:04).
No se toco ese proceso: se levanto uno limpio en 8082 para que el bundle refleje sin duda el codigo de esta rama.

```
$ npm run web -- --port 8082
Starting Metro Bundler
Waiting on http://localhost:8082
Logs for your project will appear below.
Web .\index.js ░░░░░░░░░░░░░░░░  0.0% (0/1)
Web Bundled 2203ms index.js (1803 modules)
 LOG  [web] Logs will appear in the browser console
```

```
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:8082
200
```

HTTP 200 confirmado ANTES de navegar con Playwright, como exige el gate de UI.
