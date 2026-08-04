# Aprobación y promoción de Clases

**Fecha:** 2026-08-04  
**Issue:** #159  
**Gate:** aprobación visual humana explícita

## Evidencia humana

El owner declaró: “Perfecto, doy mi aprobacion, modulo clases finalmente corregido”. La decisión quedó
publicada y delimitada en [#159](https://github.com/RitualBoat/PlanearIA/issues/159#issuecomment-5182823974).

La misma instrucción establece una regla para las olas siguientes: no ejecutar `apply` hasta que el owner
apruebe sus artefactos SDD.

## Promoción realizada

- Sección: `177:115`, renombrada como `Clases · approved v1.3 · #159 · puentes globales candidate`.
- Contrato visible: `179:115`, actualizado a v1.3 y estado `approved`.
- Se promovieron 83 frames propios de Clases: entradas, Tablón, Trabajo de clase, Personas, Seguimiento,
  estados, overlays, filtros y launchers de desktop, tablet y móvil.
- Se verificaron como `approved` las entradas `186:115`, `189:207`, `192:292` y los launchers `198:695`,
  `198:776`, `198:809`.

## Exclusiones preservadas

Permanecen `candidate` Office `257:951` y 21 puentes/fallbacks con prefijos `272`, `274` y `277`. Son
continuidad temporal de navegación y no una aprobación visual, ground truth ni destino UX de sus módulos.

#156/PR #158, frames históricos, runtime, datos, storage, backend y `src/sync` no se modificaron. #46 y
las entrevistas docentes no se cerraron por inferencia.

## Verificación

El conector Figma confirmó 83 renombres y preservó los 22 destinos excluidos como `candidate`. Una captura
posterior del contrato `179:115` mostró el texto de aprobación completo, sin recorte. La API de historial
nombrado no está soportada por el conector; el intento falló de forma atómica antes de la promoción y el
rollback queda cubierto por historial automático Figma más reversión documental.
