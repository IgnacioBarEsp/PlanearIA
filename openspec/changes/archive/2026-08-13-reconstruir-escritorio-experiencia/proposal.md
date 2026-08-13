## Why

Escritorio sólo expresa su promesa completa en un puente desktop; tablet y móvil pierden launcher,
prioridades y continuidad, mientras el runtime conserva un placeholder honesto. #163 debe convertir el
contrato aprobado de #157 en un prototipo validable y reversible antes de considerar implementación.

## What Changes

- Reconstruir Escritorio como ruta inicial con tres capas estables: launcher de herramientas, jornada que
  requiere atención y continuidad de objetos propios.
- Mantener la misma arquitectura de información en móvil, tablet y web; adaptar navegación, densidad y
  disposición sin reducir tablet/móvil a una tarjeta ni cruzar destinos entre breakpoints.
- Hacer “Nuevo archivo” tipo-primero —documento, hoja, presentación, diseño o preguntar a la IA— con
  cancelación y retorno a Escritorio; la intención escolar aparece después como chip descartable.
- Hacer que prioridades y continuidad abran el objeto owner exacto, con contexto, estado y retorno, nunca
  un home genérico reutilizado.
- Diseñar estados loading, empty, error, offline, sync pendiente/conflicto, datos insuficientes e IA no
  configurada con recuperación manual y sin éxitos simulados.
- Conservar los frames Figma históricos, crear una sección/version `candidate` y detenerse en Present para
  aprobación visual humana antes de promover frames o proponer runtime.
- Versionar matriz de navegación, evidencia Anti-Slop/Nielsen/accesibilidad y handoff runtime; no modificar
  React Native, backend, datos, sync, IA o dependencias en este change.

## Capabilities

### New Capabilities

- `teacher-home-prototype-experience`: promesa, jerarquía, adaptación responsive, estados y handoffs del
  prototipo de Escritorio Docente.

### Modified Capabilities

- `figma-prototype-navigation`: amplía el grafo de Escritorio para launcher, creación tipo-primero, objetos
  propietarios, retornos por breakpoint, historial candidate y gate humano verificable.

## Impact

- Issue: [#163](https://github.com/IgnacioBarEsp/PlanearIA/issues/163), sub-issue de #157 bajo #101; #159
  y #161 están cerrados, y #156/PR #158 permanece histórico.
- Planes: `Documentacion/01-planes-maestros/PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` v1.3 y
  `PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- Ground truth: `context/escritorio-ground-truth/` y archivo Figma `VBK5tK7EQS83tdTmtuBpI9`; los nodos
  `198:695`, `198:776` y `198:809` se conservan como baseline/puentes y no prueban aprobación de Escritorio.
- Runtime de referencia: `InicioStack`, `AppShell`, `EscritorioPlaceholderScreen`, `navigateToHub` y
  `SyncStatusChip` sólo se inspeccionan; no se editan.
- Datos/servicios: no se crean entidades, endpoints, stores, colas, claves, migraciones, proveedores,
  dependencias ni costos.

## No objetivos

- No implementar ni refactorizar React Native, backend, datos, storage, sync, IA o navegación runtime.
- No rediseñar profundamente Office, Clases, Diseño, Asistente, Mensajería, Agenda o Reportes.
- No copiar Microsoft 365, Windows, Classroom, WhatsApp, Canva o ChatGPT de forma literal.
- No crear feed, landing promocional, dashboard ejecutivo, centro de notificaciones, bento de KPIs o
  analítica/riesgo sin evidencia explicable.
- No activar SQLite, borrar claves `@planearia:*`, crear clientes HTTP/colas paralelas ni reabrir #156,
  #159 o #161.
- No declarar Figma, Escritorio, prototipo global o runtime aprobados sin evidencia humana explícita.
