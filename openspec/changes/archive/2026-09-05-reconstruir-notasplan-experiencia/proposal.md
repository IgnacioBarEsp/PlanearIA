## Why

El editor de documentos existe en el prototipo **sólo en escritorio**. Los cuatro frames que lo
representan —`62:3`, `66:40`, `151:77` y `151:123`— miden los cuatro 1440x960 y son `draft`. En 768 y en
390 no hay absolutamente nada: el docente que abre una planeación desde el móvil no tiene a dónde llegar.

Además, el draft es un clon de Word —cinta de seis pestañas con quince comandos— y su índice propone seis
secciones que **no coinciden** con las siete que el runtime ya implementa. El prototipo y la app describen
productos distintos.

La ola `#157-O4` resuelve las dos cosas a la vez y fija la decisión que gobierna el módulo: el archivo es
un documento real desde el primer momento, para que el docente pueda descargarlo, editarlo en Word o Docs
y volver a subirlo sin que deje de ser el suyo.

## What Changes

- Se crea una sección candidate de NotasPLAN con la hoja como superficie principal en 1440, 768 y 390,
  conservando los frames históricos.
- **La estructura pasa a vivir dentro del documento.** Las siete secciones del runtime se materializan como
  encabezados con nombre; la vista formulario se convierte en una proyección sobre ellos.
- Se retira la cinta de seis pestañas y se sustituye por una barra compacta que refleja el estado del
  cursor.
- Se adopta el modelo de siete secciones del runtime y se descarta el de seis del draft.
- Crear desde plantilla ofrece tres niveles de andamiaje: `sencillo`, `moderado` y `autocompletado`, con
  valor por defecto y sin bloquear la creación.
- El editor gana seis acciones sin salir: guardar en la biblioteca, descargar, asignar a un grupo, guardar
  como plantilla propia, ver historial y compartir.
- Compartir ofrece copia en PDF o `.docx` y enlace, por ruta interna y externa. El enlace es de sólo
  lectura y revocable; editar exige cuenta en PlanearIA y solicitud de permiso.
- Se representa el formato de página real, la alternancia de vistas y el estado de borrador que el runtime
  ya tiene, para que el prototipo no prometa menos que la app.
- Se añade un estado propio de reimportación que declara qué sobrevivió al viaje desde Word.
- **BREAKING para el prototipo, no para el runtime:** los cuatro frames heredados dejan de ser la
  superficie vigente del editor. Ninguna ruta, dato o clave local cambia.

## Capabilities

### New Capabilities

- `notasplan-prototype-experience`: contrato de experiencia del editor de documentos — la hoja como
  archivo con formato de página real, siete secciones como encabezados con nombre, barra compacta
  contextual, índice y lente de formulario, tres niveles de plantilla, IA a petición y revisable, seis
  acciones del documento, compartir con enlace revocable, y nueve estados honestos incluido el de
  reimportación.

### Modified Capabilities

- `figma-prototype-navigation`: se añaden dos requirements — que el grafo de NotasPLAN resuelva en su propio
  ancho de frame **y en su destino correcto**, incorporando la comprobación que #177 tuvo que añadir tras
  dejar pasar un defecto real; y que la etiqueta `draft` de los cuatro frames heredados no constituya
  aprobación del editor.

## Impact

- **Figma:** archivo `VBK5tK7EQS83tdTmtuBpI9`, página `60:2`. Sección candidate nueva. Los nodos `62:3`,
  `66:40`, `151:77` y `151:123` se conservan como baseline histórico.
- **Documentación versionada:** `context/notasplan-ground-truth/` ya entregado; matriz de navegación y plan
  UX/UI se actualizan al cerrar la ola.
- **Deuda:** no cierra `debt-a40b2b029a63` ni `debt-b1d35a5b5915`, que son de módulos puente, pero construye
  en 768 y 390 sin ampliarlas. El plan `uxui-navegacion-global` está en 4/5 unidades y esta ola no puede
  generar deuda nueva sin disparar saneamiento.
- **Runtime:** ninguno en este change. El handoff deberá dimensionar cuatro costos: la migración del modelo
  tipado a documento-primero, el enlace revocable con solicitud de permiso, el historial con puntos de
  guardado, y la exportación con fidelidad heredada de #177 más el requisito nuevo del viaje de vuelta.
- **Riesgo declarado:** el viaje de ida y vuelta desde Word conserva texto, encabezados, listas, tablas,
  imágenes y formato de página, y degrada SmartArt, macros, campos automáticos y objetos flotantes
  complejos. El prototipo lo declara en vez de prometer equivalencia total.

## No objetivos

- No rediseñar CalcuPLAN ni PresentaPLAN: pertenecen a `#157-O5` y `#157-O6`.
- No cubrir las familias Instrumento de evaluación ni Documento académico, que entregan estado de límite.
- No implementar React Native, backend, datos ni sync.
- No construir edición colaborativa en tiempo real.
- No copiar la cinta de Word ni su densidad de comandos.
- No reabrir #156, #159, #163 ni #177.
- No promover frames a `approved` sin Figma Present y veredicto humano explícito.
- No sustituir las entrevistas docentes, pausadas por decisión del owner en #47.

## Plan maestro

`Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`, epic #101, subépica #157, issue #180.
