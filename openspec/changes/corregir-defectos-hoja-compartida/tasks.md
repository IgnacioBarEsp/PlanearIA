## 1. Baseline verificable antes de tocar codigo

- [x] 1.1 Registrar el baseline de React Doctor sobre las rutas que se van a tocar, con `node_modules` real y sin `--fix`, en `evidencia/01-react-doctor.md`
- [x] 1.2 Levantar `expo start --web`, confirmar HTTP 200 antes de navegar y medir con `getBoundingClientRect` y `document.elementFromPoint` el estado ANTES de los tres controles de cierre (`Sheet`, `Banner`, `Toast`) en `CatalogoComponentesScreen` y del cierre de `AssignSheet` en Contenido; guardar en `evidencia/02-medicion-area-tactil.md`
- [x] 1.3 Medir en navegador el resto del inventario de `hitSlop` (grupos B y C) hasta donde sea alcanzable en la app corriendo, y declarar explicitamente que sitios quedaron medidos y cuales derivados por lectura de codigo, en `evidencia/03-inventario-hitslop.md`

## 2. Semantica de errores de la hoja (debt-9f9d7019d927)

- [x] 2.1 Separar en `src/hooks/useAssignSheet.ts` el estado `error` en `errorCarga` y `errorEscritura`, con `ErrorEscritura = { mensaje, asignados, pendientes }`, y renombrar `reintentar` a `reintentarCarga`
- [x] 2.2 Sacar el progreso de la escritura del `try` de `asignar` a un registro que sobreviva al fallo, con los elementos ya procesados, el acumulado de `asignados` y el `syncOk` acumulado
- [x] 2.3 Ligar el registro de progreso a la clave del destino (`grupoId|unidadId|tareaId`) para que no pueda aplicarse a un destino distinto, y limpiarlo tambien en `reiniciar()`
- [x] 2.4 Hacer que `asignar()` recorra solo los elementos pendientes cuando el destino no cambio, y todos cuando cambio
- [x] 2.5 Poblar `errorEscritura` en el `catch` con el mensaje, los `asignados` acumulados y los `pendientes` reales
- [x] 2.6 En `src/components/assign/AssignSheet.tsx`, derivar titulo, mensaje y accion del banner segun la causa: recarga de destinos para `errorCarga`, reintento de la asignacion para `errorEscritura`, nombrando cuantos elementos quedaron guardados
- [x] 2.7 Cubrir con pruebas de hook y de componente los cinco escenarios de la spec nueva, y demostrar la no vacuidad de cada uno con `git checkout development -- <archivo>`

## 3. Area tactil real en la biblioteca base (debt-c319ed19fe20)

- [x] 3.1 Anadir `minTargetBox()` a `src/components/base/primitives.ts` junto a `hitSlopToMinTarget`, documentando por que `hitSlop` no sirve en web
- [x] 3.2 Adoptar el helper en el control de cierre de `src/components/base/Sheet.tsx`, retirando `hitSlop` y compensando el crecimiento con margen negativo derivado del tamano visual
- [x] 3.3 Adoptar el mismo patron en `src/components/base/Banner.tsx` y `src/components/base/Toast.tsx`
- [x] 3.4 Anadir `testID` al control de cierre de `Banner` y a la instancia de `Toast` del catalogo, para poder anclar la medicion en navegador
- [x] 3.5 Anadir la guardia estructural de dependencia de `hitSlop` con inventario declarado que falle en las dos direcciones, y probarla por mutacion (anadir un uso nuevo y quitar uno declarado)
- [x] 3.6 Cubrir con prueba unitaria que los tres controles de cierre declaran caja >= 44 en ambos ejes sin contar `hitSlop`, con no vacuidad demostrada

## 4. Cobertura del vacio y del error desde Contenido (debt-7f36f0586032)

- [x] 4.1 Anadir a `src/__tests__/sync/asignacionContenidoEncolada.test.tsx` el caso de cero grupos que afirma el estado vacio y que su salida navega a `ClasesTab`/`CrearGrupo`
- [x] 4.2 Anadir el caso que hace fallar `classroomFacade` y observa el banner de error de carga con su reintento
- [x] 4.3 Demostrar la no vacuidad de ambos casos con `git checkout development -- <archivo>`

## 5. Evidencia de sincronizacion

- [x] 5.1 Cubrir `offline-reconnect` para el camino con reintento: fallo parcial sin conexion, reanudacion y drenado al reconectar sin operaciones duplicadas
- [x] 5.2 Cubrir `no-local-loss`: lo escrito antes del fallo sobrevive a `reconcileWithPending` con lista remota que aun no lo refleja
- [x] 5.3 Cubrir `cross-device` contra `npm run backend:dev:local`, resolviendo el limite de CORS que #114 declaro con el backend desplegado

## 6. QA visual y accesibilidad

- [x] 6.1 Medir el estado DESPUES de los cuatro controles de cierre con `getBoundingClientRect` (>= 44x44) y `document.elementFromPoint` justo dentro del borde ampliado, y comparar la altura del encabezado antes/despues
- [x] 6.2 Capturas en 375/768/1280 y en tema claro y oscuro de la hoja de asignacion y del catalogo de componentes, midiendo el panel por su `data-testid` y no por `[aria-modal="true"]`
- [x] 6.3 Verificar foco con Tab real sobre el control de cierre ampliado y el checklist Nielsen y anti-slop de la seccion 1.9
- [x] 6.4 React Doctor sobre las rutas tocadas comparado contra el baseline de 1.1

## 7. Cierre

- [x] 7.1 `npm run typecheck`, `npm run lint -- --quiet`, `npm test -- --runInBand`, `npm run test:sync -- --runInBand`, `npm run test:project-os-contract`, `npm run agent:harness:check`, `npm run openspec:validate` y `npm run qa:visual:check -- --change corregir-defectos-hoja-compartida`
- [x] 7.2 Revision adversarial en contexto limpio y cierre de todos los Blockers y Majors
- [x] 7.3 Assessment de deuda (`kind: remediation`) resolviendo los tres items y registrando como candidato lo no corregido del inventario de `hitSlop`
- [ ] 7.4 Gate `npm run openspec:ready:archive -- --change corregir-defectos-hoja-compartida --run-local` en PASS
