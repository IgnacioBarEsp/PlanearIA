# Brownfield baseline: reconstruir Clases

## Superficies tocadas

- Archivo Figma PlanearIA `VBK5tK7EQS83tdTmtuBpI9`: nueva sección/version candidate de Clases.
- Entrada a Clases, Tablón, Trabajo de clase, Personas y Seguimiento en móvil, tablet y web.
- Matriz de navegación, ground truth de Clases, evidencia de #159 y artefactos de este change.
- Runtime Expo solo para comparación read-only por breakpoint; no se edita.

## Fuentes de verdad actuales

- Issue #159 enriquecido y su manifest pre-propose en PASS.
- `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` v1.1 y baseline de Clases 0.1 aprobados.
- `context/classroom-ground-truth/`: fuentes oficiales, flujos, decisiones, drift y preflight.
- `openspec/specs/figma-prototype-navigation/spec.md`, Anti-Slop, shell adaptativo y navegación vigente.
- Código/`openspec/specs/` describen runtime actual; Figma draft no lo sustituye.

## Comportamiento vigente

Figma presenta Clases como área de archivos, repite entrada/detalle, usa filtros sin estados separados,
obliga a elegir un borrador documental para crear actividad y conecta móvil con un frame desktop. Los
frames están marcados draft y no tienen aprobación visual. Runtime tiene hub, clases, tres áreas y datos
de seguimiento, pero no es el destino visual y no se modifica.

## Comportamiento objetivo

El prototipo aprobado muestra una entrada clases-primero y, dentro de cada clase, Tablón, Trabajo de clase,
Personas y Seguimiento. Demuestra actividad sin archivo, recursos opcionales con retorno/confirmación,
señales trazables, estados honestos y la misma arquitectura en tres breakpoints. El owner aprobó la v1.3
el 2026-08-04; otros módulos y sus puentes conservan estado `candidate`.

## Compatibilidad legacy

Los frames `38:2`, `90:48`, `125:65`, `127:166` y `158:150` se conservan como historial draft. La
navegación global corregida por #156 no cambia. Rutas, screens, hooks, contexts, claves `@planearia:*`,
backend y motor `src/sync` permanecen intactos. La futura migración runtime tendrá issue/change propio.

## Owner de spec y contexto

- Spec nueva: `classroom-prototype-experience`, owner de la experiencia navegable docente de Clases.
- Spec modificada: `figma-prototype-navigation`, owner del grafo y evidencia del prototipo.
- Contexto primario: Classroom y Organización Académica.
- Consumidores representados: Seguimiento y Evaluación, Planeación y Contenido Docente, Experiencia y
  Preferencias; Sync/IA son capacidades transversales sin ownership nuevo.

## Evidencia actual

- Aprobación humana del plan 1.1 y baseline 0.1, 2026-08-03.
- Aprobación visual humana de Clases v1.3 en #159, 2026-08-04; promoción acotada de 83 frames.
- Gate `npm run openspec:ready:propose -- --issue 159`: PASS 10/10.
- Inventario Figma/runtime con GitNexus primario y CodeGraph fallback documentado.
- Preflight Anti-Slop por superficie y fuentes oficiales públicas de Google Classroom.
- #156 cerrado por PR #158; #159 abierto y en PlanearIA Product OS.

## Fuera de alcance

React Native, backend, datos, storage, sync, IA, dependencias, rutas runtime y migraciones. No se crean
experiencias de alumno/tutor/admin, analítica real, gamificación ni rediseños de otros módulos. La
aprobación visual registrada no equivale a runtime implementado, validación IHC de campo ni cierre del
prototipo global. No se crea automáticamente el issue/change runtime posterior.
