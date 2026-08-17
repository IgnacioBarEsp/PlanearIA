# TLDR: actualizar el pin del constructor

## Intención — Proposal

PlanearIA fija el constructor en `0.1.4`, la última versión que declara el handle anterior de GitHub. El
renombrado del repositorio no pudo tocar un paquete ya publicado. El upstream ya está corregido, así que
falta subir el pin de forma deliberada y cerrar el hueco que dejó pasar el problema: nada verifica la
identidad que declara la release fijada.

## Enfoque — Design

La verificación se suma al contrato de consumidor, que ya compara manifiesto, lockfile, instalación y
`--version`, pero sólo por número. El owner esperado se deriva de una fuente única, no se escribe como
literal, para no crear la misma deuda que se está corrigiendo. La comprobación es local, sin red, y falla
duro en vez de avisar. La subida se verifica antes de fijarse.

## Comportamiento — Specs

El contrato de consumidor gana un requisito: los metadatos de identidad de la release instalada deben
resolver al owner vigente del upstream. Coincidir en el número de versión deja de ser prueba suficiente. Un
renombrado futuro obliga a decidir de forma explícita entre subir de release o registrar por qué se conserva
la anterior, sin que el pin obsoleto sobreviva callado.

## Plan de trabajo — Tasks

Primero se instala `0.1.5` sin consolidar y se comparan comportamiento de gates, harness y motor de deuda;
una diferencia bloqueante detiene la subida. Después se fija el pin, se refresca el lockfile y se actualiza
la constante del contrato. Luego se implementa la verificación de identidad y se prueba en negativo.
Finalmente se registra la cadencia, se capturan validaciones y assessment de deuda y se corre el gate de
archive.

## Resumen integral

El change deja la cadena de herramientas apuntando a la identidad vigente y, sobre todo, convierte esa
identidad en algo que una herramienta comprueba. El valor duradero no es el número nuevo sino la verificación:
sin ella, el siguiente renombrado volvería a sobrevivir en verde. Si `0.1.5` resultara incompatible, el cierre
honesto es conservar `0.1.4` con la limitación documentada y la verificación igualmente instalada.
