# Design: sanear la fuente de breakpoint (Ola 2b)

## Context

`useBreakpoint()` (`src/hooks/useBreakpoint.ts`, creado en #79) es la fuente reactiva unica de ancho y
rango. Expone `width`, `height`, `fontScale`, `breakpoint` y los flags `isMobile`/`isTablet`/`isDesktop`,
memoizados por valor. Los rangos son movil `<768`, tablet `768-1279`, escritorio `>=1280`.

El shell ya la consume (`src/navigation/AppShell.tsx`, `src/navigation/shellOptions.ts`). Pero 27
archivos llaman `useWindowDimensions()` directo. Ninguno esta roto: todos son reactivos. Lo que falta es
que la fuente unica **sea** unica, y que algo lo verifique.

Estado verificado el 2026-07-24 sobre `development@25be40d`: 27 consumidores (24 pantallas, 2
componentes, 1 hook), `Dimensions.get()` ausente de `src/`, `debt:check` PASS con el plan
`uxui-navegacion-global` activo en 1/5.

### Bounded contexts afectados (obligatorio)

Este change es **intra-contexto y no requiere contrato cruzado**. Toca superficies de varios contextos
(`Classroom y Organizacion Academica` en grupos y classroom; `Seguimiento y Evaluacion` en reportes;
`Contenido y Planeacion` en planeaciones y plantillas; `Identidad y Cuenta` en auth, perfil y cuenta;
`Comunicacion` en feed, social y notificaciones), pero en todas cambia unicamente **de donde se lee el
ancho de la ventana**. No toca ninguna entidad, regla, invariante ni dato de dominio, y ningun contrato
entre contextos. El ancho de ventana es un detalle de presentacion transversal, no lenguaje de dominio.

## Goals / Non-Goals

**Goals.** Que `useBreakpoint()` sea la unica lectura de dimensiones en `src/`. Que reintroducir
`useWindowDimensions()` directo falle la validacion. Que los consumidores con umbral canonico conmuten en
el mismo punto que el shell. Cero cambio de presentacion a igual ancho.

**Non-Goals.** Cambiar umbrales de contenido. Redisenar. Tocar `useBreakpoint`, los rangos o el AppShell.
Migrar tema o tokens. Convertir `StyleSheet` de modulo en fabricas.

## Decisions

### Decision 1: la guardia vive en un script propio, no en una regla de ESLint

El issue #106 proponia `no-restricted-imports`. **Seria vacuo en 10 de los 27 archivos**, verificado:

```
node -e 'const cfg=require("./.eslintrc.cjs"); ...'
consumidores: 27 | rollout: 50
SOLAPE (no-restricted-imports esta OFF en estos): 10
```

El segundo override de `.eslintrc.cjs` apaga `no-restricted-imports` por completo para las 50 entradas
del registro `LEGACY_COLORS_ROLLOUT`, y 10 consumidores de ancho estan ahi. ESLint apaga **por nombre de
regla**: no existe forma de apagar la restriccion de `COLORS` y conservar la de `useWindowDimensions` si
ambas cuelgan del mismo nombre. Y `scripts/checkThemingRollout.mjs` exige exactamente un override que la
apague, asi que separar overrides romperia la guardia de la Ola 2a.

Alternativa descartada: `no-restricted-syntax`, que si sobreviviria por tener otro nombre. Se descarta
porque dejaria dos fuentes de verdad (la lista autorizada en `.eslintrc.cjs` y el techo en el script) y
porque la regla de ESLint sigue sin poder observar una entrada muerta, que es justo la que ya no marca.
Un solo verificador con una sola lista es mas simple y estrictamente mas capaz.

### Decision 2: la guardia comprueba tres invariantes, no una

- **Consumidor no autorizado:** un archivo de `src/` fuera de la lista importa `useWindowDimensions`.
- **Entrada muerta:** un archivo de la lista ya no lo importa, o no existe. Es la invariante que ninguna
  regla de lint puede cubrir, porque su silencio es indistinguible del exito.
- **Techo:** la lista no crece por encima de su constante declarada. Con la lista en 1
  (`src/hooks/useBreakpoint.ts`), el techo hace que autorizar una segunda fuente exija editar el script,
  lo que un review ve, en vez de ser el default silencioso.

### Decision 3: los tests quedan fuera del alcance de la guardia

`src/__tests__/**` mockea `react-native` y necesita nombrar `useWindowDimensions` para simular anchos
(`src/__tests__/hooks/useBreakpoint.test.tsx` ya lo hace). Los tests no son superficie de producto y
excluirlos es el mismo criterio que usa el override de `COLORS`. La exclusion es una regla estructural
del script, no una lista de archivos, asi que no puede pudrirse.

### Decision 4: los tres grupos de consumidores y su patron de migracion

**Grupo A, umbral canonico (11).** El numero desaparece:

```diff
-  const { width } = useWindowDimensions();
-  const isDesktop = width >= 768;
+  const { isMobile } = useBreakpoint();
+  const isDesktop = !isMobile;
```

Se conserva el nombre de la variable local aunque `isDesktop` sea impreciso para el rango tablet:
renombrarla tocaria decenas de sitios de estilo sin cambiar comportamiento, y este change es de
mecanismo. El comentario en el sitio explica la equivalencia.

**Grupo B, umbral de contenido (13).** El numero se conserva:

```diff
-  const { width } = useWindowDimensions();
+  const { width } = useBreakpoint();
   const isDesktop = width >= 1080;
```

**Grupo C, dimensiones crudas (3).** Igual que B, sin umbral que conservar.

### Decision 5: por que no se normalizan los umbrales de contenido

Un rango de dispositivo (768/1280) clasifica la pantalla y lo comparte el shell. Un umbral de contenido
(780, 820, 900, 960, 980, 1080, 1100) expresa cuando cabe una segunda columna en una pantalla concreta.
No hay banda canonica entre 900 y 1100, asi que esos umbrales no son un rango mal escrito: son una
medida de contenido.

Normalizarlos cambiaria el layout en bandas reales. `ClassroomGroupScreen` dejaria de ser compacta entre
768 y 779; `CrearAlumnoScreen` pasaria a dos columnas desde 768 en vez de 1080. Eso es rediseno, esta
prohibido por los no objetivos del epic #141, y la spec vigente ya lo protege con el escenario "Los
umbrales propios no cambian" de `reactive-breakpoints`. Mismo criterio que #79 aplico a sus 6 mixtos.

Consecuencia declarada sin maquillaje: tras esta ola sigue habiendo pantallas que conmutan en un punto
distinto del shell. Lo que deja de existir es la **segunda fuente de lectura** y la posibilidad de
reintroducirla. La alineacion de umbrales de contenido es una decision de diseno de las olas de rediseno
del plan UX/UI, no de un saneamiento, y se rastrea como tal.

### Decision 6: no vacuidad por mutacion, no por sonda externa

Leccion de la Ola 2a: un test que monta la pantalla y afirma sobre una sonda que consume el mismo hook
prueba el hook, no la pantalla, y pasaria con la pantalla congelada. Aqui cada test de reactividad
afirma sobre la **salida real** del componente migrado a dos anchos distintos, y se verifica por mutacion
que falla contra el codigo sin migrar.

## Responsive

No cambia ningun layout. Los 11 del Grupo A conmutan exactamente donde ya conmutaban (768/1280), ahora
por el mismo predicado que el shell. Los 16 restantes conservan su umbral. QA visual en 375, 768 y 1280.

## Estandar de Excelencia Visual (seccion 1.9)

Change de mecanismo sin superficie nueva: no introduce pantallas, estados ni micro-interacciones. El
estandar aplica como **no regresion**: ninguna pantalla migrada pierde estados, jerarquia tipografica,
densidad por breakpoint ni accesibilidad. Se verifica con el checklist anti-slop y Nielsen sobre las
pantallas migradas de mayor trafico, no proponiendo diseno nuevo.

## Risks / Trade-offs

- **Riesgo: migrar 27 archivos en un change.** Mitigacion: la transformacion es identica y mecanica por
  archivo, typecheck la cubre entera, y cada archivo se revierte solo. El alternativa de lotear por
  modulo dejaria la guardia vacua hasta el ultimo lote, que es el modo de fallo que este change corrige.
- **Riesgo: un flag semantico que no equivale al umbral que sustituye.** Mitigacion: solo se sustituye
  cuando el umbral es exactamente 768 o 1280; la equivalencia se verifica archivo por archivo y los tests
  de rango afirman la conmutacion en el limite.
- **Trade-off: el techo de la guardia es falsificable** editando el script. No pretende ser
  infalsificable, sino que ampliar la lista sea deliberado y visible en review.

## Migration Plan

Sin migracion de datos. No toca AsyncStorage, claves `@planearia:*`, `src/sync`, esquemas ni proyecto
nativo. Rollback por revert del PR; rollback parcial devolviendo el import de un archivo y reinsertando
su entrada en la lista autorizada.

## Open Questions

Ninguna abierta. La unica decision material (normalizar umbrales de contenido o conservarlos) se resuelve
por el precedente de #79 y por los no objetivos vigentes del epic, y su residual queda rastreado.
