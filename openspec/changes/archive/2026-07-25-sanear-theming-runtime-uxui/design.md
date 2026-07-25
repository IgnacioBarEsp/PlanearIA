# Design: sanear el rollout de theming runtime (Ola 2a)

## Context

El change `theming-runtime` (#78) creo el mecanismo de consumo en runtime (`useAppTheme()` mas fabricas `getStyles`) y dejo el resto del rollout gobernado por una lista en `.eslintrc.cjs` llamada `LEGACY_COLORS_ROLLOUT`. La spec vigente `theming-runtime-propagation` exige que esa lista sea el registro verificable del pendiente y que "la validacion del repositorio la mantiene sincronizada con el codigo real".

Estado verificado sobre `development@80e8f4c`:

- La lista declara 61 entradas; solo 57 importan `COLORS`. Dos archivos ya no existen (`FloatingActionIcons.tsx`, `AppTabsNavigator.tsx`) y dos ya migraron sin salir del registro (`SyncStatusBanner.tsx`, `StackNavigator.tsx`).
- `LEGACY_COLORS_ROLLOUT` aparece **unicamente** en `.eslintrc.cjs` en todo el repositorio. No existe ninguna verificacion, pese a que el comentario afirma que CI la comprueba en cada PR y que la lista solo puede encoger.
- El trinquete de ESLint si funciona en su mitad: 0 archivos fuera de la lista importan `COLORS`.
- `COLORS === lightTheme` por identidad de referencia (`src/themes/colors.ts`), asi que migrar no cambia nada en tema claro.

La conclusion que ordena este diseno: **la deuda no es "quedan pantallas por migrar", es "el registro del rollout no esta verificado y por eso miente"**. Una lista sin guardia se degrada en silencio, y eso ya paso.

### Bounded contexts afectados (obligatorio)

Contexto afectado: **Experiencia y Preferencias**, owner de tema, fuente, daltonismo y accesibilidad como experiencia de uso.

Este change es **intra-contexto y no requiere contrato cruzado**. Cambia unicamente *como* una pantalla consume las preferencias de presentacion (de `COLORS` estatico a `useAppTheme()`), sin tocar ninguna entidad, regla ni dato de los contextos a los que pertenecen las pantallas migradas (`Classroom y Organizacion Academica` para grupos y tareas; `Seguimiento y Evaluacion` para calificaciones). Esas pantallas ya eran consumidoras de la presentacion; cambia su fuente de color, no su lenguaje de dominio.

No aplican invariantes de `userId` ni de `src/sync`: el change no lee, escribe ni sincroniza datos academicos, y no toca repositorios, colas ni almacenamiento. Tampoco aplica la invariante de confirmacion IA.

## Goals / Non-Goals

**Goals:**

- Convertir en verificable la requirement que hoy solo esta escrita: una guardia ejecutable que falle ante entradas muertas y ante crecimiento del registro.
- Dejar el registro diciendo la verdad: 50 entradas, todas vivas.
- Formalizar fix-on-touch como comportamiento con `SHALL`, no como nota en un comentario.
- Migrar las referencias `COLORS.` de 6 pantallas elegidas por alcanzabilidad QA, de modo que el repintado se pueda demostrar con evidencia no vacua.
- Dejar declarado, con numeros por pantalla, cuanto falta para que esas pantallas tematicen al 100%.

**Non-Goals:**

- Migrar los 50 archivos legacy restantes.
- Reconciliar literales hex contra tokens, agregar tokens nuevos o tocar `src/themes`.
- Migrar la paleta local `DT` de `ContenidoScreen`.
- Rediseniar UI, cambiar navegacion, activar `react-native/no-color-literals`.
- Resolver `debt-3d3ea5ba87ac` (breakpoints, Ola 2b) o `debt-5862d25288fa` (blur y fuente de marca).

## Decisions

### Decision 1: la guardia vive en un script propio, no en la regla de ESLint

**Elegido:** `scripts/checkThemingRollout.mjs`, invocado por `npm run check:theming-rollout` y cableado como test de harness en `src/__tests__/harness/themingRollout.test.ts`.

**Por que:** ESLint solo puede opinar sobre archivos que analiza. Una entrada muerta es, por definicion, un archivo que ESLint ya no marca (no existe, o ya no importa `COLORS`), asi que la regla no puede detectarla nunca: su silencio es indistinguible del exito. La guardia necesita razonar sobre *la lista misma* como dato, comparandola contra el arbol real. Ese es un chequeo de inventario, no de lint.

**Alternativas descartadas:**

- *Un plugin de ESLint propio:* mucha maquinaria para leer un array; ademas seguiria atado al conjunto de archivos analizados.
- *Solo un paso de CI en el workflow:* no reproducible en local y se salta en cada corrida local, que es justo cuando se introduce el drift. Cablearlo como test de Jest lo hace correr en `npm test`, en el gate de archive y en CI, con una sola fuente.

**Precedente:** identico al de `scripts/checkSourceEncoding.mjs` mas `src/__tests__/harness/sourceEncoding.test.ts` de #132, que ya probo este patron.

### Decision 2: la guardia comprueba tres invariantes, no una

1. **Existencia:** toda entrada apunta a un archivo que existe.
2. **Vitalidad:** todo archivo listado sigue importando `COLORS`. Una entrada que ya no importa es una migracion no registrada y debe salir.
3. **Trinquete:** la lista no supera un techo declarado en el propio script. Solo puede encoger.

**Por que las tres:** el drift observado tuvo las dos primeras causas (dos borrados y dos migraciones sin retirar). El techo cubre la tercera direccion, que todavia no ocurrio pero que el mensaje de la propia regla invita a hacer ("agregalo a la lista de LEGACY_COLORS_ROLLOUT"). Con solo el techo, las entradas muertas seguirian invisibles; con solo vitalidad, la lista podria crecer sin freno.

**Sobre el techo:** es una constante en el script, no un archivo de estado aparte. Bajarla es parte de migrar, y subirla exige editar el script con intencion, lo que un review ve. No pretende ser infalsificable: pretende que crecer sea un acto deliberado y visible, en vez del default silencioso de hoy.

### Decision 3: la lista lee de `.eslintrc.cjs`, sin duplicar la fuente

La guardia hace `require('.eslintrc.cjs')` y localiza el override cuyo `rules['no-restricted-imports'] === 'off'`. No se copia la lista a un JSON paralelo.

**Por que:** dos copias de la misma verdad es exactamente el fallo que este change viene a corregir. La lista tiene que seguir siendo el registro unico, y la guardia su verificador, no su duplicado.

**Riesgo asumido:** la guardia depende de la forma del override. Se mitiga con una asercion explicita: si no encuentra exactamente un override que apague `no-restricted-imports`, falla con mensaje claro en vez de pasar en vacio.

### Decision 4: "migrada" significa que la pantalla no importa `COLORS`, no que tematice al 100%

Las 6 pantallas conservan literales hex sin token equivalente. La spec, el brownfield-baseline y la evidencia declaran el numero por pantalla.

**Por que:** la deuda registrada es el congelamiento por importar `COLORS` estatico, y eso queda resuelto. Afirmar "tematiza por completo" seria falso y convertiria la evidencia en vacua. Se declara el residuo con numeros en vez de esconderlo.

**Alternativas descartadas** (ambas entrevistadas y rechazadas el 2026-07-24):

- *56 tokens uno a uno:* paleta de 62 a 118, en su mayoria de un solo uso, con nombres derivados de un hex arbitrario. Es token sprawl, es decir deuda nueva, contra la directiva del epic.
- *~17 tokens semanticos:* paleta sana pero consolidar 56 valores en 17 cambia colores visiblemente. Es un redisenio y pertenece a `design-tokens` (#80).

### Decision 5: `ContenidoScreen` sale del batch con excepcion, y no por conveniencia

Importa `COLORS` sin usarlo (import muerto) y pinta desde una paleta local `DT` de 23 colores con 111 referencias, 13 sin equivalente en tokens, incluido su azul de marca `#004580` frente al `primary` real `#1676D2`.

**Elegido:** retirar el import muerto y su entrada de la lista, y registrar el fork `DT` como hallazgo verificado con excepcion valida.

**Por que:** el import muerto es una mentira del registro y se corrige. La paleta forkeada, en cambio, no es migrable bajo las reglas de este epic: exigiria inventar tokens o remapear a tokens lejanos, y ambas cosas estan prohibidas. Registrarla con excepcion la deja visible y con fecha de revision en vez de perderla.

**Por que una excepcion y no un item abierto:** un item `open` nacido en un flujo `remediation` dispara `remediation-new-debt` y mantiene el plan pausado (`policy.mjs`), lo que impediria cerrar el epic. Un item en `accepted-exception` no cuenta como abierto (`isOpenDebt` exige `status === 'open'`), asi que registra la verdad sin fabricar un bloqueo. La excepcion caduca y obliga a revisarla.

**Sustituta:** `CrearTareaGrupoScreen` (ruta `CrearTareaGrupo`, GJ2, 51 usos de `COLORS.`, sin paleta forkeada), que conserva el tamano del batch y su anclaje a journeys ejecutables.

### Decision 6: el patron de migracion por pantalla

Cada pantalla pasa de `const styles = StyleSheet.create({...COLORS.x...})` a nivel de modulo, a una fabrica `getStyles({ colors, isDark, scaled, highContrast })` memoizada por pantalla:

```
const { colors, isDark, scaled, highContrast } = useAppTheme();
const styles = useMemo(() => getStyles({ colors, isDark, scaled, highContrast }), [colors, isDark, scaled, highContrast]);
```

**Por que `useAppTheme` y no `useTheme`:** `useTheme()` entrega colores sin el filtro de daltonismo. `useAppTheme` compone los cuatro contextos y ya aplica `applyDaltonismo`. Usar `useTheme` dejaria la pantalla ciega al daltonismo sin ningun error visible.

**Por que memoizar:** `useAppTheme` memoiza `colors` por identidad, asi que la fabrica solo recrea el `StyleSheet` cuando cambia una preferencia, no en cada render. Sin el `useMemo` la migracion introduciria una regresion de rendimiento real.

**Colores fuera de `styles`** (props `color` de iconos, `backgroundColor` inline) se resuelven desde `colors` en el cuerpo del componente. Se conserva `breakpoint` fuera de la entrada: ninguna de las 6 lo necesita, y anadirlo obligaria a tocar archivos ya migrados.

## Responsive

Ninguna de las 6 pantallas cambia de layout: la migracion sustituye el origen del color, no la estructura. Se verifica que los tres breakpoints de `useBreakpoint` (movil `<768`, tablet `768-1279`, escritorio `>=1280`) conservan su presentacion, con capturas por breakpoint en ambos temas. No se introducen archivos `.web.tsx` ni `.native.tsx`.

## Estandar de Excelencia Visual (seccion 1.9)

Este change es saneamiento en zona **sobria** (pantallas de trabajo: listas, calificar, detalle de grupo), donde la seccion 1.9.1 pide calma y precision, no espectaculo. No se agregan micro-interacciones ni motion nuevos: anadirlos seria redisenio encubierto y contradiria el alcance aprobado. El checklist anti-slop se aplica como verificacion de no regresion (jerarquia tipografica, estados disenados, densidad por breakpoint), no como licencia para rediseniar. No se toca blur ni la fuente de marca (regla 1.9.4, `debt-5862d25288fa`).

## Risks / Trade-offs

- **La migracion cambia el aspecto sin querer** -> Mitigacion: `COLORS === lightTheme` por identidad de referencia, asi que en tema claro cada valor es identico. Se compara captura antes/despues en claro por breakpoint; cualquier diferencia visible es un bug de la migracion, no un efecto esperado.
- **La evidencia visual resulta vacua (misma captura en ambos temas)** -> Mitigacion: el repintado se prueba alternando el tema en runtime desde `CuentaScreen` sin recargar, y se verifica que las capturas clara y oscura difieren de verdad. Una captura identica entre temas es un fallo, no una prueba.
- **La pantalla repinta al remontar pero no en runtime** -> Mitigacion: el `useMemo` depende de la identidad de `colors`, que cambia al cambiar la preferencia; la prueba navega y alterna sin recargar la app.
- **Regresion de daltonismo, escala de fuente o alto contraste** -> Mitigacion: se consume `useAppTheme` (no `useTheme`), que ya aplica `applyDaltonismo`, y se verifica cada preferencia sobre al menos una pantalla migrada.
- **Perdida de rendimiento por recrear `StyleSheet` en cada render** -> Mitigacion: fabrica memoizada por identidad de preferencias.
- **La guardia se rompe si cambia la forma de `.eslintrc.cjs`** -> Mitigacion: falla explicitamente cuando no encuentra exactamente un override reconocible, en vez de pasar en vacio; cubierto por fixture negativo.
- **La guardia pasa por vacuidad** (lista vacia, o no lee nada) -> Mitigacion: fixtures positivo y negativo obligatorios; el test afirma que la guardia detecta una entrada muerta inyectada y una lista crecida, no solo que el arbol actual pasa.
- **DetalleGrupoScreen es grande** (2,018 lineas, 109 referencias) -> Mitigacion: es sustitucion mecanica de un identificador; se apoya en typecheck y en la comparacion visual por breakpoint. Se migra en su propia tarea para aislar el diff.
- **Los literales hex restantes dan la impresion de trabajo terminado** -> Mitigacion: se declara el numero por pantalla en spec, baseline y evidencia, y se propone el seguimiento contra `design-tokens` (#80).

## Migration Plan

1. Guardia y saneamiento del registro primero: con la guardia en verde sobre un registro ya saneado, cualquier migracion posterior queda protegida desde su primer commit.
2. `ContenidoScreen`: retirar import muerto y su entrada.
3. Migrar las 6 pantallas, una tarea por pantalla, retirando su entrada en el mismo commit. Bajar el techo de la guardia conforme encoge la lista.
4. Evidencia visual por breakpoint y por tema; React Doctor sobre las rutas tocadas.
5. Assessment con `resolves` de `debt-b279f64f815b` y la excepcion del fork `DT`.

**Rollback:** revertir el PR restaura las 6 pantallas a `COLORS` estatico, devuelve sus entradas a la lista y elimina la guardia. Si una sola pantalla regresa mal, se revierte ese archivo y se reinserta su entrada: las 6 migraciones son independientes entre si y la guardia acepta el techo mas alto mientras la entrada este viva. Ningun cambio toca almacenamiento persistente, asi que no hay migracion de datos que revertir.

## Open Questions

Ninguna. Las tres decisiones materiales (alcance del batch, tratamiento de `ContenidoScreen` y tratamiento de los literales hex) se entrevistaron y aprobaron el 2026-07-24. La excepcion del fork `DT` requiere owner y aprobador, que se declaran en el assessment de cierre.
