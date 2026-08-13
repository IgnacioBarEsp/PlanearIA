# Fuentes y capturas públicas

Fecha: 2026-08-13
Zona horaria: America/Mexico_City
Issue: [#167](https://github.com/IgnacioBarEsp/PlanearIA/issues/167)

## Fuentes verificadas

| Fuente | Estado observado | Autoridad y límite |
|---|---|---|
| `README.md` previo | Mezcla producto, presentación profesional e instrucciones internas | Baseline brownfield que motiva la simplificación |
| `Documentacion/00-fundamentos/RESUMEN_EJECUTIVO.md` | Desarrollo activo, demo hosteada y suite docente conectada | Fuente de estado; no permite afirmar lanzamiento o usuarios reales |
| `Documentacion/00-fundamentos/VISION_ACTUAL.md` | Familiaridad, herramientas conectadas, IA confirmable y offline-first | Fuente de visión, no evidencia de implementación completa |
| `Documentacion/00-fundamentos/ARQUITECTURA.md` y código real | React Native/Expo/TypeScript, Node serverless, MongoDB, JWT, gateway IA | Fuente para afirmaciones técnicas |
| `https://planearai.com` | HTTP 200; onboarding y shell invitado renderizados con Playwright | Demo pública actual; endpoints protegidos devolvieron 401 sin exponer datos reales |
| Figma `VBK5tK7EQS83tdTmtuBpI9` | Present cargó los tres nodos candidate con Playwright | Visión beta/candidate; no prueba producción, paridad ni aprobación humana |
| GitHub Releases | `demo-84` respondió HTTP 200 y publicó `PlanearIA-26732a4.apk` | Ruta estable para instalar Android; el nombre del asset cambia por versión |

## Capturas de la aplicación actual

Todas se obtuvieron en una sesión de navegador efímera después de limpiar storage, elegir el recorrido público y evitar login o datos de usuario.

| Asset | Página / acción | Viewport | Estado representado |
|---|---|---:|---|
| `assets/readme/planearia-actual-onboarding.webp` | `https://planearai.com`, slide inicial | 1440×900 | Promesa actual de planeación asistida por IA; contenido público del onboarding |
| `assets/readme/planearia-actual-contenido.webp` | Tab Contenido | 1440×900 | Empty state invitado con crear planeación, subir recurso y plantillas |
| `assets/readme/planearia-actual-clases.webp` | Tab Grupos / “Tus clases” | 1440×900 | Empty state de Clases con crear/importar y estructura académica visible |

La consola registró respuestas 401 de endpoints protegidos de mensajes, grupos y notificaciones. Se conservan como límite honesto del modo invitado: la UI pública renderiza estados vacíos, pero no se presenta acceso a datos remotos como éxito. Este change no diagnostica ni modifica esos endpoints.

## Capturas de la visión Figma beta

Las URLs usan Figma Present con `hide-ui=1`; el fondo negro pertenece al visor y ayuda a distinguir el frame candidate de una captura de producción.

| Asset | Nodo | Viewport del navegador | Estado representado |
|---|---:|---:|---|
| `assets/readme/planearia-vision-beta-escritorio.webp` | `307:966` | 1440×900 | Escritorio desktop candidate: launcher, prioridades y continuidad |
| `assets/readme/planearia-vision-beta-tablet.webp` | `307:1046` | 1200×900 | Escritorio tablet candidate con la misma arquitectura a menor densidad |
| `assets/readme/planearia-vision-beta-movil.webp` | `307:1078` | 900×900 | Escritorio móvil candidate con herramientas, prioridad, continuidad y barra inferior |

## Integridad y privacidad de assets

| Asset | Dimensiones | Peso | Revisión |
|---|---:|---:|---|
| `planearia-actual-onboarding.webp` | 1440×900 | 259,096 B | Sin sesión, PII o tooling; imagen editorial pública del producto |
| `planearia-actual-contenido.webp` | 1440×900 | 84,708 B | Empty state, cero elementos y sin documentos reales |
| `planearia-actual-clases.webp` | 1440×900 | 121,944 B | Cero cursos/alumnos/pendientes; sin nombres o grupos reales |
| `planearia-vision-beta-escritorio.webp` | 1440×900 | 154,796 B | Datos sintéticos del prototipo; rotular siempre como beta |
| `planearia-vision-beta-tablet.webp` | 1200×900 | 107,084 B | Datos sintéticos del prototipo; rotular siempre como beta |
| `planearia-vision-beta-movil.webp` | 900×900 | 87,792 B | Datos sintéticos del prototipo; rotular siempre como beta |

Total aproximado: 797 KiB. Los seis archivos son WebP RGB, existen localmente y fueron inspeccionados visualmente. No muestran credenciales, tokens, herramientas del navegador, correos privados, nombres de alumnos, escuelas, documentos reales o sesiones autenticadas.

## Límites declarados

- Las capturas actuales son una fotografía del 2026-08-13; el deploy puede evolucionar.
- Las capturas Figma usan datos sintéticos y frames candidate pendientes del gate humano de #163.
- Playwright, screenshots y API no cierran aprobación visual ni entrevistas docentes.
- El README no afirmará que lo visible en Figma ya existe en producción.
