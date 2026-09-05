# Inventario as-is de Office — `#157-O3`

> **Fecha:** 2026-09-04.
> **Alcance:** estado verificado del prototipo Figma y del runtime antes de proponer el change.
> **Método Figma:** `get_metadata` read-only sobre `VBK5tK7EQS83tdTmtuBpI9`, nodos `257:951`, `277:958`
> y `274:958`. Clasificación de breakpoint **por ancho de frame**, según la regla que #166 impone a toda
> ola posterior.
> **Método runtime:** CodeGraph sobre el índice del checkout `416509d`. GitNexus no expone superficie MCP
> en esta sesión (`.mcp.json` registra codegraph, figma, context7, github, vercel, expo, planearia-sqlite
> y playwright); su wrapper sólo gobierna salud de índice. Se declara la limitación en vez de atribuir a
> GitNexus una consulta que no hizo. Índice reparado y verificado el 2026-09-04 antes de consultar.

## 1. Figma: las tres superficies de Office existentes

| Superficie | Nodo | Tamaño real | Clasificación por ancho |
| --- | --- | ---: | --- |
| `D-2 · Office Docente · desktop · candidate` | `257:951` | 1440x960 | escritorio |
| `T-G · Office Docente · tablet · desktop-fallback · candidate` | `277:958` | 1440x960 | **escritorio**, pese al nombre |
| `M-G · Office Docente · móvil · bridge · candidate` | `274:958` | 390x844 | móvil |

### 1.1 Desktop `257:951`

Estructura verificada: rail editorial de 264 px con nueve destinos de nav y bloque de contexto docente;
área de archivos de 1176 px con eyebrow, título, subtítulo, `Acción · Nuevo archivo` (instancia),
`Acción · Importar archivo`, cuatro filtros (Todos, Documentos, Hojas de cálculo, Presentaciones), sección
`Recientes` con estado, tres filas de archivo con un único control `Abrir`, un bloque
`Inicio por intención docente` con cuatro sugerencias (Planeación de clase, Material de lectura, Rúbrica,
Bibliografía) y una línea de estado.

### 1.2 Tablet `277:958`

**Es un clon exacto del desktop.** Misma jerarquía, mismo rail de 264 px, misma área de 1176 px, mismos
nombres de capa, mismo bloque de sugerencias. No difiere en un solo elemento estructural. Confirma
literalmente lo que #166 declaró: se llama tablet y es una superficie de escritorio.

### 1.3 Móvil `274:958`

Header de 76 px, eyebrow, título, subtítulo, **un único panel de prioridad** con una sola acción
(`Acción · abrir prioridad · móvil`), una línea de estado y la barra compacta de cinco hubs. No tiene
launcher, ni biblioteca, ni filtros, ni creación, ni archivo alguno.

Es exactamente el patrón de degradación que #163 encontró y corrigió en Escritorio: móvil reducido a una
tarjeta. Aquí sigue vigente.

## 2. Brecha entre el prototipo actual y lo decidido en la entrevista

| Decisión de la entrevista | Estado en `257:951` | Brecha |
| --- | --- | --- |
| Creación desplegada con los tres tipos visibles al entrar | Un solo botón `Nuevo archivo` | La zona de creación no existe; hay que construirla |
| Sólo tres tipos creables | El botón no declara tipos | Sin evidencia de tipos en la superficie |
| Plantillas visibles como atajo opcional, después del tipo | `Inicio por intención docente` ofrece Planeación, Material de lectura, Rúbrica y Bibliografía | **Contradice D3**: es intención-primero, no tipo-primero, y está al fondo de la página |
| Biblioteca por recientes y luego agrupada por tipo | `Recientes` + cuatro filtros por tipo | **Alineado.** Se conserva y se refina |
| Cinco acciones por archivo sin abrirlo | Sólo `Abrir` | Falta el diferenciador completo del módulo |
| Importar como acción persistente | `Acción · Importar archivo` ya existe en el header | **Alineado.** Confirma la decisión derivada |
| Estado vacío con crear e importar | No existe | Hay que construirlo |
| Superficie propia en 768 | Clon de 1440 | Hay que construirla |
| Superficie propia en 390 | Una tarjeta de prioridad | Hay que reconstruirla |

## 3. Runtime: qué existe hoy

`OfficeStack` (`src/navigation/stacks/OfficeStack.tsx`) registra dieciséis rutas bajo `OfficeTab`, con
`OfficeHome` como ruta inicial:

| Grupo | Rutas |
| --- | --- |
| Hub | `OfficeHome` |
| Planeaciones | `Planeaciones`, `CrearPlaneacion`, `GenerarPlaneacionIA`, `ImportarPlaneacion`, `EscanerPlantilla`, `ExportarPlaneacion`, `ListaPlaneaciones` |
| Recursos | `RecursosDidacticos`, `ListaRecursos`, `CrearRecurso` |
| Plantillas | `BibliotecaPlantillas`, `ListaPlantillas`, `DetallePlantilla`, `EditorPlantilla` |
| Biblioteca transversal | `Contenido` |

`DocEditor` no vive en Office: es ruta raíz a pantalla completa con modos `crear`, `editar` y `plantilla`.

### 3.1 `OfficeHomeScreen`

Lanzador de cinco filas: Mis planeaciones, Crear documento, Recursos didácticos, Plantillas y Biblioteca.
Usa `useAppTheme`, `useBreakpoint` y fábrica `getStyles` memoizada, es decir ya está en el patrón migrado
por las Olas 2a y 2b del epic #141. Cierra con una nota honesta de que CalcuPLAN y PresentaPLAN llegarán
después, y el código documenta por qué no los lista como botones:

> Solo lo que existe hoy. CalcuPLAN y PresentaPLAN entran con sus changes de Ola 3+; listarlos como
> botones seria crear accesos muertos (anti-slop 1.9.3).

### 3.2 Hallazgos que el prototipo ignora

Tres capacidades ya existen en runtime y **no tienen ninguna representación en el prototipo**:

1. **D6 ya está parcialmente implementado.** `Contenido` es ruta de `OfficeStack`, no tab propia, y el
   tipo lo documenta: "Biblioteca transversal (antes ContenidoTab; D6 la disuelve dentro de Office)".
2. **Existe una biblioteca de plantillas real.** `BibliotecaPlantillasScreen` tiene categorías, búsqueda,
   destacadas por número de usos, recientes por fecha de modificación, estado vacío y duplicado. El
   catálogo de plantillas que decidiste en la entrevista tiene una superficie runtime donde aterrizar.
3. **Existe importación y exportación de planeaciones.** `ImportarPlaneacion`, `ExportarPlaneacion` y
   `EscanerPlantilla` son rutas vivas.

Esto no autoriza copiar el runtime al prototipo. El runtime informa la evolución; no es UX destino. Pero sí
obliga a que el candidate no invente desde cero lo que ya existe ni prometa menos de lo que la app hace.

## 4. Consecuencia para el diseño del candidate

1. La zona de creación desplegada y las cinco acciones por archivo son **construcción nueva**.
2. `Recientes` y los cuatro filtros son **conservación**: el eje elegido en la entrevista ya está en el
   prototipo y sólo cambia de jerarquía.
3. `Inicio por intención docente` es **sustitución**: contradice D3 y el catálogo de plantillas acordado
   ocupa su función correctamente, después del tipo y no antes.
4. Tablet 768 y móvil 390 son **reconstrucción total**. Ninguna de las dos superficies existe hoy.
5. Abrir un editor entrega el estado honesto de límite, reutilizando el patrón `345:968` / `345:1006`
   aprobado en #163, hasta que corran `#157-O4` a `#157-O6`.

## 5. Límite de este inventario

No se ejecutó Playwright contra el runtime: la comparación visual con la app no es necesaria para decidir
la arquitectura del candidate y el módulo no tiene todavía superficie de destino que comparar. Si el gate
visual la exige, se levanta en `apply` con `expo start --web` y HTTP 200 confirmado antes de navegar.
