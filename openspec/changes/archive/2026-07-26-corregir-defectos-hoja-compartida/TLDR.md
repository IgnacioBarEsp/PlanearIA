# TLDR - corregir-defectos-hoja-compartida

## Por que se hace este cambio (Proposal)

Al adoptar la hoja de asignacion en Contenido quedaron tres problemas anotados. Dos son fallas reales de la hoja que usan todas las pantallas: cuando algo sale mal, siempre dice "no se pudieron cargar los destinos", aunque lo que fallo fuera guardar; y su boton de cerrar mide 28 puntos en la version web, cuando la regla escrita pide 44. El tercero es que faltaban pruebas de dos situaciones desde Contenido. Este cambio cierra los tres y devuelve el plan de UX/UI a su presupuesto sano.

## Como se resuelve (Design)

La hoja pasa a distinguir dos fallas distintas: no poder cargar las clases y no poder guardar. Cada una muestra su propio aviso y ofrece la accion que de verdad repara lo que fallo. Si guardar se corta a la mitad, la hoja dice cuantos elementos alcanzaron a guardarse, y reintentar continua desde donde quedo en vez de repetir lo ya hecho. Para el boton de cerrar se crea una pieza reutilizable que garantiza 44 puntos reales, sin que el encabezado crezca. Se anade una prueba que impide volver a caer en el mismo error.

## Que debe hacer el sistema (Spec)

Queda escrito que la hoja nunca debe presentar una falla con el lenguaje de la otra, y que la accion ofrecida debe corresponder a la causa: recargar clases si eso fue lo que fallo, reintentar la asignacion si lo que fallo fue guardar. Tambien queda escrito que un guardado interrumpido debe decir cuantos elementos quedaron guardados y cuantos faltan, y que reintentar no debe repetir lo ya guardado. Si el docente cambia de destino, en cambio, todo se vuelve a guardar hacia el destino nuevo.

## Como se ejecuta (Tasks)

Primero se mide el estado actual en el navegador, para poder comparar despues con numeros y no con impresiones. Luego se separan las dos fallas en la hoja, se corrige el boton de cerrar en las tres piezas base que comparten el defecto, y se anaden las pruebas que faltaban. Cada prueba nueva se comprueba contra el codigo viejo para confirmar que no pasa por casualidad. Al final se mide otra vez, se toman capturas en tres anchos y en los dos temas, y se revisa todo de forma adversarial.

## Resumen integral del change

La hoja de asignacion es compartida por toda la app, asi que sus defectos se multiplican. Este cambio hace que diga la verdad cuando algo falla, que no pierda de vista el trabajo ya guardado y que su boton de cerrar se pueda tocar de verdad en web. No rediseña nada ni migra los otros veintiocho lugares con el mismo patron de area tactil: los mide, los deja registrados con evidencia y anade una guardia para que no aparezcan mas. El resultado es un flujo de saneamiento que cierra tres deudas anotadas sin generar ninguna nueva sin registrar.
