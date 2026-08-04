# Baseline Escritorio PlanearIA `#157-O2`

> **Versión:** 0.1 candidate.
> **Fecha:** 2026-08-04.
> **Aprobación:** pendiente; este documento no autoriza `apply`.
> **Nivel de paridad:** medio. Familiaridad de suite y home operativo, sin copiar una marca externa.

## 1. Promesa

Escritorio es el primer lugar al que llega el docente. En una mirada debe permitirle abrir una herramienta,
atender lo que requiere acción y retomar trabajo propio. Su firma útil es la **línea del día**: una secuencia
breve de objetos reales, con owner, contexto, tiempo y estado, que conecta creación, clase, comunicación y
seguimiento sin convertir la suite en feed ni dashboard.

## 2. Arquitectura de la experiencia

### Capa A — Launcher de herramientas

- NotasPLAN, CalcuPLAN y PresentaPLAN como herramientas de Office Docente.
- Diseño de materiales, Clases y Asistente de IA como experiencias distintas.
- Acceso a “Nuevo archivo” mediante selector tipo-primero: documento, hoja, presentación, diseño o preguntar
  a la IA.
- Labels globales permanecen: Escritorio, Office Docente, Clases, Asistente de IA, Diseño de materiales,
  Mensajería, Agenda, Reportes y Cuenta.

### Capa B — Lo que requiere atención

Lista priorizada, no tablero de métricas. Cada fila responde:

- qué objeto es;
- por qué requiere atención;
- a qué clase, grupo, alumno o fecha pertenece;
- qué estado local/sync tiene;
- cuál es la siguiente acción;
- cómo vuelve a Escritorio.

Ejemplos sintéticos válidos: revisar entregas de una tarea, registrar asistencia de la siguiente clase,
resolver una entrega vencida o abrir un mensaje que exige respuesta. Un promedio/riesgo sólo aparece si
Reportes/Seguimiento puede explicar evidencia; de lo contrario muestra datos insuficientes.

### Capa C — Continuidad

Objetos propios iniciados o usados recientemente: documento, planeación, material, borrador de mensaje o
actividad. No es “recientes” indiscriminado; debe conservar owner, última acción, estado local/sync y verbo
de continuación.

## 3. Priorización candidata

1. **Requiere acción:** revisión, error recuperable, conflicto o entrega vencida.
2. **Ocurre pronto:** siguiente clase, evento o vencimiento de hoy.
3. **Continuar:** borrador o trabajo reciente con contexto suficiente.
4. **Sugerencia IA:** sólo si es relevante, secundaria, descartable y confirmable.

La regla es un supuesto de composición, no un algoritmo aprobado ni una promesa de analítica. No se
inventan urgencia, riesgo o datos personales para llenar la superficie.

## 4. Adaptación por breakpoint

| Breakpoint | Navegación global | Composición candidata | Invariante |
| --- | --- | --- | --- |
| Móvil `<768` | Cinco hubs; Más conserva módulos secundarios. | Launcher compacto con labels; 1–3 prioridades visibles; continuidad posterior; detalle en pantalla siguiente. | Launcher, jornada y continuidad siguen presentes y todos los destinos son móviles. |
| Tablet `768–1279` | Rail. | Launcher compacto; prioridades como lista principal; continuidad como sección o pane auxiliar según espacio. | Misma semántica y objeto activo, sin reducir la experiencia a una tarjeta. |
| Web `>=1280` | Sidebar y panel IA alcanzable. | Dock completo; lista priorizada de intensidad media; continuidad en pane secundario sin competir con la jornada. | No hay bento ni catálogo inerte; el objeto y su próxima acción dominan. |

La guía oficial de Android para interfaces adaptativas respalda cambiar navegación y disposición según el
espacio, preservando estado y tarea, en lugar de estirar la misma composición. Es referencia de patrón,
no dependencia técnica ni decisión de adoptar Material.

## 5. Estados mínimos

| Estado | Contrato visible | Acción disponible |
| --- | --- | --- |
| Loading | Nombra la zona que carga; no desplaza el shell ni finge contenido. | Esperar o cancelar navegación cuando aplique. |
| Empty nuevo docente | Explica que aún no hay jornada construida. | Crear clase; crear/importar documento; probar Asistente de IA. |
| Empty con historial | Distingue “nada urgente” de “sin datos”. | Abrir Agenda, explorar herramientas o continuar un objeto. |
| Error parcial | Mantiene zonas locales disponibles e identifica la fuente que falló. | Reintentar o abrir el owner manualmente. |
| Offline | Expone datos locales y limita acciones remotas sin pérdida aparente. | Continuar localmente; revisar pendientes de sync. |
| Sync pendiente/conflicto | Separa guardado local de confirmación remota y nombra el objeto. | Revisar, reintentar o resolver; nunca afirmar éxito remoto. |
| IA no configurada | La sugerencia no aparece o explica indisponibilidad sin ocupar la jornada. | Completar manualmente o abrir configuración de forma explícita. |

## 6. Navegación y retornos

- Launcher → herramienta/módulo del mismo breakpoint → volver devuelve a la posición previa de Escritorio.
- Prioridad → objeto exacto y filtro owner → volver conserva clase, alumno, tarea o fecha de origen.
- Continuidad → objeto editable → volver conserva estado y no crea una copia nueva.
- Nuevo archivo → selector tipo-primero → destino elegido → cancelar vuelve al mismo disparador.
- Sugerencia IA → borrador/diff/resumen revisable → confirmar o descartar → nunca guardar/asignar sola.

## 7. Referencias oficiales y límites

- [Microsoft Support — Quick access](https://support.microsoft.com/en-us/onedrive/getting-started-with-quick-access):
  valida que accesos frecuentes y ubicaciones recientes pueden reducir la búsqueda; no justifica copiar su
  sidebar ni convertir objetos docentes en archivos.
- [Microsoft Support — File Explorer Home](https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows):
  contrasta una entrada que acerca objetos recientes/favoritos y búsqueda; PlanearIA añade intención docente,
  owner y acción.
- [Android Developers — Adaptive do's and don'ts](https://developer.android.com/develop/adaptive-apps/guides/adaptive-dos-and-donts):
  respalda cambiar barra/rail y composición según tamaño, no estirar componentes.
- [Android Developers — Canonical layouts](https://developer.android.com/develop/ui/views/layout/canonical-layouts):
  respalda conservar selección/estado cuando lista y detalle pasan de dos panes a uno.
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/): foco, orden, reflow, labels y target mínimo oficial.
- [W3C — Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum):
  mínimo AA de 24 CSS px; PlanearIA mantiene su criterio más exigente de 44 pt para controles.

Ninguna fuente externa define nomenclatura, paleta, jerarquía o autonomía IA de PlanearIA. La visión
aprobada tiene precedencia y familiaridad no significa copia literal.

## 8. Supuestos IHC a validar

- La línea del día reduce el costo de decidir por dónde empezar.
- Tres niveles —herramientas, atención, continuidad— se reconocen sin instrucción.
- El launcher compacto móvil conserva descubribilidad sin desplazar las prioridades críticas.
- Los verbos y owners permiten anticipar destino y retorno.

Se validarán con docentes reales cuando el plan active investigación con prototipo. Hasta entonces no se
declara eficacia, satisfacción, adopción ni paridad percibida como probadas.
