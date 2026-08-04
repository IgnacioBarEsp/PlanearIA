# Evidencia 08 — recorridos reales en Figma Present

Fecha: 2026-08-03  
Change: `reconstruir-clases-experiencia`  
Issue operativo: #159  
Estado: validación manual del agente completada; aprobación visual humana pendiente.

Gate publicado en [#159, comentario 5164346763](https://github.com/IgnacioBarEsp/PlanearIA/issues/159#issuecomment-5164346763).

## Método y alcance

Se abrió el prototipo publicado mediante Figma Present y se accionaron hotspots reales con Playwright, en viewports de 1440 × 960, 1024 × 768 y 390 × 844. No se dedujo la navegación desde el grafo: cada resultado se comprobó por cambio de frame, overlay visible o retorno al contexto de origen.

Puntos de entrada:

- [Desktop — launcher `198:695`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=198-695&starting-point-node-id=198%3A695&scaling=scale-down&content-scaling=fixed)
- [Tablet — launcher `198:776`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=198-776&starting-point-node-id=198%3A776&scaling=scale-down&content-scaling=fixed)
- [Móvil — launcher `198:809`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=198-809&starting-point-node-id=198%3A809&scaling=scale-down&content-scaling=fixed)

## Resultado por recorrido

| Journey | Desktop | Tablet | Móvil | Resultado observado |
|---|---|---|---|---|
| C-01 entrar y atender | `198:695` → `186:115` → `186:392` | `198:776` → `189:207` → `189:482` | `198:809` → `192:292` → `192:540` | PASS. Clases conserva el breakpoint y la señal de revisión abre Seguimiento. |
| C-02 actividad sin archivo | `186:257` → editor → confirmación → `195:520` | `189:345` → editor → confirmación → `195:753` | `192:417` → editor → confirmación → `195:956` | PASS. El adjunto permanece opcional y Programar termina en estado local/sync pendiente, no en éxito remoto falso. |
| C-03 recurso opcional | Trabajo de clase → selector/handoff → Office `193:485` o Diseño `224:8` → asociación → `195:461` | Trabajo de clase → selector/handoff → Office `193:682` o Diseño `224:56` → asociación → `195:701` | Trabajo de clase → selector/handoff → Office `193:879` o Diseño `224:104` → asociación → `195:912` | PASS. Ambos owners son explícitos; el retorno conserva clase y borrador y exige confirmación antes de guardar. |
| C-04 revisar y devolver | `186:392` → revisión → confirmación → `195:638` | `189:482` → revisión → confirmación → `195:857` | `192:540` → revisión → confirmación → `195:1044` | PASS. La devolución muestra evidencia sintética, nota editable y resultado pendiente de sync. |
| C-05 publicar anuncio | `186:193` → editor → confirmación → `186:193` | `189:279` → editor → confirmación → `189:279` | `192:358` → editor → confirmación → `192:358` | PASS. El anuncio retorna al Tablón y no invade Trabajo de clase. |

## Capturas

Se conservaron 68 capturas en `evidencia/figma-present/`, incluyendo estados intermedios y pruebas diagnósticas de carga/coordenadas. Muestras representativas:

- Desktop: `figma-present-desktop-launcher.png`, `figma-present-desktop-activity-confirm.png`, `figma-present-desktop-resource-design-associated.png`, `figma-present-desktop-returned.png`.
- Tablet: `figma-present-tablet-entry.png`, `figma-present-tablet-attach-selector.png`, `figma-present-tablet-resource-office-pending-v2.png`, `figma-present-tablet-review-confirm.png`.
- Móvil: `figma-present-mobile-entry.png`, `figma-present-mobile-attach-selector.png`, `figma-present-mobile-resource-handoff-v2.png`, `figma-present-mobile-track-scrolled.png`, `figma-present-mobile-announcement-confirm.png`, `figma-present-mobile-dark-audit.png`.

## Addendum 2026-08-04 — tránsito global candidate

Tras feedback del owner se recorrieron en Figma Present los puentes globales recién aislados:

| Breakpoint | Recorrido real | Resultado |
| --- | --- | --- |
| Desktop | `198:695 → 272:952` Asistente → `272:1028` Reportes → `186:115` Clases | PASS: no retorna a `90:48`. |
| Tablet | `198:776 → 277:1034` Asistente fallback → `189:207` Clases | PASS: no retorna a Clases legacy; fallback desktop declarado. |
| Móvil | `198:809 → 274:983` Asistente → `274:1008` Más → `192:292` Clases | PASS: mantiene el breakpoint y el candidate. |
| Móvil secundario | `274:1008` Más → `274:1197` Reportes → `192:292` Clases | PASS: Más tampoco fuga al grafo histórico. |

Capturas nuevas: `desktop-global-bridge-reportes-2026-08-04.png`,
`tablet-global-bridge-launcher-2026-08-04.png`,
`tablet-global-bridge-assistant-fallback-2026-08-04.png`,
`mobile-global-bridge-launcher-2026-08-04.png` y `mobile-global-bridge-more-2026-08-04.png`.

## Hallazgos

- Hotspots rotos: ninguno en los 15 recorridos breakpoint/journey ejecutados.
- Cruces de breakpoint: ninguno; cada recorrido terminó en frames del tamaño correspondiente.
- Éxitos falsos de datos reales: ninguno. Las confirmaciones declaran que Figma representa intención y que asignación, devolución, publicación o sync no ocurren realmente.
- Drift funcional nuevo: ninguno respecto del baseline 0.1 y la matriz v1.1.
- Corrección adversarial: el retorno genérico de Crear recurso se sustituyó por destinos separados de
  Office Docente y Diseño de materiales, con seis variantes tipadas nuevas. Se reejecutaron Diseño en
  desktop, Office en tablet y cancelación en móvil; las ramas restantes quedaron cubiertas por la auditoría
  del grafo.
- Observación móvil: Seguimiento requiere scroll interno para alcanzar `Revisar entrega`; el recorrido se completó y la navegación inferior permaneció disponible. Es comportamiento esperado, no bloqueo.
- Ruido de consola: Figma Present emitió errores/advertencias propios del host durante la sesión, sin impedir carga, interacción ni cambio de frames; no se atribuyen al prototipo ni al runtime de PlanearIA.

## Límite de esta evidencia

Esta comprobación prueba navegabilidad y legibilidad manual del candidato. No sustituye la aprobación visual del owner, no promueve frames a `approved`, no afirma paridad runtime y no autoriza archive/finish.
