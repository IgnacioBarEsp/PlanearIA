# No vacuidad por mutacion

## Procedimiento

Se conservaron las pruebas nuevas y se revirtio **solo** el codigo de produccion
(`src/screens/contenido/ContenidoScreen.tsx`) al estado de `HEAD`, es decir, al arbol sin la
adopcion. Despues se restauro el codigo y se reejecutaron las mismas suites.

```bash
git checkout -- src/screens/contenido/ContenidoScreen.tsx
npx jest --runInBand --testPathPattern="(contenido/ContenidoScreen|sync/asignacionContenidoEncolada|components/assign/guardarrailesAssign)"
```

## Resultado contra el arbol SIN el cambio

```
Test Suites: 3 failed, 3 total
Tests:       11 failed, 38 passed, 49 total
```

Las once que fallan son exactamente las que describen comportamiento nuevo:

```
● ContenidoScreen › accion Asignar a grupo › ofrece la accion en un recurso y abre el selector canonico con ese elemento
● ContenidoScreen › accion Asignar a grupo › ofrece la accion en un entregable y traduce su tipo
● ContenidoScreen › accion Asignar a grupo › no ofrece la accion en una planeacion
● ContenidoScreen › accion Asignar a grupo › no ofrece la accion en una plantilla
● ContenidoScreen › accion Asignar a grupo › no sustituye la accion ausente por un aviso de disponibilidad futura
● ContenidoScreen › modo seleccion › afirma el resultado y vuelve atras cuando si hubo escritura
● ContenidoScreen › modo seleccion › no afirma exito ni vuelve atras cuando no hubo ninguna escritura
● asignar desde Contenido encola y sobrevive al pull (#114) › conserva la asignacion cuando el servidor devuelve el recurso sin grupo
● asignar desde Contenido encola y sobrevive al pull (#114) › cancelar no escribe ni encola nada
● asignar desde Contenido encola y sobrevive al pull (#114) › no afirma exito cuando el elemento ya no existe y no escribe nada
● las superficies adoptantes no reimplementan la asignacion › ContenidoScreen.tsx monta la hoja compartida desde el barrel
```

## Resultado contra el arbol CON el cambio

```
Test Suites: 4 passed, 4 total
Tests:       56 passed, 56 total
```

## Las tres aserciones nuevas que NO cambian de signo, y por que

No todo lo que se agrego es sensible a la mutacion, y decirlo importa mas que inflar el conteo:

1. **`conserva el resto de opciones del menu en un tipo no asignable`** pasa en ambos arboles a
   proposito. Es una prueba de **no regresion**: construir el menu por tipo podia perder por
   descuido opciones que no tienen nada que ver con asignar. Su valor esta en fallar si una
   refactorizacion futura las tira, no en distinguir este commit.
2. **`no monta el selector mientras no se dispara la accion`** tambien pasa en ambos, porque en el
   arbol viejo no hay selector que montar. Vigila que la hoja no se monte de forma incondicional al
   abrir el menu, que seria un coste innecesario y un cambio de foco no pedido.
3. **`las superficies adoptantes no abren almacenamiento, cola ni cliente propios`** pasa en ambos:
   ninguna de las dos superficies lo hacia antes tampoco. Es una guardia permanente contra la
   reintroduccion del defecto de #84, no una prueba de este commit. Su no vacuidad se comprueba por
   construccion: la guardia rechaza cualquier superficie que agregue `AsyncStorage`,
   `queueEntityOperation`, `fetch(` o una clave `@planearia:` literal.

La asercion hermana de esa guardia, `monta la hoja compartida desde el barrel`, **si** falla contra
el arbol viejo, porque `ContenidoScreen` no importaba la hoja. Por eso aparece en la lista de once.
