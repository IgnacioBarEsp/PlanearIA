<!-- planearia:reconstruir-clases-experiencia:gate-visual-candidate -->

## Gate visual — Clases v1.3 approved

El owner aprobó explícitamente la versión v1.3 de Clases el 2026-08-04, después de las iteraciones desktop
y de tránsito global. La evidencia quedó publicada en
[#159](https://github.com/RitualBoat/PlanearIA/issues/159#issuecomment-5182823974). No se modificó runtime y
#156 permanece cerrado.

> **Iteración desktop posterior al feedback del owner (2026-08-03):** se confirmó que los enlaces
> desktop de Office y Escritorio del candidate cruzaban a frames históricos. Se creó el destino Office
> candidate `257:951` y se redirigieron los retornos requeridos. La verificación Present del subflujo
> `198:695 → 257:951 → 186:115 → 198:695` pasó. Véase `evidencia/11-iteracion-desktop-office.md`.

> **Iteración global posterior al feedback del owner (2026-08-04):** los hubs externos candidate ya no
> devuelven a Clases legacy. Se añadieron puentes por breakpoint y se verificó Present en desktop, tablet
> y móvil. Tablet conserva fallback desktop para esos módulos hasta sus SDD propios. Véase
> `evidencia/12-puentes-globales-candidate.md`.

### Entradas Figma Present

- [Desktop — launcher `198:695`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=198-695&starting-point-node-id=198%3A695&scaling=scale-down&content-scaling=fixed)
- [Tablet — launcher `198:776`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=198-776&starting-point-node-id=198%3A776&scaling=scale-down&content-scaling=fixed)
- [Móvil — launcher `198:809`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=198-809&starting-point-node-id=198%3A809&scaling=scale-down&content-scaling=fixed)
- [Desktop — Office candidate `257:951`](https://www.figma.com/proto/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=257-951&starting-point-node-id=198%3A695&scaling=scale-down&content-scaling=fixed)
- [Sección candidate editable `177:115`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=177-115)

### Qué revisar

1. Entrada “Lo que sigue” y señales accionables.
2. Tablón, Trabajo de clase, Personas y Seguimiento dentro de una clase.
3. Actividad sin archivo y confirmación antes de asignar/programar.
4. Adjuntar existente y Crear recurso con destinos separados Office Docente/Diseño, retorno al mismo borrador y owner visible.
5. Revisión/devolución y anuncio sin éxito remoto simulado.
6. Legibilidad, densidad y navegación en desktop, tablet y móvil.

### Evidencia previa al gate

- 15 recorridos C-01 a C-05 ejecutados en Figma Present; selectores/handoffs adicionales verificados.
- 68 capturas versionadas en `evidencia/figma-present/`, incluidas las iteraciones Office y tránsito global.
- Auditoría final: 603 aristas, cero destinos rotos, cero cruces de breakpoint, cero targets menores de 44 pt, cero textos menores de 12 pt o con color fijo.
- Fuente 125% y modo oscuro verificados; el contraste oscuro medido queda entre 7.00:1 y 17.29:1.
- Revisión adversarial: `PASS CON HUECOS`, sin Blockers/Majors abiertos. Los residuales son límites externos o decisiones del futuro runtime, no aprobación implícita.
- Debt check read-only: `PASS`, plan UX/UI activo, presupuesto 0/5.

Evidencia detallada: `evidencia/08-figma-present-recorridos.md`,
`evidencia/09-revision-adversarial.md`, `evidencia/11-iteracion-desktop-office.md` y
`evidencia/12-puentes-globales-candidate.md` dentro del change `reconstruir-clases-experiencia`.

### Decisión registrada y alcance

- 83 frames propios de Clases fueron promovidos a `approved`.
- Office `257:951` y 21 puentes/fallbacks globales permanecen `candidate` hasta su propio SDD.
- La promoción no aprueba runtime, #46, entrevistas docentes ni los contenidos provisionales de otros hubs.
- El handoff runtime queda documentado, pero no se abre ni ejecuta sin issue/change y aprobación propios.
