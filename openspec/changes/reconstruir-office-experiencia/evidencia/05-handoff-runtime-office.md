# Handoff runtime de Office `#177`

**Fecha:** 2026-09-04
**Qué es:** el contrato que un change de runtime posterior tendría que respetar si se decide implementar
Office. **Qué no es:** autorización. No crea issue, no crea change y no autoriza tocar `src/`.

## 1. Correspondencia de superficies

| Superficie aprobada del prototipo | Runtime actual | Qué implicaría |
| --- | --- | --- |
| Office Docente (`461:969` / `461:1050` / `461:1108`) | `OfficeHomeScreen` en `src/screens/office/` | Reestructurar el lanzador de cinco filas en tres capas: crear, biblioteca y acciones |
| Biblioteca y sus vistas filtradas | `ListaPlaneaciones`, `Contenido`, `RecursosDidacticos` | Unificar en una lista cronológica con filtro por tipo. `Contenido` ya vive dentro de `OfficeStack` |
| Plantillas por tipo | `BibliotecaPlantillasScreen`, `ListaPlantillas`, `DetallePlantilla` | Ya existe biblioteca con categorías, búsqueda, destacadas y recientes. Falta el modelo de familia con presets |
| Importar | `ImportarPlaneacion`, `EscanerPlantilla` | Existe para planeaciones; habría que generalizarlo a los tres tipos |
| Superficie pendiente por breakpoint | no existe | Patrón honesto para lo que no esté implementado; no inventar editor |
| Asignar a un grupo | change `assign-sheet` archivado, spec `cross-surface-assignment` | **Reutilizar el componente único.** El prototipo tuvo que clonar la hoja de Clases porque su cableado Figma entraba al flujo interno de Clases; en runtime eso no aplica y duplicar sería un defecto |

## 2. Roles perceptuales, no hex

El candidate no aporta colores nuevos: cada relleno está enlazado a `PlanearIA / Color`, con modos Claro y
Oscuro verificados. El runtime debe mapear **rol**, no valor.

| Rol en el prototipo | Familia de token | Consumo en runtime |
| --- | --- | --- |
| Fondo de pantalla | `bg/canvas` | `colors.background` |
| Tarjeta y fila de archivo | `bg/surface` | `colors.surface` |
| Acción primaria de crear | `bg/primary` + `text/inverse` | `colors.primary` |
| Filtro activo y acción secundaria | `bg/selected` | familia de acento suave |
| Rótulos de sección | `text/brand` | acento de marca |
| Texto secundario | `text/secondary` | `colors.textSecondary` |
| Borde de tarjeta | `border/subtle` / `border/strong` | `colors.borderLight` / `colors.borderStrong` |
| Estados de aviso y error | `bg/warning`, `bg/danger`, `text/danger` | familias de estado |

`OfficeHomeScreen` ya está migrada a `useAppTheme` + `useBreakpoint` + fábrica `getStyles` memoizada, así
que hereda tema, escala tipográfica y daltonismo sin trabajo adicional. Cualquier pantalla nueva de Office
debe nacer con ese patrón y **no** importar `COLORS` estático.

## 3. Contratos que el runtime debe conservar

- `OfficeStack` con `OfficeHome` como ruta inicial y la partición de hubs vigente; los cruces entre hubs
  usan `navigateToHub`.
- MVVM: pantallas delgadas, hooks como ViewModels, servicios para I/O.
- `src/sync` como único motor de sincronización. Nada de clientes HTTP ni colas paralelas.
- Aislamiento por `userId` en toda entidad multiusuario.
- Claves legacy `@planearia:*` intactas; AsyncStorage por defecto y SQLite opt-in.
- IA sólo a través de `backend/lib/aiGateway.js`.
- Objetivo táctil de 44 pt **sin depender de `hitSlop`**. La excepción de deuda vigente por 25 controles
  que sí dependen de él no debe ampliarse.
- Una sola pantalla responsive por superficie; archivos `.web.tsx` / `.native.tsx` requieren justificación.

## 4. Lo que el prototipo promete y el runtime todavía no tiene

Esto es lo que hace que el handoff no sea trivial. Se lista con su costo real, no como lista de deseos.

| Promesa | Estado en runtime | Costo y riesgo |
| --- | --- | --- |
| Crear hoja de cálculo y presentación | **No existen.** `OfficeHomeScreen` deliberadamente no los lista para no crear accesos muertos | Alto. Son `#157-O4` a `#157-O6` en prototipo y changes propios en runtime. Hasta entonces el runtime debe mantener el estado honesto, no un botón muerto |
| **Descargar conservando formato** (.docx, .xlsx, .pdf) | Existe `ExportarPlaneacion`; no hay exportación fiel para los tres tipos | **El más alto y sin dimensionar.** Debe medirse contra la excepción de deuda vigente por el cuelgue síncrono de SheetJS ante un xlsx corrupto, y contra el costo real de fidelidad en docx. El prototipo lo representa y **no lo simula** precisamente para no dar por resuelto lo que nadie ha medido |
| Ver dónde se está usando | No existe | Medio. Requiere consulta inversa de archivo a grupos y tareas. Hay que verificar si el modelo actual permite resolverla sin recorrer todas las entidades |
| Adjuntar a una conversación | Mensajería no está reconstruida | Bloqueado por su propia ola |
| Duplicar para otro grupo | No existe como acción de biblioteca | Bajo o medio, según si se reutiliza el duplicado de plantillas ya presente en `BibliotecaPlantillasScreen` |
| Familias de plantillas con presets | La biblioteca existe con categorías planas | Medio. Es un cambio de modelo de datos de plantillas, no sólo de UI |

## 5. Estados que el runtime debe poder representar

Los siete del prototipo no son decorado: cargando, error, offline, sync pendiente, sync en conflicto,
vacío y superficie no disponible en este tamaño. Dos condiciones que la spec impone y el runtime hereda:

1. **Sync pendiente y sync en conflicto no pueden verse iguales**, ni presentarse como éxito remoto.
2. **Crear no puede depender de que la biblioteca responda.** Si la lectura local falla, la zona de
   creación sigue usable.

## 6. Lo que este handoff no decide

- No decide si Office se implementa ahora ni en qué orden respecto de los editores.
- No autoriza activar SQLite ni migrar claves locales.
- No cierra el issue #87, que además pide índices de Asistente y registro de frames aprobados.
- No sustituye las entrevistas docentes, pausadas por decisión del owner en #47. Los supuestos IHC del
  ground truth siguen abiertos.

Cualquier trabajo de runtime derivado de este documento requiere issue propio, gate de readiness y su
propio change.
