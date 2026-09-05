# Gate visual de Office — recorridos preparados para Figma Present

**Fecha de preparación:** 2026-09-04
**Issue:** [#177](https://github.com/IgnacioBarEsp/PlanearIA/issues/177)
**Estado:** recorridos preparados (tarea 7.1). **El gate no está pasado.** Las tareas 7.2 a 7.6 requieren
al owner y no se ejecutan sin él.

Archivo: `VBK5tK7EQS83tdTmtuBpI9`, página `60:2`, sección `Office · candidate · #177` (`461:968`).

## Cómo entrar

| Breakpoint | Frame inicial | Nodo |
| --- | --- | --- |
| Escritorio | Office Docente · escritorio | `461:969` |
| Tablet | Office Docente · tablet | `461:1050` |
| Móvil | Office Docente · móvil | `461:1108` |

## Recorrido O-01 · Crear (los tres breakpoints)

1. Entra a Office. **Comprueba:** documento, hoja y presentación están visibles al entrar, sin abrir ningún
   modal. En móvil, comprueba que los tres se ven sin desplazarte.
2. Pulsa `Empezar en blanco` en cualquier tipo. **Comprueba:** llega el estado que nombra el límite, no un
   editor simulado, y del ancho correcto.
3. Pulsa `Volver`. **Comprueba:** regresa exactamente al punto de origen.
4. Vuelve a Office y abre una plantilla. En móvil el control es `Plantillas` y lleva a la hoja de plantillas
   `477:974`. **Comprueba:** ninguna plantilla se impone antes de elegir el tipo.

**Pregunta abierta 1:** ¿la zona de creación compite con la biblioteca en 390?
**Pregunta abierta 4:** ¿la hoja de plantillas de móvil debería ser por tipo en vez de una sola?

## Recorrido O-02 · Biblioteca y filtros

1. Baja a `TU BIBLIOTECA`. **Comprueba:** lo más reciente encabeza, y cada archivo declara tipo, nombre,
   grupo, último uso y dónde se usa.
2. Pulsa el filtro `Hojas de cálculo`. **Comprueba:** queda sólo la hoja, el orden se conserva y el filtro
   aplicado sigue visible.
3. Pulsa `Todos` para volver.

**Pregunta abierta 2:** ¿el chip del filtro activo se lee como pulsable aunque no lo sea?

## Recorrido O-03 · Las cinco acciones sin abrir el archivo

1. En escritorio, en la fila de un archivo, recorre `Descargar`, `Asignar`, `Adjuntar`, `Dónde se usa` y
   `Duplicar`. En tablet, ábrelas con `Acciones del archivo`. En móvil, con `Acciones`.
2. **Comprueba en Descargar:** nombra el formato de salida y dice explícitamente que el prototipo no
   descarga. No debe aparecer progreso ni archivo generado.
3. **Comprueba en Asignar:** llega la hoja Asignar con el rótulo `DESDE OFFICE · #177` y al cerrar vuelve a
   Office, no al flujo interno de Clases.
4. **Comprueba en Adjuntar:** en escritorio llega a Mensajería del mismo ancho; en tablet y móvil llega al
   destino de su propio ancho.
5. **Comprueba en Dónde se usa:** declara grupos, tareas y último uso, rotulado como ejemplo.

**Pregunta abierta 3:** confirmar las dos decisiones derivadas — importar como acción persistente y el
catálogo de plantillas agrupado en familias en vez de plantillas sueltas.

## Recorrido O-04 · Importar y estado vacío

1. Pulsa `Importar un archivo` con la biblioteca llena. **Comprueba:** es alcanzable sin entrar a crear.
2. Abre `Office · vacío · escritorio` (`468:1013`). **Comprueba:** ofrece crear e importar, no muestra
   ejemplos falsos y explica por qué no los muestra.

## Recorrido O-05 · Estados

Abre `Office · estados · escritorio` (`469:968`). **Comprueba:** cargando, error, offline, sync pendiente
y sync en conflicto tienen rótulo, texto y salida propios, y que pendiente y conflicto no se confunden.

## Recorrido O-06 · Navegación entre módulos

1. Desde Office, usa la navegación lateral o la barra inferior hacia Escritorio y Clases en los tres
   breakpoints. **Comprueba:** cada destino llega en su propio ancho.
2. En tablet, entra a un módulo que todavía no tiene superficie de 768. **Comprueba:** llega el estado que
   nombra el límite, no una pantalla de escritorio.
3. Desde Escritorio, abre `Nuevo archivo`. **Comprueba:** el selector tipo-primero aprobado en #163 sigue
   intacto y con sus cinco tipos. La creación desplegada de Office no lo sustituyó.

## Qué debe producir el gate

- Veredicto explícito del owner en #177: aprobado, aprobado con condiciones, o rechazado.
- Si hay condiciones, se corrigen dentro de este change y se vuelve a recorrer (tarea 7.4).
- Sólo después se promueven los frames y se renombra la sección (tarea 7.6).

Hasta entonces las 25 superficies permanecen `candidate` y ninguna evidencia automática de este change
cuenta como aprobación visual.


---

# Ronda 1 — resultado

**Fecha:** 2026-09-04. El owner recorrió Present en escritorio, tablet y móvil.

## Veredicto

**Aprobado con condiciones.** El recorrido funciona en las tres vistas. Una condición bloqueante y una
mejora.

## Condiciones emitidas

| # | Condición | Estado |
| --- | --- | --- |
| C1 | Los filtros `Documentos` y `Presentaciones` no muestran su contenido: alternan entre `Todos` y `Hojas`, y se pueden pulsar indefinidamente | **Corregida.** Nueve vistas filtradas, una por tipo y breakpoint; comprobación de destino por tipo añadida al gate |
| C2 | El botón `Plantillas` de móvil debe mostrar sólo las plantillas del tipo que se va a crear | **Corregida.** Tres hojas, una por tipo |

## Respuestas a las preguntas abiertas

| # | Pregunta | Respuesta del owner | Consecuencia |
| --- | --- | --- | --- |
| 1 | ¿La zona de creación compite con la biblioteca en 390? | Pide explicación más detallada antes de decidir | **Abierta.** No se cambia nada hasta que decida |
| 2 | ¿El chip de filtro activo se lee como pulsable? | Sí, se intuye fácilmente que son pulsables | **Resuelta.** Chip de tipo activo ahora limpia el filtro; `Todos` activo pasa a pestaña |
| 3 | Confirmar importar persistente y catálogo en familias | "Está perfecto y sí funciona tal cual" | **Confirmadas.** Las dos decisiones derivadas quedan aprobadas |
| 4 | ¿Plantillas de móvil por tipo? | Sí, sólo las del tipo a crear | **Resuelta.** Ver C2 |

## Qué falta

- Cerrar la pregunta 1 con el owner.
- Segundo recorrido de Present sobre las correcciones (tarea 7.4).
- Veredicto definitivo y promoción de frames (tareas 7.5 y 7.6).
