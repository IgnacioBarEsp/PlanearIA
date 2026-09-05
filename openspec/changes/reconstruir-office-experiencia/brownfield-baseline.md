# Brownfield baseline — `reconstruir-office-experiencia`

> Registra únicamente la superficie que este change va a tocar. No sustituye la spec ni inventaría la app.

## Superficies tocadas

- Prototipo Figma, archivo `VBK5tK7EQS83tdTmtuBpI9`, página `60:2`: se crea una sección candidate nueva de
  Office. Los nodos `257:951` (desktop 1440x960), `277:958` ("tablet" que mide 1440x960) y `274:958`
  (móvil 390x844) se leen como baseline histórico y **no se editan**.
- Documentación versionada: `context/office-ground-truth/`, la matriz de navegación y el plan UX/UI.
- Capacidades de spec: se crea `office-prototype-experience` y se extiende `figma-prototype-navigation`.

No se toca `src/`, `backend/`, `openspec/specs/` a mano, dependencias ni configuración.

## Fuentes de verdad actuales

| Fuente | Qué gobierna |
| --- | --- |
| `openspec/specs/figma-prototype-navigation/spec.md` | Inicio único, navegación global, entrada y retorno semánticos, destinos honestos y evidencia de recorridos |
| `openspec/specs/teacher-home-prototype-experience/spec.md` | Escritorio aprobado, incluido el recorrido de creación tipo-primero desde "Nuevo archivo" |
| `openspec/specs/classroom-prototype-experience/spec.md` | Clases aprobada; frontera de ownership de grupo, tarea y recurso |
| `openspec/specs/cross-surface-assignment/spec.md` | Hoja Asignar, reutilizada por la acción de asignar de Office |
| `openspec/specs/anti-slop-design-guardrail/spec.md` | Preflight obligatorio antes de UI visible |
| `context/office-ground-truth/` | Decisiones de la entrevista, baseline candidate, inventario as-is y preflight de esta ola |
| `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md` | Blueprint UX/UI, decisiones D1 a D15 |

## Comportamiento vigente

- El prototipo entrega Office con creación reducida a un botón `Nuevo archivo` sin tipos, y con un bloque
  `Inicio por intención docente` que ofrece Planeación, Material de lectura, Rúbrica y Bibliografía antes
  de elegir tipo.
- Cada archivo de la biblioteca ofrece un único control `Abrir`.
- `Recientes`, los cuatro filtros por tipo y `Acción · Importar archivo` ya existen y funcionan.
- `277:958` es un clon exacto del frame de escritorio: mismo rail de 264 px, misma área de 1176 px, mismos
  nombres de capa.
- `274:958` reduce Office a una sola tarjeta de prioridad; su `Acción · abrir prioridad · móvil` entrega
  frames de 1440x960.
- En runtime, `OfficeStack` registra dieciséis rutas con `OfficeHome` inicial; `Contenido` y
  `BibliotecaPlantillas` ya viven dentro del hub. Ese comportamiento **no cambia**.

## Comportamiento objetivo

- Office presenta los tres tipos desplegados al entrar, sin modal, en 1440, 768 y 390, y cada tipo abre en
  blanco con sus plantillas como atajo opcional posterior.
- La biblioteca conserva el eje cronológico y los filtros por tipo, y cada archivo ofrece cinco acciones
  sin abrirlo, con label visible.
- Importar es acción persistente del hub.
- Tablet y móvil son superficies propias; ningún hotspot cruza de breakpoint, medido por ancho de frame y
  contando aristas salientes.
- Abrir un editor entrega el estado honesto de límite con retorno al origen exacto.

## Compatibilidad legacy

- Los tres frames heredados se conservan intactos y siguen siendo alcanzables como baseline histórico; su
  etiqueta no acredita aprobación ni breakpoint.
- Los puentes globales `M-G`, `T-G` y `D-G` de otros módulos permanecen candidate y fuera de alcance.
- Los selectores tipo-primero de Escritorio `310:3`, `310:69` y `310:106` permanecen intactos y
  alcanzables: la creación desplegada de Office no los sustituye ni los duplica.
- El shell global conserva cinco hubs en móvil, rail en tablet y sidebar en web.
- Runtime, rutas, datos, storage, `src/sync`, aislamiento por `userId` y claves legacy `@planearia:*`
  permanecen intactos.

## Owner de spec y contexto

- **Owner de spec de experiencia:** `office-prototype-experience`, capacidad nueva creada por este change.
- **Owner de spec de navegación:** `figma-prototype-navigation`, extendida con dos requirements.
- **Owner de datos:** sin cambio. Office proyecta referencias; Clases posee grupo y tarea, Mensajería posee
  la conversación, según `MAPA_DDD_ESTRATEGICO_LIGERO.md`.
- **Owner de contexto:** `context/office-ground-truth/`, inaugurado el 2026-09-04. No cierra el issue #87.
- **Owner humano:** el owner del repositorio emite el veredicto visual tras Figma Present.

## Evidencia actual

- `context/office-ground-truth/03-inventario/INVENTARIO_FIGMA_RUNTIME_2026-09-04.md`: estado as-is
  verificado por `get_metadata` sobre los tres nodos y por CodeGraph sobre el checkout `416509d`.
- `context/office-ground-truth/01-decisiones/MATRIZ_DECISIONES_OFFICE_157_O3.md`: doce decisiones
  confirmadas, dos derivadas marcadas, una desviación de D3 registrada y el drift heredado.
- `context/office-ground-truth/04-preflight/PREFLIGHT_VISUAL_OFFICE_157_O3.md`: PASS documental.
- `openspec/changes/archive/2026-08-13-reconstruir-escritorio-experiencia/evidencia/05-correccion-fugas-breakpoint.md`:
  método de auditoría por ancho de frame y patrón de estado de límite que este change reutiliza.
- Gate pre-propose de #177: PASS en los diez checks, incluido `debt-pre-propose`.

## Fuera de alcance

- NotasPLAN, CalcuPLAN y PresentaPLAN (`#157-O4` a `#157-O6`).
- La absorción de ContenidoTab y los recursos didácticos (D6 completo).
- Diseño y preguntar a la IA como tipos creables desde Office.
- Todo cambio de runtime, datos, endpoints, hooks, contexts, repositories, storage, sync, backend y
  dependencias.
- Las porciones de #166 que pertenecen a otros módulos: Asistente, Reportes, Diseño, Mensajería, Agenda y
  Cuenta conservan sus puentes hasta sus propias olas.
- Las entrevistas docentes, pausadas por decisión del owner en #47.
