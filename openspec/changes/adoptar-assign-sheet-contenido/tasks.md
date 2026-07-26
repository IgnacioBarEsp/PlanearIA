# Tasks: adoptar-assign-sheet-contenido

## 1. Adopcion de la hoja en la accion del menu

- [ ] 1.1 Importar `AssignSheet` y el tipo `ElementoAsignable` desde el barrel
      `src/components/assign`, y agregar el estado `itemParaAsignar` en `ContenidoScreen`.
- [ ] 1.2 Escribir el mapeo `ContenidoItem -> ElementoAsignable | null` tomando el id de `item.raw.id`
      (no del prefijo de `item.id`) y devolviendo `null` para planeaciones, plantillas y cualquier
      `raw.id` que no resulte en un numero finito.
- [ ] 1.3 Sustituir el `Alert.alert("Proximamente", ...)` del caso `"asignar"` de `handleMenuAction`
      por la apertura de la hoja con el elemento mapeado.
- [ ] 1.4 Renderizar `<AssignSheet ... />` con `onCrearClase` hacia el hub de Clases y un `testID`
      estable para la QA visual, siguiendo el patron de `ListaRecursosScreen`.

## 2. El menu deja de ofrecer lo que no puede cumplir

- [ ] 2.1 Derivar la lista de opciones del menu a partir del tipo del elemento abierto, en vez de la
      lista literal actual, conservando las opciones comunes sin cambios.
- [ ] 2.2 Incluir `asignar` solo cuando el elemento se mapea a un `ElementoAsignable`. Comprobar que no
      queda ningun control inerte ni aviso sustituto para los tipos no admitidos.

## 3. El resultado del modo seleccion se afirma segun el hecho real

- [ ] 3.1 En `handleConfirmSelection`, sumar los conteos que devuelven `asignarRecursosAGrupo` y
      `asignarEntregablesAGrupo` en vez de descartarlos.
- [ ] 3.2 Con suma cero no afirmar exito ni navegar hacia atras; informar que ningun elemento cambio de
      destino. Con suma mayor que cero informar cuantos se asignaron y volver atras, como hoy.

## 4. Cobertura y prueba de no vacuidad

- [ ] 4.1 Reescribir los casos de `ContenidoScreen.test.tsx` que hoy fijan el boton muerto y el alert
      "Proximamente".
- [ ] 4.2 Cubrir el menu en ambas direcciones: la accion aparece en recurso y en entregable, y no
      aparece en planeacion ni en plantilla.
- [ ] 4.3 Cubrir que abrir la accion monta la hoja compartida, y que cancelar no escribe ni encola nada.
- [ ] 4.4 Cubrir los dos resultados de `handleConfirmSelection`: sin escrituras no hay exito ni
      navegacion hacia atras; con escrituras si.
- [ ] 4.5 Probar que la escritura desde esta superficie **encola** y **sobrevive a un pull con trabajo
      pendiente**, ejercitando el camino real de reconciliacion y no un doble.
- [ ] 4.6 Demostrar la no vacuidad por mutacion: cada test nuevo debe fallar contra el arbol sin el
      cambio. Guardar la salida como evidencia.

## 5. Validacion tecnica

- [ ] 5.1 `npm run typecheck`.
- [ ] 5.2 `npm run lint -- --quiet`.
- [ ] 5.3 `npm test -- --runInBand` (verde salvo la falla local conocida de `spreadsheetDependency`).
- [ ] 5.4 `npm run test:sync -- --runInBand`.
- [ ] 5.5 `npm run test:project-os-contract`.
- [ ] 5.6 `npm run agent:harness:check` y `npm run openspec:validate`.
- [ ] 5.7 React Doctor sobre las rutas tocadas, comparado con el baseline y sin `--fix`.

## 6. QA visual y accesibilidad

- [ ] 6.1 Levantar `expo start --web` y confirmar HTTP 200 **antes** de navegar; guardar el registro.
- [ ] 6.2 Capturas por Playwright MCP en 375, 768 y 1280 del flujo real (abrir la hoja, asignar,
      cancelar), en tema claro y oscuro, midiendo el panel por su `data-testid`.
- [ ] 6.3 Verificar foco atrapado y cierre con Escape en web usando Tab real, touch targets de 44
      puntos y variante sin movimiento con reduce-motion.
- [ ] 6.4 Checklist Nielsen con severidad 0-4 y checklist anti-slop de la seccion 1.9; `npm run
      qa:visual:check`.

## 7. Cierre

- [ ] 7.1 Revision adversarial en contexto limpio; corregir todos los Blockers y Majors.
- [ ] 7.2 `npm run debt:capture` con el assessment del flujo.
- [ ] 7.3 `npm run openspec:ready:archive -- --change adoptar-assign-sheet-contenido --run-local` en
      PASS.
- [ ] 7.4 `npm run opsx:archive -- adoptar-assign-sheet-contenido` y `npm run opsx:finish`.
- [ ] 7.5 `npm run debt:sync` y `npm run debt:check -- --json`; cerrar #114 con la evidencia.
