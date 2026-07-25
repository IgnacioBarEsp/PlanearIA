# Tareas: sanear el rollout de theming runtime (Ola 2a)

## 1. Guardia ejecutable del registro

- [x] 1.1 Crear `scripts/checkThemingRollout.mjs`: lee la lista desde `.eslintrc.cjs` localizando el unico override que apaga `no-restricted-imports`, y falla explicitamente si no encuentra exactamente uno.
- [x] 1.2 Implementar la invariante de existencia: toda entrada apunta a un archivo presente en disco; reportar cada entrada huerfana por nombre.
- [x] 1.3 Implementar la invariante de vitalidad: todo archivo listado sigue importando `COLORS`; reportar cada entrada muerta por nombre.
- [x] 1.4 Implementar el trinquete: la lista no supera el techo declarado como constante en el script; reportar el exceso.
- [x] 1.5 Agregar el script npm `check:theming-rollout` en `package.json`.
- [x] 1.6 Crear `src/__tests__/harness/themingRollout.test.ts` con fixture positivo (arbol real en verde) y fixtures negativos que inyectan una entrada huerfana, una entrada muerta y una lista crecida; el test falla si la guardia no los detecta.
- [x] 1.7 Verificar que la guardia falla hoy sobre el registro sin sanear (4 entradas invalidas), como prueba de no vacuidad, y dejar constancia en la evidencia.

## 2. Saneamiento del registro

- [x] 2.1 Retirar de `LEGACY_COLORS_ROLLOUT` las dos entradas de archivos inexistentes: `src/components/FloatingActionIcons.tsx` y `src/navigation/AppTabsNavigator.tsx`.
- [x] 2.2 Retirar las dos entradas de archivos ya migrados: `src/components/SyncStatusBanner.tsx` y `src/navigation/StackNavigator.tsx`.
- [x] 2.3 Corregir el comentario del override: sustituir el conteo obsoleto de 2026-07-17 y la afirmacion de verificacion en CI inexistente por la referencia a la guardia real.
- [x] 2.4 Ajustar el techo del script al nuevo tamano y confirmar `node scripts/checkThemingRollout.mjs` en verde.

## 3. ContenidoScreen: import muerto

- [x] 3.1 Retirar de `src/screens/contenido/ContenidoScreen.tsx` la importacion de `COLORS`, verificando antes que ninguna referencia real la consume.
- [x] 3.2 Retirar su entrada del registro y bajar el techo; confirmar typecheck y la guardia en verde.

## 4. Migracion de pantallas

- [x] 4.1 Migrar `src/screens/classroom/ClassroomHomeScreen.tsx` (13 referencias) a `useAppTheme()` con fabrica `getStyles` memoizada; retirar su entrada y bajar el techo.
- [x] 4.2 Migrar `src/screens/grupos/ListaGruposScreen.tsx` (40 referencias); retirar su entrada y bajar el techo.
- [x] 4.3 Migrar `src/screens/calificaciones/PromediosCalificacionesScreen.tsx` (19 referencias); retirar su entrada y bajar el techo.
- [x] 4.4 Migrar `src/screens/calificaciones/CapturarCalificacionesScreen.tsx` (23 referencias); retirar su entrada y bajar el techo.
- [x] 4.5 Migrar `src/screens/grupos/tareas/CrearTareaGrupoScreen.tsx` (51 referencias); retirar su entrada y bajar el techo.
- [x] 4.6 Migrar `src/screens/grupos/DetalleGrupoScreen.tsx` (109 referencias, 2,018 lineas) en su propia tarea para aislar el diff; retirar su entrada y bajar el techo.
- [x] 4.7 Contar y registrar, por pantalla migrada, cuantos literales hex conserva, para declararlo en evidencia sin afirmar tematizacion completa.

## 5. Pruebas

- [x] 5.1 Agregar prueba de repintado en runtime para al menos una pantalla migrada: al cambiar el tema, los estilos derivados cambian sin remontar el componente.
- [x] 5.2 Agregar prueba de que la migracion consume `useAppTheme` y no `useTheme`, de modo que el filtro de daltonismo siga aplicandose.
- [x] 5.3 Verificar que la fabrica `getStyles` esta memoizada y no recrea el `StyleSheet` cuando las preferencias no cambian.
- [x] 5.4 Correr la suite completa y confirmar cero `console.error`/`console.warn` no declarados bajo la guardia de consola.

## 6. Validacion y evidencia

- [x] 6.1 Correr `npm run typecheck`, `npm run lint -- --quiet` y `npm test -- --runInBand` en verde (salvo la falla local conocida de `spreadsheetDependency` en Windows, que se documenta).
- [x] 6.2 Correr `npm run test:project-os-contract`, `npm run agent:harness:check`, `npm run agent:opsx:patch:check` y `npm run openspec:validate` en verde.
- [x] 6.3 Levantar `expo start --web`, confirmar HTTP 200 antes de navegar y capturar por breakpoint (375/768/1280) en tema claro y oscuro las pantallas migradas alcanzables, alternando el tema desde `CuentaScreen` sin recargar.
- [x] 6.4 Verificar que las capturas clara y oscura difieren de verdad, y que la comparacion antes/despues en tema claro no muestra cambios: evidencia no vacua en ambos sentidos.
- [x] 6.5 Verificar daltonismo, escala de fuente y alto contraste sobre al menos una pantalla migrada.
- [x] 6.6 Correr `npm run qa:visual:check` y completar el checklist Nielsen y el anti-slop sin severidad mayor o igual a 3.
- [x] 6.7 Correr React Doctor sobre las rutas tocadas y confirmar cero errores nuevos respecto al baseline de 0 errores y 190 warnings.

## 7. Cierre

- [x] 7.1 Escribir `TLDR.md`, `brownfield-baseline.md` y `readiness.json` en la raiz del change.
- [x] 7.2 Ejecutar la revision adversarial en contexto limpio y corregir todos los Blockers y Majors.
- [x] 7.3 Capturar el assessment con `resolves` de `debt-b279f64f815b` y la excepcion del fork `DT` de ContenidoScreen.
- [ ] 7.4 Correr `npm run openspec:ready:archive -- --change sanear-theming-runtime-uxui --run-local` en PASS.
