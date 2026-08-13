# Brownfield baseline: reconstruir Escritorio

## Superficies tocadas

- Archivo Figma PlanearIA `VBK5tK7EQS83tdTmtuBpI9`: sección/version candidate `307:965` de Escritorio,
  con frames `307:966`, `307:1046`, `307:1078` y selectors `310:3`, `310:69`, `310:106`.
- Launcher, atención diaria, continuidad, creación tipo-primero y estados en móvil, tablet y web.
- Matriz de navegación, `context/escritorio-ground-truth/`, evidencia de #163 y artefactos del change.
- Runtime Expo sólo para comparación read-only; no se edita.

## Fuentes de verdad actuales

- Issue #163 enriquecido y gate pre-propose PASS 10/10.
- `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` v1.3 y `PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- `context/escritorio-ground-truth/`: decisiones, baseline 0.1 candidate, inventario y preflight.
- `openspec/specs/figma-prototype-navigation/spec.md`, `adaptive-app-shell`, Anti-Slop y golden journeys.
- Código/`openspec/specs/` describen runtime actual; Figma y plan describen evidencia/destino según su
  precedencia, sin sustituir comportamiento implementado.

## Comportamiento vigente

Figma desktop `198:695` muestra dock, Lo inmediato y Continuidad; tablet `198:776` y móvil `198:809`
conservan sólo una prioridad y pierden las otras capas. “Nuevo archivo” abre Office Home `257:951`. Los
nombres `approved` corresponden a puentes hacia Clases y contradicen la matriz que mantiene Escritorio
candidate. Runtime abre un placeholder honesto con cuatro destinos reales, shell adaptativo y sync global.

## Comportamiento objetivo

El prototipo candidate muestra launcher, atención y continuidad en tres breakpoints; creación
tipo-primero; prioridades que abren objetos owners; retornos; estados honestos; IA secundaria; y
accesibilidad PlanearIA. El resultado permanece candidate hasta Figma Present y aprobación explícita. No
existe aún comportamiento runtime objetivo implementado ni aprobado.

## Compatibilidad legacy

Los nodos `198:695`, `198:776` y `198:809` se conservan como historial/puentes. La navegación global de
#156 y los frames aprobados de Clases #159 no cambian. `InicioTab`, `AppShell`, screens, hooks, contexts,
claves `@planearia:*`, backend, IA gateway y `src/sync` permanecen intactos. La futura migración runtime
tendrá issue/change propio.

## Owner de spec y contexto

- Spec nueva: `teacher-home-prototype-experience`, owner del contrato observable de Escritorio en Figma.
- Spec modificada: `figma-prototype-navigation`, owner del grafo, retornos y aprobación verificable.
- Contexto de presentación: Experiencia y Preferencias.
- Owners proyectados: Planeación y Contenido Docente, Classroom y Organización Académica, Seguimiento y
  Evaluación, Comunicación Profesional y Agenda futura; Sync/IA son transversales sin ownership nuevo.

## Evidencia actual

- Decisiones aprobadas de #157 y plan v1.3 vigente.
- #159 y #161 cerrados; PR #162 integrado; #156/PR #158 histórico.
- Gate `npm run openspec:ready:propose -- --issue 163`: PASS 10/10 el 2026-08-04.
- Inventario Figma read-only de tres nodos, sección candidate producida sin tocar históricos, capturas
  visuales inspeccionadas y drift documentado en `evidencia/01-*`, `02-*` y `03-*`.
- GitNexus primario con índice fresco en el repositorio principal; CodeGraph fallback para fuente lineada.
- Preflight Anti-Slop y referencias oficiales de Microsoft, Android Developers y W3C.
- Cierre 2026-08-13: auditoría por alcanzabilidad y correcciones en `evidencia/05-*`, handoff en
  `evidencia/06-*`, gate visual aprobado por el owner y 8 frames promovidos. La superficie tocada creció
  respecto a lo previsto en propose: además de la sección propia, se repuntaron destinos de retorno en
  frames aprobados de Clases y en frames del draft `#156`. Fueron cambios de destino únicamente, con
  autorización explícita del owner registrada en #163; ningún frame ajeno se movió, redimensionó,
  reescribió ni cambió de estado de promoción.

## Fuera de alcance

React Native, backend, datos, storage, sync, IA, dependencias, rutas runtime y migraciones. No se crean
experiencias completas de otros módulos, feed, analítica real, gamificación, centro de notificaciones ni
agregador de datos. La aprobación futura de Figma no equivaldrá a validación IHC de campo, runtime
implementado o prototipo global listo, y no creará automáticamente el issue/change runtime.
