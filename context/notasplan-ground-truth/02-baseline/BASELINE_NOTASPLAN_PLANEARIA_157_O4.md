# Baseline NotasPLAN PlanearIA `#157-O4`

> **Versión:** 0.1 candidate.
> **Fecha:** 2026-09-05.
> **Autoridad:** #101 → #157 → `MATRIZ_DECISIONES_NOTASPLAN_157_O4.md`.
> **Estado:** contrato candidato derivado de la entrevista del 2026-09-05. No es aprobación visual: esa la
> emite el owner tras Figma Present.

## 1. Promesa

NotasPLAN es donde el docente **escribe la planeación que va a entregar**. Se ve como el documento que va a
imprimir, se edita donde se lee, y el archivo que sale de la app sigue siendo un documento de verdad: se
abre en Word, se edita fuera y vuelve sin dejar de ser suyo.

La ayuda —secciones, plantillas, IA— nunca se interpone entre el docente y su hoja.

## 2. Arquitectura de la experiencia

### Capa A — La hoja, que es el documento

La superficie principal en los tres tamaños. No es una vista previa de un formulario: **es el archivo**. Por
eso:

- Declara su formato de página real, A4 o Carta, como ya hace el runtime.
- Las siete secciones viven dentro como **encabezados con nombre**: información institucional, datos
  generales, curricular, sesiones, evaluación, observaciones y firmas.
- Se escribe directamente sobre ella.

Que la estructura viaje dentro del documento es lo que permite descargar, editar en Word y volver sin
perderla. Si la estructura viviera en un modelo aparte, el viaje de vuelta la borraría.

### Capa B — Herramientas que aparecen donde estás

Una **barra compacta contextual**, no una cinta de pestañas. Refleja el estado del cursor y ofrece lo que
de verdad se usa: negrita, cursiva, lista, lista numerada, título, checklist y tabla.

La **IA actúa a petición** sobre la sección activa. Propone, nunca escribe sola, y su resultado llega como
cambio revisable que el docente acepta o descarta. El flujo manual funciona sin proveedor.

### Capa C — Estructura: índice y lente de formulario

- El **índice del documento** lista las siete secciones y navega a ellas. Refleja lo que hay en la hoja.
- La **lente de formulario** es una vista alterna sobre la sección activa, útil cuando la estructura ayuda
  más que el texto libre: sesiones, evaluación y datos generales. Es una proyección de los encabezados, no
  un modelo paralelo.

Al crear desde la plantilla Planeación didáctica, el docente elige el nivel de andamiaje:

| Nivel | Qué entrega |
| --- | --- |
| Sencillo | Los siete encabezados, vacíos |
| Moderado | Los encabezados con su andamiaje: tablas de datos, tarjetas de sesión, criterios de evaluación y espacio de firmas |
| Autocompletado | Lo anterior más los datos que la app ya conoce —escuela, docente, ciclo, grupo y asignatura— marcados como editables |

El nivel tiene valor por defecto y **no bloquea**: elegirlo nunca precede a la decisión de crear.

### Capa D — Acciones del documento

Seis, sin salir del editor:

| Acción | Qué hace | Owner |
| --- | --- | --- |
| Guardar en la biblioteca | Deja el documento en Office, donde el docente vuelve por él | Office |
| Descargar | Entrega `.docx` o PDF conservando formato | NotasPLAN |
| Asignar a un grupo | Abre la hoja Asignar y devuelve el control a Clases | Clases |
| Guardar como plantilla propia | Convierte esta planeación en base para las siguientes | Office |
| Ver historial | Puntos de guardado con nombre, previsualizables y restaurables | NotasPLAN |
| Compartir | Copia en PDF o `.docx`, o enlace. Dentro de PlanearIA hacia Mensajería, o fuera con el control clásico de compartir | NotasPLAN y Mensajería |

El **enlace es de sólo lectura y revocable**. Quien quiera editar crea cuenta en PlanearIA y solicita
permiso; el docente concede o no.

## 3. Adaptación por breakpoint

| Breakpoint | Hoja | Índice | Formulario | Herramientas |
| --- | --- | --- | --- | --- |
| Escritorio 1440 | Centrada, con su formato de página | Lateral permanente | Panel lateral simultáneo | Barra sobre la hoja |
| Tablet 768 | Centrada, densidad reducida | Desplegable desde un control con label | Vista alterna a pantalla completa | Barra sobre la hoja |
| Móvil 390 | Ocupa la pantalla y se edita en línea | Desplegable | A un toque, sobre la sección activa | Barra compacta anclada |

Regla heredada de #166, no negociable: **ningún hotspot cruza de breakpoint**, la clasificación es por ancho
de frame y se cuentan también las aristas que salen de la sección.

Instrumento de evaluación y Documento académico no existen todavía: entregan el estado honesto de límite,
con el patrón aprobado en #163 y reutilizado en #177.

## 4. Estados mínimos

| Estado | Qué muestra | Salida |
| --- | --- | --- |
| Documento nuevo vacío | La hoja con los encabezados del nivel elegido y el cursor listo | Escribir, o cambiar de nivel |
| Guardando y guardado | Estado explícito, con la hora del último borrador | Ninguna acción requerida |
| Cambios sin guardar al salir | Aviso que nombra qué se perdería | Guardar, descartar o seguir editando |
| Error al guardar | Nombra qué falló y qué se conserva en local | Reintentar, o seguir escribiendo |
| Offline | Declara que se sigue escribiendo en local y que nada se envía | Seguir trabajando |
| Sync pendiente o conflicto | Distingue pendiente de conflicto; nunca se presenta como éxito remoto | Resolución manual |
| IA no disponible | Declara que no hay proveedor y que el flujo manual sigue completo | Escribir sin IA |
| Reimportado desde Word | Declara qué se conservó y qué no sobrevivió al viaje | Revisar el documento |
| Sección no disponible en este tamaño | Sólo si alguna lo estuviera; nombra el límite y devuelve al origen | Volver |

Ningún estado simula guardado remoto, envío, descarga real ni sincronización. Los datos de ejemplo van
rotulados.

## 5. Navegación y retornos

- Se entra desde Office: crear un documento, abrir uno de la biblioteca, o usar una plantilla.
- `Volver a Office` conserva el filtro y la posición desde donde se entró.
- Asignar y compartir devuelven el control a su módulo owner y retornan declarando qué ocurrió.
- El editor es superficie de trabajo, no un hub: no reemplaza la navegación global.

## 6. Lo que NotasPLAN no es

No es una cinta de pestañas ni un clon literal de Word. No es un formulario con vista previa. No es un
editor colaborativo en tiempo real. No es un lienzo de diseño: eso es DisenaPLAN. No genera la planeación
por el docente: la IA propone y él decide.

No adopta glass, blur, gradientes, halos, bento ni animación ornamental. La hoja es el protagonista y el
sistema visual se aparta.

## 7. Referencias y límites

Ground truth híbrido: se contrastan de Word el formato de página y la formalidad del documento entregable,
y de Google Docs la ligereza, el índice navegable y la barra que no invade. Ninguno se copia.

Límite declarado: `context/planeaciones-reales/` sólo conserva su README, así que el andamiaje de la
plantilla no puede contrastarse contra planeaciones reales desde el repositorio en esta ola.

## 8. Supuestos IHC a validar

- Que el docente entienda y elija entre los tres niveles de plantilla.
- Que editar en línea sobre la hoja en 390 px sea cómodo en secciones con tabla.
- Que el índice de siete secciones sea el que la escuela pide, y no una variante local.
- Que la promesa de "vuelve desde Word" se entienda con sus límites y no como equivalencia total.
