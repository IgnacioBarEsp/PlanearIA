# Revisión adversarial — `reconstruir-office-experiencia`

**Fecha:** 2026-09-04
**Alcance:** issue [#177](https://github.com/IgnacioBarEsp/PlanearIA/issues/177), ola `#157-O3`.
**Fuentes:** `proposal.md`, `design.md`, las dos specs delta, `tasks.md`, `brownfield-baseline.md`,
evidencia 01 a 05, y el estado real del grafo Figma leído por Plugin API.
**Limitación declarada:** la revisión la ejecuta la misma sesión que implementó. No sustituye a un revisor
independiente; para compensarlo, cada hallazgo se sostiene con una medición sobre el archivo, no con
lectura de la propia narrativa.

## Alineación spec / tareas

- Los siete requirements de `office-prototype-experience` y los dos de `figma-prototype-navigation` tienen
  superficie construida y aristas verificables.
- Las 43 tareas se recorrieron hasta 8.4. Las de cierre siguen abiertas por dependencia, no por omisión.
- El gate humano existe, se ejecutó en dos rondas y produjo condiciones reales que cambiaron el diseño.

## Hallazgos

| Severidad | Área | Hallazgo | Evidencia | Arreglo |
| --- | --- | --- | --- | --- |
| **Major** | Spec vs implementación | La spec exige los tres tipos visibles **sin scroll en los tres breakpoints**. En tablet la tercera tarjeta terminaba en 1212 px, contra un corte real de 1024: quedaba fuera de pantalla | Medición del grafo: `Crear · Presentación · tablet` en 928-1212 | **Corregido en implementación.** Cabecera y tarjetas compactadas; la creación cierra ahora en 1018 y las cuatro superficies de tablet cumplen |
| **Major** | Spec vs implementación | Dos escenarios prometían que elegir un tipo o una plantilla "representa el objeto en blanco / con esa estructura". La decisión D-O3-6 excluye deliberadamente representar el editor, y ambos controles entregan el estado de límite. La spec afirmaba algo que el diseño niega | `distinctDestinations` de la auditoría: todos los controles de creación aterrizan en `superficie pendiente` | **Corregido en spec.** Los dos escenarios describen ahora la entrega de la superficie del tipo en el mismo ancho, y declaran que mientras los editores pertenezcan a olas posteriores esa superficie es el estado de límite |
| **Major** | Spec vs implementación | La spec decía "Asignar SHALL reutilizar la hoja Asignar aprobada". La implementación usa una **copia**, porque el original encadena `SWAP` hacia el editor de actividad de Clases y habría roto el retorno a Office que la misma spec exige. Reutilizar y clonar no son lo mismo, y la spec no podía cumplirse literalmente | Reacciones de `193:450`: `Acción · cancel` y `Acción · choose` con `SWAP` a `193:423` | **Corregido en spec.** El requirement distingue ahora prototipo de runtime: el prototipo parte de la hoja aprobada con el cableado limpiado, y el runtime reutiliza el componente único que posee `cross-surface-assignment` |
| **Minor** | Spec vs implementación | El escenario de acciones desde móvil decía "llega a una superficie de 390 del módulo owner". Asignar abre un overlay de 358 propiedad de Office, y en tablet adjuntar cae al estado de límite porque Mensajería no existe en 768 | Auditoría de destinos | **Corregido en spec.** El escenario admite el overlay dimensionado y el estado de límite cuando el módulo owner no tiene superficie en ese ancho |
| **Minor** | Cobertura | El estado vacío y el tablero de estados existen **sólo en escritorio**. Ningún escenario exige los tres anchos, así que no incumple, pero el módulo declara superficies propias en tres tamaños | `vacioSurfaces` y `estadosSurfaces` de la auditoría | **No se corrige aquí.** Se propone como deuda `optional-improvement`; construirlos ahora ampliaría el alcance después del veredicto |
| **Minor** | Artefactos | El `TLDR.md` seguía diciendo que la sección permanecía candidate y hablaba de 25 superficies | Lectura del artefacto | **Corregido.** Refleja las dos rondas del gate, las 33 superficies y la aprobación |
| **Minor** | Artefactos | `readiness.json` tenía todas sus referencias en "Pendiente" | Lectura del artefacto | **Corregido** con las rutas y resultados reales |
| **Pregunta** | Auditoría | Un overlay (`Office · importar archivo`) se abre desde escritorio y tablet, así que su contexto de dispositivo es ambiguo | Verificado: emite **cero** aristas de navegación, sólo `CLOSE` | Sin acción. El clasificador lo reporta en vez de silenciarlo |
| **Pregunta** | Auditoría | Un overlay abierto desde otro overlay no hereda contexto de forma transitiva | Afecta a descargar, dónde se usa y duplicar desde el menú de tablet; los tres emiten sólo `CLOSE` | Sin acción. Limitación declarada en la evidencia 02 y en la matriz de navegación |
| **Aceptado** | UX | Tres controles sin reacción: la pestaña `Todos` de las superficies sin filtrar | Figma rechaza navegar de un frame a sí mismo | Resuelto de raíz cambiando el significante: dejó de ser píldora. El owner lo validó en la ronda 2 |

## Lo que se intentó romper y aguantó

- **Clasificación por nombre.** Se buscó si algún frame acreditaba su breakpoint por su nombre en vez de su
  ancho. La spec lo prohíbe con un escenario propio y la auditoría lo comprueba: `277:958` sigue
  clasificado como escritorio pese a llamarse tablet.
- **Aristas salientes.** Se contaron también las que salen de la sección hacia Escritorio, Clases y los
  puentes: 320 aristas, cero cruces.
- **Tokens falsos.** Se forzó el modo Oscuro y se leyeron los valores resueltos. Un hex escrito a mano no
  habría cambiado; los tres breakpoints cambian y revierten.
- **Objetivo táctil.** Dos pasadas: la primera elevó 36 controles, la segunda descubrió 9 más que la
  primera no vio porque entonces no tenían reacción. Resultado final: 0.
- **Solapamientos.** Comprobación geométrica par a par dentro de cada tarjeta de creación: 0.

## Lo que esta revisión no puede afirmar

- Que la composición funcione con docentes reales: las entrevistas están pausadas (#47) y los supuestos IHC
  siguen abiertos.
- Que el contraste cumpla con daltonismo y alto contraste activados: eso se mide en runtime, no en Figma.
- Que el costo de la descarga con fidelidad de formato sea asumible: está declarado como no dimensionado y
  trasladado al handoff.

## Veredicto

**PASS CON HUECOS.** Tres Majors encontrados y corregidos dentro del change —uno en implementación y dos en
spec—, más cuatro Minors de los que tres quedan corregidos y uno se propone como deuda. Cero Blockers.

Archivar es aconsejable una vez capturada la deuda y con el gate de archive en verde.
