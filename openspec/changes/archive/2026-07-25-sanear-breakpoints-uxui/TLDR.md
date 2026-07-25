# TLDR: sanear la fuente de breakpoint (Ola 2b)

## Que problema resuelve

PlanearIA ya tiene un lugar unico que dice si la pantalla es de movil, tablet o escritorio. El shell lo
usa. Pero 27 archivos preguntaban el ancho por su cuenta, cada uno con su propio numero. Nada se veia
mal hoy, porque todos reaccionan al redimensionar. El problema es de mantenimiento: cambiar un rango
obligaba a revisar el proyecto entero, y nada impedia que un archivo nuevo volviera a preguntar por su
cuenta. En la ola anterior aprendimos que una regla sin verificador se degrada en silencio.

## Como lo resuelve

Los 27 archivos pasan a leer del lugar unico. Ese lugar ya entrega tanto el rango como el ancho en
pixeles, asi que quien necesitaba pixeles (una grafica, el carrusel de bienvenida, la pagina del editor)
sigue teniendolos sin verse forzado a nada. Ademas se agrega una verificacion automatica que falla si
alguien vuelve a preguntar por su cuenta. Esa verificacion es un script propio, porque se comprobo que
una regla de lint quedaria apagada en 10 de los 27 archivos.

## Que cambia para el docente

Nada visible. A cada ancho de ventana, cada pantalla se ve exactamente igual que antes. Once pantallas
que ya cambiaban justo en 768 o 1280 ahora lo hacen por el mismo criterio que la barra de navegacion, asi
que dejan de poder desalinearse de ella. Las que usan una medida propia (por ejemplo, dos columnas a
partir de 1080) la conservan: moverla seria rediseno, y esto es limpieza.

## Plan de trabajo

Primero la verificacion, probando que falla contra el codigo actual para no fabricar un verde vacio.
Luego los 27 archivos en tres grupos: los que usan un limite oficial, los que usan medida propia y los
que solo necesitan pixeles. Despues pruebas que demuestran que la pantalla realmente cambia al cambiar
de rango, comprobadas revirtiendo el codigo para verlas fallar. Cierra con validacion completa, QA
visual en tres anchos y revision adversarial.

## Resumen integral

Esta es la ultima ola del saneamiento del plan UX/UI. Deja una sola fuente de verdad para el ancho, con
un candado que impide reintroducir la segunda, y sin tocar como se ve la app. Resuelve el item de deuda
`debt-3d3ea5ba87ac` y, junto con la excepcion measure-first de `debt-5862d25288fa`, cierra el epic #141
con el plan en presupuesto cero. Queda declarado sin maquillaje que algunas pantallas siguen cambiando
de layout en un punto propio distinto del shell: eso es una decision de diseno de las olas de rediseno,
no de esta limpieza, y queda rastreada como tal.
