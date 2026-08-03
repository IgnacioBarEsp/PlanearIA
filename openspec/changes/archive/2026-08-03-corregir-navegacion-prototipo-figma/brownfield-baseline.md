## Superficies tocadas

- Archivo Figma `VBK5tK7EQS83tdTmtuBpI9`, página `09 Prototype · Office files`.
- Conexiones de prototipo, labels de navegación, overlays y frames de escritorio, tablet y móvil.
- Evidencia versionada de UX/UI para el hito #86 y el issue #156.

## Fuentes de verdad actuales

- `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- `Documentacion/05-context-engineering/DISENO_ANTI_SLOP.md`.
- Archivo Figma de Ola 2 como ground truth visual.
- Issue #156 enriquecido y su item en PlanearIA Product OS.

## Comportamiento vigente

El prototipo conserva Escritorio como inicio tras la limpieza manual, pero algunos frames funcionan como subflujos: Office no ofrece retorno visible a Escritorio, Crear desde Escritorio reutiliza un selector que vuelve a Office y el inventario global cambia, desaparece o alterna nombres entre superficies.

## Comportamiento objetivo

Un único grafo inicia en Escritorio Docente. Cada módulo es alcanzable con nombre estable; las acciones conservan contexto y toda pantalla u overlay expone retorno explícito y honesto. Las variantes desktop, tablet y móvil describen el mismo modelo de navegación.

## Compatibilidad legacy

Los frames históricos se conservan en el lienzo y no se borran. Se retiran de la presentación y del grafo activo cuando un reemplazo contextual evita una vuelta incorrecta. El historial de versiones de Figma permite restaurar conexiones previas si fuera necesario.

## Owner de spec y contexto

El owner operativo es el issue #156 dentro del plan UX/UI. La spec nueva `figma-prototype-navigation` gobierna el change; el plan UX/UI, la guía anti-slop y Figma son el contexto de diseño complementario.

## Evidencia actual

Pre-propose PASS para #156. El baseline reportado por producto identifica retorno Office/Escritorio incorrecto, opciones globales que desaparecen y nombres inconsistentes. El working tree local estaba limpio antes de crear el change.

## Fuera de alcance

No se modifica React Native, navegación de runtime, datos, IA, backend, autenticación, sincronización, proveedores ni los gates manuales de entrevistas docentes.
