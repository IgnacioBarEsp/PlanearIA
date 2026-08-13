# Plan Maestro: Visión y Contrato de Experiencia del Prototipo — Subépica #157

> **Versión:** 1.4, vigente.
> **Fecha:** 2026-08-13.
> **Formato:** Blueprint + backlog de olas, conforme a `meta_guia_planes.md`.
> **Autoridad operativa padre:** issue [#101](https://github.com/IgnacioBarEsp/PlanearIA/issues/101), Plan Maestro UX/UI y Navegación Global.
> **Subépica de este plan:** issue [#157](https://github.com/IgnacioBarEsp/PlanearIA/issues/157), reconstrucción del prototipo como suite docente por módulos.
> **Plan padre:** [`PLAN_UXUI_NAVEGACION_GLOBAL.md`](PLAN_UXUI_NAVEGACION_GLOBAL.md).
> **Estado:** activo. `#157-O0`, `#157-O1 Clases` y `#157-O2 Escritorio` tienen aprobación visual humana y frames promovidos. `#157-O3 Office Home y Crear` es la siguiente ola autorizada para issue, entrevista específica y artefactos; ningún `apply` posterior se ejecuta sin aprobación humana explícita de esos artefactos.
> **Alcance:** visión consolidada, arquitectura de experiencias, nomenclatura, fronteras, paridad, ground truth, riesgos, olas y gates para reconstruir el prototipo un módulo a la vez.

## Control de versiones

| Versión | Fecha | Estado | Cambio |
| --- | --- | --- | --- |
| 0.9 | 2026-08-03 | Candidata | Sintetiza las fuentes vigentes, la matriz publicada en #157 y la entrevista transversal con el owner. |
| 1.0 | 2026-08-03 | Aprobada | El owner aprueba el contrato como baseline y habilita preparar únicamente `#157-O1 Clases`. |
| 1.1 | 2026-08-03 | Aprobada | Integra las decisiones de la entrevista de Clases, el baseline oficial Google Classroom 0.1, los inventarios read-only de Figma/runtime y el preflight visual; habilita el gate pre-propose sin aprobar todavía una composición Figma ni implementación. |
| 1.2 | 2026-08-04 | Aprobada | Registra la aprobación visual de Clases v1.3, conserva como candidate los puentes de otros módulos y activa únicamente la preparación de artefactos de `#157-O2 Escritorio`; `apply` requiere una aprobación posterior. |
| 1.3 | 2026-08-04 | Superada | Integra el contrato transversal de rollback Figma, roles semánticos Figma-runtime, frontera de daltonismo y origen canónico de QA fijado por el saneamiento #161; la reanudación depende de `debt:check` y cada ola conserva su aprobación humana separada. |
| 1.4 | 2026-08-13 | Vigente | Registra la aprobación visual de Escritorio v1.0 en #163, la promoción de sus 8 frames y la corrección del retorno a Escritorio en 44 controles; fija la auditoría por alcanzabilidad y clasificación por ancho de frame como método válido, y activa la preparación de `#157-O3`. |

Una modificación posterior de la promesa, arquitectura de experiencias, fronteras o nomenclatura incrementa
la versión menor y registra la decisión. Una corrección editorial sin cambio de significado incrementa el
parche. Ninguna evidencia automática sustituye la aprobación del owner.

---

## 0. Gobernanza y relación con el plan UX/UI

1. `PLAN_UXUI_NAVEGACION_GLOBAL.md` sigue siendo el blueprint padre y #101 conserva la autoridad
   operativa del plan UX/UI completo.
2. #157 es una subépica especializada en fidelidad, fronteras y navegación semántica del prototipo. No
   reemplaza #101, no duplica sus milestones y no reabre las Olas 0 y 1 ya archivadas.
3. Para evitar la colisión con las olas históricas del plan padre, este documento usa el namespace
   `#157-O0`, `#157-O1`, etc. Es una secuencia interna; no crea milestones por sí misma.
4. Solo se crean issues de la ola activa y la siguiente cuando el owner autorice activarlas. Este
   documento conserva las demás como backlog, no como trabajo iniciado.
5. El código y `openspec/specs/` describen el comportamiento real. La visión y el plan padre describen el
   destino. Rutas, carpetas y pantallas legacy son inventario técnico, no UX objetivo.
6. Si una decisión de este subplan exige cambiar una spec archivada de gobernanza o comportamiento, se
   tramita después mediante issue enriquecido y change SDD; la spec nunca se edita a mano.

### Estado de la Ola #157-O0

La matriz de decisiones previas fue publicada en [#157](https://github.com/IgnacioBarEsp/PlanearIA/issues/157#issuecomment-5162804972).
La entrevista transversal resolvió:

- #157 es subépica gobernada por #101.
- Prioridad de decisión: integridad/offline/privacidad/control docente; familiaridad; conexión nativa;
  expresión visual.
- Hasta contar con investigación de campo, las restricciones de María y Carmen desempatan; las
  capacidades avanzadas de Luis se ofrecen mediante divulgación progresiva.
- Clases es el primer módulo posterior a #157-O0.
- Este plan vive como artefacto versionado separado y enlazado al plan UX/UI padre.

---

## 1. Visión consolidada

PlanearIA es una suite offline-first para docentes mexicanos. Reúne en un solo lugar herramientas
familiares para crear, conectar, asignar, comunicar, revisar y dar seguimiento, evitando descargas,
copias, recaptura y archivos perdidos entre aplicaciones.

La familiaridad es la puerta de entrada; la conexión nativa es el diferenciador. PlanearIA no copia
literalmente Office, Classroom, ChatGPT, Canva o WhatsApp. Conserva sus patrones reconocibles y los une
mediante objetos reales, contexto docente, retornos semánticos, sincronización visible e IA confirmable.

La promesa de experiencia es:

> Creo algo, PlanearIA entiende qué es, me sugiere dónde va, lo asigno, le doy seguimiento y obtengo
> reportes sin salir de la app.

### Actor y criterio provisional de desempate

El actor rector es el docente mexicano. Las proto-personas María, Luis y Carmen siguen siendo supuestos
IHC, no evidencia de campo. Mientras se realizan entrevistas reales:

- Se protege primero el trabajo de María y Carmen: conectividad inestable, Android gama media,
  accesibilidad, importación de métodos existentes, confianza y reconocimiento inmediato.
- Luis conserva caminos rápidos de IA, adjuntos y conexión entre módulos, revelados de forma progresiva
  sin volver obligatorio un flujo avanzado.
- Esta prioridad no degrada a una persona a “usuario secundario”; solo resuelve empates de diseño hasta
  contar con datos reales.

### Orden aprobado para resolver conflictos

1. Integridad del trabajo, offline-first, privacidad y control docente.
2. Familiaridad, reconocimiento y accesibilidad.
3. Conexión nativa, continuidad de contexto y reducción de pasos.
4. Distinción visual, pulido y momentos memorables.

Una decisión visual nunca puede sacrificar un nivel anterior para optimizar uno posterior.

---

## 2. Arquitectura de experiencias

| Experiencia visible | Trabajo principal | Entrada típica | Produce o transforma | Salida y retorno propios | No es |
| --- | --- | --- | --- | --- | --- |
| Escritorio | Orientar la jornada y lanzar herramientas | Inicio de sesión/onboarding o retorno global | Continuaciones, prioridades, alertas y accesos | Abre el objeto o módulo correcto y permite volver al Escritorio | Feed, landing, tablero de métricas o bento decorativo |
| Office Docente | Encontrar, importar y crear trabajo de oficina escolar | Escritorio, navegación global o handoff de otro módulo | Documentos, hojas y presentaciones | Vuelve a Office o al origen contextual; permite asignar/adjuntar | Destino genérico de todos los módulos |
| NotasPLAN | Redactar y editar documentos texto-primero | Office, Crear, importación o borrador IA | Documento, planeación, rúbrica o reporte editable | Office, origen contextual o selector de asignación | Chat, clase o editor visual libre |
| CalcuPLAN | Editar hojas, listas, fórmulas y tablas | Office, Crear o importación | Hoja, lista, asistencia o calificaciones mapeables | Office, preview confirmable o Clases por referencia | Dashboard analítico ni magia que oculta fórmulas |
| PresentaPLAN | Crear láminas lineales, rápidas y texto-primero | Office o Crear | Presentación, PDF/PPTX y material asignable | Office, modo presentar o destino confirmado | Lienzo libre, capas o clon de Diseño de materiales |
| Clases | Organizar grupos, asignar y dar seguimiento | Escritorio, navegación global o objeto asignado | Grupo, unidad, tarea y contexto de seguimiento | Regresa a la clase/objeto y abre herramientas especializadas para creación profunda | Office renombrado, catálogo de archivos o creador universal |
| Asistente de IA | Conversar con contexto y proponer transformaciones | Hub móvil, panel web o acción contextual | Borrador, copia, diff, resumen o acción propuesta | Regresa al objeto de origen o abre destino solo tras confirmación | Proveedor directo, automatización autónoma o requisito para trabajar |
| Diseño de materiales | Crear recursos visuales con plantillas/bloques | Escritorio, Crear, Office o transformación confirmada | Infografía, imprimible, material interactivo o recurso visual | Galería, origen o asignación confirmada | PresentaPLAN duplicado ni lienzo completo sin validar demanda |
| Mensajería | Colaborar profesionalmente con docentes | Navegación global, compartir o notificación | Conversación, mensaje y referencia a objeto compartido | Hilo, lista de conversaciones u objeto recibido | Feed público, red social o owner del recurso compartido |
| Agenda | Ver objetos reales en el tiempo | Escritorio, navegación global o recordatorio | Vista temporal y recordatorios | Abre la clase, tarea, documento o evento fuente | Base paralela de objetos ni ficha temporal muerta |
| Reportes | Interpretar evidencia académica y actuar | Clases, Agenda o navegación global | Resumen, alerta explicada y observación revisable | Regresa al grupo/alumno/dato que sustenta el resultado | Colección de KPIs de relleno ni gamificación infantil |
| Cuenta | Controlar identidad, sesiones, privacidad y preferencias | Chrome global o Más | Preferencias, sesión y controles de confianza | Retorna al origen o al hub Más | Pantalla decorativa ni owner de datos académicos |

### Capacidades transversales

- **Sync/offline:** guardado local, cola, reconciliación y estado visible mediante el contrato vigente;
  nunca decide reglas de dominio.
- **IA contextual:** sugiere dentro del módulo y conserva el origen; toda acción importante se confirma.
- **Asignar/Adjuntar:** selector compartido; no constituye una pantalla madre ni duplica owners.
- **Búsqueda y navegación:** encuentran objetos y conservan el módulo activo, el origen y el retorno.
- **Identidad, permisos y privacidad:** protegen objetos por `userId`; no redefinen su significado.
- **Notificaciones:** apuntan al objeto real y conservan entrega/lectura; no copian el estado de negocio.

### Presentación adaptativa de una misma arquitectura

- **Móvil:** cinco hubs — Inicio, Office, Clases, Asistente y Más. Más expone Diseño de materiales,
  Mensajería, Agenda, Reportes y Cuenta con sus nombres canónicos.
- **Tablet:** rail; las experiencias mantienen significado, contexto e historial.
- **Web:** sidebar con etiquetas y superficie/panel de IA cuando el ancho útil lo permita.
- Cambia la presentación, no el grafo conceptual. No se crean rutas paralelas ni módulos invisibles por
  breakpoint.

---

## 3. Glosario y nomenclatura

| Etiqueta visible vigente | Nombre interno o antecedente | Significado operativo | Uso prohibido |
| --- | --- | --- | --- |
| Escritorio | Inicio / Escritorio Docente | Ruta inicial, lanzador y tablero del día | Feed o landing |
| Office Docente | Office | Familia de NotasPLAN, CalcuPLAN y PresentaPLAN | Pantalla comodín para otros módulos |
| NotasPLAN | Editor documental | Documento Word/Docs familiar | Nombre de navegación global separado de Office sin decisión nueva |
| CalcuPLAN | Editor tabular | Hoja Excel/Sheets familiar | Reportes o listas académicas sin contexto/preview |
| PresentaPLAN | Editor de presentaciones | Láminas lineales texto-primero | Diseño de materiales |
| Clases | Classroom | Experiencia alrededor de un Grupo | Confundir Clase con el registro técnico Grupo |
| Asistente de IA | AsistePLAN / DocenteLLM | Chat y propuestas IA con contexto | Alternar `AsistePLAN` en el grafo activo |
| Diseño de materiales | DiseñaPLAN | Creación visual tipo Canva/Genially | Alternar `DiseñaPLAN` o fusionarlo con PresentaPLAN |
| Mensajería | ConectaPLAN | Comunicación profesional docente | Alternar `ConectaPLAN` o restaurar Feed/Social como entrada |
| Agenda | AgendaPLAN | Vista temporal de objetos existentes | Alternar `AgendaPLAN` o crear objetos duplicados |
| Reportes | ReportaPLAN | Evidencia y seguimiento académico | Alternar `ReportaPLAN` o mostrar métricas sin sustento |
| Cuenta | Cuenta/Accesibilidad/Seguridad | Control del usuario y sus preferencias | Perfil público, alumno o datos académicos |

Los nombres `AsistePLAN`, `DiseñaPLAN`, `ConectaPLAN`, `AgendaPLAN` y `ReportaPLAN` permanecen como
candidatos históricos de marca. No se usan en el grafo activo hasta que exista una decisión de naming
separada, una prueba de comprensión y una migración atómica de etiquetas, hotspots y evidencia.

### Términos de dominio que afectan la UX

- **Grupo:** registro académico administrado por el docente.
- **Clase:** espacio de trabajo construido alrededor de un Grupo.
- **Tarea:** actividad asignable; el storage/ruta legacy puede llamarse `entregables` sin crear otra
  entidad de producto.
- **EntregaTarea:** evidencia individual de un alumno para una Tarea; no es sinónimo de Tarea.
- **Recurso:** material reutilizable; compartir o asignar conserva su owner y una referencia.
- **Plantilla:** estructura reutilizable; usarla no duplica su fuente ni la convierte por sí sola en un
  objeto académico instanciado.

---

## 4. Fronteras entre módulos

| Frontera | Owner y contrato | Permitido | Prohibido |
| --- | --- | --- | --- |
| Office ↔ Clases | Office/Contenido posee el artefacto; Clases conserva una referencia confirmada | Asignar documento, hoja, presentación o recurso sin descargar | Copiar el contenido, redirigir todo Clases a Office o crear profundamente dentro de Clases |
| Office ↔ Diseño | Cada editor conserva su intención y objeto | Convertir o adjuntar mediante propuesta revisable | Compartir el mismo editor, toolbar o composición por conveniencia |
| PresentaPLAN ↔ Diseño | PresentaPLAN: láminas lineales; Diseño: bloques/lienzo visual | Importar/exportar o transformar con confirmación | Duplicar presentaciones en ambos sin distinguir intención |
| Clases ↔ Seguimiento/Reportes | Clases posee Grupo/Unidad/Tarea; Seguimiento posee asistencia, calificación y entrega | Abrir evidencia contextual y retornar al Grupo/Alumno/Tarea | Hacer que Reportes o una card sea owner del dato fuente |
| IA contextual ↔ Asistente | La contextual conserva el origen; el chat conserva conversación/resultado | Enviar solicitud aprobada y devolver borrador/copia/diff/resumen | Sobrescribir, asignar, guardar o enviar automáticamente |
| Mensajería ↔ Contenido | Mensaje guarda referencia y estado de envío; Contenido conserva ownership | Compartir un recurso que el receptor puede guardar o asignar | Transferir ownership, exponer datos académicos o fingir envío real |
| Agenda ↔ dominios | Agenda proyecta fechas de objetos owner | Deep link al objeto y recordatorio | Mantener una copia divergente del estado académico |
| Plantillas ↔ Office/Diseño | Planeación y Contenido conserva owner; Office aloja biblioteca | Diseño consume una plantilla mediante referencia/taxonomía explícita | Crear dos bibliotecas genéricas o resolver el drift desde una pantalla |
| Cuenta ↔ resto | Identidad/Cuenta posee usuario, rol y sesión | Aplicar permisos y preferencias en runtime | Confundir Usuario con Alumno o convertir Cuenta en owner académico |

Todo contrato cruzado futuro declara owner, consumidor, dirección, IDs/proyección, compatibilidad,
`userId`, sync, permisos, confirmación IA y rollback. Documentar el contrato no autoriza microservicios,
CQRS, event sourcing, colas paralelas ni providers globales nuevos.

### Contrato transversal heredado por cada ola

El prototipo Figma expresa roles perceptuales (`bg/canvas`, `bg/surface`, `text/primary`, `text/secondary`,
`border/divider`, `action/primary`, `selection`, estados y elevación). El runtime dueño elige la familia
de `ColorTokens` mediante `useAppTheme`; no copia hex ni declara paridad por coincidencia de valores.
Cuando falta un token, el change runtime debe proponerlo con contraste, compatibilidad y rollback. Figma
debe comunicar selección, riesgo, éxito, error, offline y sync pendiente con señales no dependientes del
color; `DaltonismoContext` es el contrato funcional y un modo Figma solo se reabre con evidencia de un
defecto cromático concreto.

Toda ola Figma conserva historial automático, frames históricos sin inicio activo, sección identificada
por módulo/estado/versión y evidencia enlazada del destino de restauración. Un checkpoint nombrado es
opcional y solo se afirma cuando el conector confirma su creación. La QA web usa `http://localhost:8081`,
confirma HTTP 200 y verifica el preflight del origen exacto antes de afirmar backend o sync; otro origen
requiere configuración `ALLOWED_ORIGINS` explícita. La aprobación humana de cada ola sigue siendo un gate
independiente y una aprobación previa no autoriza la siguiente.

---

## 5. Matriz de ground truth y nivel de paridad

Las carpetas locales de ground truth inspeccionadas contienen índices mínimos; el material completo fue
externalizado. Su existencia no equivale a contar con capturas suficientes para diseñar paridad alta.

| Experiencia | Paridad | Evidencia disponible | Brecha actual | Gate antes de diseño final |
| --- | --- | --- | --- | --- |
| Escritorio | Media | Figma Ola 2 y matriz de navegación #156 | La navegación está auditada; la aceptación visual #46 sigue separada | Frame candidato con preflight, estados y aprobación humana |
| Office Home/Crear | Alta | Figma vigente; `context/planeaciones-ground-truth/README.md` | Índice local sin material completo | Recuperar respaldo/Figma aprobado y probar reconocimiento tipo Office/Docs |
| NotasPLAN | Alta | Índice de planeaciones; runtime como baseline técnico futuro | Faltan referencias visuales completas y contraste editor web/nativo | Ground truth aprobado y spike técnico solo cuando exista issue/change |
| CalcuPLAN | Alta | `context/excel-ground-truth/README.md` | Índice sin hojas, fórmulas ni referencias completas | Recuperar respaldo o referencias vigentes antes de decidir grid/importación |
| PresentaPLAN | Alta | Referencias conceptuales del plan | No existe carpeta específica ni frame final aprobado | Crear/recuperar ground truth de Slides/PowerPoint y fijar frontera con Diseño |
| Clases | Alta | Baseline oficial 0.1 aprobado, inventario Figma/runtime, preflight y decisiones en `context/classroom-ground-truth/`; frames actuales draft | Falta construir y validar la composición candidata por breakpoint; no existe aprobación visual | Figma candidato después de `propose`, Present manual y comparación Playwright proporcional, sin copiar runtime ciegamente |
| Asistente de IA | Alta | Figma actual; `context/chat-ground-truth/README.md` | El índice mezcla chat y no sustituye ground truth específico ChatGPT/Gemini/NotebookLM | Ground truth específico, privacidad y estados de proveedor antes de UI final |
| Diseño de materiales | Alta | Concepto Figma actual | No existe `context/diseno-ground-truth/` ni material versionado suficiente | Ground truth Canva/Genially aprobado; draft reversible hasta entonces |
| Mensajería | Alta | Figma actual; `context/chat-ground-truth/README.md` | Índice mínimo; ejemplos reales requieren revisión de privacidad | Ground truth profesional anonimizado y estados de entrega honestos |
| Agenda | Media | Concepto Figma y visión documentada | Falta validación de jerarquía temporal con docentes | Concepto aprobado y objetos/datos fuente definidos |
| Reportes | Media | Concepto Figma y datos académicos existentes como fuentes futuras | No hay evidencia suficiente para métricas/gamificación | Datos reales anonimizados, trazabilidad y estado “datos insuficientes” |
| Cuenta | Funcional | Specs archivadas de preferencias/accesibilidad y tokens | La paridad visual no es el objetivo; sí la propagación real | Validación de accesibilidad, privacidad y preferencias en runtime cuando toque |
| Shell/sync | Funcional | Specs `adaptive-app-shell`, `reactive-breakpoints`, `sync-status-presentation` y #156 | No debe rediseñarse incidentalmente desde un módulo | Regresión por breakpoint, labels, foco, hotspot y retorno |

### Regla de uso

- Paridad alta sin ground truth suficiente permanece bloqueada para UI final.
- Puede producirse un draft reversible si declara la ausencia, pero no se presenta como aprobado ni fiel.
- El runtime se inspecciona con GitNexus primero; CodeGraph solo entra como fallback documentado.
- Playwright demuestra comportamiento del runtime; Figma y la revisión humana deciden el destino visual.
- No se exponen documentos, conversaciones, alumnos o escuelas reales en evidencia pública.

---

## 6. Principios vinculantes

1. Reconocimiento antes que memoria.
2. Familiaridad sin copia literal.
3. Conexión mediante objetos reales, no redirecciones genéricas.
4. Una tarea, jerarquía, entrada, salida y retorno propios por módulo.
5. Crear tipo-primero; intención escolar después y descartable.
6. Clases organiza y asigna; la creación profunda vive en herramientas especializadas.
7. IA contextual más conversación explícita; toda acción importante es confirmable.
8. Resultados IA revisables y originales intactos.
9. Guardado local inmediato, sync visible y trabajo manual disponible sin proveedor IA.
10. Accesibilidad, estados negativos y recuperación se diseñan desde el inicio.
11. Una arquitectura de información, adaptada por breakpoint.
12. Calma y precisión en trabajo frecuente; impacto visual solo cuando orienta.
13. Ground truth y evidencia humana preceden cualquier declaración de paridad/aprobación.
14. Presupuesto bajo/cero, monolito modular y cambios reversibles.

---

## 7. Anti-patrones

- Redirigir módulos distintos al selector, editor o home de Office.
- Reutilizar una pantalla genérica porque comparte cards, toolbar o grid.
- Convertir rutas legacy, carpetas o tabs actuales en arquitectura objetivo.
- Crear un feed o dashboard de métricas como inicio.
- Presentar “Crear” como lista de tareas escolares antes del tipo de archivo.
- Fusionar PresentaPLAN y Diseño de materiales.
- Hacer que Clases cree profundamente todos los artefactos.
- Alternar etiquetas `*PLAN` con nombres canónicos en el mismo grafo.
- Fingir red, IA, envío, autenticación o sincronización en el prototipo.
- Usar glass, blur, gradientes, bento, pills, cards, avatares o métricas como receta.
- Diseñar solo el happy path o dejar controles sin destino y retorno.
- Tratar una captura, API de Figma o tests verdes como aprobación humana.
- Abrir todos los issues del backlog o ejecutar más de un módulo grande a la vez.
- Copiar código, assets o contenido real de referencias sin licencia y privacidad verificadas.

---

## 8. Riesgos y drifts gobernados

| Riesgo o drift | Impacto | Mitigación |
| --- | --- | --- |
| #101 es el epic único en la spec operativa y #157 se etiqueta como subépica | Doble autoridad o jerarquía ambigua | #101 sigue gobernando; #157 no crea milestones ni muta la spec. Si la jerarquía requiere cambio normativo, se hace después mediante SDD. |
| “Ola 0” histórica frente a `#157-O0` | Reabrir fundaciones cerradas o confundir estado | Namespace obligatorio `#157-O*`; las Olas 0/1 del plan padre permanecen intactas. |
| Ground truth local incompleto | Paridad declarada desde memoria | Bloqueo explícito, recuperación de respaldo o referencias aprobadas antes de UI final. |
| El runtime se vuelve diseño objetivo | Conservación accidental del legacy | Runtime solo informa comportamiento/factibilidad; visión, plan y ground truth definen destino. |
| Mega-change de todo el prototipo | Revisión imposible y regresiones cruzadas | Un módulo/change a la vez; solo ola activa y siguiente con issues. |
| Clases arrastra Office o una composición genérica | Persiste el problema que originó #157 | Primera ola dedicada, ground truth alta, frontera explícita y retorno a Clases. |
| Office es demasiado amplio | Un solo change intenta home y tres editores | Separar Office Home/Crear, NotasPLAN, CalcuPLAN y PresentaPLAN en olas revisables. |
| Naming histórico reaparece | Grafo inconsistente y pruebas ambiguas | Etiquetas canónicas hasta una decisión de naming independiente. |
| Supuestos IHC se presentan como datos | Sesgo y falsa validación | Etiquetarlos como supuestos; #47 conserva consentimiento y síntesis anonimizadas. |
| Diseño atractivo sin estados/confianza | “AI slop” o prototipo engañoso | Preflight, Nielsen, Anti-Slop, accesibilidad y estados honestos por módulo. |

---

## 9. No objetivos

- No crear o modificar frames Figma durante `#157-O0`.
- No crear child issues, milestones ni un change OpenSpec antes de la aprobación de la versión 1.0.
- No implementar React Native, backend, sync, IA, mensajería, auth ni datos reales desde este plan.
- No reabrir #156 ni alterar su historial; futuras regresiones pertenecen al change que las introduzca.
- No reescribir ni renumerar las olas históricas de `PLAN_UXUI_NAVEGACION_GLOBAL.md`.
- No cerrar #46 o #47 mediante documentación, automatización o inferencia.
- No definir todavía nombres de marca finales para los cinco módulos con antecedentes `*PLAN`.
- No construir todos los editores de Office, el lienzo completo de Diseño ni una comunidad pública.
- No activar SQLite, crear infraestructura costosa, microservicios ni colas paralelas.
- No diseñar para alumnos o padres dentro de esta subépica docente.

---

## 10. Backlog propuesto por olas

Cada ola posterior a `#157-O0` empieza con entrevista específica al owner, inventario, ground truth,
criterios y aprobación de alcance. Una ola puede dividirse antes de `propose` si no cabe en un change
revisable; nunca se fusionan varias experiencias para ahorrar ceremonias.

| Ola | Experiencia | Resultado esperado | Dependencia principal | Estado |
| --- | --- | --- | --- | --- |
| `#157-O0` | Visión transversal | Contrato versionado, fronteras, paridad, plan y prioridad inicial | Matriz + entrevista + aprobación humana | Aprobada 2026-08-03 |
| `#157-O1` | Clases | Contrato y prototipo reconocible tipo Classroom, con jerarquía propia y handoffs semánticos | Versión 1.1; baseline 0.1 aprobado | Prototipo v1.3 aprobado en [#159](https://github.com/IgnacioBarEsp/PlanearIA/issues/159#issuecomment-5182823974); cierre SDD documental en curso; runtime no iniciado |
| `#157-O2` | Escritorio | Launcher + jornada accionable que representa la suite y recibe retornos de Clases | Clases validada; ground truth medio por consolidar | Prototipo v1.0 aprobado en [#163](https://github.com/IgnacioBarEsp/PlanearIA/issues/163#issuecomment-5286904053); 8 frames promovidos; cierre SDD documental en curso; runtime no iniciado |
| `#157-O3` | Office Home y Crear | Bandeja Office y creación tipo-primero sin absorber otros módulos | Escritorio; ground truth Office | Siguiente ola: hereda el rodeo por plantillas del selector propio de Office y la construcción de superficies de 768 y 390 px |
| `#157-O4` | NotasPLAN | Editor documental familiar y conectado | Office Home/Crear; ground truth documental | Pendiente |
| `#157-O5` | CalcuPLAN | Hoja familiar con importación/mapeo confirmable | Office Home/Crear; ground truth tabular | Pendiente |
| `#157-O6` | PresentaPLAN | Láminas lineales y frontera demostrable con Diseño | Office Home/Crear; ground truth presentaciones | Pendiente |
| `#157-O7` | Asistente de IA | Chat/panel con adjuntos, estados honestos y acciones revisables | Objetos reales de Clases/Office; ground truth IA | Pendiente |
| `#157-O8` | Diseño de materiales | Galería y creación visual diferenciada de PresentaPLAN | Office/Clases; ground truth Canva/Genially | Pendiente |
| `#157-O9` | Mensajería | Colaboración profesional con objetos compartidos y estados de entrega | Objetos compartibles; ground truth chat | Pendiente |
| `#157-O10` | Agenda | Vista temporal de objetos reales y retornos directos | Clases/Office con fechas | Pendiente |
| `#157-O11` | Reportes | Evidencia trazable, datos insuficientes y acciones prudentes | Clases/Seguimiento con datos representativos | Pendiente |
| `#157-O12` | Cuenta y cierre transversal | Confianza, preferencias y regresión integral del grafo | Módulos anteriores; specs de accesibilidad | Pendiente |

### Gate manual al cerrar cada ola de módulo

1. **Aprobación de intención:** el owner confirma tarea, frontera, entradas, salidas y no objetivos.
2. **Ground truth:** referencia suficiente y privacidad/licencia revisadas; paridad alta no admite N/A.
3. **Preflight visual:** Anti-Slop, zona, jerarquía, estados, accesibilidad y evidencia siguiente.
4. **Revisión candidata:** desktop, tablet y móvil; labels activos, foco, contraste y toque mínimo.
5. **Present manual:** recorridos, overlays, destinos y retornos reproducidos por una persona.
6. **Aprobación visual:** evidencia humana explícita; Figma/API/tests no la reemplazan.
7. **IHC de campo:** se ejecuta conforme a #47 y la cronología global; ajusta el backlog antes de la
   siguiente inversión de alto costo.

### Definition of Ready por módulo

Antes de `propose` deben existir:

- versión 1.0 de este contrato aprobada;
- issue/item de Product OS bajo la gobernanza de #101/#157, solo para ola activa o siguiente;
- entrevista específica cerrada;
- inventario Figma y, si se compara runtime, GitNexus primero y Playwright después;
- ground truth suficiente o bloqueo explícito;
- tarea docente, diferenciador, fronteras y retornos;
- criterios observables por breakpoint y estados negativos;
- evidencia esperada, riesgos, dependencias, costo/licencias, rollback y no objetivos;
- `openspec:ready:propose` en PASS antes de crear el change.

### Definition of Done por módulo

- El módulo tiene composición, tarea y retorno propios; no redirige genéricamente a Office.
- Los handoffs nombran el artefacto, el destino y la salida semántica.
- Desktop, tablet y móvil conservan arquitectura, labels, estado activo y controles de al menos 44 pt.
- Loading, empty, error, offline y capacidades no disponibles son honestos o tienen N/A justificado.
- Nielsen no conserva severidad 3–4; el preflight Anti-Slop y accesibilidad están completos.
- Los golden journeys aplicables se reproducen en Present y la matriz de navegación se actualiza.
- La aprobación visual humana queda enlazada; no se infiere.
- La revisión adversarial no conserva Blockers ni Majors.
- Rollback por historial Figma/PR y trazabilidad documental quedan declarados; el mínimo Figma es historial
  automático, frames previos, sección/version identificable y destino de restauración documentado.

---

## 11. Resultado del primer módulo y recomendación siguiente

Clases debe ser `#157-O1` porque:

1. El owner la identifica como la mayor brecha entre prototipo y visión.
2. Su familiaridad es crítica: organiza el trabajo que recibe de Office, Diseño y Asistente.
3. Obliga a demostrar que un módulo puede tener jerarquía propia sin romper la suite ni los retornos.
4. Prueba temprano fronteras de Grupo, Unidad, Tarea, seguimiento y AssignSheet.
5. Existe runtime funcional que podrá usarse como baseline técnico, sin convertirlo en diseño objetivo.

### Condición de arranque

La carpeta `context/classroom-ground-truth/` ya contiene el baseline oficial 0.1 aprobado, flujo deseado,
decisiones de entrevista, inventario de drift y preflight por superficie. El change
`reconstruir-clases-experiencia` fue propuesto y validado para producir solo el prototipo Figma y su
evidencia; runtime queda para un issue/change posterior a la aprobación visual. GitNexus fue la primera
consulta; al omitir superficies clave, CodeGraph se usó como fallback documentado.

La condición se cumplió el 2026-08-04: el owner aprobó la v1.3 después de corregir la continuidad global.
Se promovieron solo los frames de Clases; Office y los puentes/fallbacks de los demás hubs siguen
`candidate`. La aprobación no incluye runtime, #46 ni validación IHC de campo.

### Decisiones de la entrevista específica de Clases

- Entrada clases-primero con “Lo que sigue”, clases reconocibles y Crear/Importar clase.
- Cuatro áreas: Tablón, Trabajo de clase, Personas y Seguimiento; calificaciones vive en Seguimiento.
- Tareas por revisar, entregas vencidas y promedio/riesgo son las señales prioritarias.
- Resumen compacto al entrar y resolución dentro de Seguimiento; Tablón no contiene métricas.
- Creación académica breve en Clases; creación profunda por handoff a Office/Diseño.
- Una actividad puede existir sin archivo; adjuntar o crear un recurso es opcional.

### Resultado de `#157-O2 Escritorio`

El owner aprobó Escritorio el 2026-08-13 tras recorrer los tres breakpoints en Figma Present. Se promovieron
los 8 frames propios y se corrigió el retorno a Escritorio en 44 controles: 20 de escritorio que devolvían al
Escritorio antiguo, 12 del rail de Clases tablet que estaban muertos y 12 de Clases móvil que apuntaban al
lanzador antiguo. La ola dejó dos estados de límite por breakpoint (`345:968` y `345:1006`) que declaran
honestamente que una superficie no existe todavía en ese tamaño, en vez de saltar a escritorio.

La ola también corrigió el método de auditoría: contar por sección y clasificar frames por nombre producía
falsos verdes. El método válido es un BFS desde cada frame de entrada, clasificando por ancho de frame.

La aprobación no incluye runtime, `#46`, entrevistas IHC ni los módulos puente.

### Siguiente módulo: `#157-O3 Office Home y Crear`

Office sigue porque ya recibe la mayor parte de los handoffs de Escritorio y porque hereda dos deudas
concretas: su selector propio conserva un rodeo por plantillas en `Documento` que rompe la simetría con los
otros cuatro tipos, y no tiene superficies propias en 768 ni 390 px. Esa ola debe construirlas y sustituir
los puentes `T-G` y `M-G` de Office por superficies gobernadas.

### Contexto histórico de la autorización de `#157-O2`

Escritorio sigue porque ya es el origen y retorno de Clases, pero su launcher candidate todavía no prueba
una jornada docente propia. Esta ola deberá convertirlo en dock de herramientas más tablero accionable
diario, nunca feed, landing decorativa, bento de tarjetas ni resumen genérico de módulos. Debe abrir
objetos reales, conservar retornos y mostrar sync/offline de forma calmada.

La autorización vigente cubre issue, entrevista específica, ground truth, baseline y artefactos SDD. No
cubre `apply`, Figma candidato ni runtime: antes de cualquiera de esas acciones el owner debe aprobar
explícitamente los artefactos de la ola.

---

## 12. Criterio de cierre de la subépica

#157 puede cerrarse cuando:

- La versión vigente de visión y fronteras está aprobada y trazable.
- Cada experiencia activa tiene ficha de tarea, ground truth, diferenciador, límites, entrada y salida.
- Ningún módulo activo usa Office o una pantalla genérica como sustituto de su experiencia.
- El grafo conserva un inicio, nomenclatura estable, retornos semánticos y adaptación por breakpoint.
- Los módulos de paridad alta cuentan con ground truth suficiente y aprobación humana.
- Los golden journeys del prototipo se reproducen manualmente sin destinos rotos ni éxitos falsos.
- Las entrevistas docentes y su síntesis ajustaron los supuestos y el backlog sin falsificar #47.
- La revisión final no conserva Blockers/Majors de navegación, accesibilidad, confianza o fronteras.
- #101 refleja el estado operativo y las specs archivadas conservan el comportamiento aprobado.

Cerrar #157 no significa que todo el runtime esté implementado ni que la suite esté lanzada a docentes.

---

## 13. Decisiones abiertas que no bloquean la versión vigente

| Decisión | Estado | Momento de resolución |
| --- | --- | --- |
| Naming final de los módulos con antecedentes `*PLAN` | Abierta; labels activos confirmados | Trabajo de naming separado, no durante un módulo |
| Corrección de proto-personas/journeys | Supuesto IHC | Tras 3–5 entrevistas con consentimiento y síntesis anónima |
| Material completo de ground truth por módulo | Dependencia externa | Definition of Ready de cada módulo |
| Privacidad de datos de alumnos con IA cloud | Abierta por diseño técnico | Change futuro del Asistente, antes de adjuntos reales |
| Necesidad de adaptar la spec de Product OS para representar subépicas | Drift gobernado | Solo si la jerarquía operativa no puede expresarse sin cambiar el contrato archivado |

---

## 14. Rollback y recuperación

- Este documento puede retirarse mediante PR normal; el plan padre, #101, #156 y sus specs permanecen
  intactos.
- Los frames históricos no se borran. Cada ola Figma usa historial, estado draft/aprobado/obsoleto y
  matriz de navegación para restaurar la versión anterior.
- Un módulo no aprobado no altera el siguiente. Su issue/change permanece abierto o se revierte antes de
  activar otra ola grande.
- Ninguna decisión de prototipo autoriza migraciones destructivas de datos, storage o rutas runtime.

---

## 15. Gate de aprobación de esta versión

**Estado:** versión 1.4 vigente. La v1.2 fue aprobada por instrucción explícita del owner el 2026-08-04.

La v1.2 registra la aprobación visual de Clases v1.3 enlazada en #159 y habilita preparar la ola
`#157-O2 Escritorio`. No aprueba los puentes visuales de otros módulos, runtime de Clases, #46 ni
entrevistas docentes. Para toda ola posterior, la aprobación de proposal/design/spec/tasks es un gate
manual separado y obligatorio antes de ejecutar `apply`.
