# Matriz de decisiones — Office Docente `#157-O3`

> **Versión:** 0.1 candidate.
> **Fecha:** 2026-09-04.
> **Autoridad:** #101 → #157 → issue de la ola `#157-O3`.
> **Método:** entrevista dirigida al owner (2026-09-04, doce temas). No repite decisiones transversales
> de #157 ni reabre lo aprobado en #159 (Clases) o #163 (Escritorio).

## Decisiones confirmadas en entrevista

| Decisión | Fuente y ruta | Estado | Impacto para Figma | Condición concreta para reabrirla |
| --- | --- | --- | --- | --- |
| La ola `#157-O3` cubre únicamente el hub de Office. NotasPLAN, CalcuPLAN y PresentaPLAN pertenecen a `#157-O4` a `#157-O6`. | Entrevista 2026-09-04; frontera declarada en `evidencia/05-correccion-fugas-breakpoint.md` de #163. | Confirmada | Se diseña Office Home en 1440, 768 y 390. Abrir un editor entrega estado honesto de límite, no un editor simulado. | Sólo si el owner fusiona olas por escrito aceptando el riesgo de mega-change que #157 declara. |
| La tarea principal de Office es crear algo nuevo. | Entrevista 2026-09-04. | Confirmada | La creación ocupa la zona de mayor jerarquía; la biblioteca no la empuja hacia abajo en ningún breakpoint. | Si entrevistas docentes muestran que el docente entra a Office mayoritariamente a retomar y no a crear. |
| El ground truth es híbrido docente: recientes y creación reconocibles de Microsoft 365 home, con contexto escolar propio. | Entrevista 2026-09-04; `PLAN_UXUI_NAVEGACION_GLOBAL.md` §1.5. | Confirmada | Se contrastan patrones de M365 home; no se copia su layout ni su lenguaje. Drive queda descartado como eje. | Si se aprueba otro ground truth versionado para Office con su propio registro de fuentes. |
| El hub de Office se construye como superficie propia en 390 y 768, no como fallback de escritorio. | Entrevista 2026-09-04; criterio de cierre de #166. | Confirmada | Cierra la porción de Office de #166. Cada hotspot resuelve en su propio ancho de frame. | No se reabre: es deuda registrada con criterio de cierre explícito. |
| Dentro de Office la creación está desplegada: los tres tipos se ven al entrar, sin modal intermedio. | Entrevista 2026-09-04. | Confirmada con desviación acotada | Office Home muestra documento, hoja y presentación como zona principal. Ver "Desviaciones" abajo. | Si el owner restituye el modal dentro de Office o si Present muestra que la zona desplegada degrada la comprensión. |
| Office crea sólo sus tres tipos: documento, hoja y presentación. | Entrevista 2026-09-04; D2 y D8 del plan UX/UI. | Confirmada | Diseño y preguntar a la IA no aparecen como tipos creables en Office; siguen ofreciéndose desde Escritorio. | Si DisenaPLAN o AsistePLAN definen una entrada compartida desde Office con su propio contrato de retorno. |
| La creación arranca en blanco; las plantillas docentes se ofrecen visibles como atajo opcional, nunca como paso obligatorio. | Entrevista 2026-09-04; D3 del plan UX/UI. | Confirmada | El tipo abre el objeto vacío por defecto. Ninguna plantilla bloquea ni precede a la elección de tipo. | Si se demuestra que el docente no encuentra las plantillas y necesita que precedan al tipo. |
| La biblioteca contiene sólo archivos de Office en esta ola. | Entrevista 2026-09-04; D6 del plan UX/UI. | Confirmada | Recursos y materiales heredados de ContenidoTab no se dibujan ni se fingen. D6 se completa en una ola posterior con su propia entrevista. | Cuando se abra la ola que absorba ContenidoTab; requiere entrevista específica. |
| La biblioteca se organiza por lo reciente y luego agrupada por tipo. | Entrevista 2026-09-04. | Confirmada | Eje primario cronológico; agrupación secundaria en documentos, hojas y presentaciones. El grupo o materia es etiqueta del objeto, no estructura de la biblioteca. | Si el volumen real de archivos hace que lo reciente deje de ser suficiente para encontrar. |
| Un archivo de la biblioteca ofrece cinco acciones sin abrirlo: descargar con fidelidad de formato, asignar a un grupo, adjuntar a una conversación, ver dónde se está usando y duplicar para otro grupo. | Entrevista 2026-09-04; `assign-sheet` archivado. | Confirmada | Es el diferenciador declarado del módulo. Asignar reutiliza la hoja Asignar ya aprobada. | Si una acción pierde su módulo owner o si el runtime demuestra que no puede sostenerla. |
| El estado vacío ofrece crear e importar lo que el docente ya tiene. | Entrevista 2026-09-04. | Confirmada | El docente nuevo ve creación con plantillas más una entrada de importación real. Sin ejemplos falsos ni tarjetas inertes. | Si importar no puede sostenerse en runtime; entonces el estado vacío lo declara en vez de ofrecerlo. |

## Decisiones derivadas por el agente

Se registran marcadas porque el owner no las respondió literalmente; se derivan de respuestas confirmadas y
son reversibles en Present sin rehacer el candidate.

| Derivación | De qué respuesta se deriva | Estado |
| --- | --- | --- |
| Importar es una acción persistente del hub, no exclusiva del estado vacío. | El owner puso importar en el estado vacío y descartó "tres + importar" como set de tipos creables. Un docente con años de material lo necesita también con la biblioteca llena, y no es un tipo creable sino una entrada de archivos. | Derivada, confirmar en Present |
| El catálogo de plantillas se agrupa en familias con presets en vez de plantillas sueltas. | El owner enumeró plantillas solapadas y pidió expresamente organizarlas "de manera coherente y sin redundancias". | Derivada, confirmar en Present |

## Catálogo inicial de plantillas

Organizado en familias para eliminar el solapamiento que la enumeración original tenía: lista de asistencia,
registro de calificaciones y la variante combinada son la misma estructura con distinto alcance, y examen y
rúbrica comparten esqueleto de instrumento.

### NotasPLAN — documento

| Familia | Presets | Por qué existe |
| --- | --- | --- |
| Planeación didáctica | base | Artefacto central del docente mexicano y el único con ground truth real en el repositorio (`context/planeaciones-reales/`). |
| Instrumento de evaluación | examen, rúbrica de cotejo | Comparten encabezado de identificación, tabla de reactivos o criterios y espacio de puntaje; separarlos duplicaría estructura. |
| Documento académico | reporte, resumen, investigación | Los tres usos que pidió el owner comparten un mismo esqueleto: portada, jerarquía de títulos y espacio de fuentes. Se ofrece como una familia y no como tres plantillas. |

### CalcuPLAN — hoja

| Familia | Presets | Por qué existe |
| --- | --- | --- |
| Control del grupo | asistencia, calificaciones, concentrado | El concentrado es la variante combinada que pidió el owner: asistencia, calificaciones, promedio y observaciones en una sola hoja. Como familia evita las tres plantillas redundantes. |
| Cobros y aportaciones | cobro simple, pedido con tallas | Caso real declarado por el owner: viajes, camisas, libretas y material de evento. Se separan porque el pedido con tallas exige columna de variante y consolidado por talla, estructura que un cobro simple no tiene. |

### PresentaPLAN — presentación

| Familia | Presets | Por qué existe |
| --- | --- | --- |
| Temas visuales | varios temas sobrios | El owner pidió plantillas sencillas al estilo de la galería de PowerPoint. Son temas de diseño, no estructuras escolares: no se presupone la estructura de una clase sin evidencia docente. |

## Desviaciones registradas

| Desviación | Alcance | Justificación | Cómo se controla |
| --- | --- | --- | --- |
| D3 del plan UX/UI fija "un solo botón Crear -> modal de TIPOS". Dentro de Office la creación queda desplegada, sin modal. | Sólo el hub de Office. D3 sigue gobernando el botón Crear global del shell y los selectores `310:3`, `310:69` y `310:106` aprobados en #163. | Crear es la tarea principal declarada de este módulo; obligar a un modal dentro del módulo cuya tarea principal es crear añade un paso sin función. | La spec del change lo declara explícitamente y Present verifica que el selector global de Escritorio sigue intacto y alcanzable. |

## Drift heredado que este change debe cerrar

| Drift | Evidencia | Qué exige |
| --- | --- | --- |
| Office Home `257:951` es el destino de "Nuevo archivo" desde el Escritorio histórico, en vez del selector tipo-primero. | `INVENTARIO_FIGMA_RUNTIME_2026-08-04.md` de #163. | El candidate de Office no puede heredar ese rol de destino genérico de creación. |
| El puente `T-G · Office · tablet · desktop-fallback · candidate` (`277:958`) se llama tablet y mide 1440x960. | #166; auditoría por ancho de frame de #163. | Sustituirlo por superficie de 768 propia. Es la porción de Office de la deuda `debt-a40b2b029a63`. |
| El control `Acción · abrir prioridad · móvil` del puente `M-G` de Office entrega frames de 1440x960. | #166. | Sustituirlo por superficie de 390 propia. Porción de Office de `debt-b1d35a5b5915`. |

## Riesgo trasladado al handoff runtime

"Descargar el archivo ya formateado sin perder calidad ni formato en su extensión (.docx, .xlsx, .pdf)" es
una promesa de runtime, no del prototipo. El candidate la representa como afordancia visible y **no simula
la descarga, el formato ni el resultado**. El change runtime posterior deberá dimensionarla contra la
excepción de deuda vigente por el cuelgue síncrono de SheetJS ante xlsx corrupto y contra el costo real de
fidelidad en exportación docx. No se declara resuelta por aparecer en el prototipo.

## Supuestos IHC que permanecen abiertos

- El orden y la densidad de la zona de creación frente a la biblioteca necesitan validación con docentes.
- El catálogo de plantillas se deriva de la experiencia declarada del owner, no de campo. Qué plantillas usa
  de verdad un docente y con qué frecuencia sigue sin medirse.
- Que la organización cronológica baste para encontrar es un supuesto: no se ha medido el volumen real de
  archivos de un docente en un ciclo.

Estos supuestos no reabren las decisiones de visión confirmadas: suite offline-first, familiaridad,
control docente, IA confirmable, objetos reales y fronteras entre módulos.
