# No vacuidad: cada prueba nueva falla contra el codigo sin el cambio

Metodo: `git checkout development -- <archivo>` para volver el archivo de produccion a su
estado previo, correr la suite, y restaurar con `git checkout HEAD -- <archivo>`.

**Aviso operativo, aprendido a golpes en esta sesion.** `git checkout development -- <archivo>`
**descarta los cambios sin commitear** de ese archivo. La implementacion se perdio una vez por
mutar antes de commitear y hubo que rehacerla. El orden correcto es: commitear la
implementacion, mutar, y restaurar con `git checkout HEAD -- <archivo>`. (`git checkout -- <archivo>`
a secas es no-op una vez commiteado, que fue el error del change anterior.)

## Mutacion 1: el ViewModel vuelve a `development`

`git checkout development -- src/hooks/useAssignSheet.ts`

```
Tests: 5 failed, 13 passed, 18 total
● useAssignSheet › ofrece reintentar cuando falla la carga de destinos
● useAssignSheet › fallo de escritura › no lo confunde con el fallo de carga y cuenta lo ya escrito
● useAssignSheet › fallo de escritura › reintentar retoma lo pendiente sin reescribir lo ya encolado
● useAssignSheet › fallo de escritura › conserva el encolado pendiente al acumular intentos
● useAssignSheet › fallo de escritura › reiniciar limpia el progreso ...
```

## Mutacion 2: la hoja y el ViewModel vuelven a `development`

`git checkout development -- src/components/assign/AssignSheet.tsx src/hooks/useAssignSheet.ts`

```
Tests: 4 failed, 11 passed, 15 total
● AssignSheet › avisos de error › el fallo de carga se anuncia como fallo de carga y recarga destinos
● AssignSheet › avisos de error › el fallo de escritura se anuncia como tal y nombra lo ya guardado
● AssignSheet › avisos de error › reintentar el fallo de escritura reintenta la asignacion, no la carga
● asignar desde Contenido ... › si falla la carga de destinos avisa y permite reintentar sin perder el elemento
```

## Mutacion 3: la prueba de sincronizacion con reintento

Misma reversion, sobre `asignacionReintentoEncolado.test.tsx`:

```
Tests: 1 failed, 1 total
● reintento de una escritura parcial ... › conserva lo escrito, lo completa al reintentar y lo sube al reconectar
  Unable to find an element with testID: hoja-error-escritura
```

## Los dos casos que NO fallan contra el codigo viejo, y por que

Declararlos importa mas que ocultarlos.

### `cambiar de destino tras un fallo parcial reescribe todo hacia el destino nuevo`

Pasa contra `development` porque el codigo viejo **reprocesa todo siempre**, asi que satisface
la propiedad por no tener memoria. No es una prueba de un defecto corregido: es una **guardia
sobre el mecanismo nuevo**, que existe para que la reanudacion no se pase de lista y salte
elementos que apuntan al destino anterior.

Su mutacion correcta es contra la implementacion propia. Desactivando la invalidacion por
clave de destino (`if (false && progreso.current.clave !== clave)`):

```
Tests: 1 failed, 17 passed, 18 total
● useAssignSheet › fallo de escritura › cambiar de destino tras un fallo parcial reescribe todo hacia el destino nuevo
```

Falla exactamente ese caso y ninguno mas.

### `sin clases ofrece crear una y su salida lleva a CrearGrupo`

Tambien pasa contra `development`, y **es lo correcto**: el item que lo motiva
(`debt-7f36f0586032`) esta clasificado como `optional-improvement`, es decir cobertura
faltante, no defecto. El estado vacio y su salida ya funcionaban; lo que no habia era prueba
de que la superficie Contenido cableara la salida al formulario de crear grupo. Una prueba de
cobertura nueva sobre comportamiento correcto no puede fallar contra el codigo viejo sin que
alguien haya roto algo.

## Mutaciones de la guardia de area tactil

La guardia tiene que fallar en las dos direcciones, o se convierte en una lista muerta.

### Uso nuevo sin declarar

Se inyecta un `hitSlop` en `components/base/Card.tsx`, que no esta en el inventario:

```
● guardia de area tactil real en web › ningun control nuevo depende de hitSlop sin declararlo
+ Array [
+   "components/base/Card.tsx",
+ ]
Tests: 1 failed, 4 passed, 5 total
```

### Entrada del inventario que quedo obsoleta

Se quita el `hitSlop` de `components/ScreenBackButton.tsx` sin limpiar su linea:

```
● guardia de area tactil real en web › el inventario no conserva entradas que ya no usan hitSlop
+ Array [
+   "components/ScreenBackButton.tsx",
+ ]
Tests: 1 failed, 4 passed, 5 total
```

### Un cierre de la base vuelve a la caja de 28

Se devuelve `Sheet.tsx` a `width/height: ICONO_CERRAR`:

```
● guardia de area tactil real en web › los cierres de la biblioteca base resuelven el minimo con caja, no con hitSlop
Tests: 1 failed, 4 passed, 5 total
```

Los tres archivos se restauraron con `git checkout HEAD -- <archivo>` y la suite volvio a
verde. `git status` quedo limpio de fuentes tras cada mutacion.

## Limite declarado de la guardia

Detecta **dependencia de `hitSlop`**, no mide areas tactiles. Un control que no use `hitSlop`
y aun asi mida 20x20 la pasa. Medir cajas exigiria navegador dentro de CI, que este repo no
tiene hoy. Queda escrito en el encabezado del propio test y en `design.md` (D6), no
disimulado.
