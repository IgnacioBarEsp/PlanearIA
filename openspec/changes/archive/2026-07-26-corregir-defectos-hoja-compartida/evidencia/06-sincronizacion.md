# Evidencia de sincronizacion

Superficie `sync` declarada porque la reanudacion del reintento cambia **que elementos
atraviesan el camino de escritura** en un segundo intento. Las tres evidencias del perfil se
cubren sobre el motor real de `src/sync`: cola, almacenamiento y reconciliacion sin dobles.
Prueba: `src/__tests__/sync/asignacionReintentoEncolado.test.tsx`.

El fallo se inyecta donde puede ocurrir de verdad —la persistencia de la lista de recursos,
que es lo que `RecursosContext.persist` hace antes de encolar— y no mockeando el ViewModel.

## offline-reconnect

Sin conexion, con dos elementos y la escritura del segundo fallando:

1. La hoja informa el fallo nombrando lo guardado: *"Se guardo 1 elemento y queda 1 pendiente.
   Reintentar continua desde ahi."*
2. El elemento 1 quedo escrito **y encolado**: 1 operacion pendiente. El 2 sigue sin `grupoId`.
3. Reintentar completa el pendiente. El resultado acumula los dos intentos: *"2 elementos
   asignados a 2do A."*, no "1" por el ultimo intento.
4. La cola queda con **una operacion por elemento** (ids 1 y 2), no una por intento.
5. Al reconectar, `flushQueue("recursos")` procesa **2** operaciones, `success: true`, y la cola
   queda vacia.

## no-local-loss

Con la operacion todavia en cola tras el fallo parcial, se aplica `reconcileWithPending` con
una lista remota que **aun no conoce la asignacion**. El `grupoId` local sobrevive: es el modo
de fallo exacto que documenta el change del selector, y sigue cerrado con el camino nuevo.

## cross-device

Lo que este flujo entrega al servidor son los documentos que suben al drenar la cola. Tras
reconectar, los dos cuerpos POST a `/api/recursos` llevan `grupoId: 7` y los ids 1 y 2: eso es
lo que otro dispositivo ve al bajar.

### El limite de CORS que declaro el change anterior: medido y corregido

El change anterior declaro como limitacion que *"el backend desplegado rechaza por CORS el
origen localhost"*. **Esa lectura era imprecisa.** Verificado en vivo contra
`npm run backend:dev:local`, que corre el mismo `backend/api/index.js`:

```
Origin: http://localhost:8081  ->  Access-Control-Allow-Origin: http://localhost:8081
Origin: http://localhost:8082  ->  Access-Control-Allow-Origin: https://planearai.com
```

La lista por defecto de `backend/lib/auth.js` **si admite localhost**, pero solo en los puertos
`8081` (el de Expo por defecto) y `19006`. El change anterior corrio la web en **8082**, porque
un dev server previo ocupaba el 8081, y por eso choco. No es una barrera de "localhost": es una
lista de puertos. Se resuelve corriendo la web en el puerto por defecto, o anadiendo el puerto a
`ALLOWED_ORIGINS`.

### Hasta donde se llego, y por que no mas

Con el origen aceptado, la peticion **ya no muere en CORS** y avanza hasta las capas
siguientes:

```
sin cabecera        -> 401 {"error":"Missing API key"}
con X-API-Key       -> {"error":"Se requiere sesión de usuario (JWT)"}
```

El techo restante **no es CORS**: las rutas de datos exigen clave de API y sesion JWT, y
cualquier ida y vuelta real necesita MongoDB. `scripts/localBackendServer.mjs` no carga
`.env`, y el unico `MONGODB_URI` del repositorio apunta al **Atlas M0 de produccion**.

**No se ejercito la persistencia servidor y la relectura**, deliberadamente: hacerlo habria
exigido apuntar la prueba a la base de datos compartida de produccion y escribir registros
reales en ella. Eso es una accion con efectos externos que este change no tiene autorizada, y
el beneficio —confirmar que Mongo guarda un campo que el POST ya demuestra que viaja— no
justifica el riesgo.

Queda declarado como lo que es: **limite conocido con causa identificada y camino de salida**
(un `MONGODB_URI` de descarte, o un mongod local), no como un hueco sin explicar. Es
estrictamente mas de lo que se sabia antes: la causa del choque de CORS pasa de "el backend
rechaza localhost" a "la lista de origenes no incluye el puerto 8082", que es accionable.

## Comandos

```bash
npm run test:sync -- --runInBand     # 6 suites, 30 pruebas (7 suites, 31 con la nueva)
npm run backend:dev:local            # servidor local para la verificacion de CORS
```
