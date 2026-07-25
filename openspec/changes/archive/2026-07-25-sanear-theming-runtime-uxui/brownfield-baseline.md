# Brownfield baseline: sanear el rollout de theming runtime (Ola 2a)

Estado medido sobre `development@80e8f4c` el 2026-07-24. Documenta solo la superficie que este change toca.

## Superficies tocadas

Superficies declaradas: `ui` y `harness`.

- Configuracion de lint: el override `LEGACY_COLORS_ROLLOUT` de `.eslintrc.cjs`, que es el registro del rollout de theming.
- Harness: un script de verificacion nuevo y su prueba, sin tocar los gates existentes.
- UI: seis pantallas de trabajo que migran su fuente de color, mas una septima de la que solo se retira una importacion no utilizada.

No se tocan `src/sync`, AsyncStorage, claves `@planearia:*`, backend, gateway de IA, `src/themes`, navegacion ni `package.json` mas alla de un script npm.

## Fuentes de verdad actuales

- `.eslintrc.cjs`: unica fuente del registro del rollout. La regla `no-restricted-imports` prohibe importar `COLORS` desde `**/themes/colors` y desde el barrel `**/types`, y el override lista los archivos legacy autorizados.
- `src/themes/useAppTheme.ts`: unico punto de consumo de las preferencias en runtime; compone tema, tamano de fuente, daltonismo y alto contraste, y aplica `applyDaltonismo`.
- `src/themes/colors.ts`: tokens de color. `COLORS` es la misma referencia que `lightTheme`.
- `openspec/specs/theming-runtime-propagation/spec.md`: comportamiento vigente del consumo de preferencias y del registro legacy.
- `qa/golden-journeys.json`: manifiesto de QA visual, define los journeys y los anchos por nivel.
- `.project-os/debt/registry.json`: item `debt-b279f64f815b`, cuya remediacion registrada es la politica fix-on-touch.

## Comportamiento vigente

El registro declara 61 entradas y solo 57 importan `COLORS`. Dos apuntan a archivos borrados (`src/components/FloatingActionIcons.tsx`, `src/navigation/AppTabsNavigator.tsx`) y dos a archivos ya migrados que nunca salieron de la lista (`src/components/SyncStatusBanner.tsx`, `src/navigation/StackNavigator.tsx`).

No existe ninguna verificacion del registro: `LEGACY_COLORS_ROLLOUT` aparece unicamente en `.eslintrc.cjs` en todo el repositorio, pese a que su comentario afirma que CI lo comprueba en cada PR y que la lista solo puede encoger. La mitad que si funciona es el trinquete de ESLint: cero archivos fuera de la lista importan `COLORS`.

Las pantallas legacy congelan el tema al importar: cambiar a modo oscuro no las repinta. `ContenidoScreen` figura en el registro pero importa `COLORS` sin usarlo nunca; pinta desde una paleta local propia de 23 colores con 111 referencias.

## Comportamiento objetivo

El registro queda en 50 entradas, todas vivas, y pasa a estar respaldado por una verificacion ejecutable que falla ante una entrada huerfana, ante una entrada muerta y ante el crecimiento de la lista, y que falla de forma explicita si no puede leer el registro. La politica fix-on-touch queda escrita como requirement con escenarios, no como comentario.

Seis pantallas dejan de importar `COLORS` y obtienen sus colores de `useAppTheme()` mediante una fabrica `getStyles` memoizada, de modo que cambiar tema, tamano de fuente o daltonismo las repinta en runtime sin reiniciar ni remontar. `ContenidoScreen` pierde su importacion no utilizada y su entrada, sin migrar su paleta local.

Migrada significa que la pantalla ya no importa los colores estaticos; no significa que obtenga todos sus colores de tokens. El residuo de valores fijos se declara por pantalla.

## Compatibilidad legacy

Las 50 pantallas que siguen en el registro conservan intacto su comportamiento y su fallback estatico: la regla las sigue autorizando y ninguna cambia de aspecto. `ThemeContext`, `FontSizeContext`, `DaltonismoContext` y `AccessibilityPreferencesContext` conservan su contrato publico; el change consume `useAppTheme`, que se apoya en ellos sin reemplazarlos.

En tema claro no hay cambio visual posible por construccion: `COLORS` y `lightTheme` son la misma referencia, asi que cada valor migrado es identico. Las pantallas migradas conservan sus estados de carga, vacio, error y sin conexion, sus etiquetas accesibles y sus areas de toque.

No hay migracion de datos, ni cambios de esquema, ni claves de almacenamiento afectadas, por lo que revertir es puramente revertir codigo.

## Owner de spec y contexto

Capability owner: `theming-runtime-propagation`, modificada por este change. La capability vecina `settings-accessibility-preferences` conserva su contrato y no se toca.

Bounded context: **Experiencia y Preferencias**, owner de tema, fuente, daltonismo y accesibilidad. El change es intra-contexto y no requiere contrato cruzado: cambia como una pantalla consume la presentacion, sin tocar entidades ni reglas de `Classroom y Organizacion Academica` ni de `Seguimiento y Evaluacion`, a los que pertenecen las pantallas migradas.

Plan owner: `uxui-navegacion-global`. Issue: [#145](https://github.com/RitualBoat/PlanearIA/issues/145), Ola 2a del epic [#141](https://github.com/RitualBoat/PlanearIA/issues/141). Item de deuda: `debt-b279f64f815b`.

## Evidencia actual

- Conteo del registro y entradas invalidas: lectura programatica de `.eslintrc.cjs` contra el arbol real, 2026-07-24, 61 entradas declaradas y 57 con importacion real.
- Ausencia de guardia: busqueda de `LEGACY_COLORS_ROLLOUT` en todo el repositorio, un unico resultado en `.eslintrc.cjs`.
- Cobertura del trinquete: cero archivos fuera de la lista importan `COLORS`.
- Alcanzabilidad QA: cruce de `qa/golden-journeys.json` con las rutas legacy; GJ0 atraviesa `ClassroomHome` y `Contenido`, GJ3 es integramente legacy y GJ2 incluye `DetalleGrupo` y `CrearTareaGrupo`.
- Residuo de literales: 96 valores hex unicos en el batch, de los que 40 tienen token equivalente y 56 no.
- Baseline de calidad: `npm run typecheck` y `npm run lint -- --quiet` en exit 0; React Doctor full con 0 errores y 190 warnings; CI, CD Builds, React Doctor y Agent Harness Parity en success sobre 80e8f4c; `npm run debt:check` PASS con el plan activo en 2 de 5.

## Fuera de alcance

- Los 50 archivos legacy restantes del registro.
- La reconciliacion de literales hex contra tokens y cualquier token nuevo: exigiria duplicar la paleta o consolidar con cambio visual, y pertenece a `design-tokens` (#80).
- La paleta local de `ContenidoScreen`, que queda registrada con excepcion aprobada.
- `debt-3d3ea5ba87ac` (breakpoints, issue #106): es la Ola 2b.
- `debt-5862d25288fa` (blur y fuente de marca): excepcion measure-first al cerrar el epic.
- El fallo preexistente del fixture de GitNexus en `scripts/gitNexusFts.mjs`, que pertenece al plan `preparacion-operativa-sdd-harness`.
- La falla local de `src/__tests__/harness/spreadsheetDependency.test.ts` en Windows, preexistente y verde en CI.
- Redisenio de UI, cambios de navegacion, activacion de `react-native/no-color-literals` y subida de Expo SDK.
