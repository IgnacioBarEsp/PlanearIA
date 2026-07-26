# React Doctor: antes y despues

React Doctor v0.9.1, con `node_modules` real y **sin `--fix`**, sobre los tres directorios
que este change toca. La herramienta acepta un solo directorio por invocacion.

```bash
npx react-doctor@latest --verbose src/components/base
npx react-doctor@latest --verbose src/components/assign
npx react-doctor@latest --verbose src/hooks
```

| Directorio | Baseline | Despues | Errores |
| --- | --- | --- | --- |
| `src/components/base` | 81/100, 1 warning | **81/100, 1 warning** | 0 en ambos |
| `src/components/assign` | 81/100, 1 warning | **81/100, 1 warning** | 0 en ambos |
| `src/hooks` | 55/100, 21 hallazgos | **55/100, 21 hallazgos** | 0 en ambos |

El unico warning de los dos directorios de componentes es `react-doctor/expo-lockfile`
("No lock file detected at the project root"), que apunta a `package.json` y no al codigo del
directorio: es del proyecto, preexistente y ajeno a este change.

En `src/hooks` el conjunto de hallazgos quedo **identico al baseline**, misma regla y mismo
archivo en cada uno; solo cambian numeros de linea por el codigo anadido:

```
$ diff baseline actual   # ignorando numeros de linea
IDENTICO al baseline
```

## Un hallazgo nuevo apareció y se corrigió

La primera pasada tras implementar dio **22 hallazgos en `src/hooks`, uno mas que el
baseline**:

> Performance: Ref initializer runs on every render — `useAssignSheet.ts:145`

**Verdadero positivo.** `useRef(PROGRESO_VACIO())` construye el objeto y un `Set` nuevos en
cada render para que React los descarte despues del primero. Se corrigio inicializando la ref
en `null` y creando el progreso cuando de verdad hace falta, dentro de `asignar`. El `null`
ademas expresa mejor el estado real: todavia no hay progreso. Tras la correccion,
`src/hooks` vuelve a 21 hallazgos y al mismo 55/100.

No se suprimio ninguna regla ni se toco la configuracion de react-doctor.

## Los tres hallazgos preexistentes sobre `useAssignSheet.ts`

Siguen ahi, sin agravarse, y ninguno se corrige en este change:

1. **`async-await-in-loop`** en el bucle de escritura. La secuencialidad es deliberada: cada
   iteracion escribe y encola por el motor de sincronizacion, y paralelizarlas cambiaria el
   orden en que entran a la cola. Corregirlo es una decision sobre el camino de escritura, que
   es no objetivo aqui.
2. **`async-defer-await`** en el efecto de carga de destinos.
3. **`no-set-state-after-await-in-effect`** en el mismo efecto. **Falso positivo**: el efecto
   ya guarda cada setter tras el `await` con la bandera `vigente` y con
   `grupoVigente.current !== grupoId`, que es exactamente la mitigacion que la regla pide.
   Preexistente de #84; no se toca ni se registra como deuda nueva.
