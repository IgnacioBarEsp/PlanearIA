# Revisión adversarial

**Alcance:** Issue #167 / change `simplificar-readme-planearia`
**Fuentes:** proposal, design, delta spec, tasks, TLDR, Issue #167, diff de `README.md`, seis assets, render GitHub, evidencia Playwright y validaciones documentales.

## Alineación spec/tareas

- El README abre con la frase aprobada en primera persona y explica el producto antes de mostrar evidencia o stack.
- La aplicación actual aparece antes de “Visión en desarrollo”; el texto de Figma aclara que no es la interfaz final.
- La prueba del producto no requiere entorno de desarrollo: demo invitado y release con APK.
- Arquitectura, comandos y operación se retiraron de la portada, pero `Documentacion/README.md` mantiene una salida técnica.
- El perfil junior, las prácticas y el correo aparecen al final y no se usan para presentar cada capacidad del producto.
- Los seis assets siguen teniendo texto alternativo, pies y revisión de privacidad.

## Intentos de refutación

| Riesgo intentado | Evidencia | Resultado |
|---|---|---|
| El README todavía habla como una presentación laboral | Scan de términos, orden de secciones y lectura completa | Refutado; no se dirige a contratación, RH, evaluadores, colaboradores o agentes |
| La primera persona convierte todo el texto en autobiografía | Diff y render en tres anchos | Refutado; se usa en apertura, visión y autor, mientras las funciones se describen de forma neutral |
| Figma puede confundirse con la app actual | Encabezados, orden y aclaración previa | Refutado; aparece después de la aplicación y declara que no es interfaz final |
| El enlace Android no contiene un instalable | API de GitHub Release `demo-84` | Refutado; existe `PlanearIA-26732a4.apk` |
| Simplificar elimina el acceso técnico | Enlace local y existencia de `Documentacion/README.md` | Refutado; la portada deriva el detalle sin duplicarlo |
| Una imagen expone datos privados | Inventario, inspección visual y estados usados | Refutado; no hay PII, credenciales, tokens, sesiones o documentos reales |
| El Markdown se rompe en móvil | Playwright 390/768/1440 | Refutado; seis imágenes cargadas, cero overflow horizontal y orden estable |
| El texto afirma que toda la visión ya existe | Sección de funciones y estado | Refutado; distingue explícitamente demo actual y funciones en desarrollo |

## Hallazgos

| Severidad | Área | Hallazgo | Evidencia | Arreglo |
|---|---|---|---|---|
| Minor — resuelto | Readiness | La primera versión simplificada del Issue #167 no conservó los encabezados exactos requeridos por el gate. | Primer `openspec:ready:propose` en FAIL. | Se agregaron `Historia Original`, `Enriquecida`, `No objetivos` y `Rollback`; la repetición terminó en PASS. |
| Pregunta/suposición — resuelta | Publicación | La vista exacta dentro de github.com no existía mientras la rama seguía local. | Rama publicada y [PR #168](https://github.com/IgnacioBarEsp/PlanearIA/pull/168) disponible. | `pr-link` registrado en `readiness.json`. |

No quedan Blockers, Majors o Minors abiertos.

`npm run debt:capture -- --flow simplificar-readme-planearia --input .../debt-assessment-input.json` terminó en PASS idempotente y sin drift. `npm run debt:check` terminó en PASS para los cuatro planes activos.

## Veredicto

**PASS.** La implementación satisface la nueva spec y las tareas documentales sin cambiar runtime.

El change queda listo para ejecutar el gate de archive. El PR #168 conserva la revisión remota y la integración hacia `development` sin mezclar la rama independiente de Escritorio/Figma.
