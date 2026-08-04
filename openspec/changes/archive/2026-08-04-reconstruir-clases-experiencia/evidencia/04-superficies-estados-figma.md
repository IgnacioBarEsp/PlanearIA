# Superficies y estados del candidato Clases

Fecha: 2026-08-03  
Archivo Figma: `VBK5tK7EQS83tdTmtuBpI9`  
Sección candidate: `177:115`

## Superficies principales

| Breakpoint | Entrada | Tablón | Trabajo de clase | Personas | Seguimiento |
| --- | --- | --- | --- | --- | --- |
| Desktop | `186:115` | `186:193` | `186:257` | `186:324` | `186:392` |
| Tablet | `189:207` | `189:279` | `189:345` | `189:414` | `189:482` |
| Móvil | `192:292` | `192:358` | `192:417` | `192:479` | `192:540` |

La entrada contiene “Lo que sigue”, señales con clase/objeto, clases activas y Crear/Importar. Cada clase
abre Tablón y mantiene Tablón, Trabajo de clase, Personas y Seguimiento en el mismo breakpoint. En móvil el
contenido usa scroll vertical dentro del shell y la barra inferior permanece fija.

## Estados y recuperación

La matriz visual `E0 · Matriz de estados · Clases · candidate` (`197:665`) documenta 30 celdas para Entrada,
Tablón, Trabajo de clase, Personas, Seguimiento y escrituras/IA. Cubre loading, empty, error, offline y
recuperación/datos insuficientes. Todos los mensajes nombran la tarea y una salida; ninguno afirma red,
persistencia, IA o sync reales. La recuperación de Trabajo de clase explicita título vacío sin pérdida de
valores y conflicto local/remoto antes de confirmar.

## Recorridos de escritura

- Anuncio: editor → revisión → confirmación representada → Tablón.
- Actividad: título suficiente y adjunto opcional; selector/handoff no borra el borrador.
- Handoff explícito: Office Docente conserva la rama `193:485`/`193:504`, `193:682`/`193:701` y
  `193:879`/`193:898`; Diseño de materiales usa referencias tipadas propias en `224:8`/`224:25`,
  `224:56`/`224:73` y `224:104`/`224:121`. Cancelar retorna al editor del mismo breakpoint.
- Resultados de actividad por breakpoint: borrador, programada y asignada, diferenciando local, sync
  pendiente y confirmación remota.
- Revisión: evidencia sintética → retroalimentación → confirmación → mismo filtro con estado
  `Devuelta · sync pendiente`.
- Personas: roster sintético, rol/incorporación y una invitación que puede quedar preparada offline sin
  presentarse como enviada.

## Seguimiento explicable

Cada breakpoint incluye filtros navegables Por revisar, Vencidas, Asistencia y Calificaciones. Promedio o
riesgo expone fuente y “datos insuficientes”; no calcula, colorea ni clasifica a un alumno sin evidencia.

## Verificación visual incremental

Se inspeccionaron screenshots de entrada, Trabajo de clase y Seguimiento en los tres breakpoints; los
overlays de actividad y revisión; el retorno de devolución; Calificaciones móvil; launchers y matriz de
estados. Se corrigieron ancho responsivo de overrides, alto de tarjetas tablet, labels del estado activo y
recortes de contenedor. La versión permanece `candidate` y no constituye aprobación humana.
