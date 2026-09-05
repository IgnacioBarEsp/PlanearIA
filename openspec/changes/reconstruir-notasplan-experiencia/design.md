## Context

NotasPLAN llega a esta ola con una asimetría poco común: **el runtime está más adelantado que el
prototipo**. La app tiene un editor real —siete secciones, formato A4 y Carta con medidas exactas, dos
ranuras de logo, alternancia de vistas, texto enriquecido sobre tentap con fallback web, IA por sección,
borrador automático, deshacer y guardia de salida— mientras el prototipo tiene cuatro frames `draft` de
1440 que describen un Word.

| Superficie | Nodo | Tamaño | Problema |
| --- | --- | ---: | --- |
| Documento planeación | `62:3` | 1440x960 | Cinta de seis pestañas; índice de seis secciones ajenas al runtime |
| Documento nuevo plantillas | `66:40` | 1440x960 | Sin niveles de andamiaje |
| Los dos anteriores desde Escritorio | `151:123`, `151:77` | 1440x960 | Duplican el mismo modelo |
| Tablet | — | — | **No existe** |
| Móvil | — | — | **No existe** |

La entrevista del 2026-09-05 fijó quince decisiones, registradas con su condición de reapertura en
`context/notasplan-ground-truth/01-decisiones/`.

## Goals / Non-Goals

**Goals:**

- Que la hoja sea el archivo, no una vista previa de otra cosa.
- Que el documento sobreviva al viaje a Word y de vuelta con su estructura.
- Que el editor exista de verdad en 768 y 390, no como fallback.
- Que la ayuda —secciones, plantillas, IA— nunca se interponga entre el docente y su texto.
- Que el prototipo no prometa menos que el runtime ni más de lo que nadie ha medido.

**Non-Goals:**

- CalcuPLAN y PresentaPLAN (`#157-O5` y `#157-O6`).
- Las familias Instrumento de evaluación y Documento académico.
- Edición colaborativa en tiempo real.
- Cualquier cambio de runtime, datos, sync o backend.

## Decisions

### D-O4-1. El documento es la fuente de verdad; el formulario es una lente

**Elegido:** el archivo es un documento real desde el primer momento. Las siete secciones viven dentro como
encabezados con nombre y el formulario es una proyección sobre ellos.

**Alternativas descartadas y por qué el owner las recorrió:**

| Alternativa | Por qué se descartó |
| --- | --- |
| Híbrido según el origen (estructurado si viene de plantilla, libre si empieza en blanco) | Deja sin resolver qué pasa al volver de Word con el documento estructurado, que es justo la condición que el owner puso |
| Estructura primero con exportación sólo de ida | Cero migración, pero la estructura se pierde al reimportar: Word no tiene dónde guardar que un párrafo es el propósito de la sesión 2 |
| Lienzo libre siempre | Máxima integridad del archivo, pero retira ocho componentes de sección, la vista formulario y el modelo tipado que ya funcionan |

**Por qué esta y no otra:** es la única que cumple la condición original —que el archivo siga siendo
editable fuera— **sin** tirar trabajo que ya funciona. La estructura viaja dentro del archivo, así que
vuelve con él.

**Costo aceptado:** el runtime guarda hoy un `PlaneacionDocumento` tipado y tendría que migrar a
documento-primero. Es migración de almacenamiento con datos existentes, no reescritura de UI, y es el costo
mayor de la ola. Pertenece al handoff, no a este change.

### D-O4-2. Barra compacta contextual en lugar de cinta

**Elegido:** una barra que refleja el estado del cursor con los siete comandos que el runtime ya tiene.

**Alternativa descartada:** cinta completa en escritorio que colapsa en móvil. Son dos sistemas de
herramientas que mantener y diseñar en tres tamaños, y quince comandos en un prototipo serían mayoría
inertes. Familiaridad no significa copiar la densidad de escritorio a una pantalla de 390 px.

### D-O4-3. Las siete secciones del runtime, no las seis del draft

**Elegido:** información institucional, datos generales, curricular, sesiones, evaluación, observaciones y
firmas.

**Por qué:** están implementadas, probadas y reflejan el formato que una escuela pide. Las seis del draft
—Propósito, Inicio, Desarrollo, Cierre, Materiales, Bibliografía— son la secuencia didáctica de una sesión,
que no es lo mismo que la estructura del entregable. Esa secuencia vive **dentro** de la sección `sesiones`,
donde el runtime ya la modela con `SesionCard`.

### D-O4-4. Tres niveles de andamiaje, con default y sin bloquear

**Elegido:** `sencillo` entrega los siete encabezados; `moderado` añade tablas, tarjetas de sesión,
criterios y firmas; `autocompletado` prellena además los datos que la app conoce, marcados como editables.

**Restricción heredada:** la spec archivada de #177 exige que el tipo abra sin que ninguna decisión escolar
lo preceda. Por eso el nivel tiene valor por defecto y se puede cambiar después, en vez de ser un modal
obligatorio.

**Por qué marcar los datos prellenados como editables:** en `autocompletado` la app afirma cosas sobre la
escuela y el docente. Si no se distinguen de lo que él escribió, el docente entrega datos que nunca
revisó.

### D-O4-5. En móvil se escribe sobre la hoja; el formulario está a un toque

**Elegido:** la hoja ocupa la pantalla y se edita en línea; un control lleva al formulario de la sección
activa.

**Alternativa descartada:** formulario por defecto en secciones con estructura. Contradice la respuesta del
owner, que pidió edición en línea. Queda como condición reabrible si Present demuestra que editar una tabla
en 390 px es hostil.

### D-O4-6. La IA propone y el docente decide

**Elegido:** actúa a petición sobre la sección activa; su resultado es un cambio revisable que se acepta o
descarta. Sin proveedor, el flujo manual sigue completo.

**Alternativa descartada:** sugerencia automática al entrar a una sección vacía. Convertiría a la IA en el
punto de partida por defecto de la planeación, que es exactamente lo que la regla de oro del proyecto
prohíbe: la IA propone, el docente decide.

### D-O4-7. El enlace compartido es de sólo lectura y revocable

**Elegido:** quien recibe el enlace ve; quien quiere editar crea cuenta en PlanearIA y solicita permiso, y
el docente concede o no.

**Por qué importa más aquí que en otros módulos:** una planeación puede nombrar alumnos. Un enlace abierto
y permanente convierte un reenvío en acceso indefinido a datos de menores. Sólo lectura más revocación es
el mínimo defendible, y la solicitud de permiso da al docente el control de quién entra.

### D-O4-8. La reimportación declara qué sobrevivió

**Elegido:** al volver un documento editado fuera, el prototipo nombra qué se conservó y qué no.

**Por qué:** documento-primero hace posible el viaje de vuelta, no lo hace perfecto. Sobreviven texto,
encabezados, listas, tablas, imágenes y formato de página; degradan SmartArt, macros, campos automáticos y
objetos flotantes. Presentar el documento como si nada hubiera pasado sería la clase de promesa que este
proyecto no hace.

## Risks / Trade-offs

- **El editor termina siendo un clon de Word** → refutado en el preflight; se controla con la barra
  contextual y prohibiendo la cinta.
- **Editar en línea en 390 px resulta hostil en secciones con tabla** → se prueba en Present; si falla, el
  formulario pasa a default sólo en esas secciones, sin cambiar el resto.
- **"Vuelve desde Word" se lee como equivalencia total** → estado propio de reimportación y límite
  declarado en tres artefactos.
- **El prototipo promete menos que el runtime** → el inventario lista lo que la app ya hace y el candidate
  debe representarlo: formato de página, alternancia de vistas, borrador y guardia de salida.
- **La migración a documento-primero se subestima** → se declara como el costo mayor de la ola en el
  proposal, el design, el ground truth y el handoff. No se presenta como detalle de implementación.
- **Deuda nueva con el presupuesto en 4/5** → cualquier hallazgo residual se clasifica y verifica antes de
  capturarlo.

## Migration Plan

1. Revalidación Figma read-only antes de escribir.
2. Sección candidate nueva; los cuatro frames heredados se conservan intactos.
3. Construcción por breakpoint: 1440 para fijar la arquitectura, luego 768 y 390.
4. Auditoría del grafo por ancho de frame **y por corrección de destino**; corrección dentro del change.
5. Figma Present por breakpoint y veredicto humano.
6. Promoción sólo tras aprobación explícita.

**Rollback:** Figma conserva los frames históricos y la sección candidate es recuperable por historial. Los
artefactos versionados se revierten por PR normal. Runtime, rutas, datos y claves locales permanecen
intactos.

## Open Questions

- Si el docente distingue y usa los tres niveles de plantilla. Se resuelve con docentes, no en Present.
- Si el índice de siete secciones es el que la escuela pide en todos los niveles educativos.
  `context/planeaciones-reales/` está externalizado, así que esta ola no puede contrastarlo.
- Cuándo se abren `#157-O5` y `#157-O6`. No bloquean esta ola.
