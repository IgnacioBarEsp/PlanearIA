# Baseline de experiencia deseada: Clases `#157-O1`

> **Versión:** 0.1, aprobada por el owner el 2026-08-03.
> **Fecha:** 2026-08-03.
> **Deriva de:** baseline oficial de Classroom + entrevista específica del owner.
> **Alcance:** contrato de experiencia; no es un diseño de pantalla ni una spec implementable.

## 1. Trabajo principal

Clases permite al docente organizar grupos, comunicar novedades, crear o vincular trabajo escolar,
asignarlo y revisar evidencia sin perder el contexto de la clase. Los editores especializados conservan
la creación profunda; Clases conserva el contexto académico y el retorno.

## 2. Jerarquía aprobada

### Nivel 1: entrada a Clases

1. **Lo que sigue:** resumen compacto y accionable entre clases.
2. **Mis clases:** clases activas reconocibles, con estado honesto y acceso directo.
3. **Crear clase / Importar clase:** acciones primarias del contenedor, no banners promocionales.

Señales prioritarias, por decisión del owner:

- tareas por revisar;
- entregas vencidas;
- promedio o riesgo de alumnos, solo con evidencia suficiente y explicación.

La recomendación de dos niveles queda así: la entrada presenta conteos o resúmenes compactos; cada señal
abre el objeto real y su resolución vive dentro de **Seguimiento**. No se colocan métricas en Tablón.

### Nivel 2: clase seleccionada

| Área | Tarea | Entrada | Salida/retorno | No es |
| --- | --- | --- | --- | --- |
| Tablón | Leer o publicar anuncios y novedades de la clase | Clase seleccionada o deep link de anuncio | Permanece en la clase; abre objetos referenciados | Feed social, métricas o catálogo de actividades |
| Trabajo de clase | Crear, ordenar, programar y abrir actividades, preguntas y materiales | Clase seleccionada, tema/unidad o deep link | Vuelve a Trabajo de clase conservando clase y filtro | Editor profundo ni Office incrustado |
| Personas | Ver roster, roles, estado e incorporación | Clase seleccionada o acción de miembros | Vuelve a Personas o a la persona seleccionada | Cuenta, red social o directorio global |
| Seguimiento | Revisar entregas, vencimientos, retroalimentación, asistencia y calificación | Señal, tarea, alumno o clase | Vuelve al mismo filtro/objeto; puede abrir Reportes contextual | Dashboard de KPIs ni pestaña Grades separada |

La entrada normal a una clase abre Tablón; un deep link abre directamente el objeto/área de origen. La
navegación interna siempre conserva la identidad de la clase.

## 3. Recorridos canónicos

### C-01: entrar y decidir qué atender

1. El docente entra a Clases.
2. Ve “Lo que sigue” y sus clases activas.
3. Selecciona una señal o una clase.
4. Si selecciona una señal, llega al filtro correspondiente de Seguimiento.
5. Al volver, conserva clase, filtro y posición razonables.

Condición negativa: sin datos suficientes, la señal explica el estado y ofrece el siguiente paso; no
inventa promedio, riesgo ni urgencia.

### C-02: crear una actividad sin archivo

1. Desde Trabajo de clase, el docente elige Crear actividad.
2. Captura título y, opcionalmente, instrucciones, destinatarios, puntos, fecha/hora y tema/unidad.
3. Puede guardar borrador, programar o asignar según conectividad/capacidad.
4. El adjunto es opcional; la actividad puede completarse sin archivo o documento.
5. Tras confirmar, vuelve a Trabajo de clase y ve el estado real de la actividad.

### C-03: adjuntar o crear un recurso de forma opcional

1. Durante la actividad, el docente elige **Adjuntar existente** o **Crear recurso**.
2. Adjuntar existente abre un selector compartido con owner y tipo visibles.
3. Crear recurso abre Office Docente o Diseño de materiales según el tipo elegido.
4. Al terminar, el recurso retorna por referencia a la actividad original.
5. El docente confirma la asociación; cancelar vuelve sin perder el borrador.

Clases no exige este recorrido para crear la actividad y no duplica el artefacto.

### C-04: revisar y devolver

1. Una señal de “Tareas por revisar” abre Seguimiento filtrado.
2. El docente distingue pendiente, entregada, vencida, revisada/devuelta y estado de sync.
3. Abre la evidencia de un alumno, registra retroalimentación y, si aplica, calificación.
4. Confirma la devolución.
5. El resumen y el objeto fuente se actualizan sin perder el filtro.

### C-05: comunicar en Tablón

1. El docente entra a Tablón y crea un anuncio breve.
2. Puede referenciar un objeto existente; el adjunto no es obligatorio.
3. Guarda borrador, programa o publica según el estado disponible.
4. El anuncio aparece con autor, fecha y estado honestos.

Tablón no mezcla analítica, gamificación o conversación social abierta.

## 4. Contratos cruzados

| Destino | Handoff | Retorno obligatorio |
| --- | --- | --- |
| Office Docente | Crear/seleccionar documento, hoja o presentación para una actividad | Actividad y clase de origen, con el artefacto aún sin asociar hasta confirmar |
| Diseño de materiales | Crear/seleccionar recurso visual | Actividad/material y clase de origen |
| Asistente de IA | Pedir propuesta contextual sobre actividad, instrucción o retroalimentación | Borrador/copia/diff/resumen revisable; nunca publicación automática |
| Agenda | Proyectar fecha de una actividad real | Abre actividad/clase owner; Agenda no duplica estado |
| Reportes | Interpretar evidencia de clase/alumno | Vuelve al filtro de Seguimiento que originó el análisis |

## 5. Adaptación responsiva

La arquitectura no cambia entre móvil, tablet y web:

- móvil conserva el hub global Clases y ofrece las cuatro áreas internas con prioridad táctil;
- tablet usa rail/paneles sin convertir áreas en módulos nuevos;
- web aprovecha ancho para lista + detalle cuando no rompe foco ni retorno;
- labels, owners, deep links, estados y objeto activo son idénticos.

La composición exacta queda pendiente del inventario Figma y no se define en este baseline.

## 6. Estados obligatorios

- loading con tarea/objeto identificable;
- vacío de “sin clases”, “sin trabajo”, “sin personas” y “sin evidencia” con CTA pertinente;
- error recuperable y causa comprensible;
- offline con guardado local, pendiente de sync y acción disponible;
- conflicto de sync con comparación/recuperación, nunca sobrescritura silenciosa;
- capacidad no configurada, por ejemplo IA ausente, con flujo manual completo;
- datos insuficientes para promedio/riesgo sin números de relleno.

## 7. Criterio perceptual

En una prueba de reconocimiento, un docente familiarizado con Classroom debe identificar sin explicación:

- dónde están sus clases;
- dónde se publica un anuncio;
- dónde se crea trabajo escolar;
- dónde se administran personas;
- dónde se revisan entregas y calificaciones.

Después debe descubrir el diferenciador PlanearIA: adjuntar o crear en herramientas especializadas y
volver a la actividad original sin descargar, duplicar ni perder contexto.

## 8. No objetivos del primer slice

- Perspectiva completa de alumno, padre/tutor o administrador.
- Copiar el gradebook de Google o activar analítica sin datos reales.
- Crear editores Office/Diseño dentro de Clases.
- Exigir adjuntos, IA o conectividad para crear una actividad.
- Rediseñar Escritorio, Office u otro módulo en el mismo change.
- Definir la composición visual final antes del gate Figma/ground truth.

## 9. Gate de aprobación

El owner aprobó explícitamente la versión 0.1 el 2026-08-03. La aprobación cubre:

1. la jerarquía de dos niveles para “Lo que sigue” y Seguimiento;
2. Tablón como comunicación de clase, sin métricas;
3. creación breve con adjunto opcional y creación profunda por handoff;
4. el baseline oficial como referencia suficiente para iniciar diseño candidato.

No cubre todavía una composición Figma, una implementación runtime ni una declaración de paridad visual.
