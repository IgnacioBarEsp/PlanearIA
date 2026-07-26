# React Doctor: antes y despues

Medido con `node_modules` real, sin `--fix`, sobre el directorio tocado. React Doctor v0.9.1.

```bash
npx react-doctor@latest src/screens/contenido
```

| Medicion | Score | Warnings | Errores | Archivos |
| --- | --- | --- | --- | --- |
| Baseline (`HEAD`, sin el cambio) | 74/100 | 5 | 0 | 2 |
| Con el cambio | 73/100 | 6 | 0 | 2 |

**Cero errores en ambos**, que es la condicion dura. La diferencia es exactamente un warning nuevo.

## El warning nuevo: `no-barrel-import` en ContenidoScreen.tsx:43

> Performance: Import from a barrel file. This ships extra code in your app bundle & slows startup.
> Import directly from "../../components/assign/AssignSheet".

**Clasificacion: falso positivo verificado.** No se corrige y no se registra como deuda. Tres razones,
en orden de peso:

1. **El impacto que afirma no existe aqui.** El barrel `src/components/assign/index.ts` exporta
   exactamente dos valores en runtime: `AssignSheet` y `useAssignSheet` (lo demas son tipos, que se
   borran al compilar). Y `AssignSheet.tsx` importa `useAssignSheet` por su cuenta. Es decir, el grafo
   de modulos que se carga importando el barrel es **identico** al que se carga importando el
   componente directo. La regla es correcta como heuristica general sobre barrels grandes; sobre este
   barrel de dos exports no hay codigo extra que enviar.

2. **Es el patron vigente y deliberado.** La adopcion de referencia,
   `src/screens/biblioteca/ListaRecursosScreen.tsx:25`, produce **el mismo warning con el mismo
   texto**. El barrel existe justamente como puerta unica de la capacidad: su encabezado lo declara
   ("Una sola hoja para toda la app... por eso Office, Clases y Conecta pueden montarla en las olas
   siguientes sin copiarla"). Importar el componente directo desde cada superficie erosiona esa puerta.

3. **La guardia estructural depende de ella.** El guardarrail nuevo
   (`guardarrailesAssign.test.ts`, "las superficies adoptantes no reimplementan la asignacion")
   verifica que cada superficie monta la hoja desde el barrel. Es la forma barata de detectar que una
   superficie futura se salta la capacidad compartida.

Corregir el warning exigiria, entonces, romper el patron de la adopcion de referencia y debilitar una
guardia, a cambio de cero bytes de bundle. La politica del motor de deuda es explicita en que la
salida de un scanner es un candidato y no autoriza una correccion sin verificacion; aqui la
verificacion dice que no hay defecto.

## Los otros cinco warnings

Los cinco del baseline siguen igual y son preexistentes; ninguno lo introduce ni lo agrava este
change:

- `exhaustive-deps` en `ContenidoScreen.tsx:492` (preexistente).
- `rn-no-scrollview-mapped-list` en `ContenidoScreen.tsx:842` (preexistente).
- `rerender-state-only-in-handlers` sobre `itemToSend` (preexistente).
- Componente de mas de 300 lineas (preexistente; rediseñar la pantalla es no objetivo declarado).
- El quinto pertenece al otro archivo del directorio.

Nota sobre el estado nuevo `itemParaAsignar`: **no** dispara
`rerender-state-only-in-handlers`, porque a diferencia de `itemToSend` si se lee en el render (decide
si la hoja se monta). Por eso es `useState` y no `useRef`.
