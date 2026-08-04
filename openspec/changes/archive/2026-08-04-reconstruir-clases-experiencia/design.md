## Context

#159 activa `#157-O1 Clases` bajo #157/#101. El owner aprobó el plan de visión 1.1 y el baseline de
Clases 0.1 el 2026-08-03. El prototipo vigente tiene frames draft para entrada, detalle, creación y móvil,
pero presenta Clases como área de archivos, repite home/detalle, fuerza un documento para crear actividad
y cambia la arquitectura en móvil. La navegación base de #156/PR #158 permanece cerrada y se preserva.

El runtime solo aporta baseline brownfield: `ClassroomHomeScreen` y `ClassroomGroupScreen` consumen hooks
MVVM y `classroomFacade`; los datos reales ya incluyen Grupo, Unidad, Tarea, Alumno, asistencia,
calificación y una entrega individual todavía incompleta. No existe un modelo vigente de anuncio de clase
y el Tablón actual deriva elementos de Trabajo de clase. Por ello este change se limita al prototipo Figma,
documentación y evidencia. Implementar runtime ahora obligaría a resolver contratos de datos no aprobados
y convertiría la ola en un mega-change.

Fuentes visuales y de experiencia:

- `context/classroom-ground-truth/03-referencias-reales/BASELINE_OFICIAL_GOOGLE_CLASSROOM_2026-08.md` 0.1;
- `context/classroom-ground-truth/04-flujos-deseados/BASELINE_CLASES_PLANEARIA_157_O1.md` 0.1;
- `context/classroom-ground-truth/04-flujos-deseados/PREFLIGHT_VISUAL_CLASES_157_O1.md`;
- inventario de drift en `context/classroom-ground-truth/01-errores-actuales/`;
- archivo Figma `VBK5tK7EQS83tdTmtuBpI9`, cuyos frames actuales siguen `draft`;
- `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` v1.1, Anti-Slop, IHC y golden journeys.

## Goals / Non-Goals

**Goals:**

- Producir un prototipo navegable y reconocible de Clases con una entrada cross-class y cuatro áreas
  internas propias.
- Demostrar actividad sin archivo, handoff opcional a herramientas especializadas, Seguimiento trazable y
  estados honestos sin fingir persistencia o red.
- Conservar la misma arquitectura en móvil, tablet y web, con accesibilidad y retornos verificables.
- Detener el flujo en un gate de aprobación visual humana y dejar un handoff acotado para un change runtime
  posterior.

**Non-Goals:**

- Modificar React Native, backend, modelos, storage, sync, rutas runtime, IA o dependencias.
- Diseñar experiencias completas de alumno, tutor o administrador.
- Resolver persistencia de anuncios, EntregaTarea, analítica/riesgo o migración de rutas legacy.
- Rediseñar otros módulos, el shell global o la navegación cerrada por #156.
- Declarar paridad visual o aprobación a partir de Figma API, capturas, Playwright o tests.

## Decisions

### 1. El primer change termina en prototipo aprobado, no en runtime

El apply de este change podrá editar únicamente Figma y artefactos versionados de soporte. El gate manual
ocurre después de Present y antes de marcar los frames como aprobados. Un issue/change posterior decidirá
modelo de anuncio, persistencia, rutas y composición React Native a partir de la evidencia aprobada.

Alternativa descartada: Figma y runtime en el mismo change. El Tablón carece de owner persistente propio y
`EntregaTarea` no tiene persistencia/sync dedicada; resolver ambos junto con cinco superficies elevaría el
riesgo y permitiría implementar una composición aún no aprobada.

### 2. La arquitectura tiene dos niveles y cinco superficies

La entrada a Clases contiene “Lo que sigue”, clases activas y Crear/Importar clase. Una clase seleccionada
contiene Tablón, Trabajo de clase, Personas y Seguimiento. La entrada normal abre Tablón; señales y deep
links abren el área/objeto que los sustenta. Calificaciones no crea una quinta pestaña: vive en
Seguimiento.

Alternativa descartada: reutilizar entrada y detalle con filtros visuales. No cambia la tarea, impide
validar recorridos y conserva el drift actual de “Área de archivos”.

### 3. Las señales son índices hacia evidencia, no KPIs

“Tareas por revisar”, “Entregas vencidas” y “Promedio/riesgo” aparecen como resumen cross-class compacto.
Cada señal debe abrir un estado de Seguimiento con clase, filtro y objeto identificables. Promedio/riesgo
solo usa datos sintéticos claramente rotulados en el prototipo y siempre incluye el estado “datos
insuficientes”; no se presenta como predicción real.

Alternativa descartada: cards de Cursos/Alumnos/Pendientes o métricas dentro de Tablón. Son información
genérica, separan el número de la acción y convierten Clases en dashboard.

### 4. Crear actividad es autónomo; los recursos son un handoff opcional

El recorrido candidato permite título y campos académicos breves, y ofrece Guardar borrador, Programar o
Asignar con estados honestos. No exige archivo. “Adjuntar existente” abre un selector conceptual con owner
y tipo; “Crear recurso” ofrece Office Docente y Diseño como destinos explícitos, representa el traspaso sin
duplicar sus editores y vuelve al borrador original con una referencia tipada. Al retornar, el recurso aún
requiere confirmación para asociarse. Cancelar conserva el borrador.

Alternativa descartada: abrir primero un editor de documento o forzar “elegir borrador”. Absorbe Clases en
Office y contradice la fuente oficial y la decisión humana.

### 5. El prototipo usa una matriz explícita de estados

Cada superficie tiene al menos un estado principal y variantes de loading, vacío, error y offline. Los
recorridos de escritura distinguen borrador local, pendiente de sync y confirmación remota; como Figma no
persiste, la microcopy declara que es una simulación de estado. Los hotspots nunca concluyen “asignada”,
“publicada” o “devuelta” sin pasar por una confirmación visible.

Los estados se modelan como componentes/variantes cuando comparten semántica y como frames cuando cambian
la tarea o deben recorrerse en Present. No se fabrican datos personales; nombres, clases, calificaciones y
mensajes son sintéticos.

### 6. Responsive significa una IA, no los mismos píxeles

- Móvil `<768`: conserva el hub Clases, una acción principal táctil y las cuatro áreas internas en un
  control accesible que no oculta etiquetas.
- Tablet `768–1279`: usa el rail global vigente y puede mostrar navegación/objeto en paneles cuando conserva
  foco y retorno.
- Web `>=1280`: usa sidebar global y puede mostrar lista + detalle, sin duplicar el objeto activo.

El prototipo parte de componentes y nomenclatura compartidos. No crea experiencias independientes ni usa
un frame desktop como destino de un hotspot móvil.

### 7. Anti-Slop, tokens, accesibilidad y motion son restricciones del artefacto

Jerarquía, espacio y tipografía resuelven la comprensión antes que color o contenedores. Los componentes
visuales derivan de los tokens y la biblioteca vigentes; no copian la paleta de Google. Cards, chips y
pills solo expresan agrupación, estado o acción. No se introducen glass, blur, halos o gradientes.

La microinteracción significativa es el feedback de selección/confirmación/estado y el retorno al origen,
no movimiento ornamental. Ninguna información depende de animación. Los controles se documentan con
nombre accesible, selección, orden de foco, contraste y objetivo mínimo de 44 pt; cerrar un overlay devuelve
el foco al disparador.

### 8. Bounded contexts y contratos cruzados

El contexto primario es **Classroom y Organización Académica**, owner de Grupo, Unidad, Alumno y Tarea. El
prototipo muestra IDs/relaciones conceptuales, pero no crea datos.

Los contratos cruzados son:

| Owner | Consumidor en el prototipo | Dirección/forma | Compatibilidad e invariantes |
| --- | --- | --- | --- |
| Planeación y Contenido Docente: Recurso | Classroom | Referencia tipada que vuelve al borrador de Tarea | No copia contenido; asociación solo tras confirmación; `userId`/permisos se preservarán en runtime |
| Seguimiento y Evaluación: EntregaTarea, Asistencia, Calificación | Classroom | Proyección contextual por `tareaId`, `alumnoId`, `grupoId` | No crea owner paralelo; “datos insuficientes” es obligatorio; `src/sync` sigue siendo la vía futura |
| Experiencia y Preferencias | Classroom | Shell, breakpoint, tema y accesibilidad | Labels globales de #156 no cambian; preferencias se reflejan en los estados candidatos |
| Sync/offline transversal | Classroom | Estado visible, no dato académico | El prototipo no crea cola ni cliente; separa guardado local de confirmación remota |
| IA transversal | Classroom | Propuesta revisable opcional | Sin proveedor hay flujo manual; no sobrescribe ni ejecuta acciones |

El change no introduce microservicios, CQRS, event sourcing, colas paralelas ni providers globales.

### 9. Historial Figma y autoridad de aprobación

Los frames `38:2`, `90:48`, `125:65`, `127:166` y `158:150` no se borran ni se renombran como aprobados.
Los nuevos frames usan estado `candidate` y una versión/section propia. Solo un comentario o registro humano
explícito del owner permite promoverlos a `approved`; #46 no se cierra ni se infiere por este change.

La matriz de navegación registra origen, acción, destino, retorno, estado y breakpoint. Un hotspot roto,
un éxito simulado o un destino desktop desde móvil bloquea el gate.

### 10. Runtime solo se compara de forma read-only

Antes de la revisión final se levanta Expo web hasta obtener HTTP 200 y se capturan los breakpoints
requeridos para comparar comportamiento útil, no para definir el destino. GitNexus ya fijó la estructura y
CodeGraph fue fallback lineado porque la consulta amplia omitió pantallas clave. No se modifica código ni se
marca ninguna prueba de runtime como evidencia de implementación.

## Risks / Trade-offs

- **El prototipo promete datos que runtime no posee** → rotular datos sintéticos, representar estados no
  disponibles y registrar el gap del modelo de anuncios/EntregaTarea en el handoff runtime.
- **Familiaridad se convierte en copia** → usar arquitectura/tareas oficiales, pero tokens, componentes,
  microcopy y firma de continuidad propios de PlanearIA.
- **Cinco superficies producen demasiados frames** → reutilizar componentes/variantes para estados
  semánticamente iguales; crear frames solo para tareas y recorridos verificables.
- **Una señal de riesgo estigmatiza o finge certeza** → exigir fuente, explicación, acción y estado de datos
  insuficientes; no usar color como único indicador.
- **Móvil pierde áreas o retorna a desktop** → recorrer cada journey por breakpoint y bloquear cualquier
  hotspot cruzado.
- **La aprobación se infiere de evidencia automática** → pausa manual obligatoria y estado `candidate`
  hasta registro explícito.

## Migration Plan

1. Confirmar inventario y conservar frames históricos sin edición destructiva.
2. Crear una sección/version candidate con componentes y estados compartidos.
3. Construir entrada, Tablón, Trabajo de clase, Personas y Seguimiento en desktop, tablet y móvil.
4. Conectar los cinco recorridos canónicos, overlays, handoffs, cancelación y retornos.
5. Ejecutar preflight, recorridos Present, matriz, Nielsen, revisión de accesibilidad y comparación
   read-only con runtime por breakpoint.
6. Detenerse para aprobación visual humana. Si se rechaza, iterar candidate o restaurar por historial.
7. Solo con aprobación, marcar evidencia y documentar el handoff a un issue/change runtime separado.

Rollback: restaurar la versión anterior en historial Figma y revertir los artefactos del PR. No hay datos,
rutas, storage, backend ni runtime que revertir.

## Open Questions

No hay decisiones de visión abiertas que bloqueen `apply`. El orden/densidad exactos de señales y la
composición por breakpoint se validan como parte del diseño candidato, no reabren el baseline. Si la
prueba humana no reconoce Classroom o no descubre la continuidad PlanearIA, se itera la composición y no
se promueve a aprobada.
