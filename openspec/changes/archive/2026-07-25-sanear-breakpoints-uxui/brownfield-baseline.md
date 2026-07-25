# Brownfield baseline: sanear la fuente de breakpoint (Ola 2b)

Levantado sobre `development@25be40d` el 2026-07-24. Documenta solo la superficie que este change toca.

## Superficies tocadas

27 archivos de `src/` que llaman `useWindowDimensions()` directo, mas la infraestructura de guardia:

- **24 pantallas:** `alumnos/` (CrearAlumno, ListaAlumnos, NotasAlumno, ReportesAlumno), `planeaciones/`
  (DocEditor, EscanerPlantilla, ExportarPlaneacion, ImportarPlaneacion), `social/` (Social,
  BuscadorPerfiles), `feed/` (Feed, PostDetail), `classroom/` (ClassroomGroup,
  DetalleActividadClassroom), `grupos/` (DetalleGrupo, ReportesGrupo), `auth/Registro`, `ayuda/Ayuda`,
  `contenido/Contenido`, `cuenta/EditarPerfil`, `notificaciones/Notificaciones`, `onboarding/Onboarding`,
  `perfil/Perfil`, `plantillas/BibliotecaPlantillas`.
- **2 componentes compartidos:** `components/CrearNuevoModal.tsx`, `components/ExpandedStatsModal.tsx`.
- **1 hook:** `hooks/useEditorMode.ts`.
- **Infraestructura nueva:** `scripts/checkBreakpointSource.mjs`, su script npm en `package.json`,
  `src/__tests__/harness/breakpointSource.test.ts` y sus fixtures.

`src/hooks/useBreakpoint.ts` se lee pero **no se modifica**.

## Fuentes de verdad actuales

- `src/hooks/useBreakpoint.ts`: fuente reactiva unica creada por #79. Define `BREAKPOINTS`
  (`tablet: 768`, `desktop: 1280`), `getBreakpoint(width)`, `resolveResponsive()` y el hook
  `useBreakpoint()`, que devuelve `width`, `height`, `fontScale`, `breakpoint`, `isMobile`, `isTablet`
  e `isDesktop`, memoizados por valor.
- `src/navigation/AppShell.tsx` y `src/navigation/shellOptions.ts`: consumidores canonicos del rango
  desde #81. Determinan barra inferior, rail o sidebar.
- `openspec/specs/reactive-breakpoints/spec.md`: verdad de comportamiento vigente. Ya exige fuente
  reactiva unica, prohibe `Dimensions.get()` y protege los umbrales propios de las pantallas migradas.
- `src/utils/responsive.ts`: solo conserva `isWeb()` (plataforma, no ancho). `responsive()` y
  `getScreenDimensions()` fueron jubilados por #79.

## Comportamiento vigente

Los 27 archivos leen `useWindowDimensions()` de `react-native` y comparan el ancho contra un umbral
propio. **Todos son reactivos hoy**: `useWindowDimensions` se actualiza en resize y rotacion, asi que
ninguna de esas superficies esta congelada y no hay bug observable por el docente.

Umbrales vigentes verificados archivo por archivo: 768 en 10 archivos; 768 y 1280 en `ContenidoScreen`;
780 en `ClassroomGroupScreen`; 820 en `DetalleActividadClassroomScreen`; 900 en `CrearNuevoModal` y
`BibliotecaPlantillasScreen`; 960 en `EscanerPlantillaScreen`; 980 en `ReportesGrupoScreen`,
`ExportarPlaneacionScreen` e `ImportarPlaneacionScreen`; 1080 en `CrearAlumnoScreen`,
`ListaAlumnosScreen` y `ReportesAlumnoScreen`; 1100 en `NotasAlumnoScreen`; umbral configurable por
parametro en `useEditorMode`. Tres archivos (`DetalleGrupoScreen`, `OnboardingScreen`, `DocEditorScreen`)
no clasifican rango: solo derivan pixeles del ancho.

No existe ninguna verificacion que impida a un archivo nuevo leer `useWindowDimensions()` directo.
`Dimensions.get()` esta ausente de `src/` (comprobado; solo aparece en comentarios historicos).

## Comportamiento objetivo

Cero archivos de producto fuera de `src/hooks/useBreakpoint.ts` leen `useWindowDimensions()`. Los 11
archivos cuyo umbral coincide con un limite de rango lo expresan mediante los flags del hook y conmutan
en el mismo punto que el shell. Los 16 restantes conservan su umbral o su calculo en pixeles, leyendo el
ancho del hook. Una guardia ejecutable falla ante un consumidor no autorizado, una entrada muerta del
registro o un crecimiento del techo.

**A igual ancho, cada pantalla presenta exactamente el mismo layout que antes.**

## Compatibilidad legacy

No hay formato, clave ni contrato legacy en juego. El change no toca AsyncStorage, claves
`@planearia:*`, `src/sync`, esquemas de datos, backend ni proyecto nativo. `useWindowDimensions` sigue
existiendo y siendo valido: lo que cambia es quien esta autorizado a llamarlo.

La lista autorizada de la guardia es el mecanismo de compatibilidad: si un archivo necesitara volver a
leer la primitiva, se agrega a la lista de forma explicita y visible en review, en vez de hacerlo en
silencio. Los tests quedan fuera del alcance de la guardia por regla estructural, no por lista, porque
necesitan mockear la primitiva para simular anchos.

## Owner de spec y contexto

Spec: `openspec/specs/reactive-breakpoints/spec.md`, creada por #79 y ampliada por este change.
Plan owner: `uxui-navegacion-global`
(`Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`). Item de deuda:
`debt-3d3ea5ba87ac`. Issue: #106. Epic: #141. Contexto DDD: intra-contexto, sin contrato cruzado; el
ancho de ventana es presentacion transversal y no lenguaje de dominio.

## Evidencia actual

- Barrido reconfirmado el 2026-07-24: `grep -rl useWindowDimensions src --include=*.tsx --include=*.ts | grep -v useBreakpoint`
  devuelve 27 archivos.
- `Dimensions.get()` ausente de `src/`, verificado por grep.
- Solape verificado programaticamente: 10 de los 27 consumidores estan en las 50 entradas del override
  `LEGACY_COLORS_ROLLOUT` de `.eslintrc.cjs`, que apaga `no-restricted-imports` por completo.
- `npm run debt:check` PASS; plan `uxui-navegacion-global` activo en 1/5.
- `npm run harness:doctor` PASS tras `gitnexus:repair` y `gitnexus:verify`; unico WARN `mcp-smoke` por
  OAuth interactivo de expo/figma, preexistente y ajeno a esta superficie.

## Fuera de alcance

- Cambiar cualquier umbral existente, alinear los umbrales de contenido con los rangos canonicos o
  redisenar cualquier pantalla.
- Modificar `src/hooks/useBreakpoint.ts`, los rangos 768/1280 o el AppShell de #81.
- Migrar tema, tokens o literales de color. `debt-f7ff020d5dee` (paleta local de `ContenidoScreen`)
  queda intacto con su excepcion vigente hasta 2027-07-24, aunque el archivo se toque para el ancho.
- Convertir `StyleSheet` de modulo en fabricas `getStyles`.
- La falla local preexistente de `src/__tests__/harness/spreadsheetDependency.test.ts` en Windows
  (tarball vendorizado de SheetJS, de #133/#126; pasa en CI) y los `<button>` anidados del menu de
  cuenta.
