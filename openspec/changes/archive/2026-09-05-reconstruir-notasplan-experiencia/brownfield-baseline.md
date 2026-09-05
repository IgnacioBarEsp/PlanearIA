# Brownfield baseline — `reconstruir-notasplan-experiencia`

> Registra únicamente la superficie que este change va a tocar. No sustituye la spec ni inventaría la app.

## Superficies tocadas

- Prototipo Figma, archivo `VBK5tK7EQS83tdTmtuBpI9`, página `60:2`: se crea una sección candidate nueva de
  NotasPLAN. Los nodos `62:3`, `66:40`, `151:77` y `151:123` se leen como baseline histórico y **no se
  editan**.
- Documentación versionada: `context/notasplan-ground-truth/`, la matriz de navegación y el plan UX/UI.
- Capacidades de spec: se crea `notasplan-prototype-experience` y se extiende `figma-prototype-navigation`.

No se toca `src/`, `backend/`, `openspec/specs/` a mano, dependencias ni configuración.

## Fuentes de verdad actuales

| Fuente | Qué gobierna |
| --- | --- |
| `openspec/specs/figma-prototype-navigation/spec.md` | Inicio único, navegación global, retornos semánticos, destinos honestos y las reglas de auditoría acumuladas de #166 y #177 |
| `openspec/specs/office-prototype-experience/spec.md` | Office aprobado: creación tipo-primero, plantillas como atajo posterior al tipo y estado de límite al abrir un editor |
| `openspec/specs/cross-surface-assignment/spec.md` | Hoja Asignar, reutilizada por la acción de asignar del editor |
| `openspec/specs/anti-slop-design-guardrail/spec.md` | Preflight obligatorio antes de UI visible |
| `context/notasplan-ground-truth/` | Decisiones de la entrevista, baseline, inventario as-is y preflight de esta ola |
| `src/screens/planeaciones/DocEditorScreen.tsx` y `src/components/editor/` | Comportamiento runtime vigente del editor |

## Comportamiento vigente

- En Figma, el editor existe sólo en 1440. `62:3` presenta una cinta de seis pestañas con quince comandos y
  un índice de seis secciones —Propósito, Inicio, Desarrollo, Cierre, Materiales, Bibliografía— ajeno al
  runtime. `66:40` ofrece plantillas sin niveles de andamiaje.
- **No existe ninguna superficie de editor en 768 ni en 390.**
- En runtime, `DocEditorScreen` es ruta raíz con modos `crear`, `editar` y `plantilla`. Implementa las siete
  secciones en ocho componentes, formato A4 y Carta con medidas reales, dos ranuras de logo con topes de
  2 MB y 1500 px, alternancia de vistas, `RichTextEditor` sobre tentap con fallback web, `EditorToolbar` de
  siete comandos, IA por sección, autoguardado de borrador, deshacer y guardia de salida.
- El runtime guarda un `PlaneacionDocumento` **tipado**: las secciones son campos y el texto enriquecido
  vive dentro de ellos. Ese comportamiento **no cambia en este change**.

## Comportamiento objetivo

- La hoja es la superficie principal en 1440, 768 y 390 y declara su formato de página real.
- Las siete secciones se materializan como encabezados con nombre dentro del documento; el índice los
  navega y el formulario los proyecta.
- Las herramientas son una barra compacta contextual; la cinta desaparece.
- Crear desde plantilla ofrece tres niveles con valor por defecto y sin bloquear.
- La IA propone sobre la sección activa y el docente acepta o descarta.
- Seis acciones viven en el editor; compartir por enlace es de sólo lectura y revocable, y editar exige
  cuenta y permiso.
- Nueve estados con salida honesta, incluido el de reimportación que declara qué sobrevivió.

## Compatibilidad legacy

- Los cuatro frames heredados se conservan intactos y siguen `draft`; su etiqueta no acredita aprobación ni
  paridad responsive.
- Las superficies aprobadas de Office en #177 siguen siendo la entrada al editor y no se modifican.
- El estado de límite reutiliza el patrón aprobado en #163 y ya replicado en #177.
- El shell global conserva su navegación en los tres tamaños.
- Runtime, rutas, datos, storage, `src/sync`, aislamiento por `userId` y claves legacy `@planearia:*`
  permanecen intactos.

## Owner de spec y contexto

- **Owner de spec de experiencia:** `notasplan-prototype-experience`, capacidad nueva de este change.
- **Owner de spec de navegación:** `figma-prototype-navigation`, extendida con dos requirements.
- **Owner de datos:** sin cambio. NotasPLAN posee el documento; Clases posee grupo y tarea; Mensajería posee
  la conversación; Office posee la biblioteca.
- **Owner de contexto:** `context/notasplan-ground-truth/`, inaugurado el 2026-09-05.
- **Owner humano:** el owner del repositorio emite el veredicto visual tras Figma Present.

## Evidencia actual

- `context/notasplan-ground-truth/03-inventario/INVENTARIO_FIGMA_RUNTIME_2026-09-05.md`: barrido por ancho
  de frame que confirma cero superficies de editor en 768 y 390, y lectura del runtime por CodeGraph.
- `context/notasplan-ground-truth/01-decisiones/MATRIZ_DECISIONES_NOTASPLAN_157_O4.md`: quince decisiones,
  el recorrido de la decisión de fondo con sus dos revisiones y el límite honesto de la integridad.
- `context/notasplan-ground-truth/04-preflight/PREFLIGHT_VISUAL_NOTASPLAN_157_O4.md`: PASS documental, con
  el arte generado evaluado y descartado.
- Gate pre-propose de #180: PASS en los diez checks.

## Fuera de alcance

- CalcuPLAN y PresentaPLAN (`#157-O5` y `#157-O6`).
- Las familias Instrumento de evaluación y Documento académico.
- Edición colaborativa en tiempo real.
- La migración del almacenamiento del runtime a documento-primero, que se declara en el handoff y requiere
  issue y change propios.
- Todo cambio de runtime, datos, endpoints, hooks, contexts, repositories, storage, sync, backend y
  dependencias.
- Las entrevistas docentes, pausadas por decisión del owner en #47, y el contraste con planeaciones reales,
  cuyo contenido está externalizado fuera del repositorio.
