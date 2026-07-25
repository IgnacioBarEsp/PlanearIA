# reactive-breakpoints Specification

## Purpose
TBD - created by archiving change breakpoints-reactivos. Update Purpose after archive.
## Requirements
### Requirement: La interfaz se reacomoda al redimensionar o rotar sin recargar

Una pantalla cuyo layout depende del ancho SHALL reacomodarse al instante cuando cambia el ancho disponible (rotacion de tablet o redimension de la ventana web), sin recargar ni reiniciar la app. El sistema SHALL derivar el ancho de una fuente reactiva, no de una lectura instantanea congelada al importar.

Este requisito define **como se reacciona al ancho**. No cambia el aspecto de ninguna pantalla a un ancho dado: a igual ancho, la presentacion es equivalente a la previa al change.

#### Scenario: El docente rota la tablet

- **WHEN** el docente rota el dispositivo estando en una pantalla dependiente de ancho
- **THEN** la pantalla recalcula su layout para el nuevo ancho de inmediato, sin recargar

#### Scenario: El docente redimensiona la ventana del navegador

- **WHEN** el docente arrastra el borde de la ventana web y cruza un limite de rango (768 o 1280)
- **THEN** la pantalla adopta el layout del nuevo rango sin recargar

#### Scenario: Ventana web angosta se ve como movil

- **WHEN** el docente reduce la ventana web por debajo de 768px de ancho
- **THEN** la pantalla adopta el layout movil, no el de escritorio, aunque la plataforma sea web

### Requirement: Existe una fuente reactiva unica de breakpoints con tres rangos

El sistema SHALL exponer un unico punto de consumo reactivo que clasifique el ancho actual en tres rangos: movil (`<768`), tablet (`768-1279`) y escritorio (`>=1280`). Ese punto SHALL exponer tambien el ancho, el alto y el factor de escala tipografica actuales, y SHALL actualizarse ante cambios de dimension. El sistema SHALL ofrecer un resolutor por rango para valores de estilo, utilizable donde no se puede invocar el hook (fabricas de estilos).

#### Scenario: Clasificacion por rango

- **WHEN** el ancho actual es 767, 768, 1279 o 1280
- **THEN** el punto de consumo lo clasifica como movil, tablet, tablet y escritorio respectivamente

#### Scenario: El rango se actualiza al cambiar de ancho

- **WHEN** el ancho cambia de un rango a otro
- **THEN** el consumidor del punto de consumo recibe el rango nuevo sin intervencion manual

#### Scenario: Resolutor por rango para estilos

- **WHEN** una fabrica de estilos pide un valor con variantes movil, tablet y escritorio para el rango activo
- **THEN** recibe la variante del rango activo, y la variante de escritorio omitida cae a la de tablet

### Requirement: No quedan lecturas de dimensiones congeladas

El sistema SHALL NOT depender de una lectura instantanea de dimensiones (`Dimensions.get()`) para
calcular estilos o layout. Ningun estilo dependiente de ancho SHALL quedar fijado al valor presente en
el momento de importar el modulo.

Esta prohibicion SHALL estar respaldada por la misma verificacion ejecutable que vigila la fuente unica,
y no por una auditoria manual. Una lectura instantanea SHALL fallar la validacion en cualquier archivo
de producto, incluida la propia fuente autorizada: la autorizacion para envolver la primitiva reactiva
SHALL NOT extenderse a la lectura congelada.

#### Scenario: Estilo dependiente de ancho tras la migracion

- **WHEN** una pantalla migrada calcula un tamano que depende del ancho
- **THEN** ese tamano se evalua con el ancho reactivo vigente, no con una foto tomada al importar

#### Scenario: El repositorio no reintroduce la lectura congelada

- **WHEN** un archivo de producto introduce una lectura instantanea de dimensiones
- **THEN** la verificacion ejecutable falla nombrando el archivo, sin depender de que alguien recuerde
  auditarlo

#### Scenario: La lectura congelada no puede usarse para eludir la fuente unica

- **WHEN** un archivo obtiene un ancho mediante la lectura instantanea en vez de importar la primitiva
  reactiva
- **THEN** la verificacion falla igualmente, porque de lo contrario bastaria cambiar de primitiva para
  reintroducir una segunda fuente de ancho sin que nada lo detecte

### Requirement: La migracion preserva estados, accesibilidad y las pantallas ya reactivas

Migrar una pantalla a la fuente reactiva unica SHALL ser un cambio de mecanismo, no de aspecto ni de comportamiento. La pantalla migrada SHALL conservar sus estados de carga, error y contenido, sus etiquetas accesibles y su area de toque minima. Las pantallas que ya reaccionaban al ancho por su cuenta SHALL conservar sus umbrales propios. El helper de plataforma existente SHALL permanecer con su semantica intacta.

#### Scenario: Estados preservados tras migrar

- **WHEN** una pantalla migrada entra en estado de carga o error, o muestra su contenido
- **THEN** presenta el mismo estado que antes de la migracion, ahora reaccionando al ancho reactivo

#### Scenario: Accesibilidad en cada rango

- **WHEN** la pantalla migrada se muestra en movil, tablet o escritorio
- **THEN** conserva sus etiquetas accesibles y un area de toque minima de 44pt en cada rango

#### Scenario: Los umbrales propios no cambian

- **WHEN** una pantalla que ya reaccionaba al ancho con un umbral a medida se migra a la fuente unica
- **THEN** conserva ese umbral y su comportamiento; solo cambia de donde lee el ancho

#### Scenario: El helper de plataforma sigue siendo de plataforma

- **WHEN** una pantalla usa el helper de plataforma para diferenciar web de nativo
- **THEN** ese helper sigue respondiendo por plataforma y no por ancho, sin cambio de comportamiento

### Requirement: Toda lectura de dimensiones de ventana pasa por el punto de consumo unico

El codigo de producto SHALL obtener el ancho, el alto y el rango vigentes exclusivamente del punto de
consumo reactivo unico. Ningun archivo de producto SHALL leer las dimensiones de ventana de la
plataforma por su cuenta.

El punto de consumo unico SHALL exponer las dimensiones crudas ademas del rango, de modo que una
superficie que necesita pixeles (el ancho de una grafica, de una diapositiva o de una pagina) pueda
enrutarse por el mismo punto sin verse obligada a adoptar una clasificacion por rango que no usa.

El codigo de prueba queda fuera de este requisito: necesita nombrar la primitiva de plataforma para
simular anchos, y no es superficie de producto.

#### Scenario: Una pantalla necesita saber el rango

- **WHEN** una pantalla decide su layout segun la clase de dispositivo
- **THEN** obtiene el rango del punto de consumo unico, y no compara un ancho crudo leido por su cuenta

#### Scenario: Una superficie necesita pixeles y no un rango

- **WHEN** una superficie calcula un tamano en pixeles a partir del ancho disponible
- **THEN** obtiene ese ancho del punto de consumo unico, sin quedar obligada a clasificarlo en un rango

#### Scenario: Un archivo nuevo intenta leer las dimensiones por su cuenta

- **WHEN** un archivo de producto importa la primitiva de dimensiones de la plataforma sin estar
  autorizado
- **THEN** la validacion del repositorio falla nombrando el archivo y el punto de consumo que debe usar

#### Scenario: Las pruebas pueden simular anchos

- **WHEN** una prueba mockea la primitiva de dimensiones de la plataforma para simular un ancho
- **THEN** la validacion pasa, porque el codigo de prueba no es superficie de producto

### Requirement: El registro de fuentes autorizadas de dimensiones se verifica y solo puede encoger

El repositorio SHALL mantener un registro explicito de los archivos autorizados a leer la primitiva de
dimensiones de la plataforma, y ese registro SHALL estar respaldado por una verificacion ejecutable y
reproducible en local y en CI.

La verificacion SHALL comprobar tres invariantes: que ningun archivo de producto fuera del registro
importe la primitiva, que todo archivo del registro siga importandola, y que el registro no crezca por
encima de su techo declarado. La ausencia de un fallo de lint SHALL NOT considerarse evidencia de que el
registro este sincronizado.

La verificacion SHALL NOT delegarse a una regla de lint cuya activacion pueda quedar desactivada por
configuracion en parte de la superficie que vigila, porque en esos archivos su silencio seria
indistinguible del exito.

#### Scenario: Un consumidor no autorizado reaparece

- **WHEN** un archivo de producto fuera del registro importa la primitiva de dimensiones
- **THEN** la verificacion falla nombrando el archivo

#### Scenario: Una entrada del registro deja de necesitar la autorizacion

- **WHEN** un archivo listado en el registro deja de importar la primitiva, o se borra del repositorio
- **THEN** la verificacion falla nombrando la entrada muerta, porque el registro estaria declarando una
  autorizacion que ya no corresponde a nada

#### Scenario: Alguien intenta hacer crecer el registro

- **WHEN** el registro supera el techo declarado en la verificacion
- **THEN** la verificacion falla, y ampliarlo exige editar el techo de forma visible en review

#### Scenario: La guardia no pasa en vacio

- **WHEN** la verificacion se ejecuta contra un arbol donde los consumidores directos siguen presentes
- **THEN** falla enumerandolos, y no reporta exito por no haber encontrado nada que mirar

#### Scenario: La verificacion cubre la superficie de producto fuera del directorio principal

- **WHEN** un archivo de producto que no vive bajo el directorio principal de codigo, como el punto de
  arranque de la app, lee la primitiva de dimensiones
- **THEN** la verificacion falla nombrandolo, porque su alcance es la superficie de producto declarada y
  no un directorio

### Requirement: El rango de dispositivo y el umbral de contenido son conceptos distintos

El sistema SHALL distinguir el **rango de dispositivo**, que clasifica la clase de pantalla y comparten
el shell y las superficies que dependen de esa clase, del **umbral de contenido**, que expresa a partir
de que ancho una pantalla concreta acomoda una disposicion distinta.

Una superficie cuyo umbral coincide con un limite de rango SHALL expresarlo mediante el rango y no
repitiendo el numero, de modo que conmute en el mismo punto que el shell. Una superficie con un umbral
de contenido propio SHALL conservarlo y leer el ancho del punto de consumo unico; cambiar ese umbral es
una decision de diseno y SHALL NOT ocurrir como efecto de una migracion de mecanismo.

#### Scenario: Umbral que coincide con un limite de rango

- **WHEN** una superficie decide su layout comparando el ancho contra 768 o contra 1280
- **THEN** expresa esa decision mediante el rango del punto de consumo unico, y conmuta exactamente en el
  mismo punto que el shell

#### Scenario: Umbral de contenido propio

- **WHEN** una superficie decide su layout a partir de un ancho que no corresponde a ningun limite de
  rango
- **THEN** conserva ese umbral y lo evalua sobre el ancho del punto de consumo unico

#### Scenario: Una migracion de mecanismo no mueve umbrales

- **WHEN** una superficie con umbral de contenido propio se migra al punto de consumo unico
- **THEN** a igual ancho presenta el mismo layout que antes de la migracion

