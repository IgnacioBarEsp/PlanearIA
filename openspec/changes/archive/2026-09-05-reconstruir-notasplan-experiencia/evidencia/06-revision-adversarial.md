# Revisión adversarial — `reconstruir-notasplan-experiencia`

**Fecha:** 2026-09-05
**Alcance:** issue [#180](https://github.com/IgnacioBarEsp/PlanearIA/issues/180), ola `#157-O4`.
**Fuentes:** proposal, design, las dos specs delta, tasks, brownfield-baseline, evidencia 01 a 05 y el
estado real del grafo Figma leído por Plugin API.
**Limitación declarada:** la ejecuta la misma sesión que implementó. Para compensarlo, cada hallazgo se
sostiene con una medición sobre el archivo, no con lectura de la propia narrativa.

## Alineación spec / tareas

- Los diez requirements de `notasplan-prototype-experience` y los dos de `figma-prototype-navigation`
  tienen superficie construida y aristas verificables.
- Las 48 tareas se recorrieron hasta 8.4.
- El gate humano existió, corrió tres rondas y produjo cuatro condiciones que cambiaron el diseño.

## Hallazgos

| Severidad | Área | Hallazgo | Evidencia | Arreglo |
| --- | --- | --- | --- | --- |
| **Major** | Spec vs implementación | La spec exige la lente de formulario **alcanzable en los tres breakpoints**. Medido: sus diez entradas venían todas de tablet y móvil. **En escritorio no había forma de abrirla** | Conteo de aristas entrantes a `523:980`, `523:1121` y `523:1195` por breakpoint de origen | **Corregido en implementación.** Se añadió `Ver formulario de la sección` a las catorce superficies de escritorio con índice. Entradas ahora: 14 escritorio, 6 tablet, 4 móvil |
| **Major** | Spec vs implementación | Un escenario prometía que abrir la lente "estando en sesiones o en evaluación" muestra los campos **de esa sección**. Las tres lentes declaran siempre `04 SESIONES` | Lectura del eyebrow y título de las tres lentes | **Corregido en spec.** El escenario describe ahora que la pantalla declara de qué sección son los campos, y que el prototipo demuestra la lente sobre Sesiones como instancia. Construir siete lentes por breakpoint sería veintiuna superficies para demostrar un contrato que ya se lee |
| **Major** | Spec vs implementación | El escenario del índice decía que "la hoja se sitúa en ese encabezado". En tablet y móvil el panel sólo cierra | Las catorce filas de los paneles de índice emiten `CLOSE` | **Corregido en spec.** Dos escenarios: con la página visible la sección se enfoca; en pantalla pequeña el panel cierra y devuelve al documento, y el prototipo **no finge** un desplazamiento que no representa |
| **Minor** | Cobertura | El estado de documento nuevo vacío existe como panel del tablero, no como superficie propia. Office le dedicó un frame | `Estado · vacio` en `525:980` | **No se corrige.** La spec pide diseñarlo, no dedicarle superficie, y el panel declara su salida. Se propone como observación, no como deuda |
| **Minor** | Artefactos | `TLDR.md` hablaba de nueve estados y del aviso de reimportación, retirado por el owner | Lectura del artefacto | **Corregido** |
| **Minor** | Artefactos | `readiness.json` tenía sus referencias en "Pendiente" | Lectura del artefacto | **Corregido** con rutas y resultados reales |
| **Pregunta** | Alcance | Este change edita el cableado de una sección **aprobada** (Office, #177) | 61 controles recableados | Sin acción. La spec archivada de Office lo anticipaba, el cambio se acota a las entradas de tipo documento y queda declarado en la evidencia y en la matriz de navegación. Office conserva sus cero fugas |
| **Pregunta** | Trazabilidad | La evidencia archivada de #177 conserva sus cifras de auditoría originales, que ya no reflejan el estado actual de su sección | — | Sin acción. Es un registro histórico de aquel cierre; el estado vigente vive en la matriz de navegación, que sí se actualizó |

## Lo que se intentó romper y aguantó

- **Fugas por overlay.** Se resolvió el contexto de dispositivo de cada overlay por quién lo abre. Detectó
  una fuga real —el selector de nivel abierto desde tablet navegaba a un frame de 1440— que la
  clasificación por ancho no puede ver. Corregida con una variante de tablet.
- **Callejones sin salida.** Comprobación nueva tras el hallazgo del owner: 0 overlays sin acción de
  salida.
- **Destinos plausibles pero equivocados.** La comprobación de corrección de destino se extendió a los
  comandos de la barra, que era justo el grupo que no cubría cuando el defecto pasó.
- **Contenido fuera del papel.** Comprobación nueva tras la ronda 2: ningún elemento del documento queda
  por encima del borde de la hoja, en las siete vistas de sección.
- **Tokens falsos.** Modo oscuro forzado y revertido en los tres editores, incluida la hoja.
- **Objetivo táctil.** 0 controles bajo 44 pt desde la primera pasada.
- **Solapamientos.** Comprobación geométrica dentro de la hoja y dentro del índice: 0.

## Lo que esta revisión no puede afirmar

- Que la composición funcione con docentes reales: las entrevistas siguen pausadas (#47).
- Que las siete secciones sean las que pide cada escuela: `context/planeaciones-reales/` está
  externalizado.
- Que la migración a documento-primero sea viable con los datos ya guardados: es trabajo de runtime y está
  declarado como el costo mayor de la ola.
- Que el contraste cumpla con daltonismo y alto contraste activados: se mide en runtime, no en Figma.

## Veredicto

**PASS CON HUECOS.** Tres Majors encontrados y corregidos dentro del change —uno en implementación, dos en
spec—, tres Minors de los que dos quedan corregidos y uno se clasifica como observación. Cero Blockers.

Archivar es aconsejable una vez capturada la deuda y con el gate de archive en verde.
