## Context

#163 activa `#157-O2 Escritorio` bajo #157/#101. El plan v1.3 autoriza issue, baseline y artefactos,
pero exige aprobación humana de este paquete antes de `apply`. Clases #159 y el saneamiento #161 están
cerrados; #156/PR #158 conserva el contrato de navegación base y no se reabre.

El prototipo tiene una base desktop útil en `198:695`, pero tablet `198:776` y móvil `198:809` reducen
Escritorio a una tarjeta. Los nombres `approved` pertenecen a su uso como puentes hacia Clases y
contradicen la matriz/plan, que no aprobaron Escritorio como experiencia. Además, “Nuevo archivo” abre
Office Home en vez del selector tipo-primero confirmado.

Runtime sólo aporta baseline brownfield: `InicioStack` abre `EscritorioPlaceholderScreen`; `AppShell`
mantiene hubs y breakpoints; `SyncStatusChip` presenta sync. GitNexus confirmó esta estructura y
CodeGraph fue fallback lineado porque la consulta amplia omitió el cuerpo de la screen. El placeholder no
simula datos y declara que el dashboard real pertenece a un change posterior. Diseñar proyecciones reales
de múltiples contextos y runtime a la vez convertiría esta ola en un mega-change sin aprobación visual.

Fuentes directas:

- `context/escritorio-ground-truth/` baseline 0.1 candidate, inventario, matriz y preflight;
- `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` v1.3 y `PLAN_UXUI_NAVEGACION_GLOBAL.md`;
- Figma `VBK5tK7EQS83tdTmtuBpI9`, inspeccionado sin mutaciones;
- `openspec/specs/figma-prototype-navigation/spec.md`, Anti-Slop, IHC y golden journeys;
- código y `adaptive-app-shell` sólo como comportamiento runtime actual.

No se agregan APIs, librerías ni motion runtime; por ello no hay API externa que verificar en Context7 en
este design. Cualquier change React Native posterior deberá volver a verificar las APIs que use.

## Goals / Non-Goals

**Goals:**

- Producir un prototipo candidate de Escritorio que combine launcher, atención diaria y continuidad.
- Demostrar creación tipo-primero, apertura de objetos owners, retornos y estados honestos en tres
  breakpoints.
- Conservar identidad PlanearIA, accesibilidad, offline-first y control docente sin depender de IA.
- Detener el ciclo en un gate visual humano y dejar un handoff runtime separado y acotado.

**Non-Goals:**

- Modificar React Native, rutas, hooks, contexts, backend, datos, storage, sync, IA o dependencias.
- Diseñar la implementación de un agregador/proyección runtime cross-context.
- Rediseñar profundamente otro módulo o completar todos los journeys de la suite.
- Crear feed, dashboard ejecutivo, centro de notificaciones o analítica/riesgo sin evidencia.
- Declarar paridad IHC de campo, aprobación visual o readiness de runtime a partir de evidencia automática.

## Decisions

### 1. El change termina en prototipo aprobado, no en runtime

Durante `apply` se podrá editar únicamente Figma y artefactos versionados de soporte. Tras construir y
recorrer el candidate, el flujo se pausa para aprobación visual explícita. Un issue/change posterior
definirá ViewModel, proyecciones de objetos, contratos de datos y migración del placeholder.

Alternativa descartada: Figma y runtime juntos. Escritorio consume objetos de al menos cuatro contextos;
implementar su agregación antes de validar jerarquía aumenta el blast radius y puede fijar una composición
no aprobada.

### 2. La arquitectura estable tiene tres capas

1. **Launcher:** NotasPLAN, CalcuPLAN, PresentaPLAN, Diseño de materiales, Clases y Asistente de IA.
2. **Requiere atención:** objetos con owner, motivo, contexto, estado y próxima acción.
3. **Continuidad:** borradores o trabajo reciente propio con verbo de continuación.

Las tres capas existen en móvil, tablet y web. No son tres dashboards ni un bento; son una jerarquía
continua de reconocimiento, decisión y reanudación.

Alternativa descartada: una tarjeta destacada por pantalla pequeña o un catálogo de apps por pantalla
grande. Ambos eliminan parte de la promesa y repiten el problema de módulos genéricos.

### 3. La línea del día prioriza acciones, no calcula un score opaco

El candidate ordenará primero lo que requiere acción, después lo que ocurre pronto y luego lo que puede
continuarse. Cada señal debe abrir la evidencia que la sustenta. No se crea algoritmo, severidad, riesgo
predictivo ni KPI. Si falta evidencia, el prototipo usa “datos insuficientes” o un vacío específico.

Alternativa descartada: métricas globales de cursos, alumnos o pendientes. Separan el número de la tarea y
convierten Escritorio en dashboard ejecutivo.

### 4. Crear parte del tipo y difiere la intención escolar

“Nuevo archivo” abre un selector contextual con documento, hoja, presentación, diseño y preguntar a la IA.
Después de elegir, la intención escolar puede sugerirse como chip descartable. Cancelar vuelve al mismo
disparador; ningún paso obliga a describir una planeación antes de empezar.

Alternativa descartada: navegar primero a Office Home o abrir un modal de “¿qué quieres lograr?”. El
primero diluye el destino y el segundo bloquea una acción familiar.

### 5. Escritorio proyecta referencias; los módulos conservan ownership

El contexto de **Experiencia y Preferencias** posee shell, navegación y presentación de Escritorio, pero no
los objetos que muestra. Los contratos representados son:

| Owner | Consumidor | Dirección/forma | Compatibilidad e invariantes futuras |
| --- | --- | --- | --- |
| Planeación y Contenido Docente: Planeación/Recurso | Escritorio | Referencia por ID, tipo, título y estado resumido | Sólo el owner edita; `userId`, permisos y original sin sobrescritura IA. |
| Classroom y Organización Académica: Grupo/Tarea | Escritorio | Deep link con `grupoId`/`tareaId` y acción pendiente | No copia tarea ni grupo; la asignación sigue en Clases. |
| Seguimiento y Evaluación: EntregaTarea/Asistencia/Calificación | Escritorio | Proyección accionable hacia filtro/evidencia owner | Datos explicables; “datos insuficientes”; `src/sync` al persistir en runtime. |
| Comunicación Profesional: Conversación/Mensaje | Escritorio | Referencia y estado de entrega hacia el hilo | Sólo participantes autorizados; no copia contenido académico. |
| Agenda futura | Escritorio | Fecha/objeto proyectado y retorno al owner | Agenda no crea ownership alterno del objeto fuente. |
| Sync/offline transversal | Escritorio | Estado visible global y por objeto | Un pull fallido no borra local; no se crea cola paralela. |
| IA transversal | Escritorio | Sugerencia/borrador revisable opcional | Backend gateway, fallback manual y confirmación docente en runtime futuro. |

Este contrato no exige microservicios, CQRS, event sourcing, colas ni providers globales. El prototipo usa
datos sintéticos y no materializa el contrato.

### 6. Responsive conserva la IA y cambia la composición

- **Móvil `<768`:** cinco hubs, launcher compacto con labels, 1–3 prioridades iniciales y continuidad en
  flujo vertical; el detalle ocupa la pantalla siguiente.
- **Tablet `768–1279`:** rail, launcher compacto, prioridades principales y continuidad como sección o pane
  auxiliar según espacio.
- **Web `>=1280`:** sidebar, dock completo, lista de jornada principal y continuidad auxiliar; panel IA
  alcanzable sin competir con el trabajo.

No se crean archivos de plataforma ni implementaciones independientes. Todo hotspot permanece en el
mismo breakpoint y los retornos preservan el origen conceptual.

### 7. Los estados forman una matriz honesta y proporcional

Launcher, atención y continuidad tendrán estado principal y cobertura verificable de loading, empty,
error y offline. Escrituras representadas diferencian local, sync pendiente, conflicto y confirmación
remota. El vacío de docente nuevo ofrece crear clase, crear/importar documento y probar Asistente. Como
Figma no persiste, la microcopy no afirma que envió, guardó o sincronizó datos reales.

Se usan componentes/variantes para cambios semánticos compartidos y frames sólo cuando cambia la tarea o
el recorrido de Present. Datos, grupos, alumnos y mensajes son sintéticos.

### 8. La IA es secundaria, descartable y nunca necesaria

Una sugerencia IA sólo aparece con contexto suficiente, después de las acciones docentes y con controles
para revisar, confirmar o descartar. Sin proveedor, el launcher y la jornada siguen completos. Ningún
hotspot representa guardado, asignación, publicación o envío autónomo.

Alternativa descartada: chat/hero IA como entrada o tarjeta persistente que desplaza prioridades. Cambia la
promesa de la suite y contradice el control docente.

### 9. Anti-Slop y accesibilidad gobiernan la composición

La intensidad es media. Tipografía, espacio, alineación y listas resuelven jerarquía. Dock tiles se
justifican por reconocimiento de herramientas; prioridades no se dividen en cards inertes. No hay glass,
blur, halos, gradientes, bento o sombras ornamentales.

La microinteracción significativa es selección/confirmación/retorno, no movimiento decorativo. En Figma se
demuestra el estado final sin depender de animación. Controles documentan label, estado, foco, contraste y
objetivo mínimo de 44 pt; fuente ampliada y reducir movimiento conservan el resultado.

### 10. Historial Figma y autoridad de aprobación son explícitos

Los nodos `198:695`, `198:776` y `198:809` no se borran ni se reinterpretan como aprobación. Se crea una
sección/version `Escritorio 0.1 candidate`; los nuevos frames permanecen candidate hasta un comentario del
owner después de Present. Historial automático, frames previos, sección identificada y evidencia enlazada
forman el rollback obligatorio; un checkpoint nombrado sólo se registra si la herramienta lo soporta.

### 11. Runtime se compara read-only y conserva su placeholder

GitNexus ya fijó rutas y shell; CodeGraph aportó la fuente puntual. Durante `apply`, una comparación web
read-only podrá documentar el placeholder en tres breakpoints después de HTTP 200, sin modificar código ni
presentarla como implementación. El handoff posterior deberá reconciliar el identificador histórico
`escritorio-docente` de `adaptive-app-shell` con el issue/change runtime que se apruebe.

## Risks / Trade-offs

- **Tablet/móvil pierden una capa por falta de espacio** → verificar las tres capas y journeys en cada
  breakpoint; cambiar densidad, no semántica.
- **La jornada se vuelve un feed o lista infinita** → limitar el candidate a objetos accionables y
  continuidad; sin paginación o actividad social ficticia.
- **Datos sintéticos parecen analítica real** → rotularlos, incluir vacío/datos insuficientes y enlazar cada
  señal a evidencia representada.
- **Los nombres `approved` inducen promoción accidental** → preservar nodos, documentar drift y crear sección
  candidate separada.
- **La creación tipo-primero invade Office/Diseño/IA** → el selector sólo entrega control; no duplica
  editores y siempre conserva retorno.
- **El prototipo promete una agregación runtime costosa** → handoff explícito, sin definir store o endpoint
  hasta validar la composición y hacer análisis de impacto propio.
- **La aprobación se infiere de checks verdes** → pausa manual obligatoria; API, capturas y tests nunca
  cambian el estado.

## Migration Plan

1. Revalidar inventario Figma y documentar nodos históricos sin mutarlos.
2. Crear sección/version candidate y componentes compartidos.
3. Construir launcher, atención y continuidad con datos y vacío en desktop, tablet y móvil.
4. Conectar E-01 iniciar/atender, E-02 crear tipo-primero, E-03 continuar/volver y E-04 offline/sync.
5. Completar matriz de estados, navegación, Anti-Slop, Nielsen y accesibilidad; comparar runtime read-only.
6. Recorrer Figma Present y detenerse para aprobación visual humana.
7. Si se aprueba, promover sólo los frames autorizados y documentar handoff runtime; no crear ese issue sin
   autorización adicional.

Rollback: restaurar la versión previa mediante historial Figma o frames históricos y revertir artefactos
por PR normal. No hay datos, rutas, backend, storage o runtime que revertir.

## Open Questions

No hay decisiones de visión abiertas que bloqueen `apply` después de la aprobación de estos artefactos.
La cantidad exacta de señales visibles y la geometría del launcher son hipótesis de composición candidate.
Si Present o investigación con docentes no permite reconocer las tres capas, se itera la composición y no
se promueve. La validación IHC de campo permanece pendiente y no se infiere del gate del owner.
