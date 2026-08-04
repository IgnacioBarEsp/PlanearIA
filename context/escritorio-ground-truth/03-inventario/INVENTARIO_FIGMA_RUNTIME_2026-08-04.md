# Inventario Escritorio — Figma y runtime

> **Fecha de corte:** 2026-08-04.
> **Método:** lectura Figma API/imagen; GitNexus primario y CodeGraph como fallback lineado.
> **Mutaciones realizadas:** ninguna.

## Figma as-is

Archivo: `VBK5tK7EQS83tdTmtuBpI9`.

| Breakpoint | Nodo | Hallazgo útil | Drift/brecha |
| --- | --- | --- | --- |
| Desktop 1440×960 | `198:695` | Sidebar global; título “Tu día docente, conectado”; dock de seis herramientas; Lo inmediato; Continuidad; copy local/offline. | “Nuevo archivo” abre Office Home `257:951` en vez del selector tipo-primero. El nombre incluye `approved`, pero sólo se aprobó como puente a Clases. |
| Tablet 768×1024 | `198:776` | Rail global y una prioridad con objeto reconocible. | Falta launcher, lista priorizada, continuidad y diversidad de salida. Una tarjeta no satisface la promesa. |
| Móvil 390×844 | `198:809` | Cinco hubs y copy offline. | Falta launcher y continuidad; una única prioridad lleva genéricamente a Office. El nombre `approved` no prueba aprobación de Escritorio. |

### Drift de aprobación

- **Fuente A:** nombres Figma `D-1/T-1/M-1 · Lanzador Escritorio → Clases · ... · approved`.
- **Fuente B:** `MATRIZ_NAVEGACION.md`, evidencia de #159 y plan #157 v1.3: los frames externos a Clases
  fueron puentes/fallbacks y permanecen candidate para sus propios módulos.
- **Impacto:** un apply podría sobrescribir o promover una composición no aprobada de Escritorio.
- **Recomendación:** conservar los nodos, clonar/versionar en sección `Escritorio 0.1 candidate` y no
  modificar el estado histórico hasta un nuevo gate visual explícito.

## Runtime as-is

GitNexus se consultó desde el repositorio principal porque el worktree nuevo no tenía índice local. El
índice estaba fresco y confirmó el shell/rutas principales. La consulta estructural no devolvió el cuerpo
de la screen; CodeGraph se usó como fallback autorizado para fuente lineada.

| Superficie/símbolo | Comportamiento vigente | Uso en esta ola |
| --- | --- | --- |
| `InicioStack` | Ruta inicial `Escritorio`; renderiza `EscritorioPlaceholderScreen`. | Contrato de entrada a preservar en un futuro change runtime. |
| `AppShell` | Cinco hubs, navegación adaptativa, top bar, tema y breakpoint. | Baseline técnico; no se edita. |
| `EscritorioPlaceholderScreen` | Cuatro destinos reales: Office, Clases, Asistente y Más; sin datos simulados. | Placeholder honesto, no UX objetivo. |
| `SyncStatusChip` | Presenta estado sync, retry/relogin y accesibilidad desde el shell. | Capacidad existente que el futuro handoff debe conservar. |

No se inspeccionó ni propuso una nueva API, modelo, endpoint, storage o cola. La futura implementación debe
resolver proyecciones de objetos por owner usando contratos existentes y `src/sync`; este change no decide
esa arquitectura de datos.

## Precedencia aplicada

1. Código/specs: placeholder actual y shell/sync reales.
2. Visión/planes: launcher + jornada accionable como destino.
3. Figma actual: baseline visual parcial, nunca autoridad silenciosa.
