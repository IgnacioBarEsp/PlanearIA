## ADDED Requirements

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

## MODIFIED Requirements

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
