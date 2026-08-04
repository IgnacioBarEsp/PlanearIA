# Grafo candidate de Clases

Fecha: 2026-08-03  
Archivo Figma: `VBK5tK7EQS83tdTmtuBpI9`

## Navegación global sin reabrir #156

Se clonaron tres launchers dentro de la sección candidate. Las pantallas originales y sus destinos
cerrados por #156/PR #158 no fueron modificados.

| Breakpoint | Launcher candidate | Entrada Clases |
| --- | --- | --- |
| Desktop | `198:695` | `186:115` |
| Tablet | `198:776` | `189:207` |
| Móvil | `198:809` | `192:292` |

Los launchers son puntos de inicio de Present adicionales; `87:47` permanece como `Flow 1`. El estado
inicial conservaba otros destinos globales para limitar el cambio a Clases. La corrección v1.3, abajo,
reemplaza esos escapes únicamente dentro del candidate; el grafo cerrado de #156 no fue modificado.

## Contrato de interacción

- `OVERLAY` abre editores y límites honestos desde el objeto de origen.
- `SWAP` conserva el mismo overlay al pasar de borrador a revisión, selector, handoff o confirmación.
- `CLOSE` cancela y devuelve foco/contexto al disparador.
- `NAVIGATE` solo se usa tras una confirmación visible para mostrar un resultado representado y
  revisable; no se etiqueta como éxito remoto.
- Los filtros seleccionados y tabs actuales no navegan a sí mismos.
- `Crear recurso` presenta botones separados para Office Docente y Diseño de materiales. Cada rama vuelve
  con owner/tipo propio, exige confirmar asociación y conserva una cancelación al editor original.

## Auditoría API

- Frames candidate auditados: 83.
- Aristas de navegación candidate: 603.
- Destinos inexistentes: 0.
- Cruces entre breakpoints candidate: 0.
- Controles `Acción ·` o `Filtro ·` habilitados sin reacción: 0, excluyendo filtros ya seleccionados y
  wrappers de texto cuya hit area padre contiene la reacción.
- Hotspots móviles hacia frames candidate desktop/tablet: 0.

La auditoría automática valida estructura, no sustituye los cinco recorridos manuales por breakpoint en
Figma Present ni aprueba visualmente el candidato.

## Corrección v1.3 — puentes globales candidate

El feedback del owner reveló que al salir de Clases candidate hacia otro hub y volver, los hubs históricos
seguían apuntando a Clases legacy. Se añadieron puentes dentro de `177:115`; son copias de hubs ya
existentes para navegación, no rediseños ni frames aprobados.

| Breakpoint | Puentes candidate | Retorno a Clases | Límite honesto |
| --- | --- | --- | --- |
| Desktop | `272:952`, `272:1028`, `272:1104`, `272:1256`, `272:1332`, `272:1408` y Office `257:951` | `186:115` | El contenido profundo de cada módulo mantiene su propio SDD. |
| Tablet | `277:958`, `277:1034`, `277:1110`, `277:1262`, `277:1338`, `277:1414`, `277:1493` | `189:207` | Usa el hub desktop existente como fallback hasta que cada módulo tenga superficie tablet propia. |
| Móvil | `274:958`, `274:983`, `274:1008`, `274:1122`, `274:1147`, `274:1172`, `274:1197`, `274:1222` | `192:292` | Cubre Office, Asistente, Más y sus cinco módulos secundarios; no declara paridad de detalles. |

Auditoría API del contrato global: desktop 171 enlaces, tablet 159, móvil 95; cero enlaces a Clases
legacy, cero destinos inexistentes y los seis destinos de Más permanecen dentro del candidate. La
reproducción Present recorrió Desktop `198:695 → 272:952 → 272:1028 → 186:115`, Móvil
`198:809 → 274:983 → 274:1008 → 192:292` y `Más → Reportes → Clases`, y Tablet
`198:776 → 277:1034 → 189:207`.
