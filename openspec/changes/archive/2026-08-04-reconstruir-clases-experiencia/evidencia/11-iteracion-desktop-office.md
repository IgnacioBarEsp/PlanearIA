# Iteración desktop — continuidad de Office

**Fecha:** 2026-08-03  
**Motivo:** feedback del owner: desktop todavía se percibía como copias genéricas del Escritorio,
incluido Office Docente.  
**Alcance:** candidate Figma de #159; no runtime, no Figma histórico, no #156.

## Verificación del hallazgo

La inspección read-only de Figma confirmó que el launcher desktop candidate `198:695` y las superficies
desktop de Clases enlazaban `Nav hit · office` al frame histórico `61:2`. Los retornos
`Nav hit · escritorio` apuntaban a `87:47`. El frame histórico de Office sí tenía una tarea y jerarquía
propias (archivos, tipos y contexto), pero cruzar desde el candidate a ese grafo hacía el flujo
visualmente difícil de atribuir y contradecía el aislamiento prometido para la iteración.

Móvil usa otro destino Office (`158:125`), lo que explica por qué el problema era más evidente en
desktop. No se concluye que móvil apruebe el candidate: su aprobación humana sigue pendiente.

## Corrección aplicada

- Se creó `257:951`, `D-2 · Office Docente · desktop · candidate`, dentro de la sección `177:115`.
  Reutiliza la superficie Office existente como continuidad de archivos, no como editor incrustado ni
  como rediseño de Office.
- En los hubs, entrada y estados desktop de Clases se redirigieron 26 enlaces de Office/Escritorio a
  `257:951` y `198:695`.
- En `198:695`, `Nuevo archivo` abre la continuidad Office candidate y `Dock · Clases` abre `186:115`.
- En `257:951`, los retornos de Escritorio y Clases llevan a `198:695` y `186:115`.
- No se editaron los frames históricos `61:2`, `87:47`, `90:48` ni las rutas cerradas por #156.

Los módulos globales fuera de Escritorio, Office y Clases conservan sus destinos históricos como frontera
explícita de alcance; esta corrección no pretende validar ni rediseñar sus experiencias.

## Revalidación

| Comprobación | Resultado |
| --- | --- |
| Auditoría API de enlaces desktop Office/Escritorio | 26 enlaces; cero rutas a `61:2`/`87:47`; dos destinos candidate resueltos; cero destinos inexistentes. |
| Figma Present | `198:695 → 257:951 → 186:115 → 198:695` reproducido manualmente. |
| Identidad Office desktop | La superficie mantiene archivos, tipos de documento/hoja/presentación, contexto activo, crear/importar y guardado local visible; no replica el tablero diario de Escritorio. |
| Accesibilidad y diseño | Se reutilizan tokens y controles existentes; sin efectos nuevos, contenido simulado ni afirmaciones de sync real. |

Capturas Present: `figma-present/desktop-launcher-recheck-2026-08-03.png` y
`figma-present/desktop-office-candidate-iteration-2026-08-03.png`.

## Gate pendiente

Esta corrección no convierte ningún frame a `approved` ni reabre #156. Falta la revisión visual humana
de la candidata actualizada; hasta entonces siguen prohibidos promotion, handoff runtime, archive y
finish.
