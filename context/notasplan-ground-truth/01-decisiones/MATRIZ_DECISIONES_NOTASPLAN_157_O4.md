# Matriz de decisiones — NotasPLAN `#157-O4`

> **Versión:** 0.1 candidate.
> **Fecha:** 2026-09-05.
> **Autoridad:** #101 → #157 → issue de la ola `#157-O4`.
> **Método:** entrevista dirigida al owner (2026-09-05, quince temas en cuatro rondas). No repite
> decisiones transversales de #157 ni reabre lo aprobado en #159 (Clases), #163 (Escritorio) o #177 (Office).

## La decisión de fondo, y cómo se llegó a ella

El owner cambió de postura dos veces sobre la naturaleza del módulo, y el recorrido importa porque explica
por qué la respuesta final no es un punto medio sino la única que satisface su condición original.

1. **Ronda 1 — "híbrido según el origen":** estructurado si vienes de una plantilla, libre si empiezas en
   blanco. Pero con una condición explícita: *"que esto no rompa el formato de Word, que si se guarda,
   asigna, manda o demás el archivo siga funcionando bien, incluso si un docente descarga el documento y
   luego lo abre en otro editor como Word o Docs y pueda seguir editándolo. Si esto no es posible, que sea
   un lienzo libre siempre; haz la mejor opción para mantener la integridad."*
2. **Ronda 2 — "lienzo libre siempre":** al conocer que un modelo tipado no sobrevive el viaje de ida y
   vuelta por Word, el owner optó por su plan B.
3. **Ronda 3 — "documento primero con lente de formulario":** al ver que el lienzo libre retiraba ocho
   componentes de sección, la vista formulario y el modelo tipado que ya funcionan, el owner eligió la
   arquitectura que conserva ambas cosas.

**Decisión final registrada:** el archivo **es** un documento real desde el primer momento. Las siete
secciones viven dentro como **encabezados con nombre**, y la vista formulario es una **proyección** sobre
esos encabezados, no un modelo paralelo. Descargar a `.docx`, editar fuera y volver a subir conserva la
estructura porque la estructura viaja dentro del documento.

## Decisiones confirmadas

| Decisión | Fuente | Estado | Impacto para Figma | Condición para reabrirla |
| --- | --- | --- | --- | --- |
| La ola `#157-O4` cubre únicamente la familia Planeación didáctica. | Entrevista 2026-09-05. | Confirmada | Instrumento de evaluación y Documento académico se representan con estado de límite hasta su propia ola. | Sólo si el owner fusiona familias por escrito aceptando el riesgo de mega-change. |
| NotasPLAN es documento-primero con lente de formulario. | Entrevista 2026-09-05, rondas 1 a 3. | Confirmada tras dos revisiones | La hoja es la superficie principal en los tres breakpoints; el formulario se presenta como vista alterna sobre la sección activa. | Si se demuestra que la proyección por encabezados no sostiene una sección concreta, esa sección se declara y se acota. |
| Las secciones son las siete del runtime. | Entrevista; `DocEditorScreen` y sus ocho componentes de sección. | Confirmada | Info institucional, datos generales, curricular, sesiones, evaluación, observaciones y firmas. El índice del documento las navega. | Si una planeación real recurrente exige otra sección, se añade con evidencia documental. |
| Las herramientas son una barra compacta contextual, no una cinta de pestañas. | Entrevista; `EditorToolbar` del runtime. | Confirmada | Se retira la cinta de seis pestañas del draft `62:3`. La barra cambia según dónde esté el cursor. | Si el owner reintroduce la cinta para escritorio con su propio contrato en tres tamaños. |
| El ground truth es Word y Google Docs adaptados. | Entrevista 2026-09-05. | Confirmada | Hoja centrada, barra compacta, índice lateral navegable y formato de página real. No se copia la cinta ni su densidad. | Si se aprueba otro ground truth versionado con su registro de fuentes. |
| La plantilla ofrece tres niveles: sencillo, moderado y autocompletado. | Entrevista 2026-09-05. | Confirmada | Sencillo entrega sólo los siete encabezados; moderado añade el andamiaje interno; autocompletado prellena además escuela, docente, ciclo, grupo y asignatura, marcados como editables. | Si los docentes no distinguen los niveles o eligen siempre el mismo. |
| En móvil la hoja es lo primero y se edita en línea; el formulario está a un toque. | Entrevista 2026-09-05, rondas 2 y 4. | Confirmada | 390 abre la hoja y permite escribir sobre ella. Un control lleva al formulario de la sección activa. | Si editar en línea resulta hostil en secciones con tabla, se invierte el default para esas secciones. |
| La IA actúa a petición sobre la sección activa y su resultado es revisable. | Entrevista; `AIToolbar` y `useCopiloto` del runtime; `IA_CHATBOT_LLM.md`. | Confirmada | Nunca escribe sola, nunca sobrescribe el original: propone un cambio que el docente acepta o descarta. | No se reabre sin análisis de seguridad y decisión explícita sobre autonomía de IA. |
| El historial son puntos de guardado con nombre, previsualizables y restaurables. | Entrevista 2026-09-05. | Confirmada | No es sólo deshacer de la sesión, ni un historial continuo estilo Google Docs. | Si el costo de almacenar versiones sin conexión resulta inviable, se declara y se acota. |
| Compartir ofrece copia y enlace, y ambas rutas: dentro de PlanearIA y externa. | Entrevista 2026-09-05. | Confirmada | Copia en PDF o `.docx` a elegir, o enlace al documento. Interno hacia ConectaPLAN; externo con el símbolo clásico de compartir. | Si la revisión de privacidad restringe alguna ruta. |
| El enlace es de sólo lectura y revocable; editar exige cuenta en PlanearIA y solicitar permiso. | Entrevista 2026-09-05. | Confirmada | Modelo estilo Canva: quien recibe ve; quien quiere editar crea cuenta y pide acceso, y el docente concede o no. | Si se aprueba edición anónima con su propio análisis de datos de alumnos. |
| El editor ofrece seis acciones sin salir: guardar en biblioteca, descargar, asignar a un grupo, guardar como plantilla propia, ver historial y compartir. | Entrevista 2026-09-05. | Confirmada | Asignar reutiliza el contrato de la hoja aprobada; guardar como plantilla conecta con la biblioteca de plantillas que el runtime ya tiene. | Si una acción pierde su módulo owner. |

## Decisiones derivadas por el agente

| Derivación | De qué se deriva | Estado |
| --- | --- | --- |
| El nivel de plantilla tiene un valor por defecto y no bloquea la creación. | El owner pidió elegir entre tres niveles, y O3 aprobó que el tipo abra sin que ninguna decisión escolar lo preceda. Un selector obligatorio contradiría esa spec ya archivada. | Derivada, confirmar en Present |
| El formulario en móvil es alcanzable pero no es el default. | Concilia la respuesta literal "documento con edición en línea" con la existencia de la lente de formulario, decidida después. | Derivada, ya confirmada en la ronda 4 |
| Las siete secciones se materializan como encabezados con nombre dentro del documento. | Es la consecuencia mecánica de documento-primero: si la estructura no viaja dentro del archivo, no sobrevive a Word. | Derivada, confirmar en Present |

## Límite honesto de la promesa de integridad

Documento-primero hace posible el viaje de ida y vuelta, pero **no lo hace perfecto**, y el prototipo no
debe prometer más de lo que se puede sostener:

- **Sobrevive:** texto, encabezados con nombre, listas, tablas, imágenes y formato de página.
- **Degrada:** funciones que Word tiene y el editor no reproduce —SmartArt, macros, campos automáticos,
  objetos flotantes complejos—. Vuelven como contenido plano o se pierden.
- **Consecuencia de diseño:** al reimportar, el prototipo debe declarar qué se conservó y qué no, en vez de
  presentar el documento como si nada hubiera cambiado.

## Drift heredado que este change debe cerrar

| Drift | Evidencia | Qué exige |
| --- | --- | --- |
| El draft `62:3` es un clon de Word: cinta de seis pestañas y quince comandos. | Inventario 2026-09-05. | Sustituir por barra compacta contextual. |
| El índice del draft usa Propósito, Inicio, Desarrollo, Cierre, Materiales y Bibliografía, que no son las secciones del runtime. | Inventario 2026-09-05. | Adoptar las siete del runtime; la secuencia didáctica vive dentro de sesiones. |
| El draft no representa la vista formulario ni el formato de página que el runtime ya tiene. | `DocEditorScreen` con A4 y Carta y vistas mixto, documento y formulario. | El candidate debe representarlas: el prototipo no puede prometer menos que la app. |

## Riesgos trasladados al handoff runtime

1. **Migración a documento-primero.** El runtime guarda hoy un `PlaneacionDocumento` tipado. La decisión
   aprobada exige que el documento sea la fuente de verdad y el formulario una proyección. Es migración de
   almacenamiento con datos existentes, no una reescritura de UI, y es el costo mayor de esta ola.
2. **Enlace revocable y solicitud de permiso.** No existe hoy. Requiere identidad del receptor, estado de
   permiso por documento y revocación, además de una decisión de privacidad sobre datos de alumnos.
3. **Historial con puntos de guardado.** El runtime tiene borrador automático y deshacer en memoria; no
   tiene versiones nombradas ni restauración.
4. **Exportación con fidelidad.** Heredado de #177 y todavía sin dimensionar, ahora con el requisito
   adicional del viaje de vuelta.

## Supuestos IHC que permanecen abiertos

- Que el docente entienda y use los tres niveles de plantilla no está medido.
- Que editar en línea sobre la hoja en 390 px sea cómodo en secciones con tabla es un supuesto.
- `context/planeaciones-reales/` sólo conserva su README: el contenido está externalizado, así que el
  contraste con planeaciones reales no puede hacerse desde el repositorio en esta ola.
- Las entrevistas con docentes siguen pausadas por decisión del owner (#47).
