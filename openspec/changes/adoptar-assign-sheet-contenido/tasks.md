# Tasks: adoptar-assign-sheet-contenido

## 1. Adopcion de la hoja en la accion del menu

- [x] 1.1 Importar `AssignSheet` y el tipo `ElementoAsignable` desde el barrel
      `src/components/assign`, y agregar el estado `itemParaAsignar` en `ContenidoScreen`.
      Evidencia: `ContenidoScreen.tsx:43-44` (import) y `:409` (estado).
- [x] 1.2 Escribir el mapeo `ContenidoItem -> ElementoAsignable | null` tomando el id de `item.raw.id`
      (no del prefijo de `item.id`) y devolviendo `null` para planeaciones, plantillas y cualquier
      `raw.id` que no sea un entero positivo.
      Evidencia: `ContenidoScreen.tsx:137-160`; pruebas `it.each` de los cinco ids invalidos y del id
      numerico entregado como cadena, en `ContenidoScreen.test.tsx`.
- [x] 1.3 Sustituir el `Alert.alert("Proximamente", ...)` del caso `"asignar"` de `handleMenuAction`
      por la apertura de la hoja con el elemento mapeado.
      Evidencia: `ContenidoScreen.tsx:539-545`; prueba `ofrece la accion en un recurso y abre el
      selector canonico con ese elemento`.
- [x] 1.4 Renderizar `<AssignSheet ... />` con `onCrearClase` hacia el hub de Clases y un `testID`
      estable para la QA visual, siguiendo el patron de `ListaRecursosScreen`.
      Evidencia: `ContenidoScreen.tsx:1367-1379`; testIDs observados en el navegador
      (`evidencia/04-qa-visual.md`).

## 2. El menu deja de ofrecer lo que no puede cumplir

- [x] 2.1 Derivar la lista de opciones del menu a partir del tipo del elemento abierto, en vez de la
      lista literal actual, conservando las opciones comunes sin cambios.
      Evidencia: `opcionesMenu()` en `ContenidoScreen.tsx:162-186`, consumida en `:947`; prueba
      `conserva el resto de opciones del menu en un tipo no asignable`.
- [x] 2.2 Incluir `asignar` solo cuando el elemento se mapea a un `ElementoAsignable`. Comprobar que no
      queda ningun control inerte ni aviso sustituto para los tipos no admitidos.
      Evidencia: pruebas `no ofrece la accion en una planeacion`, `no ofrece la accion en una
      plantilla` y `no sustituye la accion ausente por un aviso de disponibilidad futura`.
- [x] 2.3 (Añadida tras la revision adversarial) Aplicar la misma regla al modo seleccion, que ofrecia
      elegir tipos no asignables y luego los descartaba en silencio.
      Evidencia: `ContenidoScreen.tsx:1131-1137` (casilla) y `:490-494` (tocar la tarjeta); prueba
      `no deja elegir tipos que la asignacion no puede escribir`. Detalle en
      `evidencia/05-revision-adversarial.md`, Major 2.

## 3. El resultado del modo seleccion se afirma segun el hecho real

- [x] 3.1 En `handleConfirmSelection`, sumar los conteos que devuelven `asignarRecursosAGrupo` y
      `asignarEntregablesAGrupo` en vez de descartarlos.
      Evidencia: `ContenidoScreen.tsx:452-456`.
- [x] 3.2 Con suma cero no afirmar exito ni navegar hacia atras; informar que ningun elemento cambio de
      destino. Con suma mayor que cero informar cuantos se asignaron y volver atras, como hoy.
      Evidencia: `ContenidoScreen.tsx:458-480`; pruebas `no afirma exito ni vuelve atras cuando no hubo
      ninguna escritura` y `afirma el resultado y vuelve atras cuando si hubo escritura`.
- [x] 3.3 (Añadida tras la revision adversarial) Distinguir encolado de sincronizado con el vocabulario
      de la fuente unica, en vez de un texto que omitia el estado de sincronizacion.
      Evidencia: `ContenidoScreen.tsx:394` (`useSyncPresentation`) y `:472-479`; pruebas `distingue
      encolado de sincronizado con el vocabulario compartido` y `afirma sincronizado cuando la cola
      quedo drenada`. Detalle en `evidencia/05-revision-adversarial.md`, Major 1.
- [x] 3.4 (Añadida tras la revision adversarial) Convertir a numero el grupo destino, que llegaba como
      cadena y dejaba `grupoId: "7"` donde el resto de la app compara contra `7`.
      Evidencia: `ContenidoScreen.tsx:397-401`; prueba `convierte el grupo destino a numero antes de
      escribir`.

## 4. Cobertura y prueba de no vacuidad

- [x] 4.1 Reescribir los casos de `ContenidoScreen.test.tsx` que fijaban el boton muerto y el alert
      "Proximamente".
      Evidencia: el caso del alert desaparece y el del menu deja de afirmar la opcion sobre una
      planeacion.
- [x] 4.2 Cubrir el menu en ambas direcciones: la accion aparece en recurso y en entregable, y no
      aparece en planeacion ni en plantilla.
      Evidencia: cuatro pruebas del bloque `accion Asignar a grupo`.
- [x] 4.3 Cubrir que abrir la accion monta la hoja compartida, y que cancelar no escribe ni encola nada.
      Evidencia: `no monta el selector mientras no se dispara la accion` (pantalla) y `cancelar no
      escribe ni encola nada` (sync, con la hoja real).
- [x] 4.4 Cubrir los dos resultados de `handleConfirmSelection`.
      Evidencia: cuatro pruebas del bloque `modo seleccion`.
- [x] 4.5 Probar que la escritura desde esta superficie encola y sobrevive a un pull con trabajo
      pendiente, ejercitando el camino real de reconciliacion y no un doble.
      Evidencia: `src/__tests__/sync/asignacionContenidoEncolada.test.tsx`, que recorre pantalla, hoja,
      ViewModel, contexto y cola sin mockear el motor, y aplica `reconcileWithPending` real.
- [x] 4.6 Demostrar la no vacuidad por mutacion.
      Evidencia: `evidencia/01-no-vacuidad-mutacion.md`. 23 pruebas fallan contra `development`; se
      documentan tambien las tres aserciones que no cambian de signo y por que.
- [x] 4.7 (Añadida tras la revision adversarial) Cubrir el ciclo offline -> reconexion -> subida.
      Evidencia: `src/__tests__/sync/asignacionContenidoOfflineReconexion.test.tsx`.
- [x] 4.8 (Añadida tras la revision adversarial) Guardia estructural del lado de las superficies: hasta
      ahora solo se vigilaba que la hoja no escribiera, no que una superficie no reimplementara la
      escritura.
      Evidencia: bloque `las superficies adoptantes no reimplementan la asignacion` en
      `guardarrailesAssign.test.ts`.

## 5. Validacion tecnica

- [x] 5.1 `npm run typecheck` sin errores.
- [x] 5.2 `npm run lint -- --quiet` sin salida.
- [x] 5.3 `npm test -- --runInBand`: 911 de 912 en verde. El unico fallo es
      `spreadsheetDependency.test.ts`, falla local conocida en Windows por el tarball vendorizado de
      SheetJS, que pasa en CI y esta declarada fuera de alcance.
- [x] 5.4 `npm run test:sync -- --runInBand`: 6 suites, 28 pruebas en verde.
- [x] 5.5 `npm run test:project-os-contract`: PASS.
- [x] 5.6 `npm run agent:harness:check` (36 espejos en paridad) y `npm run openspec:validate`
      (52 de 52).
- [x] 5.7 React Doctor sobre la ruta tocada, con `node_modules` real y sin `--fix`.
      Evidencia: `evidencia/02-react-doctor.md`. Cero errores antes y despues. El unico warning nuevo
      es `no-barrel-import`, clasificado como falso positivo verificado.

## 6. QA visual y accesibilidad

- [x] 6.1 `expo start --web` con HTTP 200 confirmado antes de navegar.
      Evidencia: `evidencia/03-entorno-web.md`.
- [x] 6.2 Capturas por Playwright MCP en 375, 768 y 1280 del flujo real, en tema claro y oscuro,
      midiendo el panel por su `data-testid`.
      Evidencia: 11 capturas de md5 distinto en `evidencia/capturas/`; tabla de medicion en
      `evidencia/README.md`.
- [x] 6.3 Verificar foco atrapado y cierre con Escape en web usando Tab real, touch targets y reduced
      motion.
      Evidencia: `evidencia/04-qa-visual.md`. El foco sigue dentro del panel tras nueve Tab reales;
      Escape cierra sin escribir ni encolar. Hallazgo: el control de cierre mide 28x28 en web porque RN
      Web no implementa `hitSlop`, verificado con `elementFromPoint`; es del componente base #82 y queda
      capturado como deuda.
- [x] 6.4 Checklist Nielsen con severidad 0-4 y checklist anti-slop; `npm run qa:visual:check`.
      Evidencia: severidad maxima 2, bajo el umbral 3;
      `qa:visual:check -- --change adoptar-assign-sheet-contenido` en PASS con sus 12 checks.

## 7. Cierre

- [x] 7.1 Revision adversarial en contexto limpio; corregir todos los Blockers y Majors.
      Evidencia: `evidencia/05-revision-adversarial.md`. Veredicto inicial FAIL con 6 Majors y 4
      Minors; los 6 Majors cerrados dentro del change.
- [x] 7.2 `npm run debt:capture` con el assessment del flujo.
- [x] 7.3 `npm run openspec:ready:archive -- --change adoptar-assign-sheet-contenido --run-local` en
      PASS.
- [x] 7.4 `npm run opsx:archive -- adoptar-assign-sheet-contenido` y `npm run opsx:finish`.
- [x] 7.5 `npm run debt:sync` y `npm run debt:check -- --json`; cerrar #114 con la evidencia.
