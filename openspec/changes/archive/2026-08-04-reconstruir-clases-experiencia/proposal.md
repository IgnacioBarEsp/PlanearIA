## Why

Clases hoy se percibe como un área de archivos/Office en el prototipo y como dos jerarquías parciales en
runtime. El plan #157 v1.1 y el baseline de Clases 0.1 ya fijaron una experiencia docente propia,
reconocible para usuarios de Classroom y conectada de forma nativa; #159 debe convertir ese contrato en
una superficie validable sin perder datos, contexto ni control offline-first.

## What Changes

- Reconstruir una entrada clases-primero con “Lo que sigue”, clases activas y Crear/Importar clase; cada
  señal abre el objeto o filtro de Seguimiento que la sustenta.
- Dar a cada clase cuatro áreas estables: Tablón, Trabajo de clase, Personas y Seguimiento, con tarea,
  jerarquía, estados, deep links y retornos propios.
- Permitir crear una actividad breve sin archivo. Adjuntar un artefacto existente o crearlo en Office
  Docente/Diseño de materiales será opcional, cancelable y confirmable al retornar.
- Diseñar primero frames Figma candidatos para desktop, tablet y móvil, conservar los frames históricos y
  detenerse para Present y aprobación visual humana antes de cualquier implementación runtime.
- Documentar el handoff a un change runtime posterior, que solo podrá proponerse tras la aprobación
  visual y deberá conservar MVVM, `classroomFacade`, repositories, `src/sync` y compatibilidad legacy.
- Diseñar y verificar loading, empty, error, offline, sync pendiente/conflicto, datos insuficientes,
  accesibilidad y fallback manual sin IA; registrar evidencia visual, funcional y adversarial.

## Capabilities

### New Capabilities

- `classroom-prototype-experience`: entrada, áreas internas, creación breve, seguimiento, estados,
  adaptación responsive y handoffs navegables del prototipo docente de Clases.

### Modified Capabilities

- `figma-prototype-navigation`: amplía el contrato navegable de Clases para cubrir sus cinco superficies,
  deep links, overlays, retornos y el gate de aprobación visual sin éxitos simulados.

## Impact

- Issue: [#159](https://github.com/IgnacioBarEsp/PlanearIA/issues/159), dependiente de #156 cerrado por PR
  #158 y gobernado por #157/#101.
- Planes: `Documentacion/01-planes-maestros/PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` v1.1 y
  `PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- Ground truth: `context/classroom-ground-truth/` y archivo Figma
  `VBK5tK7EQS83tdTmtuBpI9`; los frames actuales permanecen como historial draft.
- Runtime de referencia: `src/navigation/stacks/ClasesStack.tsx`, screens/hooks `classroom`, facade,
  repositorios, `AssignSheet` y `src/sync` se inspeccionan como baseline técnico, pero no se modifican.
- Datos/servicios: no se crean ni migran entidades, claves, APIs o backend. No se agregan dependencias ni
  servicios pagados.

## No objetivos

- No copiar Google Classroom píxel a píxel ni adoptar su marca, assets, licencias o dependencias Google.
- No crear experiencias completas de alumno, tutor o administrador ni analítica sin datos explicables.
- No rediseñar Escritorio, Office, Diseño, Asistente, Agenda, Reportes o el shell global en este change.
- No incrustar editores profundos en Clases, duplicar ownership ni crear colas/stores/clientes HTTP
  paralelos.
- No implementar ni refactorizar React Native, backend, datos o sync en este change; eso requiere un
  issue/change posterior basado en el prototipo aprobado.
- No activar SQLite, borrar claves `@planearia:*`, migrar datos de forma destructiva o reabrir #156.
- No declarar Figma, prototipo o runtime aprobados sin evidencia humana explícita.
