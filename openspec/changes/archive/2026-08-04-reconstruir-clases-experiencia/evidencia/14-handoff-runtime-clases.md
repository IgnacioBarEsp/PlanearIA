# Handoff runtime de Clases

**Estado:** preparado; runtime no autorizado ni iniciado.  
**Destino visual:** Clases Figma v1.3 approved.  
**Condición:** issue enriquecido y artefactos SDD aprobados antes de cualquier `apply`.

## Superficie y arquitectura a conservar

El futuro change debe partir de `ClasesStack` como hub propio, screens delgadas, hooks/ViewModels,
`classroomFacade`, repositories/ports y `src/sync`. AsyncStorage sigue como default y SQLite como opt-in.
No se crea cliente HTTP, store, cola, contexto global o fuente académica paralela.

`AssignSheet` conserva el contrato transversal Clase → Unidad → Actividad opcional, con referencia tipada,
resultado visible y sync honesto. Los contexts de tema, tamaño de fuente y daltonismo permanecen vigentes.

## Gaps que el change runtime deberá decidir

| Gap | Estado real | Contrato objetivo | Gate técnico |
| --- | --- | --- | --- |
| Anuncios de Tablón | Tablón deriva actividades/materiales; no hay owner persistente de anuncio | Anuncio/novedad con autor, fecha, estado y offline honesto, sin duplicar Trabajo de clase | Definir entidad/owner, persistencia, `userId`, sync, migración y rollback antes de UI |
| `EntregaTarea` | La VM carga entregas, pero la persistencia/sync individual sigue incompleta | Revisión y devolución por `tareaId`, `alumnoId`, `grupoId`, con estado revisable | Completar port/repository/sync y probar offline → reconexión → backend/otro dispositivo |
| Actividad sin archivo | `AgregarContenidoClassroomScreen` exige archivo o enlace | El título basta; adjunto/handoff es opcional | Separar validación académica de adjunto y cubrir borrador/programación/asignación |
| Seguimiento | Datos de asistencia/calificación existen, pero no hay cuarta superficie owner | Seguimiento integra revisar, vencidas, asistencia y calificaciones con datos insuficientes | Reusar fuentes existentes; no crear KPIs o riesgo sin trazabilidad |
| Rutas legacy | `ClasesStack` mezcla `ClassroomGroup`, `DetalleGrupo` y rutas académicas paralelas | Una ruta moderna por intención con deep links y retornos compatibles | Inventariar consumers, alias/redirect temporal, métricas de uso si existen y rollback |
| IA de clase | Resumen se muestra como alert transitorio | Propuesta/copia/resumen revisable, opcional y confirmable | Solo vía backend gateway; fallback sin proveedor; nunca sobrescribir ni ejecutar acción |

## Compatibilidad y datos

- Mantener claves `@planearia:*` hasta contar con migración validada y rollback.
- Toda consulta multiusuario filtra por `userId` y todo dato académico sincronizable pasa por `src/sync`.
- Preservar Grupo, Unidad, Tarea, Alumno, Asistencia y Calificación como owners actuales; Reportes y Agenda
  consumen proyecciones, no copias.
- Las rutas legacy se redirigen gradualmente; no se eliminan hasta verificar deep links, navegación atrás y
  datos locales existentes.
- No copiar hex o composición Figma directamente: mapear roles a tokens y validar ThemeContext,
  FontSizeContext y DaltonismoContext.

## Validación mínima futura

1. Tests unitarios de ViewModels, facade y validación de actividad sin archivo.
2. Tests de navegación/deep links y compatibilidad de rutas legacy.
3. Tests de repositorio/sync para anuncios y entregas, incluyendo conflicto y pérdida de red.
4. Playwright web por `<768`, `768–1279` y `>=1280`, después de HTTP 200.
5. Dispositivo Android medio, lector de pantalla, 44 pt, fuente ampliada, modo oscuro y reducir movimiento.
6. Comparación con los frames approved y journeys C-01 a C-05, sin tratar screenshots como aprobación.

## No objetivos del handoff

No se crea el issue runtime, no se modifica código, no se activa SQLite, no se resuelve IA/Reportes/Agenda
fuera de los contratos consumidos y no se declara paridad funcional. La siguiente ola autorizada por el
owner es `#157-O2 Escritorio`, no la implementación runtime de Clases.
