# TLDR: restaurar-fixture-estructural-doctor

## Que problema resuelve (intencion del proposal)

El arranque de cualquier flujo SDD pasa por `npm run harness:doctor`, y este fallaba en el check de
GitNexus con el indice al dia. Parecia que la prueba de referencia habia quedado desactualizada. No era
eso: la prueba decia la verdad y lo que se habia estropeado era el indice local. El problema de fondo es
que el comando de reparacion mide su exito solo por si el indice esta al dia, asi que sobre un indice al
dia pero roto por dentro no hacia nada y aun asi reportaba exito. Quedaba un fallo sin salida
documentada.

## Como se aborda (enfoque del design)

Se corrige la reparacion, no la prueba. Ahora `gitnexus:repair` comprueba tambien que el grafo responda,
usando la misma verificacion que ya comparten el doctor y el comando de verificacion. Si un indice al
dia no responde, reconstruye el indice completo y vuelve a comprobar; si aun asi falla, se detiene y
dice cual es la causa. La prueba de referencia no se toca, porque se comprobo que describe el nodo
correcto: el que realmente carga las dependencias del simbolo.

## Que comportamiento queda garantizado (spec)

La spec de salud del indice se endurece. Antes solo exigia que la reparacion no cantara victoria
dejando el indice atrasado; ahora tampoco puede cantar victoria dejando el grafo sin resolver su prueba
de referencia. Se anaden los tres desenlaces posibles: indice al dia que no responde, reconstruccion que
lo arregla, y reconstruccion que no lo arregla. Nada se relaja: se conserva la identificacion exacta del
simbolo, la exigencia de resolucion exacta y el fallo sin rebajarlo a aviso.

## Como se implementa (plan de tareas)

Primero se registra la evidencia de la causa: estado del grafo antes y despues, comprobacion de que el
programa fijado no cambio, y el doctor antes y despues. Luego se extiende la reparacion con la
comprobacion estructural y su reconstruccion. Despues se anaden pruebas de regresion, incluida una que
demuestra que no son de adorno: contra el simbolo equivocado deben fallar. Al final se corrigen tres
estados obsoletos del plan de UX/UI y se cierra con la validacion completa y la revision adversarial.

## Resumen integral del change

El doctor volvia a fallar por su prueba estructural. La investigacion descarto que el programa indexador
hubiera cambiado y descubrio que casi dos mil nodos del grafo local habian perdido su identificador,
conservando sus relaciones. Reconstruir el indice lo restauro todo. Por eso no se cambia la prueba: se
arregla el comando de reparacion, que hasta ahora podia declarar exito sobre un grafo roto. Se anaden
pruebas que habrian detectado el estado, se endurece la spec y se corrige documentacion que declaraba
pendiente trabajo ya terminado. No se toca codigo de producto ni interfaz.
