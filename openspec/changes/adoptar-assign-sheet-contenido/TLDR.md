# TLDR: adoptar-assign-sheet-contenido

## Que problema resolvemos y por que ahora (Proposal)

En la pantalla Contenido, la opcion "Asignar a grupo" no hace nada: responde con un aviso de
"proximamente" sobre una funcion que ya existe y que ya funciona en Biblioteca. Al revisar la pantalla
para conectarla aparecio un segundo problema en el mismo archivo: el otro camino de asignacion avisa
"exito" siempre, incluso cuando no guardo nada. Este change conecta el selector real y corrige ese aviso
falso. No rediseña la pantalla ni cambia donde vive.

## Como lo vamos a construir (Design)

Se reutiliza el selector compartido que ya existe, con el mismo patron que la pantalla de Biblioteca ya
usa: la pantalla solo dice **que** elemento se asigna, y el selector se encarga de elegir destino,
confirmar y guardar. El menu de opciones deja de ser una lista fija y se arma segun el tipo de elemento,
asi que planeaciones y plantillas dejan de mostrar una opcion que no pueden cumplir. Los colores locales
de la pantalla quedan intactos por una excepcion vigente, pero tampoco crecen: lo nuevo usa el tema.

## Que comportamiento queda garantizado (Spec)

La regla que se agrega al contrato compartido es sencilla: una pantalla solo ofrece "asignar" sobre
elementos que el selector puede asignar de verdad. Nada de botones apagados ni de avisos de
"proximamente" como sustituto. Lo demas ya estaba escrito y se conserva: el guardado siempre pasa por la
cola de sincronizacion, la confirmacion nombra el destino elegido, y el resultado dice la verdad,
distinguiendo lo que ya subio al servidor de lo que quedo guardado en el dispositivo.

## Como se va a trabajar y comprobar (Tasks)

Primero se conecta el selector y se arma el menu por tipo. Despues se corrige el aviso de exito del otro
camino. Luego llegan las pruebas: que la opcion aparece donde debe y desaparece donde no, que cancelar
no guarda nada, y sobre todo que lo guardado **sobrevive a una sincronizacion** con trabajo pendiente,
que es el modo de fallo que ya costo perdida de datos antes. Cada prueba nueva debe fallar sin el
cambio. Cierra con revision visual por tamaño de pantalla y tema, y revision adversarial.

## Resumen integral del change

Contenido tenia un boton que prometia asignar y no asignaba, y otro camino que decia "listo" sin
comprobar nada. Ambas cosas se corrigen sin rediseñar la pantalla ni tocar su deuda de color aceptada.
La funcion no se reinventa: se adopta la que ya existe, para que asignar se sienta igual en toda la app
y el trabajo del docente no se pierda al sincronizar. Donde la funcion no aplica, la opcion simplemente
no aparece, en vez de fingir que llegara despues. La prueba clave es que lo guardado sobreviva al
siguiente ciclo de sincronizacion.
