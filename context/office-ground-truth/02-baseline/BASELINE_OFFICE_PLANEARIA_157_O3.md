# Baseline Office Docente PlanearIA `#157-O3`

> **Versión:** 0.1 candidate.
> **Fecha:** 2026-09-04.
> **Autoridad:** #101 → #157 → `MATRIZ_DECISIONES_OFFICE_157_O3.md`.
> **Estado:** contrato candidato derivado de la entrevista del 2026-09-04. No es aprobación visual.
> Los frames se aprueban con Figma Present y veredicto humano explícito, nunca por este documento.

## 1. Promesa

Office Docente es el lugar donde el docente **hace un material nuevo** y donde vuelve por el que ya hizo.
No es un gestor de archivos ni una copia de Drive: cada archivo sabe a qué grupo pertenece, dónde se está
usando y sale de la app en el formato que la escuela pide.

La tarea principal declarada es crear. Todo lo demás está subordinado a que crear sea inmediato.

## 2. Arquitectura de la experiencia

### Capa A — Crear (zona principal)

Los tres tipos de Office están desplegados al entrar: **documento**, **hoja** y **presentación**. No hay
modal intermedio dentro de Office. Cada tipo abre en blanco por defecto.

Junto a cada tipo se ofrecen sus plantillas docentes como atajo opcional, nunca como paso previo. El
catálogo inicial está organizado en familias con presets para evitar plantillas redundantes:

| Tipo | Familias | Presets |
| --- | --- | --- |
| Documento | Planeación didáctica; Instrumento de evaluación; Documento académico | base; examen y rúbrica de cotejo; reporte, resumen e investigación |
| Hoja | Control del grupo; Cobros y aportaciones | asistencia, calificaciones y concentrado; cobro simple y pedido con tallas |
| Presentación | Temas visuales | varios temas sobrios |

**Importar** vive en esta capa como acción persistente, no sólo en el estado vacío: el docente que llega
con años de material no crea, trae.

### Capa B — Biblioteca

Eje primario cronológico: lo reciente primero. Agrupación secundaria por tipo, con los filtros que el
prototipo ya tiene (Todos, Documentos, Hojas de cálculo, Presentaciones).

El grupo o la materia es **etiqueta del objeto**, no estructura de la biblioteca. Un archivo declara su
grupo; la biblioteca no se organiza en carpetas por grupo.

Alcance de esta ola: sólo archivos de Office. Recursos didácticos y materiales heredados de ContenidoTab
no se dibujan ni se insinúan. D6 se completa en una ola posterior con su propia entrevista, aunque el
runtime ya tenga `Contenido` dentro de `OfficeStack`.

### Capa C — Acciones sobre el archivo sin abrirlo

Es el diferenciador declarado del módulo. Cinco acciones, todas con módulo owner explícito:

| Acción | Qué hace | Owner |
| --- | --- | --- |
| Descargar | Entrega el archivo en su extensión real (.docx, .xlsx, .pdf) conservando formato | Office |
| Asignar a un grupo | Abre la hoja Asignar ya aprobada en el change `assign-sheet` | Clases |
| Adjuntar a una conversación | Manda el objeto real a Mensajería, no una copia suelta | Mensajería |
| Ver dónde se está usando | Declara grupos, tareas y último uso del archivo | Office (proyecta referencias) |
| Duplicar para otro grupo | Copia el material y lo reapunta a otro grupo o ciclo | Office |

Descargar y duplicar son propias de Office. Asignar y adjuntar **devuelven el control al módulo owner** y
retornan a Office con el contexto intacto. Ver dónde se usa proyecta referencias sin poseerlas.

## 3. Adaptación por breakpoint

La arquitectura de tres capas se conserva en los tres tamaños. Cambia densidad y disposición, no la
información.

| Breakpoint | Ancho | Crear | Biblioteca | Acciones |
| --- | ---: | --- | --- | --- |
| Escritorio | 1440 | Tres tipos en fila con sus plantillas visibles | Lista completa con filtros | Visibles en la fila del archivo |
| Tablet | 768 | Tres tipos, plantillas por tipo accesibles sin ocultar el tipo | Lista con filtros, densidad reducida | Agrupadas tras un control explícito con label visible |
| Móvil | 390 | Tres tipos compactos, siempre visibles sin scroll | Lista de recientes con filtros desplazables | Hoja de acciones desde la fila del archivo |

Regla heredada de #166, no negociable: **ningún hotspot cruza de breakpoint**. La clasificación es por
ancho de frame, nunca por nombre, y se cuentan también las aristas que salen de la sección.

Abrir un editor no existe todavía en ningún tamaño: entrega el estado honesto de límite que nombra el
límite y devuelve el control, con el patrón `345:968` / `345:1006` aprobado en #163.

## 4. Estados mínimos

| Estado | Qué muestra Office | Salida |
| --- | --- | --- |
| Vacío (docente nuevo) | Zona de creación completa con plantillas, más importar. Mensaje honesto donde iría la biblioteca. Sin ejemplos falsos ni tarjetas inertes | Crear o importar |
| Cargando | La zona de creación permanece usable; sólo la biblioteca indica carga | Crear no depende de la biblioteca |
| Error | Nombra qué falló y qué se conserva localmente | Reintentar, o seguir creando |
| Offline | Declara trabajo local disponible; no promete sincronización ni descarga remota | Seguir trabajando en local |
| Sync pendiente o conflicto | Distingue pendiente de conflicto; no se confunde con éxito remoto | Resolución manual |
| Editor no disponible en este tamaño | Estado de límite de #163: nombra el límite, no simula editor | Volver al origen exacto, o ir a Office |

Ningún estado simula guardado, envío, red, IA, autenticación ni sincronización real. La descarga con
fidelidad de formato se representa como afordancia y **no se simula**.

## 5. Navegación y retornos

- Office conserva el shell global: cinco hubs en móvil, rail en tablet, sidebar en web.
- Volver desde un objeto conserva origen y filtro aplicado; el docente no reinicia la biblioteca.
- Asignar y adjuntar retornan a Office declarando qué ocurrió con el archivo.
- El selector tipo-primero global de Escritorio (`310:3`, `310:69`, `310:106`) permanece intacto y
  alcanzable: la creación desplegada de Office no lo sustituye ni lo duplica.

## 6. Lo que Office no es

No es feed, no es dashboard de KPIs, no es mosaico bento, no es catálogo de tarjetas inertes y no es
gestor de archivos genérico. No adopta glass, blur, gradientes, halos ni animación ornamental para
sustituir jerarquía. No copia el layout ni el lenguaje de Microsoft 365 ni de Drive: contrasta patrones.

No incluye NotasPLAN, CalcuPLAN ni PresentaPLAN, que pertenecen a `#157-O4` a `#157-O6`. No incluye
Diseño ni preguntar a la IA como tipos creables.

## 7. Referencias y límites

Ground truth híbrido docente: se contrastan los patrones de recientes y creación de Microsoft 365 home,
y se descarta Drive como eje por ser un gestor de archivos sin contexto docente. Ninguna referencia se
copia literalmente ni sustituye la investigación con docentes.

Office no tenía carpeta de ground truth antes de esta ola; el issue #87 sigue abierto. Esta carpeta la
inaugura y no lo cierra: #87 pide además índices de Asistente y registro de frames aprobados.

## 8. Supuestos IHC a validar

- Que crear sea la tarea principal de Office es una decisión del owner, no un hallazgo de campo.
- El catálogo de plantillas se deriva de la experiencia declarada del owner. Qué plantillas usa de verdad
  un docente, y con qué frecuencia, sigue sin medirse.
- Que lo cronológico baste para encontrar es un supuesto: no se ha medido el volumen real de archivos de
  un docente a lo largo de un ciclo.
- Que cinco acciones por archivo no saturen la fila en móvil se prueba en Present, no se presupone.
