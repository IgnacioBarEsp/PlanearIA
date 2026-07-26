# No vacuidad por mutacion

## Procedimiento

Se conservan las pruebas nuevas y se revierte **solo** el codigo de produccion
(`src/screens/contenido/ContenidoScreen.tsx`) al estado de `development`, es decir, al arbol sin la
adopcion. Despues se restaura y se reejecutan las mismas suites.

```bash
git stash push -- src/screens/contenido/ContenidoScreen.tsx
git checkout development -- src/screens/contenido/ContenidoScreen.tsx
npx jest --runInBand --testPathPattern="(contenido/ContenidoScreen|sync/asignacionContenido|components/assign/guardarrailesAssign)"
```

> Correccion respecto a la primera version de este documento: usaba `git checkout -- <archivo>`, que
> restaura **desde el indice** y por tanto devuelve la version de la rama, no la de `development`. Con
> el cambio ya commiteado ese comando era un no-op y el procedimiento no reproducia su propio
> resultado. El comando correcto nombra la rama base: `git checkout development -- <archivo>`. La
> revision adversarial detecto el error; el resultado que se afirmaba **si** se sostuvo al reproducirlo
> bien, y esta corrida es la buena.

## Resultado contra el arbol SIN el cambio

```
Test Suites: 4 failed, 4 total
Tests:       23 failed, 38 passed, 61 total
```

Las 23 que fallan son exactamente las que describen comportamiento nuevo:

```
ContenidoScreen › accion Asignar a grupo › ofrece la accion en un recurso y abre el selector canonico con ese elemento
ContenidoScreen › accion Asignar a grupo › ofrece la accion en un entregable y traduce su tipo
ContenidoScreen › accion Asignar a grupo › no ofrece la accion en una planeacion
ContenidoScreen › accion Asignar a grupo › no ofrece la accion en una plantilla
ContenidoScreen › accion Asignar a grupo › no sustituye la accion ausente por un aviso de disponibilidad futura
ContenidoScreen › accion Asignar a grupo › no ofrece la accion cuando el id de la entidad es nulo
ContenidoScreen › accion Asignar a grupo › no ofrece la accion cuando el id de la entidad es cadena vacia
ContenidoScreen › accion Asignar a grupo › no ofrece la accion cuando el id de la entidad es cero
ContenidoScreen › accion Asignar a grupo › no ofrece la accion cuando el id de la entidad es texto
ContenidoScreen › accion Asignar a grupo › no ofrece la accion cuando el id de la entidad es ausente
ContenidoScreen › accion Asignar a grupo › acepta un id numerico entregado como cadena
ContenidoScreen › modo seleccion › afirma el resultado y vuelve atras cuando si hubo escritura
ContenidoScreen › modo seleccion › no afirma exito ni vuelve atras cuando no hubo ninguna escritura
ContenidoScreen › modo seleccion › convierte el grupo destino a numero antes de escribir
ContenidoScreen › modo seleccion › distingue encolado de sincronizado con el vocabulario compartido
ContenidoScreen › modo seleccion › afirma sincronizado cuando la cola quedo drenada
ContenidoScreen › modo seleccion › no deja elegir tipos que la asignacion no puede escribir
asignar desde Contenido encola y sobrevive al pull (#114) › conserva la asignacion cuando el servidor devuelve el recurso sin grupo
asignar desde Contenido encola y sobrevive al pull (#114) › cancelar no escribe ni encola nada
asignar desde Contenido encola y sobrevive al pull (#114) › no afirma exito cuando el elemento ya no existe y no escribe nada
asignar sin conexion y subir al reconectar (#114) › guarda y encola sin conexion, y sube sola al reconectar sin intervencion del docente
asignar sin conexion y subir al reconectar (#114) › no pierde la asignacion si el primer intento de subida falla
las superficies adoptantes no reimplementan la asignacion › ContenidoScreen.tsx monta la hoja compartida desde el barrel
```

## Resultado contra el arbol CON el cambio

```
Test Suites: 5 passed, 5 total
Tests:       68 passed, 68 total
```

## Las tres aserciones nuevas que NO cambian de signo, y por que

No todo lo que se agrego es sensible a la mutacion, y decirlo importa mas que inflar el conteo:

1. **`conserva el resto de opciones del menu en un tipo no asignable`** pasa en ambos arboles a
   proposito. Es una prueba de **no regresion**: construir el menu por tipo podia perder por descuido
   opciones que no tienen nada que ver con asignar. Su valor esta en fallar si una refactorizacion
   futura las tira, no en distinguir este commit.
2. **`no monta el selector mientras no se dispara la accion`** tambien pasa en ambos, porque en el
   arbol viejo no hay selector que montar. Vigila que la hoja no se monte de forma incondicional al
   abrir el menu.
3. **`las superficies adoptantes no abren almacenamiento, cola ni cliente propios`** pasa en ambos:
   ninguna de las dos superficies lo hacia antes tampoco. Es una guardia permanente contra la
   reintroduccion del defecto de #84, no una prueba de este commit. Su no vacuidad es por
   construccion: rechaza cualquier superficie que agregue `AsyncStorage`, `queueEntityOperation`,
   `fetch(` o una clave `@planearia:` literal.

La asercion hermana de esa guardia, `monta la hoja compartida desde el barrel`, **si** falla contra el
arbol viejo y por eso aparece en la lista de 23.
