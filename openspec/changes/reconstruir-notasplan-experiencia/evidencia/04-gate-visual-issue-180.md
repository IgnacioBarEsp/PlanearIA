# Gate visual de NotasPLAN — recorridos preparados para Figma Present

**Fecha de preparación:** 2026-09-05
**Issue:** [#180](https://github.com/IgnacioBarEsp/PlanearIA/issues/180)
**Estado:** recorridos preparados (tarea 7.1). **El gate no está pasado.** Las tareas 7.2 a 7.6 requieren al
owner.

Archivo `VBK5tK7EQS83tdTmtuBpI9`, página `60:2`, sección `NotasPLAN · candidate · #180` (`516:974`).

## Cómo entrar

| Breakpoint | Frame inicial | Nodo |
| --- | --- | --- |
| Escritorio | NotasPLAN · editor · escritorio | `516:975` |
| Tablet | NotasPLAN · editor · tablet | `518:974` |
| Móvil | NotasPLAN · editor · móvil | `518:1025` |

Para recorrer la entrada real, empieza en Office (`461:969`, `461:1050`, `461:1108`) y crea un documento.

## N-01 · La hoja es el archivo

1. Entra al editor. **Comprueba:** ves una hoja con formato de página declarado, no un formulario con vista
   previa. Los siete encabezados están dentro del documento, con nombre.
2. Recorre el índice y activa una sección. **Comprueba:** el índice refleja lo que hay en la hoja.
3. **Comprueba:** el formato de página aparece como un dato ("A4 · 794 × 1123 · se elige al crear"), no como
   un interruptor que no cambia nada. Dime si prefieres un cambio real, que costaría duplicar superficies.

## N-02 · La barra refleja dónde estás

1. Pulsa cualquier comando de la barra. **Comprueba:** llegas a la variante donde `Lista` está activo y la
   línea de contexto dice "Cursor en una lista".
2. Pulsa otro comando para volver. **Comprueba:** no hay cinta de pestañas en ninguna parte.

## N-03 · La lente de formulario

1. Activa `Formulario`. **Comprueba:** ves los campos de la sección activa y la pantalla declara que es
   "una vista de lo que ya está en el documento".
2. Pulsa `Ver la hoja`. **Comprueba:** vuelves a la hoja sin perder nada.
3. En móvil, **comprueba** que la hoja es lo primero y el formulario está a un toque, no al revés.

**Pregunta abierta 1:** ¿editar en línea sobre la hoja en 390 px es cómodo en Sesiones, que lleva tarjetas?

## N-04 · Crear desde plantilla, con niveles

1. Desde Office, crea un documento con la plantilla Planeación didáctica. **Comprueba:** aparecen los tres
   niveles con `moderado` sugerido, y el aviso dice que ninguna opción bloquea.
2. Pulsa `Crear el documento` sin elegir nivel. **Comprueba:** se crea igual.

**Pregunta abierta 3:** ¿se distinguen los tres niveles al leerlos?

## N-05 · Las acciones del documento

1. Recorre descargar, asignar, guardar como plantilla, historial y compartir.
2. **Comprueba en descargar:** nombra el formato y dice que el prototipo no descarga.
3. **Comprueba en compartir:** ofrece copia y enlace, y declara que el enlace es de sólo lectura y
   revocable. Al copiar el enlace aparece la solicitud de permiso.
4. **Comprueba en la solicitud:** puedes permitir editar, dejar en sólo ver, o rechazar.
5. **Comprueba en historial:** hay puntos de guardado con nombre y fecha.

## N-06 · La IA propone, tú decides

1. Pulsa `Pedir propuesta a la IA`. **Comprueba:** ves lo que tienes junto a lo que propone, y nada se ha
   aplicado.
2. **Comprueba:** puedes descartar, y el aviso dice que el prototipo no genera texto.

## N-07 · Los nueve estados

Abre `NotasPLAN · estados · escritorio` (`525:980`). **Comprueba:** pendiente y conflicto se distinguen, y
el estado de reimportación dice qué volvió y qué no.

**Pregunta abierta 4:** ¿el estado de reimportación se entiende, o alarma de más?

## N-08 · Lo que aún no existe

1. Desde Office, intenta crear un Instrumento de evaluación. **Comprueba:** llega el estado de límite del
   mismo ancho, no un editor simulado.
2. En tablet, **comprueba** que crear desde plantilla no te entrega una pantalla de escritorio. Esto fue un
   defecto real que la auditoría encontró y corrigió durante el apply.

## Qué debe producir el gate

- Veredicto explícito en #180: aprobado, aprobado con condiciones, o rechazado.
- Si hay condiciones, se corrigen dentro del change y se vuelve a recorrer.
- Sólo después se promueven los frames.

Hasta entonces las 33 superficies permanecen `candidate`.
