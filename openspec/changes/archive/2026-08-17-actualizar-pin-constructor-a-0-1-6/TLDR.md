# TLDR: actualizar el pin del constructor

## Intención — Proposal

PlanearIA fijaba el constructor en `0.1.4`, la última versión que declara el handle anterior de GitHub. El
renombrado del repositorio no pudo tocar un paquete ya publicado. Faltaba subir el pin de forma deliberada y
cerrar el hueco que dejó pasar el problema: nada verificaba la identidad que declara la release fijada.

## Enfoque — Design

La verificación se suma al contrato de consumidor, que ya comparaba manifiesto, lockfile, instalación y
`--version`, pero sólo por número. El upstream esperado se declara una sola vez como constante: derivarlo
del owner de este repositorio haría fallar en falso a un fork. La comprobación es local, sin red, y falla
duro. La subida se verifica antes de fijarse, y esa decisión resultó decisiva.

## Comportamiento — Specs

El contrato de consumidor gana un requisito: los metadatos de identidad de la release instalada deben
resolver al upstream esperado. Coincidir en el número de versión deja de ser prueba suficiente. Un renombrado
futuro obliga a decidir de forma explícita entre subir de release o registrar por qué se conserva la
anterior, sin que un pin obsoleto sobreviva callado.

## Plan de trabajo — Tasks

Se comparó `0.1.5` contra `0.1.4` antes de fijar nada. La verificación detuvo la subida: `0.1.5` fija el
`package.json` de su plantilla en `0.1.5` y deja el lockfile en `0.1.4`, así que todo proyecto arrancado con
ella falla su propio `release.identity`. Se reportó upstream, el owner publicó `0.1.6` y el pin fue ahí.
Después se implementó la verificación de identidad, probada en positivo y en negativo.

## Resumen integral

El change deja la cadena de herramientas apuntando a la identidad vigente y convierte esa identidad en algo
que una herramienta comprueba. El valor duradero no es el número sino la verificación. Y el orden importó:
verificar antes de fijar destapó un defecto que `debt:check` no veía y que habría entrado en verde aparente,
rompiendo el arranque de cualquier proyecto nuevo creado con la herramienta.
