## Context

Office Docente tiene tres frames heredados de #156 y #159, todos `candidate`. El inventario del 2026-09-04
verificó su estado por ancho de frame y por CodeGraph sobre runtime:

| Superficie | Nodo | Tamaño real | Problema |
| --- | --- | ---: | --- |
| Desktop | `257:951` | 1440x960 | Creación sin tipos; sólo `Abrir` por archivo; intención-primero al fondo |
| "Tablet" | `277:958` | **1440x960** | Clon exacto del desktop, elemento por elemento |
| Móvil | `274:958` | 390x844 | Una sola tarjeta de prioridad cuya acción entrega frames de 1440 |

En runtime, `OfficeStack` registra dieciséis rutas con `OfficeHome` inicial ya migrado a `useAppTheme` y
`useBreakpoint`. Dos capacidades vivas no tienen representación en el prototipo: `Contenido` ya está dentro
del hub (D6 parcialmente implementado) y `BibliotecaPlantillasScreen` es una biblioteca de plantillas real
con categorías, búsqueda, destacadas, recientes y estado vacío.

La entrevista dirigida del 2026-09-04 fijó doce decisiones, registradas con su condición de reapertura en
`context/office-ground-truth/01-decisiones/MATRIZ_DECISIONES_OFFICE_157_O3.md`.

## Goals / Non-Goals

**Goals:**

- Que Office exprese su trabajo real: crear material nuevo y volver por el que ya existe.
- Que los tres breakpoints conserven la misma arquitectura de información, cambiando densidad y no
  contenido.
- Que cada hotspot resuelva en su propio ancho de frame, cerrando la porción de Office de #166.
- Que el archivo sea un objeto conectado —sabe a qué grupo pertenece, dónde se usa y cómo sale— y no una
  entrada de gestor de archivos.
- Que el prototipo no prometa menos de lo que el runtime ya hace ni simule lo que no puede sostener.

**Non-Goals:**

- Los editores NotasPLAN, CalcuPLAN y PresentaPLAN (`#157-O4` a `#157-O6`).
- La absorción de ContenidoTab y los recursos didácticos (D6 completo).
- Cualquier cambio de runtime, datos, sync o backend.
- La aprobación visual: la produce el owner en Figma Present, no este documento.

## Decisions

### D-O3-1. La creación se despliega dentro de Office, sin modal

**Elegido:** los tres tipos visibles al entrar como zona de mayor jerarquía.

**Alternativa descartada:** conservar D3 literalmente (un botón Crear que abre el modal de tipos). Se
descarta porque crear es la tarea principal declarada del módulo; un modal dentro del módulo cuya tarea
principal es crear añade un paso sin función.

**Cómo se controla la desviación:** queda acotada al hub de Office. D3 sigue gobernando el botón Crear
global del shell, y Present debe verificar que los selectores `310:3`, `310:69` y `310:106` aprobados en
#163 siguen intactos y alcanzables desde Escritorio. La desviación está registrada en la matriz de
decisiones y declarada en la spec: no se descubre en revisión adversarial.

### D-O3-2. Las plantillas van después del tipo, en familias con presets

**Elegido:** cada tipo abre en blanco por defecto; sus plantillas se ofrecen visibles como atajo opcional.
El catálogo se agrupa en familias.

**Alternativa descartada:** plantillas como portada del módulo. Haría intención-primero, contradiría D3 sin
la justificación acotada de D-O3-1 y convertiría una decisión de tipo en una compra de catálogo.

**Por qué familias y no plantillas sueltas:** la enumeración original del owner se solapaba. Lista de
asistencia, registro de calificaciones y la variante combinada son la misma estructura con distinto
alcance, y examen y rúbrica comparten esqueleto. `Control del grupo` con presets asistencia, calificaciones
y concentrado, e `Instrumento de evaluación` con presets examen y rúbrica, eliminan la redundancia sin
perder ningún caso. `Cobros y aportaciones` sí separa cobro simple de pedido con tallas, porque las tallas
exigen columna de variante y consolidado que un cobro simple no tiene.

### D-O3-3. El bloque `Inicio por intención docente` se sustituye, no se mueve

**Elegido:** retirarlo de la sección candidate; su función legítima —dar atajos docentes— la cubre el
catálogo de plantillas, colocado después del tipo.

**Alternativa descartada:** subirlo a la zona principal. Empeoraría el problema: pondría la intención
escolar aún más claramente antes del tipo.

### D-O3-4. La biblioteca conserva el eje cronológico existente

**Elegido:** recientes primero, agrupación secundaria por tipo con los cuatro filtros que el prototipo ya
tiene. El grupo o materia es etiqueta del objeto, no estructura.

**Alternativa descartada:** organizar por grupo o materia como eje primario. Es lo que más diferencia de un
Drive, pero obliga al docente a saber en qué grupo guardó algo antes de encontrarlo, y el owner eligió
explícitamente el eje cronológico. Queda registrado como supuesto reabrible si el volumen real de archivos
hace que lo reciente deje de bastar.

**Consecuencia:** los filtros y `Recientes` de `257:951` se conservan. La biblioteca es la parte del frame
actual que **no** se rehace.

### D-O3-5. Las cinco acciones cambian de forma por breakpoint, no de contenido

**Elegido:** visibles en la fila del archivo en 1440; agrupadas tras un control con label visible en 768;
hoja de acciones desde la fila en 390.

**Alternativa descartada:** menú de tres puntos en los tres tamaños. Es exactamente el patrón del gestor de
archivos genérico que el preflight refuta, y un icono mudo no puede ser el único portador de significado
de la affordance que define el módulo.

**Frontera de ownership:** descargar y duplicar son de Office. Asignar devuelve el control a Clases
reutilizando la hoja aprobada en `assign-sheet`; adjuntar lo devuelve a Mensajería. Ambas retornan a Office
declarando qué ocurrió con el archivo. Ver dónde se usa proyecta referencias sin poseerlas.

### D-O3-6. Los editores entregan el estado de límite de #163, no un editor simulado

**Elegido:** clonar el patrón `345:968` / `345:1006` con acción `BACK`, que devuelve al origen exacto sin
declarar destino fijo y por tanto nunca cruza de tamaño.

**Alternativa descartada:** construir vistas de editor en móvil y tablet. Cerraría más deuda de #166 de
golpe, pero adelanta trabajo de `#157-O4` a `#157-O6` y agranda el gate visual, que es el riesgo de
mega-change que #157 declara.

### D-O3-7. Los frames nuevos se clonan de superficie aprobada

**Elegido:** clonar frames de la sección `307:965` de Escritorio para heredar tokens, variables ligadas y
tipografía.

**Por qué:** introducir estilo nuevo en un módulo cuyo sistema visual ya está aprobado produce deriva de
tokens y hex sueltos, que es justo la deuda que #148 rastrea en ClassroomHome. Clonar hereda el
cumplimiento en vez de re-verificarlo.

### D-O3-8. La descarga se representa pero no se simula

**Elegido:** la acción existe, tiene label y destino en el prototipo, y no muestra progreso, archivo
generado ni confirmación de formato preservado.

**Por qué:** es la única de las cinco acciones cuyo costo real de runtime es alto y no está dimensionado.
Simularla en el prototipo la haría parecer resuelta y el handoff heredaría una promesa que nadie midió.

## Risks / Trade-offs

- **Office termina siendo un gestor de archivos genérico** → refutado explícitamente en el preflight; se
  controla exigiendo las tres capas y la fila de archivo conectado, y prohibiendo el menú de tres puntos
  mudo como única affordance.
- **Las cinco acciones saturan la fila en 390** → hoja de acciones en móvil, y se prueba en Present con
  fuente ampliada; no se presupone que quepan.
- **Tablet vuelve a resolverse con el fallback de escritorio** → auditoría del grafo por ancho de frame
  antes de cerrar, contando aristas salientes. Es la medición que #163 tuvo que corregir dos veces.
- **La desviación de D3 se lee como incumplimiento** → declarada en la spec y en la matriz de decisiones,
  con la verificación de que el selector global de Escritorio sigue intacto.
- **Se genera deuda nueva con el presupuesto en 4/5** → una tercera deuda transversal dispara saneamiento y
  pausa el plan. Cualquier hallazgo residual se clasifica y verifica antes de capturarlo, no se acepta como
  deuda por reflejo.
- **El prototipo promete menos que el runtime** → el inventario declara `Contenido` y
  `BibliotecaPlantillas` como capacidades vivas; el catálogo de plantillas del candidate tiene dónde
  aterrizar y no inventa desde cero.

## Migration Plan

1. Revalidación Figma read-only antes de escribir.
2. Sección candidate nueva; los tres frames heredados se conservan intactos como baseline histórico.
3. Construcción por breakpoint, empezando por 1440 para fijar la arquitectura, luego 768 y 390.
4. Auditoría del grafo por ancho de frame; corrección de fugas dentro del mismo change.
5. Figma Present por breakpoint y veredicto humano del owner.
6. Promoción de frames sólo tras aprobación explícita.

**Rollback:** Figma conserva los frames existentes y la sección candidate es recuperable por historial. Los
artefactos versionados se revierten por PR normal. Runtime, rutas, datos y claves locales permanecen
intactos. Si el gate visual se rechaza, se itera o se restaura el candidate y no se promueve ni se crea el
change de runtime.

## Open Questions

- Si la zona de creación desplegada degrada la comprensión en 390, ¿se compacta a un control único con
  tipos visibles o se acepta scroll? Se resuelve en Present, no antes.
- Las dos decisiones derivadas por el agente —importar como acción persistente y el catálogo en familias—
  están marcadas como tales y se confirman en Present.
- Cuándo se abre la ola que absorbe ContenidoTab. No bloquea esta ola.
