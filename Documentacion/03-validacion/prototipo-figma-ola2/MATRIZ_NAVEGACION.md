# Matriz de navegacion del prototipo Figma Ola 2

> **Estado:** grafo implementado y auditado por API Figma; pendiente únicamente la reproducción humana en modo Present antes de archivar.
> **Issue:** [#156](https://github.com/IgnacioBarEsp/PlanearIA/issues/156).
> **Ground truth visual:** [archivo Figma Ola 2](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=87-47).
> **Alcance:** prototipo, no runtime ni integraciones reales.

> **Ampliación v1.1 (2026-08-03):** #156/PR #158 conserva su grafo cerrado. #159 agregó una sección
> `candidate` de Clases con launchers aislados, cinco superficies responsive y recorridos reproducidos
> en Present por breakpoint. Este fue el estado inicial previo a las iteraciones v1.2–v1.4.

> **Iteración v1.2 (2026-08-03):** tras feedback del owner, el subflujo desktop de #159 ya no reutiliza
> los destinos históricos para Escritorio/Office: `198:695 → 257:951 → 186:115 → 198:695`. El alcance
> continúa siendo Clases y su continuidad con Office; los demás módulos globales conservan su frontera
> histórica de #156 y no se declaran rediseñados ni aprobados.

> **Iteración v1.3 (2026-08-04):** se cerró el tránsito global del candidate. Viajar por hubs y volver a
> Clases ya permanece en `177:115` por breakpoint; #156 no fue modificado. Los bridges no aprueban ni
> rediseñan otros módulos y tablet declara fallback desktop hasta sus SDD propios.

> **Gate v1.4 (2026-08-04):** el owner aprobó Clases v1.3. Se promovieron 83 frames propios y se
> conservaron 22 puentes/fallbacks externos como `candidate`. La aprobación no incluye runtime, #46 ni
> validación IHC de campo.

## Contrato canonico

El unico inicio activo es **Escritorio Docente**. La navegacion global conserva estas etiquetas:

1. Escritorio
2. Office Docente
3. Clases
4. Asistente de IA
5. Reportes
6. Diseño de materiales
7. Mensajería
8. Agenda
9. Cuenta

El modulo actual se indica con resaltado. No navega a si mismo. Los demás controles de escritorio tienen un hotspot de
228 x 44 pt y un destino declarado. Los nombres de producto heredados (`AsistePLAN`, `ConectaPLAN`,
`DiseñaPLAN`, `AgendaPLAN`, `ReportaPLAN`) no se usan como etiqueta de navegacion del prototipo activo.

## Matriz de rutas de escritorio

| Origen | Control | Destino | Retorno visible | Estado |
| --- | --- | --- | --- | --- |
| Escritorio | Office Docente | Office | Escritorio en rail | Automatizado en Figma |
| Escritorio | Clases / Asistente / Reportes | Hub respectivo | Escritorio en rail | Automatizado en Figma |
| Escritorio | Diseño / Mensajería / Agenda / Cuenta | Hub respectivo | Escritorio en rail | Automatizado en Figma |
| Office | Escritorio | Escritorio | Rail global | Automatizado en Figma |
| Cualquier hub o detalle | Navegacion global | Cualquier otro hub | Rail global estable | Automatizado en Figma |
| Escritorio | Nuevo archivo | Selector contextual de Escritorio | `← Escritorio Docente` | Automatizado en Figma |
| Selector contextual de Escritorio | Documento / hoja / presentación | Destino contextual de Escritorio | `Escritorio Docente` en cada editor | Automatizado en Figma |
| Office | Nuevo archivo | Selector de Office | `← Office Docente` | Automatizado en Figma |
| Clases, detalle | Crear actividad | Dialogo de actividad de Clases | Cierre al origen | Automatizado en Figma |
| Mensajería, resultado | Volver a Mensajería | Hub Mensajería | Rail global y CTA visible | Automatizado en Figma |

## Patrones tablet y móvil

| Breakpoint | Frame de entrada | Patrón | Accesos y retornos | Límite honesto |
| --- | --- | --- | --- | --- |
| Tablet | [Escritorio tablet](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=162-115) | Rail de nueve módulos | El módulo activo no navega; los ocho restantes tienen hotspot de al menos 176 x 44 pt. `Abrir documento` entrega al flujo detallado. | Es una variante de navegación y handoff; no declara todavía paridad visual de cada editor detallado. |
| Móvil | [Escritorio móvil](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=164-115) | Barra inferior de Inicio, Office, Clases, Asistente y Más | Cada control mide al menos 78 x 72 pt; los módulos secundarios quedan disponibles desde [Más](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=158-200) y el encabezado devuelve a Escritorio. | Cubre navegación compacta y módulos; los objetos detallados conservan por ahora sus superficies de escritorio. |

En las pantallas móviles de Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta el acceso activo es
`Más`; no desaparecen ni se renombran. Cada fila secundaria mide 294 x 44 pt y tiene un único destino.

## Golden journeys

| ID | Recorrido | Evidencia automatica | Evidencia manual pendiente |
| --- | --- | --- | --- |
| GJ-FIG-01 | Inicio → Office → Escritorio | Un inicio, hotspot Office y hotspot Escritorio verificados por API Figma | Reproducir en Present |
| GJ-FIG-02 | Inicio → Nuevo archivo → Documento → Escritorio | Destinos contextuales distintos de Office verificados por API Figma | Reproducir en Present |
| GJ-FIG-03 | Inicio → Clases → Crear actividad → cancelar | Destino del detalle corregido a dialogo de Clases | Reproducir en Present |
| GJ-FIG-04 | Inicio → Asistente → Conversacion → Asistente | No queda ruta al selector de Office | Reproducir en Present |
| GJ-FIG-05 | Inicio → Mensajería → confirmacion → resultado → Mensajería | Resultado y salida semantica verificados por API Figma | Reproducir en Present |
| GJ-FIG-06 | Navegacion global desde Reportes / Cuenta | Nueve etiquetas, ocho destinos y un activo auditados | Reproducir en Present |
| GJ-FIG-07 | Tablet: Escritorio → Office Docente → Escritorio | Rail completo, activo sin enlace y ocho destinos verificados por API Figma | Reproducir en Present |
| GJ-FIG-08 | Móvil: Inicio → Office → Inicio | Barra de cinco accesos, activo y cuatro rutas verificados por API Figma | Reproducir en Present |
| GJ-FIG-09 | Móvil: Más → Reportes → Más → Inicio | Cinco rutas secundarias de Más, retorno por encabezado y barra verificados por API Figma | Reproducir en Present |

## Ampliación v1.4 — Clases approved #159

### Entradas y superficies

| Breakpoint | Launcher aprobado | Entrada | Tablón | Trabajo de clase | Personas | Seguimiento |
| --- | --- | --- | --- | --- | --- | --- |
| Desktop | `198:695` | `186:115` | `186:193` | `186:257` | `186:324` | `186:392` |
| Tablet | `198:776` | `189:207` | `189:279` | `189:345` | `189:414` | `189:482` |
| Móvil | `198:809` | `192:292` | `192:358` | `192:417` | `192:479` | `192:540` |

Los launchers son copias dentro de `177:115`: prueban Escritorio → Clases sin cambiar los frames ni
destinos cerrados por #156. `87:47` continúa como `Flow 1`; los tres puntos de inicio Present de Clases
quedaron aprobados con el módulo. El módulo activo no navega a sí mismo.

### Continuidad desktop v1.2 — Escritorio, Office y Clases

| Origen candidate | Acción | Destino candidate | Retorno comprobado | Límite |
| --- | --- | --- | --- | --- |
| `198:695` Escritorio | Office Docente / Nuevo archivo | `257:951` Office Docente | Office → `186:115` Clases o `198:695` Escritorio | No redefine editores de Office. |
| `186:115`, `186:193`, `186:257`, `186:324`, `186:392` y estados desktop | Office Docente | `257:951` | Office → Clases / Escritorio candidate | No cruza a `61:2`. |
| `186:115`, `186:193`, `186:257`, `186:324`, `186:392` y estados desktop | Escritorio | `198:695` | Escritorio → Clases candidate | No cruza a `87:47`. |

La auditoría local de esta iteración verificó 26 enlaces desktop de Office/Escritorio, cero destinos
históricos para ese subflujo y cero destinos inexistentes. Figma Present ejecutó
`198:695 → 257:951 → 186:115 → 198:695`. Evidencia:
`openspec/changes/reconstruir-clases-experiencia/evidencia/11-iteracion-desktop-office.md`.

### Tránsito global candidate v1.3

| Breakpoint | Puentes / destinos | Retorno Clases | Resultado |
| --- | --- | --- | --- |
| Desktop | Asistente `272:952`, Reportes `272:1028`, Diseño `272:1104`, Mensajería `272:1256`, Agenda `272:1332`, Cuenta `272:1408` | `186:115` | La cadena entre hubs se conserva dentro del candidate. |
| Tablet | Office `277:958`, Asistente `277:1034`, Reportes `277:1110`, Diseño `277:1262`, Mensajería `277:1338`, Agenda `277:1414`, Cuenta `277:1493` | `189:207` | Retorno correcto con fallback desktop explícito. |
| Móvil | Office `274:958`, Asistente `274:983`, Más `274:1008`, Diseño `274:1122`, Mensajería `274:1147`, Agenda `274:1172`, Reportes `274:1197`, Cuenta `274:1222` | `192:292` | Más y sus módulos secundarios no fugan al legacy. |

La auditoría API cubrió 425 controles globales candidate y encontró cero enlaces a Clases legacy y cero
destinos inexistentes. Present confirmó los tres breakpoints. Evidencia:
`openspec/changes/reconstruir-clases-experiencia/evidencia/12-puentes-globales-candidate.md`.

### Journeys C-01 a C-05

| ID | Breakpoint | Origen y acción | Destino(s) | Retorno | Estado visible | Resultado |
| --- | --- | --- | --- | --- | --- | --- |
| C-01 | Desktop | `198:695` → Clases; señal `186:160` | Entrada `186:115` → Seguimiento `186:392` | Clases en rail → entrada | Por revisar, clase/tarea identificables | Evidencia accionable, no KPI |
| C-01 | Tablet | `198:776` → Clases; señal `189:253` | Entrada `189:207` → Seguimiento `189:482` | Clases en rail → entrada | Mismo objeto y labels | Sin cruce de breakpoint |
| C-01 | Móvil | `198:809` → Clases; señal `192:331` | Entrada `192:292` → Seguimiento `192:540` | Hub Clases → entrada | Barra fija y scroll | Sin destino desktop |
| C-02 | Desktop | Crear actividad `186:288` | Editor `193:423` → confirmar `193:520` | Cancelar cierra al trigger | Borrador/programada/asignada | `195:461` / `195:520` / `195:579` |
| C-02 | Tablet | Crear actividad `189:393` | Editor `193:620` → confirmar `193:717` | Cancelar cierra al trigger | Sin archivo obligatorio | `195:701` / `195:753` / `195:805` |
| C-02 | Móvil | Crear actividad `192:458` | Editor `193:817` → confirmar `193:914` | Cancelar cierra al trigger | Borrador local + sync explícito | `195:912` / `195:956` / `195:1000` |
| C-03 | Desktop | Adjuntar/Crear desde `193:423` | Selector `193:450` o handoff `193:466` → Office `193:485`/`193:504` o Diseño `224:8`/`224:25` | Cancelar vuelve a `193:423` | Owner/tipo y asociación pendiente | Continúa a confirmación, sin copia |
| C-03 | Tablet | Adjuntar/Crear desde `193:620` | `193:647` / `193:663` → Office `193:682`/`193:701` o Diseño `224:56`/`224:73` | Mismo borrador tablet | Referencia local revisable | Confirmación previa obligatoria |
| C-03 | Móvil | Adjuntar/Crear desde `193:817` | `193:844` / `193:860` → Office `193:879`/`193:898` o Diseño `224:104`/`224:121` | Mismo borrador móvil | Labels completos | Sin salto a desktop |
| C-04 | Desktop | Revisar entrega `186:462` | Editor `193:539` → confirmar `193:558` | Cancelar cierra; confirmar vuelve al filtro | Devuelta · sync pendiente | Seguimiento `195:638` |
| C-04 | Tablet | Revisar entrega `189:553` | `193:736` → `193:755` | Mismo filtro/objeto | Confirmación importante | Seguimiento `195:857` |
| C-04 | Móvil | Revisar entrega `192:602` | `193:933` → `193:952` | Mismo filtro/objeto | Evidencia sintética visible | Seguimiento `195:1044` |
| C-05 | Desktop | Nuevo anuncio `186:224` | Editor `193:388` → confirmar `193:407` | Cancelar cierra; confirmar vuelve a Tablón | Pendiente de sync, no éxito remoto | Tablón `186:193` |
| C-05 | Tablet | Nuevo anuncio `189:327` | `193:585` → `193:604` | Vuelve a `189:279` | Autor/fecha/estado | Sin feed social |
| C-05 | Móvil | Nuevo anuncio `192:399` | `193:782` → `193:801` | Vuelve a `192:358` | Confirmación visible | Sin destino desktop |

### Filtros y estados

| Breakpoint | Vencidas | Asistencia | Calificaciones | Matriz transversal |
| --- | --- | --- | --- | --- |
| Desktop | `200:712` | `200:786` | `200:860` | `197:665` |
| Tablet | `200:934` | `200:1003` | `200:1072` | `197:665` |
| Móvil | `200:1141` | `200:1202` | `200:1263` | `197:665` |

La auditoría API de la sección encontró 603 aristas, cero destinos inexistentes, cero cruces de
breakpoint y cero controles habilitados sin reacción. Los recorridos C-01 a C-05 y los selectores/handoffs
opcionales se reprodujeron en Present. El owner aprobó Clases v1.3 el 2026-08-04; se promovieron 83 frames
propios a `approved`. Office y los 22 puentes/fallbacks globales permanecen `candidate` hasta su propio SDD.

### Gate humano v1.4

- Evidencia: [#159, aprobación explícita](https://github.com/IgnacioBarEsp/PlanearIA/issues/159#issuecomment-5182823974).
- Contrato Figma: `179:115`; sección mixta `177:115` nombrada como Clases approved con puentes candidate.
- No se modificaron los frames de #156 ni se cerró #46.
- La aprobación corresponde al prototipo de Clases; no prueba runtime, red, persistencia, IA o sync real.

## Validaciones y limites honestos

- El API de Figma confirma un solo `flowStartingPoint` (`Escritorio Docente`), cero destinos rotos y ningún
  label heredado en los frames activos. Los 17 frames de escritorio auditados tienen nueve controles de
  navegación: ocho destinos externos y el activo sin enlace redundante.
- Tablet tiene nueve labels y ocho rutas; los diez hubs móviles tienen cinco controles inferiores, uno
  activo y cuatro rutas. Más expone cinco módulos secundarios. La evidencia detallada está en
  [`01-baseline-y-grafo.md`](../../../openspec/changes/corregir-navegacion-prototipo-figma/evidencia/01-baseline-y-grafo.md).
- Las capturas de escritorio, tablet, móvil y Más confirman jerarquía, legibilidad, contraste y áreas de
  toque. No sustituyen el recorrido humano en modo Present.
- La ausencia de datos y carga dinámica es `N/A` en esta navegación estática: ningún hotspot simula una
  consulta dinámica. Los estados no disponibles sí son explícitos: Asistente indica proveedor ausente y
  Mensajería confirma que no se realizó envío real. No se presenta éxito de red, IA o sincronización.
- No se declara paridad responsive de todos los editores y objetos detallados: este change cubre el shell,
  los retornos y los handoffs entre breakpoints.
- Ningun resultado del prototipo confirma envio, IA, red o sincronizacion reales.

## Rollback

No se borraron frames historicos. Si una correccion de enlaces debe revertirse, restaurar la version
anterior desde el historial de Figma mediante un change y PR normal, y actualizar esta matriz con la
evidencia de la restauracion.
