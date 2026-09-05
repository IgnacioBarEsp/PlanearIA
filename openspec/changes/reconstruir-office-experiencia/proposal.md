## Why

El prototipo de Office Docente no expresa el trabajo del módulo. La superficie de tablet `277:958` es un
clon exacto de la de escritorio a 1440x960 pese a llamarse tablet, la de móvil `274:958` reduce Office a
una sola tarjeta de prioridad sin launcher ni biblioteca, y la de escritorio `257:951` ofrece la creación
como un botón sin tipos mientras un bloque `Inicio por intención docente` propone Planeación, Material de
lectura y Rúbrica **antes** del tipo, en contra de la decisión D3 del plan UX/UI.

Office es la ola `#157-O3` de la subépica #157 y el primer módulo que hereda las tres reglas que #166
impone: clasificar breakpoint por ancho de frame, contar las aristas que salen de la sección y no dar por
cumplido un destino sin verificar el ancho del frame destino. Mientras Office no tenga superficies propias
en 390 y 768, la deuda de #166 no puede cerrarse por partes.

## What Changes

- Se crea una sección candidate de Office en el prototipo Figma con las tres capas del baseline en 1440,
  768 y 390, conservando los frames históricos sin borrarlos.
- La creación pasa a estar **desplegada** dentro de Office: documento, hoja y presentación visibles al
  entrar, sin modal intermedio. Cada tipo abre en blanco por defecto y sus plantillas docentes se ofrecen
  como atajo opcional después del tipo.
- El catálogo de plantillas se organiza en familias con presets: Planeación didáctica, Instrumento de
  evaluación y Documento académico para documento; Control del grupo y Cobros y aportaciones para hoja;
  Temas visuales para presentación.
- La biblioteca conserva el eje cronológico y los cuatro filtros por tipo que el prototipo ya tiene, y
  gana las cinco acciones por archivo sin abrirlo: descargar en su extensión real, asignar a un grupo,
  adjuntar a una conversación, ver dónde se está usando y duplicar para otro grupo.
- Importar deja de ser exclusivo del estado vacío y pasa a ser acción persistente del hub.
- Se sustituye el bloque `Inicio por intención docente`, que hace intención-primero contra D3.
- Tablet 768 y móvil 390 se construyen como superficies propias, no como fallback de escritorio.
- Abrir un editor entrega el estado honesto de límite que ya introdujo #163, hasta que corran `#157-O4` a
  `#157-O6`.
- **BREAKING para el prototipo, no para el runtime:** los tres frames heredados de Office dejan de ser la
  superficie vigente del módulo. Ningún artefacto de runtime, ruta, dato o clave local cambia.

## Capabilities

### New Capabilities

- `office-prototype-experience`: contrato de experiencia del hub de Office en el prototipo — creación
  desplegada con tres tipos y plantillas como atajo, biblioteca cronológica agrupada por tipo, cinco
  acciones sobre el archivo sin abrirlo, importación persistente, estados honestos y misma arquitectura de
  información en los tres breakpoints.

### Modified Capabilities

- `figma-prototype-navigation`: se añaden dos requirements — que el grafo de Office resuelva en su propio
  ancho de frame aplicando las tres reglas de #166, y que la etiqueta heredada de los frames `257:951`,
  `277:958` y `274:958` no constituya aprobación de Office.

## Impact

- **Figma:** archivo `VBK5tK7EQS83tdTmtuBpI9`, página `60:2`. Se crea una sección candidate nueva. Los
  nodos `257:951`, `277:958` y `274:958` se conservan como baseline histórico.
- **Documentación versionada:** `context/office-ground-truth/` ya entregado; se actualizan la matriz de
  navegación y el plan UX/UI al cerrar la ola.
- **Deuda:** cierra la porción de Office de `debt-a40b2b029a63` (tablet) y `debt-b1d35a5b5915` (móvil),
  ambas bajo #166. El plan `uxui-navegacion-global` está en 4/5 unidades de presupuesto, así que la ola no
  puede generar deuda nueva sin disparar saneamiento.
- **Runtime:** ninguno. No se tocan `OfficeStack`, `OfficeHomeScreen`, rutas, datos, storage, sync,
  backend ni dependencias. El handoff runtime requerirá issue y change separados.
- **Riesgo trasladado:** la descarga con fidelidad de formato (.docx, .xlsx, .pdf) se representa como
  afordancia y no se simula. Su costo real se dimensiona en el change de runtime, contra la excepción de
  deuda vigente por el cuelgue síncrono de SheetJS ante xlsx corrupto.

## No objetivos

- No rediseñar NotasPLAN, CalcuPLAN ni PresentaPLAN: pertenecen a `#157-O4` a `#157-O6`.
- No absorber ContenidoTab ni los recursos didácticos. D6 se completa en una ola posterior con su propia
  entrevista, aunque el runtime ya tenga `Contenido` dentro de `OfficeStack`.
- No ofrecer Diseño ni preguntar a la IA como tipos creables desde Office.
- No implementar React Native, backend, datos ni sync.
- No copiar el layout ni el lenguaje de Microsoft 365 ni de Google Drive.
- No reabrir #156, #159, #161 ni #163.
- No promover frames a `approved` sin Figma Present y veredicto humano explícito.
- No sustituir las entrevistas docentes, pausadas por decisión del owner en #47: los supuestos IHC
  permanecen abiertos y declarados.

## Plan maestro

`Documentacion/01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md`, epic #101, subépica #157, issue #177.
