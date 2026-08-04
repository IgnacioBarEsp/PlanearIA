# Inventario y drift de Clases: Figma y runtime

> **Versión:** 0.1, evidencia brownfield.
> **Fecha:** 2026-08-03.
> **Issue owner:** #159.
> **Uso:** separar comportamiento real, prototipo draft y destino aprobado.
> **No autoriza por sí solo:** editar Figma/runtime, reabrir #156 ni crear el change OpenSpec.

## 1. Método y límites

- **Figma:** inspección de solo lectura mediante metadata y Figma Plugin API. No se creó, movió, renombró
  ni conectó ningún nodo.
- **Runtime:** GitNexus fue la primera consulta. El índice estaba stale, se reparó con
  `npm run gitnexus:repair` y se verificó con `npm run gitnexus:verify`. La consulta amplia omitió
  superficies clave; se activó CodeGraph como fallback lineado, conforme al contrato del repositorio.
- **Playwright:** no ejecutado. Esta fase registra arquitectura y drift, no afirma comparación visual del
  runtime ni paridad por breakpoint.
- **Precedencia:** código/specs describen el comportamiento real; baseline oficial, visión y plan describen
  el destino; el prototipo actual es un draft navegable, no ground truth aprobado.

## 2. Inventario Figma actual

| Superficie | Frame | Estado observado | Contrato navegable |
| --- | --- | --- | --- |
| Concepto temprano | [Concept · Clases · draft `38:2`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=38-2) | Concept board, no experiencia completa | Sin autoridad visual final |
| Entrada desktop | [Clases · grupos `90:48`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=90-48) | Draft | Navegación global, Crear actividad, Registrar asistencia y filas hacia editores |
| Detalle desktop | [Clases · Ciencias 2B `125:65`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=125-65) | Draft | Navegación global, Crear actividad, Registrar asistencia y filas hacia editores |
| Alta de actividad | [Clases · nueva actividad `127:166`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=127-166) | Overlay draft | Crear borrador navega a documento `62:3`; cancelar cierra overlay |
| Entrada móvil | [Clases · grupos `158:150`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=158-150) | Draft | Una prioridad abre el detalle desktop; barra de cinco hubs |

La navegación base corregida por #156 se conserva como evidencia histórica. Los hallazgos siguientes
pertenecen a la reconstrucción semántica de #159 y no reabren ese issue.

### Drift Figma

| ID | Fuente | Drift | Impacto | Recomendación / condición de reapertura |
| --- | --- | --- | --- | --- |
| F-01 | `90:48`, `125:65` | La capa principal se llama “Área de archivos”, lista documentos/hojas/presentaciones y abre editores de Office. | Clases se percibe como Office filtrado, justo el antipatrón que #157 prohíbe. | Reemplazar el modelo de archivos por clases, anuncios, trabajo, personas y seguimiento. Solo reabrir la frontera si pruebas docentes no reconocen el modelo. |
| F-02 | `90:48`, `125:65` | Entrada y detalle repiten composición, filas y sugerencias; cambia principalmente el copy. | Entrar a una clase no cambia de tarea ni jerarquía. | Dar a la entrada un rol cross-class y al detalle las cuatro áreas propias. Reabrir solo si un journey requiere continuidad distinta. |
| F-03 | `90:48`, `125:65` | “Hoy/Resumen, Trabajo, Personas, Seguimiento” son filtros visuales sin frames/estados diferenciados. | No se puede validar Tablón, Trabajo de clase, Personas o Seguimiento. | Crear estados/frames candidatos por área después del gate; no falsificar hotspots. |
| F-04 | `127:166` | Crear actividad exige “elegir un borrador” y Crear borrador salta al editor documental. | Contradice la decisión de crear una actividad sin archivo y absorbe Clases en Office. | Alta breve autónoma; adjuntar/crear recurso como opción secundaria con retorno y confirmación. Reabrir solo si el owner cambia explícitamente el contrato. |
| F-05 | `90:68`, `125:85` | El CTA visible “Registrar asistencia” conserva nombre interno de importar archivo y navega al overlay `77:43` de importación. | Etiqueta, intención y destino no coinciden; éxito perceptual falso. | En el rediseño, llevar a asistencia real de la clase o retirar el CTA. No se corrige dentro de #156. |
| F-06 | `158:150` | Móvil muestra una única prioridad y abre un detalle desktop; no hay lista de clases ni cuatro áreas adaptadas. | La IA cambia por breakpoint y no cumple “misma arquitectura”. | Diseñar móvil desde la misma arquitectura, con densidad adaptada. Reabrir solo con evidencia de limitación técnica o IHC. |
| F-07 | Frames desktop/móvil | Las etiquetas globales Escritorio/Office Docente/Clases/Asistente de IA/Más se conservan y el offline se declara como prototipo. | Base de confianza y navegación útil. | Preservar labels, estado activo, retorno y honestidad; validar cada hotspot tras reconstruir. |
| F-08 | Todos | Los frames se llaman `draft`; #46 sigue sin aprobación manual. | No existe ground truth visual aprobado. | Mantener draft hasta presentación y aprobación humana explícita. |

## 3. Arquitectura runtime actual

```text
AppShell
  -> ClasesStack (landing: ClassroomHome)
    -> ClassroomHomeScreen
      -> useClassroomHomeViewModel
        -> classroomFacade.listGruposResumen
    -> ClassroomGroupScreen
      -> useClassroomGroupViewModel
        -> classroomFacade
          -> classroomRepository / ClassroomStoragePort
            -> AsyncStorage por default; SQLite opt-in
          -> entitySync / syncEvents
    -> AgregarContenidoClassroomScreen
      -> EntregablesContext / RecursosContext
    -> rutas legacy paralelas de Grupo, Tarea, Alumno, Asistencia y Calificaciones
```

| Superficie | Evidencia real | Comportamiento útil actual |
| --- | --- | --- |
| Shell | `src/navigation/AppShell.tsx:24` | Cinco hubs adaptativos; Clases es un stack propio. Labels runtime aún dicen Inicio, Office y Asistente. |
| Stack | `src/navigation/stacks/ClasesStack.tsx:34` | `ClassroomHome` es landing; 26 rutas mezclan experiencia Classroom y rutas académicas legacy. |
| Entrada | `src/screens/classroom/ClassroomHomeScreen.tsx:39` | Tabs Cursos/Calendario/Pendientes, CTA Crear/Importar, KPIs y cards de clases. |
| VM entrada | `src/hooks/classroom/useClassroomHomeViewModel.ts:27` | Carga resúmenes desde facade, calcula grupos/alumnos/pendientes y recarga con eventos de sync. |
| Detalle | `src/screens/classroom/ClassroomGroupScreen.tsx:38` | Tres tabs reales: Tablón, Trabajo de clase y Personas; unidades/temas, contenido y roster. |
| VM detalle | `src/hooks/classroom/useClassroomGroupViewModel.ts:63` | Carga Grupo, unidades, alumnos, actividades, entregas, asistencia, calificaciones y materiales. |
| Facade/sync | `src/services/classroom/classroomFacade.ts:29`; `src/sync/services/entitySync.ts:41` | Fachada unificada, repositorio/port y cola/pull por entidades; cambios locales se conservan ante fallos remotos. |
| Alta de contenido | `src/screens/classroom/AgregarContenidoClassroomScreen.tsx:299` | Material o actividad; hoy exige archivo/enlace antes de guardar. |
| Handoff | `src/components/assign/AssignSheet.tsx:28`; `src/hooks/useAssignSheet.ts:118` | Selector transversal Clase → Unidad → Actividad opcional, con resultado y sync visibles. |

GitNexus resolvió de forma exacta el impacto de `useClassroomGroupViewModel`: su consumidor directo es
`ClassroomGroupScreen` y el riesgo estructural reportado fue bajo. Para ambos screens devolvió símbolos
duplicados Function/Const y resultado ambiguo; no se transforma ese “bajo” en garantía del change.

### Drift runtime

| ID | Fuente | Drift | Impacto | Recomendación |
| --- | --- | --- | --- | --- |
| R-01 | `ClassroomHomeScreen.tsx:124` | KPIs genéricos Cursos/Alumnos/Pendientes y tab Calendario dominan la entrada. | Riesgo de dashboard de métricas; no prioriza revisar/vencidas/riesgo. | Conservar clases y acciones; sustituir métricas por señales trazables del contrato. |
| R-02 | `ClassroomGroupScreen.tsx:38`; VM líneas 69–74 | El VM ya carga entregas, asistencia y calificaciones, pero la UI solo tiene tres tabs. | Seguimiento existe en datos pero no como experiencia owner. | Añadir Seguimiento en el diseño/contrato futuro; no inventar nueva fuente de datos. |
| R-03 | `ClassroomGroupScreen.tsx:347`; VM líneas 208–215 | Tablón se deriva de actividades/materiales de Trabajo de clase; no modela anuncios propios. | Tablón se vuelve feed derivado y duplica contenido. | Definir anuncio/novedad o estado honesto; no duplicar toda la lista de trabajo. |
| R-04 | `AgregarContenidoClassroomScreen.tsx:312` | Actividad y material requieren adjunto antes de guardar. | Bloquea una actividad autónoma y contradice decisión humana/fuente oficial. | El futuro change debe separar validación académica de validación de adjunto. |
| R-05 | `ClasesStack.tsx:34` | `DetalleGrupo` y `ClassroomGroup` coexisten con rutas paralelas de tareas/alumnos/reportes. | Dos jerarquías y retornos posibles; alto riesgo de UX inconsistente. | Inventariar consumers y migrar rutas solo dentro del change, con compatibilidad/rollback. |
| R-06 | `AppShell.tsx:24` | Labels runtime: Inicio, Office, Asistente; visión activa: Escritorio, Office Docente, Asistente de IA. | Drift de nomenclatura entre runtime y Figma. | Registrar en el change dueño; no corregir incidentalmente si excede Clases. |
| R-07 | CodeGraph blast radius + `src/__tests__/classroom/` | Hay pruebas de modelo/facade/repository/storage, pero no cobertura directa de los dos screens/ViewModels Classroom. | Un rediseño puede romper carga, estados o navegación sin señal específica. | Añadir pruebas MVVM/screen proporcionales en el change; no marcar AC completo con tests de datos solamente. |
| R-08 | `ClassroomGroupScreen.tsx:256` | Resumen IA se presenta como alert de texto; no es objeto revisable persistente. | No cumple aún el contrato borrador/copia/diff/resumen revisable. | Dejar fuera del primer slice o diseñar un resultado revisable; nunca publicar/aplicar automáticamente. |

## 4. Qué se conserva y qué no

### Candidatos a conservar

- `ClasesStack` como hub separado y `ClassroomHome` como landing técnica.
- CTA Crear/Importar clase y cards de clases como patrón reconocible.
- Tablón, Trabajo de clase y Personas ya presentes en runtime.
- Unidad/Tema, roster, actividad, entrega, asistencia y calificación como datos reales disponibles.
- `classroomFacade` + repository/storage port + sync existente; SQLite sigue opt-in.
- `AssignSheet` como contrato transversal de referencia/retorno y estados honestos.

### No convertir en destino

- composición de archivos de Figma;
- KPIs genéricos o Calendario como tab de entrada de Clases;
- rutas legacy paralelas como arquitectura de información;
- Tablón derivado automáticamente de Trabajo de clase;
- adjunto obligatorio para actividad;
- salto de Crear actividad a documento Office;
- pantalla móvil que solo enlaza al detalle desktop.

## 5. Gate resultante

| Gate #159 | Estado |
| --- | --- |
| Entrevista específica | Cerrada; decisiones publicadas en #159 |
| Baseline oficial | 0.1 aprobado por el owner el 2026-08-03 |
| Inventario Figma | Completo para frames actuales de Clases; todos siguen draft |
| Inventario runtime | Completo a nivel estructural; GitNexus + fallback CodeGraph documentados |
| Playwright runtime | Pendiente; no necesario para aprobar la arquitectura documental, sí antes de afirmar comparación visual/runtime |
| Preflight visual por superficie | Completo; contrato previo al diseño, no composición aprobada |
| Ground truth visual de Clases | V1.3 aprobada por el owner el 2026-08-04; #46 global no se cierra por esta evidencia |
| `openspec:ready:propose` | PASS 10/10 el 2026-08-03 para #159 |
| Change OpenSpec | `reconstruir-clases-experiencia` aplicado solo a Figma/documentación; runtime no ejecutado; cierre SDD en curso |

El baseline 0.1, el plan 1.2 y el prototipo v1.3 están aprobados. La implementación runtime se gobierna
después mediante issue/change propio, con sus artefactos aprobados antes de `apply`; no se autoriza por el
cierre visual de #159.
