# Tareas: sanear la fuente de breakpoint (Ola 2b)

## 1. Guardia ejecutable de la fuente de dimensiones

- [x] 1.1 Crear `scripts/checkBreakpointSource.mjs` con la lista de fuentes autorizadas y su techo como constantes del propio script (fuente unica, sin duplicar en `.eslintrc.cjs`).
- [x] 1.2 Implementar la invariante de consumidor no autorizado: barrer `src/**/*.ts(x)` excluyendo `src/__tests__/**` y reportar por nombre cada archivo que importe `useWindowDimensions` sin estar autorizado.
- [x] 1.3 Implementar la invariante de entrada muerta: toda entrada autorizada existe en disco y sigue importando `useWindowDimensions`; reportar cada entrada muerta u huerfana.
- [x] 1.4 Implementar el trinquete de techo: la lista autorizada no supera su constante; reportar el exceso.
- [x] 1.5 Usar el entrypoint independiente de plataforma (`pathToFileURL`), para no repetir el bug POSIX de #132 que dejaba el bloque CLI sin correr en CI.
- [x] 1.6 Agregar el script npm `check:breakpoint-source` en `package.json`.
- [x] 1.7 Crear `src/__tests__/harness/breakpointSource.test.ts` con fixture positivo y fixtures negativos (consumidor no autorizado, entrada muerta, entrada huerfana, lista crecida); el test falla si la guardia no los detecta.
- [x] 1.8 Probar no vacuidad: ejecutar la guardia contra el arbol sin migrar y confirmar que enumera los 27 consumidores y sale 1; guardar la salida como evidencia.

## 2. Grupo A: umbral canonico pasa a rango semantico (11 archivos)

- [x] 2.1 `src/components/ExpandedStatsModal.tsx` (768).
- [x] 2.2 `src/screens/auth/RegistroScreen.tsx` (768, combinado con `Platform.OS === "web"`).
- [x] 2.3 `src/screens/ayuda/AyudaScreen.tsx` (768).
- [x] 2.4 `src/screens/feed/FeedScreen.tsx` (768).
- [x] 2.5 `src/screens/feed/PostDetailScreen.tsx` (768).
- [x] 2.6 `src/screens/notificaciones/NotificacionesScreen.tsx` (768).
- [x] 2.7 `src/screens/perfil/PerfilScreen.tsx` (768).
- [x] 2.8 `src/screens/social/SocialScreen.tsx` (768).
- [x] 2.9 `src/screens/social/BuscadorPerfilesScreen.tsx` (768).
- [x] 2.10 `src/screens/cuenta/EditarPerfilScreen.tsx` (768 en estilo inline).
- [x] 2.11 `src/screens/contenido/ContenidoScreen.tsx` (768 y 1280; unico archivo con los dos limites).

## 3. Grupo B: umbral de contenido conservado sobre la fuente unica (13 archivos)

- [x] 3.1 `src/components/CrearNuevoModal.tsx` (900).
- [x] 3.2 `src/screens/plantillas/BibliotecaPlantillasScreen.tsx` (900).
- [x] 3.3 `src/screens/planeaciones/EscanerPlantillaScreen.tsx` (960).
- [x] 3.4 `src/screens/grupos/ReportesGrupoScreen.tsx` (980 + ancho de grafica).
- [x] 3.5 `src/screens/planeaciones/ExportarPlaneacionScreen.tsx` (980).
- [x] 3.6 `src/screens/planeaciones/ImportarPlaneacionScreen.tsx` (980).
- [x] 3.7 `src/screens/alumnos/CrearAlumnoScreen.tsx` (1080 + `Platform.OS === "web"`).
- [x] 3.8 `src/screens/alumnos/ListaAlumnosScreen.tsx` (1080 + `Platform.OS === "web"`).
- [x] 3.9 `src/screens/alumnos/ReportesAlumnoScreen.tsx` (1080 + ancho de grafica).
- [x] 3.10 `src/screens/alumnos/NotasAlumnoScreen.tsx` (1100).
- [x] 3.11 `src/screens/classroom/ClassroomGroupScreen.tsx` (compacta por debajo de 780).
- [x] 3.12 `src/screens/classroom/DetalleActividadClassroomScreen.tsx` (compacta por debajo de 820).
- [x] 3.13 `src/hooks/useEditorMode.ts` (umbral configurable por parametro; expone `width` y `height`).

## 4. Grupo C: dimensiones crudas sin rango (3 archivos)

- [x] 4.1 `src/screens/grupos/DetalleGrupoScreen.tsx` (ancho de grafica).
- [x] 4.2 `src/screens/onboarding/OnboardingScreen.tsx` (ancho de diapositiva del carrusel).
- [x] 4.3 `src/screens/planeaciones/DocEditorScreen.tsx` (ancho de pagina del editor).

## 5. Cierre de la guardia

- [x] 5.1 Confirmar que el barrido devuelve cero consumidores directos fuera de `src/hooks/useBreakpoint.ts`.
- [x] 5.2 Bajar el techo de la guardia a la lista final y confirmar `npm run check:breakpoint-source` en verde.

## 6. Tests de reactividad, probados por mutacion

- [x] 6.1 Test de conmutacion en el limite canonico para una pantalla del Grupo A: la salida real cambia al cruzar 768 y no antes.
- [x] 6.2 Test de conservacion de umbral para una pantalla del Grupo B: la salida real cambia en su umbral propio y no en 768.
- [x] 6.3 Test de dimensiones crudas para el Grupo C: el tamano calculado sigue al ancho vigente.
- [x] 6.4 Verificar por mutacion que 6.1, 6.2 y 6.3 fallan contra el codigo sin migrar, y guardar la salida como evidencia.

## 7. Validacion

- [x] 7.1 `npm run typecheck` en exit 0.
- [x] 7.2 `npm run lint -- --quiet` en exit 0.
- [x] 7.3 `npm test -- --runInBand` verde salvo la falla local preexistente de `spreadsheetDependency` en Windows.
- [x] 7.4 `npm run agent:harness:check` y `npm run openspec:validate` en verde.
- [x] 7.5 `npm run test:project-os-contract` y `npm run qa:visual:check` en verde.
- [x] 7.6 React Doctor sobre las rutas tocadas comparado contra el baseline del commit previo, con `node_modules` real y sin `--fix`.

## 8. QA visual por breakpoint

- [x] 8.1 Levantar `expo start --web` y confirmar HTTP 200 antes de navegar; dejar constancia en evidencia.
- [x] 8.2 Capturas en 375, 768 y 1280 de pantallas migradas de los tres grupos, via Playwright MCP.
- [x] 8.3 Comprobar que el rango efectivo de una pantalla del Grupo A coincide con el del shell al cruzar 768.
- [x] 8.4 Checklist Nielsen y anti-slop como no regresion sobre las pantallas migradas alcanzables.

## 9. Correcciones de la revision adversarial

La revision encontro dos vias por las que la guardia habria callado. Ambas se corrigieron dentro del
change, con fixture y caso propios.

- [x] 9.1 Major: la guardia solo escaneaba `src/`, pero `.eslintrc.cjs` declara la superficie de producto como `["src/**/*.ts", "src/**/*.tsx", "App.tsx"]`. `App.tsx` era un punto ciego. Se agrego `EXTRA_PRODUCTION_FILES` y el fixture `fuera-de-src`.
- [x] 9.2 Major: `Dimensions.get()` eludia la guardia por completo. Es la lectura congelada que la spec prohibe desde #79 sin ningun verificador, y bastaba para reintroducir un ancho congelado. Se agrego la invariante `congelada`, el fixture homonimo y la requirement MODIFIED que exige verificacion ejecutable.
- [x] 9.3 Verificar que ambas evasiones fallan la guardia y que el arbol real sigue en verde.

## 10. Cierre

- [x] 10.1 Revision adversarial en contexto limpio; corregir Blockers y Majors dentro del change.
- [x] 10.2 Escribir el assessment y capturarlo con `debt:capture`, resolviendo `debt-3d3ea5ba87ac` y registrando la excepcion measure-first de `debt-5862d25288fa`.
- [x] 10.3 `npm run openspec:ready:archive -- --change sanear-breakpoints-uxui --run-local` en PASS.
- [x] 10.4 `npm run opsx:archive -- sanear-breakpoints-uxui` y `npm run opsx:finish`.
