# Puentes globales candidate

**Fecha:** 2026-08-04  
**Motivo:** desde un hub externo, el retorno a Clases llegaba a una pantalla legacy.  
**Alcance:** navegación Figma candidate de #159; sin runtime, sin edición de #156/PR #158 y sin
promoción visual.

## Diagnóstico

La iteración anterior aisló Office desktop, pero los demás controles globales seguían entrando en hubs
históricos. Sus botones Clases apuntaban a los frames legacy `90:48`/`158:150`, por lo que el journey se
rompía al viajar por la suite.

## Corrección

Se añadieron puentes dentro de la sección `177:115`. Reutilizan visuales existentes sólo para mantener
continuidad de prototipo; no constituyen aprobación, rediseño ni ground truth de los módulos puente.

| Breakpoint | Puentes | Regla de retorno |
| --- | --- | --- |
| Desktop | Asistente `272:952`, Reportes `272:1028`, Diseño `272:1104`, Mensajería `272:1256`, Agenda `272:1332`, Cuenta `272:1408`; Office `257:951` | Todo control global Clases retorna a `186:115`. |
| Tablet | Office `277:958`, Asistente `277:1034`, Reportes `277:1110`, Diseño `277:1262`, Mensajería `277:1338`, Agenda `277:1414`, Cuenta `277:1493` | Todo control global Clases retorna a `189:207`. |
| Móvil | Office `274:958`, Asistente `274:983`, Más `274:1008`, Diseño `274:1122`, Mensajería `274:1147`, Agenda `274:1172`, Reportes `274:1197`, Cuenta `274:1222` | Todo control global Clases retorna a `192:292`; Más mantiene sus cinco módulos secundarios dentro del candidate. |

## Verificación

| Prueba | Resultado |
| --- | --- |
| Auditoría API desktop | 171 controles globales candidate, cero enlaces legacy y cero destinos inexistentes. |
| Auditoría API tablet | 159 controles globales candidate, cero enlaces legacy y cero destinos inexistentes. |
| Auditoría API móvil | 95 controles globales candidate; seis destinos de Más internos, cero enlaces legacy y cero destinos inexistentes. |
| Figma Present desktop | `198:695 → 272:952 → 272:1028 → 186:115`. |
| Figma Present tablet | `198:776 → 277:1034 → 189:207`. |
| Figma Present móvil | `198:809 → 274:983 → 274:1008 → 192:292` y Más → Reportes → Clases. |

Capturas: `figma-present/desktop-global-bridge-reportes-2026-08-04.png`,
`figma-present/tablet-global-bridge-launcher-2026-08-04.png`,
`figma-present/tablet-global-bridge-assistant-fallback-2026-08-04.png`,
`figma-present/mobile-global-bridge-launcher-2026-08-04.png` y
`figma-present/mobile-global-bridge-more-2026-08-04.png`.

## Límite que se conserva

Los puentes cubren la navegación global de hubs. Acciones profundas de cada módulo conservan su propio
alcance histórico y deberán recibir su SDD, ground truth y diseño responsive antes de declararse paridad.
En tablet, los hubs no tienen todavía una superficie propia: el fallback desktop es visible y temporal,
no una decisión de UX destino.

## Gate

El owner aprobó Clases v1.3 el 2026-08-04. La promoción alcanzó los launchers y recorridos de Clases, no
el contenido provisional de los hubs puente. Los 22 puentes/fallbacks listados aquí siguen `candidate` y
deben ser sustituidos por superficies responsive gobernadas cuando se ejecute el SDD de cada módulo.

Evidencia: [comentario de aprobación en #159](https://github.com/IgnacioBarEsp/PlanearIA/issues/159#issuecomment-5182823974).
