# Sanear el rollout de theming runtime (Ola 2a)

## Why

El rollout de theming runtime quedo a medias y su registro dejo de decir la verdad. La lista `LEGACY_COLORS_ROLLOUT` de `.eslintrc.cjs` declara 61 archivos legacy autorizados a importar `COLORS` estatico, pero solo 57 lo importan de verdad: dos archivos ya no existen y otros dos se migraron sin retirarlos del registro. Las pantallas legacy siguen congelando el tema al importar, asi que cambiar a modo oscuro no las repinta.

La causa raiz no son las pantallas, es la ausencia de guardia. La spec vigente `theming-runtime-propagation` ya exige que "la validacion del repositorio la mantiene sincronizada con el codigo real", y el propio comentario de `.eslintrc.cjs` afirma que "CI lo verifica en cada PR" y que la lista "solo puede encoger". Nada de eso existe: `LEGACY_COLORS_ROLLOUT` aparece unicamente en `.eslintrc.cjs` en todo el repositorio. **El repositorio incumple hoy una requirement archivada**, y por eso las cuatro entradas muertas se acumularon sin que nadie lo notara.

Este change resuelve `debt-b279f64f815b` (issue [#145](https://github.com/IgnacioBarEsp/PlanearIA/issues/145), Ola 2a del epic [#141](https://github.com/IgnacioBarEsp/PlanearIA/issues/141)) del plan `Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`.

## What Changes

- **Guardia ejecutable del registro (nueva).** `scripts/checkThemingRollout.mjs` mas su test de harness fallan cuando una entrada de la lista no existe en disco, cuando existe pero ya no importa `COLORS` (entrada muerta), o cuando la lista supera su techo registrado. Convierte en verificable la requirement que hoy solo esta escrita.
- **Politica fix-on-touch formalizada.** Toda pantalla que un change toque sale de la lista en ese mismo PR. Deja de ser una nota en un comentario y pasa a ser comportamiento con `SHALL` y escenarios.
- **Saneamiento del registro.** Se retiran las cuatro entradas obsoletas: `src/components/FloatingActionIcons.tsx` y `src/navigation/AppTabsNavigator.tsx` (ya no existen), `src/components/SyncStatusBanner.tsx` y `src/navigation/StackNavigator.tsx` (existen y ya no importan `COLORS`). El comentario del override se corrige: hoy declara un conteo de 2026-07-17 y una verificacion de CI inexistente.
- **Migracion del batch por alcanzabilidad QA (6 pantallas).** Se migran sus referencias `COLORS.` a `useAppTheme()` mas fabrica `getStyles({ colors, isDark, scaled, highContrast })` y salen de la lista en el mismo PR: `ClassroomHomeScreen` (ruta de GJ0, el unico golden journey vigente y evidencia obligatoria de todo change de UI), la cadena de GJ3 `ListaGruposScreen`, `DetalleGrupoScreen`, `CapturarCalificacionesScreen` y `PromediosCalificacionesScreen`, y `CrearTareaGrupoScreen` (GJ2).
- **ContenidoScreen se trata aparte.** Importa `COLORS` y no lo usa nunca: pinta desde una paleta local `DT` de 23 colores con 111 referencias, de los cuales 13 no tienen equivalente en tokens. Se retira el import muerto y su entrada de la lista; no se migra la paleta. El fork queda registrado con excepcion valida.
- La lista pasa de 61 entradas declaradas (57 reales) a **50 entradas, todas vivas**.
- Sin cambios de aspecto: `COLORS === lightTheme` por identidad de referencia, asi que en tema claro la migracion es equivalente valor por valor. El repintado real se demuestra en tema oscuro.
- **Los literales hex quedan fuera de esta ola, documentados.** Las 6 pantallas conservan literales hex sin token equivalente (96 unicos en el batch: 40 reutilizan un token existente y 56 no tienen ninguno). Migrarlos exigiria 56 tokens nuevos uno a uno (paleta de 62 a 118, en su mayoria de un solo uso: token sprawl, es decir deuda nueva) o consolidarlos en ~17 roles semanticos, que cambia colores visiblemente y es un redisenio. Ademas pertenece a otra capability. Se documenta cuantos literales conserva cada pantalla y la reconciliacion se propone aparte contra `design-tokens` (#80).

No hay cambios BREAKING: los contextos de preferencia y las 51 pantallas legacy restantes conservan su contrato y su fallback estatico.

## Capabilities

### New Capabilities

Ninguna. El comportamiento pertenece a una capability existente y se refuerza alli en vez de crear una capability paralela que compita por la misma fuente de verdad.

### Modified Capabilities

- `theming-runtime-propagation`: la requirement "El color estatico queda prohibido salvo en la lista legacy rastreada" se refuerza. Hoy exige que el registro se mantenga sincronizado con el codigo real pero no obliga a ninguna verificacion ejecutable, y el repositorio la incumple con cuatro entradas muertas. Pasa a exigir una guardia que falle ante entradas muertas y ante crecimiento del registro, y se agrega la politica fix-on-touch como requirement propia.

## Impact

- **Codigo de producto (6 pantallas migradas):** `src/screens/classroom/ClassroomHomeScreen.tsx` (13 `COLORS.`), `src/screens/grupos/ListaGruposScreen.tsx` (40), `src/screens/grupos/DetalleGrupoScreen.tsx` (109), `src/screens/calificaciones/CapturarCalificacionesScreen.tsx` (23), `src/screens/calificaciones/PromediosCalificacionesScreen.tsx` (19) y `src/screens/grupos/tareas/CrearTareaGrupoScreen.tsx` (51). Suman 5,101 lineas y 255 referencias `COLORS.`.
- **Codigo de producto (1 pantalla, solo import muerto):** `src/screens/contenido/ContenidoScreen.tsx`. Se elimina una linea de import; su paleta `DT` no se toca.
- **Configuracion:** `.eslintrc.cjs` (lista y comentario del override).
- **Harness:** `scripts/checkThemingRollout.mjs` y `src/__tests__/harness/themingRollout.test.ts` nuevos; un script npm para invocar la guardia.
- **Tests:** pruebas de repintado por pantalla migrada y fixtures positivo/negativo de la guardia.
- **Sin impacto** en `src/sync`, AsyncStorage, claves `@planearia:*`, aislamiento por `userId`, backend, IA ni dependencias. Sin cambios de bundle: cambia el origen de los colores, no su cantidad.
- **Superficies declaradas:** `ui` (UI visible: exige HTTP 200, Playwright por breakpoint y Nielsen) y `harness` (guardia nueva: exige paridad de harness, parche opsx y fixtures).

## No objetivos

- No migrar los 50 archivos legacy restantes. Quedan gobernados por fix-on-touch y protegidos por la guardia; drenan al tocarse.
- No reconciliar literales hex contra tokens, no agregar tokens nuevos y no tocar `src/themes`. No activar `react-native/no-color-literals`. No migrar la paleta `DT` de ContenidoScreen.
- No resolver `debt-3d3ea5ba87ac` (breakpoints, issue #106): es la Ola 2b.
- No adoptar `expo-blur` ni la fuente de marca (`debt-5862d25288fa`): van a excepcion measure-first al cerrar el epic.
- No rediseniar UI, ni cambiar la estructura de navegacion, ni inventar paletas o tokens nuevos. Esto es saneamiento, no producto.
- No usar `react-doctor --fix` a ciegas.
- No tocar el saneamiento del harness (#129/#132/#133/#136) ni #126, ni el fallo preexistente del fixture de GitNexus (`Function:` frente a `Const:` en `scripts/gitNexusFts.mjs`), que pertenece al plan `preparacion-operativa-sdd-harness`.
- No arreglar la falla local de `src/__tests__/harness/spreadsheetDependency.test.ts` en Windows (preexistente, verde en CI).
- No subir Expo SDK ni activar SQLite.
- No capturar evidencia visual de rutas que no se alcanzan de verdad, ni declarar verde un scanner por riesgo solo aceptado.
