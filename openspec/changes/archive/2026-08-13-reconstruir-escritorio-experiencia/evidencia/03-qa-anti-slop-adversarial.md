# QA visual preliminar y revisión adversarial

Fecha: 2026-08-04
Alcance: `reconstruir-escritorio-experiencia` / #163

## Anti-Slop / Nielsen / accesibilidad — revisión estática

Resultado: **PASS CON HUECOS DE PRESENT**.

- No hay hero decorativo, feed, bento, KPI, gradiente, glass, blur ni sombra ornamental.
- La tarea es reconocible en cada breakpoint: crear, atender una acción y retomar trabajo.
- El dock sólo se usa para reconocimiento de herramientas; la atención se mantiene como lista accionable.
- Los controles visibles conservan label textual y superficies de al menos 44 px en las capturas revisadas.
- El móvil conserva cinco hubs (`Inicio`, `Office`, `Clases`, `Asistente`, `Más`) y no oculta la salida de
  continuidad.
- El copy offline no afirma guardado, envío o sincronización remota.
- Falta comprobar en Figma Present contraste exacto, foco visible, fuente ampliada, navegación por teclado
  y reducción de movimiento; una captura estática no cierra esos puntos.

## Revisión adversarial

| Severidad | Hallazgo | Evidencia | Tratamiento antes de archive |
|---|---|---|---|
| Minor | Los cards de selector preservan owners existentes del prototipo y no crean editores duplicados. | Reacciones de `310:3`, `310:69`, `310:106`. | Conservar; validar en Present que cada owner tenga retorno claro. |
| Pregunta/suposición | Los destinos de Office/Clases/Asistente disponibles en el archivo son principalmente frames históricos de escritorio; el selector responsive todavía necesita confirmación visual de que el destino no rompe el breakpoint. | Acciones de los cards hacia `151:123`, `151:203`, `151:366`, `97:50`, `94:122`. | No promover ni declarar paridad responsive hasta Present; si falla, crear handoff/frames owner por breakpoint en una iteración posterior. |
| Pregunta/suposición | Loading, error, conflicto y datos insuficientes están documentados como estados contractuales y no como pantallas simuladas. | Matriz en `evidencia/02-candidate-fidelity-and-navigation.md`. | Validar copy y recuperación en entrevista/Present; no afirmar éxito remoto. |
| Minor | La matriz maestra `Documentacion/03-validacion/prototipo-figma-ola2/MATRIZ_NAVEGACION.md` aún no se modifica. | Tarea 3.4 pendiente. | Actualizar sólo después de aprobación humana en tarea 5.1. |

## Veredicto

**No archivar todavía.** El candidate es reversible y apto para gate humano, pero no se declara aprobado,
listo ni de alta paridad. La revisión de Figma Present y la aprobación del owner siguen siendo obligatorias.

## Runtime read-only

- `npm run web -- --port 8081` respondió `HTTP 200` en `http://127.0.0.1:8081`; log bruto: `evidencia/04-runtime-http-200.log`.
- Se confirmó que el runtime servido sigue siendo el placeholder existente; no se modificó React Native,
  rutas, hooks, datos ni sincronización.
- El worktree no tiene `@playwright/test` instalado; por eso no se fabricaron capturas Playwright ni se
  presentó esta comprobación HTTP como QA visual de runtime. La captura por breakpoint queda como gate
  explícito de una iteración con la dependencia/browser disponible.
