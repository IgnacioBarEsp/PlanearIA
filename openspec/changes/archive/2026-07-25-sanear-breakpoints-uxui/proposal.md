# Sanear la fuente de breakpoint: unificar los 27 consumidores directos (Ola 2b)

Issue: [#106](https://github.com/IgnacioBarEsp/PlanearIA/issues/106). Epic de saneamiento: [#141](https://github.com/IgnacioBarEsp/PlanearIA/issues/141).
Item de deuda: `debt-3d3ea5ba87ac`. Plan: `uxui-navegacion-global`.

## Why

`breakpoints-reactivos` (#79) creo `useBreakpoint()` como fuente reactiva unica de ancho y rango, y
`app-shell-navegacion` (#81) la adopto en el shell: la barra es inferior por debajo de 768, rail entre
768 y 1279, y sidebar desde 1280. Pero **27 archivos de `src/` siguen llamando `useWindowDimensions()`
directo** y comparan anchos crudos contra umbrales propios sin pasar por la fuente unica.

No hay bug: `useWindowDimensions()` ya es reactivo y esas 27 superficies se reacomodan hoy. El costo es
de gobernanza y se manifiesta de dos formas concretas:

1. **Dos fuentes de verdad conviven.** Los rangos viven en `useBreakpoint`, pero 27 archivos no los
   consultan. Cambiar un rango obliga a auditar el arbol entero en vez de un modulo.
2. **No hay trinquete.** Un archivo nuevo puede volver a `useWindowDimensions()` directo sin que nada
   lo detecte, igual que pasaba con `COLORS` antes de #78.

El punto 2 es el que hace que esto no se resuelva solo. La Ola 2a (#145) probo el modo de fallo: la
lista `LEGACY_COLORS_ROLLOUT` afirmaba en un comentario que CI la verificaba, no existia tal verificador,
y acumulo cuatro entradas invalidas sin que nada fallara. Una migracion sin guardia deja el mismo hueco.

## What

**Migrar los 27 consumidores a `useBreakpoint()` y dotar la fuente unica de una guardia ejecutable.**

`useBreakpoint()` ya devuelve `width`, `height` y `fontScale` ademas de `breakpoint` y los flags, asi que
enrutar por el hook no obliga a ningun consumidor a adoptar un rango que no necesita. Los 27 migran:

- **Grupo A (11 archivos): umbral canonico.** Comparan contra 768 o 1280, que son exactamente los limites
  de `BREAKPOINTS`. Pasan a los flags semanticos (`isMobile`/`isTablet`/`isDesktop`), con lo que conmutan
  en el mismo punto que el shell y dejan de repetir el numero.
- **Grupo B (13 archivos): umbral de contenido a medida.** Usan 780, 820, 900, 960, 980, 1080 o 1100.
  Conservan su umbral y leen `width` del hook. Cambia de donde se lee, no cuando se reacomoda.
- **Grupo C (3 archivos): solo dimensiones crudas.** `DetalleGrupoScreen` (ancho de grafica),
  `OnboardingScreen` (ancho de diapositiva) y `DocEditorScreen` (ancho de pagina) no clasifican rangos:
  calculan pixeles. Migran la fuente sin adoptar rango.

**Guardia:** `scripts/checkBreakpointSource.mjs` (`npm run check:breakpoint-source`), cableada como gate
de Jest, con lista unica de fuentes autorizadas y techo. Verifica tres invariantes: consumidor no
autorizado, entrada muerta y techo que solo puede bajar.

### Por que la guardia no puede ser una regla de ESLint

El issue proponia `no-restricted-imports`, "el mismo mecanismo que #78 uso para COLORS". **Verificado que
seria vacuo en 10 de los 27 archivos.** El override del registro `LEGACY_COLORS_ROLLOUT` en
`.eslintrc.cjs` apaga esa regla entera (`"no-restricted-imports": "off"`) para sus 50 entradas, y 10 de
los consumidores estan en esa lista. ESLint apaga por nombre de regla, no por restriccion individual:
cualquier restriccion nueva colgada de ese nombre queda desactivada ahi, sin aviso. Y
`scripts/checkThemingRollout.mjs` exige que exista **exactamente un** override que la apague, asi que
duplicar overrides romperia la guardia de la Ola 2a.

Es el mismo razonamiento estructural de #145: la mitad del contrato que el lint no puede ver hay que
verificarla tratando el registro como dato y comparandolo contra el arbol real.

## Rango de dispositivo frente a umbral de contenido

Un **rango de dispositivo** (768/1280) describe la clase de pantalla y lo comparte el shell. Un **umbral
de contenido** (780-1100) describe cuando cabe una segunda columna en una pantalla concreta. Son
conceptos distintos y la spec vigente ya protege el segundo: el escenario "Los umbrales propios no
cambian" de `reactive-breakpoints` exige que una pantalla migrada conserve su umbral.

Normalizar los umbrales de contenido a los rangos canonicos cambiaria el layout en las bandas
intermedias (por ejemplo, `ClassroomGroupScreen` dejaria de ser compacta entre 768 y 779). Eso es
rediseno y esta fuera del alcance de un saneamiento. Se aplica el mismo criterio que #79 uso con sus 6
consumidores mixtos.

## No objetivos

- No redisenar ninguna pantalla ni cambiar ningun umbral existente. A igual ancho, misma presentacion.
- No tocar `useBreakpoint` ni los rangos 768/1280 definidos por #79, ni el AppShell de #81.
- No migrar tema ni tokens: eso es #80 y su rollout. No tocar `debt-f7ff020d5dee` (paleta local de
  `ContenidoScreen`), ya aceptado con excepcion vigente hasta 2027-07-24.
- No convertir `StyleSheet` de modulo en fabricas `getStyles`: #79 ya dejo `src/` sin `Dimensions.get()`,
  asi que no queda ningun estilo congelado por ancho que justifique la conversion.
- No usar `react-doctor --fix` a ciegas. No subir Expo SDK.
- No arreglar la falla local preexistente de `spreadsheetDependency` en Windows ni los `<button>`
  anidados del menu de cuenta: son hallazgos ajenos a esta superficie.
