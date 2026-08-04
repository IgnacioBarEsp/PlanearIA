# Auditoría Anti-Slop, Nielsen y accesibilidad

Fecha: 2026-08-03  
Artefacto: sección Figma candidate `177:115`  
Skill aplicada: `accessibility`

## Resultado

No quedan hallazgos de severidad 3–4 en el candidato. La inspección API final reportó:

- targets interactivos menores de 44 pt: 0;
- textos fuera de IBM Plex Sans: 0;
- textos menores de 12 pt: 0;
- truncamiento configurado: 0;
- efectos, blur o sombras nuevas: 0;
- gradientes nuevos: 0;
- destinos rotos o cruces de breakpoint: 0.

Se corrigieron 12 retornos móviles que heredaban la reacción sobre un texto de 24 pt, cuatro accesos de
continuidad de 40 pt y 95 labels heredados de 10–11 pt. La muestra móvil a 125% (`204:923`) detectó y
permitió corregir el ancho del subtítulo del header; la captura final conserva header, cuatro áreas,
acción, objetos y barra fija sin corte. La revisión adversarial añadió la muestra oscura `230:1007`: reveló
97 instancias de `State` con tinta fija y se corrigió su componente fuente `181:149` vinculándolo a
`text/primary`. La auditoría final no encontró texto candidate con color fijo. El contrato de foco/lector
está anotado en `206:916`.

## Contraste

Contrastes calculados con los valores resueltos de las variables locales del archivo Figma, modo claro:

| Par | Ratio |
| --- | ---: |
| `text/primary` sobre `bg/canvas` | 12.40:1 |
| `text/primary` sobre `bg/surface` | 13.73:1 |
| `text/secondary` sobre `bg/canvas` | 4.80:1 |
| `text/secondary` sobre `bg/surface` | 5.31:1 |
| `text/primary` sobre `bg/selected` | 11.36:1 |
| `text/primary` sobre warning/danger/success | 11.29–11.65:1 |
| blanco sobre `bg/primary` | 6.56:1 |

Modo oscuro verificado mediante la colección local `PlanearIA / Color`, modo `Oscuro`:

| Par | Ratio |
| --- | ---: |
| `text/primary` sobre `bg/canvas` | 17.29:1 |
| `text/primary` sobre `bg/surface` | 13.73:1 |
| `text/secondary` sobre `bg/canvas` | 11.36:1 |
| `text/secondary` sobre `bg/surface` | 9.03:1 |
| `text/inverse` sobre `bg/primary` | 7.00:1 |

Los estados seleccionados incluyen la palabra `actual`; offline, error, riesgo y sync incluyen texto. Color
o movimiento no son la única señal.

## Checklist Anti-Slop

| Control | Evidencia |
| --- | --- |
| Tarea docente | Entrada decide entre clases; cada área tiene objeto y acción propios. |
| Zona de intensidad | Prioridades y filtros concentran atención; Tablón evita KPIs y ruido social. |
| Jerarquía | Clase → área → objeto → estado → acción; una acción primaria por paso. |
| Estructura | Componentes, auto-layout y tokens locales; no mosaico bento ni galería de archivos. |
| Firma útil | Continuidad PlanearIA: owner tipado, retorno al borrador y sync visible. |
| Patrón genérico refutado | No landing hero, feed, KPI dashboard, Office incrustado ni copia visual de Google. |
| Estados negativos | Matriz `197:665`: loading, empty, error, offline y recuperación. |
| Evidencia siguiente | Present manual por journey/breakpoint completado; aprobación explícita del owner aún pendiente. |

## Nielsen

Visibilidad, correspondencia con el mundo docente, control/cancelación, consistencia, prevención de errores,
reconocimiento, flexibilidad responsive, minimalismo, recuperación y ayuda contextual fueron revisados en
las cinco superficies. Los hallazgos observados durante la revisión fueron corregidos: overrides estrechos,
tarjetas tablet bajas, estado activo del rail, filtros sin destino, acciones sin respuesta y éxito falso al
cerrar un overlay. No se detectó severidad 3–4 residual.

## Foco, lector y movimiento

- Orden documentado: navegación global → clase → área → objeto → estado → acción.
- Controles nuevos tienen label textual; no hay icon-only sin nombre.
- Muestra de foco visible de 2 pt y estado seleccionado textual en `206:916`.
- `CLOSE` devuelve al disparador; confirmaciones navegan a un resultado revisable.
- Ninguna información depende de la transición; el grafo conserva destino/estado con transición nula.
- Mensajes offline/error/sync son calmados y no culpan al docente.
- El archivo no define un modo de variable específico para daltonismo; la cobertura candidate se basa en
  labels, estructura y estado textual. La simulación runtime de `DaltonismoContext` permanece fuera de
  alcance y está registrada como validación obligatoria del futuro handoff.

## Drift documentado

| Fuente | Drift | Impacto | Recomendación |
| --- | --- | --- | --- |
| Variables locales Figma (`bg/primary` terracota, `bg/ink` verde) vs `src/themes/colors.ts` (primario azul) | La paleta semántica del prototipo no coincide 1:1 con el runtime actual. | El future change runtime no puede copiar hex ni declarar paridad automática. | Mapear roles semánticos en un change aprobado, preservar `ThemeContext`, `FontSizeContext` y `DaltonismoContext`, y validar claro/oscuro/daltonismo antes de promover paridad. |
| Figma API vs lector/teclado real | La API prueba estructura y tamaños, no anuncia con screen reader ni ejecuta foco de React Native Web. | No permite declarar accesibilidad runtime. | Conservar `206:916` como contrato y ejecutar lector/teclado/Playwright en el change runtime posterior. |
