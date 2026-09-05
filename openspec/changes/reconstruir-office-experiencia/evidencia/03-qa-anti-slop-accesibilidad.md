# QA anti-slop, accesibilidad y estados — Office `#177`

**Fecha:** 2026-09-04
**Alcance:** sección `461:968`. Revisión estática y por Plugin API. **No sustituye el gate humano**: los
puntos que dependen de recorrido siguen abiertos hasta Figma Present con el owner.

## 1. Tokens y tema

Todo color de la sección se enlaza a variables de `PlanearIA / Color`; no se escribió ningún hex nuevo.
La prueba no es visual sino de comportamiento: al forzar el modo `Oscuro` en las tres superficies
principales, los valores resueltos cambian y vuelven al restaurar `Claro`.

| Superficie | Fondo claro | Fondo oscuro | Título claro | Título oscuro |
| --- | --- | --- | --- | --- |
| Escritorio `461:969` | 242,244,239 | 11,30,26 | 23,50,44 | 255,255,255 |
| Tablet `461:1050` | 242,244,239 | 11,30,26 | 23,50,44 | 255,255,255 |
| Móvil `461:1108` | 242,244,239 | 11,30,26 | 23,50,44 | 255,255,255 |

Las tres restauran exactamente sus valores claros. Un color escrito a mano no habría cambiado: la prueba
distingue token real de literal disfrazado.

### Defecto encontrado y corregido durante el apply

Veinticuatro rellenos y dieciocho trazos quedaron con el literal en negro pese a tener la variable
enlazada: al asignar un paint recién creado sobre nodos clonados, el valor literal no se resolvió y los
chips de filtro se pintaron de negro. Se corrigió resolviendo la cadena de alias de cada variable hasta su
color concreto y reescribiendo el literal, conservando el enlace. Un barrido posterior sobre los 945 nodos
de la sección no encuentra ningún caso restante.

## 2. Objetivo táctil

| Momento | Controles interactivos bajo 44 pt |
| --- | ---: |
| Primera auditoría | 36 |
| Tras la corrección | **0** |

Los 36 eran chips de filtro de 36-38 px de alto y píldoras de plantilla de tablet de 40 px. Se elevaron a
44 sin recurrir a `hitSlop`, que es exactamente la excepción de deuda vigente que esta ola no debe ampliar.
Las píldoras de tablet se reespaciaron para que no quedaran pegadas tras crecer.

## 3. Patrón genérico refutado

| Patrón | Cómo se evitó |
| --- | --- |
| Gestor de archivos genérico | La fila de archivo declara tipo, nombre, grupo, último uso y dónde se usa, y expone seis acciones con texto visible. No hay lista plana de nombres ni menú de tres puntos mudo. |
| Mosaico de plantillas como portada | Las plantillas viven dentro de la tarjeta de cada tipo, **después** del botón de empezar en blanco. |
| Hero, KPIs de relleno, bento | Ausentes. La jerarquía es crear, importar, biblioteca, acciones. |
| Glass, blur, gradientes, halos, sombras decorativas | Ninguno. Superficies planas con borde de token. |

### Nota sobre `Inicio por intención docente`

El preflight refutó este bloque en Office. Un bloque con el mismo nombre existe en el **Escritorio
aprobado** (`307:1030`), y conviene dejar por escrito por qué no es una incoherencia: en Escritorio aparece
después del dock y de las filas de atención, y la creación se resuelve por el selector tipo-primero, así
que funciona como atajo secundario. En Office era la única afordancia estructurada de creación junto a un
botón sin tipos, de modo que en la práctica ponía la intención escolar antes del tipo. En la sección
candidate su función la cubre el catálogo de plantillas, colocado después del tipo. No se tocó el bloque de
Escritorio.

## 4. Estados

Los siete están diseñados, no sólo declarados.

| Estado | Dónde vive | Salida |
| --- | --- | --- |
| Vacío | `468:1013` superficie propia | Importar un archivo · Empezar en blanco |
| Cargando | Panel en `469:968` | Crear sigue disponible: no depende de la biblioteca |
| Error | Panel en `469:968` | Reintentar · Seguir creando |
| Offline | Panel en `469:968` | Seguir en local, nada se descarta |
| Sync pendiente | Panel en `469:968` | Ver qué falta · seguir trabajando |
| Sync en conflicto | Panel en `469:968` | Elegir cuál conservar, nada se sobrescribe solo |
| Editor no disponible en este tamaño | `467:968`, `467:986`, `467:1004` | Volver (BACK, al origen exacto) · Ir a Office Docente |

Pendiente y conflicto se distinguen con rótulo, texto y salida propios, que es la confusión que la spec
prohíbe explícitamente.

## 5. Honestidad de lo que el prototipo no hace

| Acción | Cómo se representa |
| --- | --- |
| Descargar | Nombra el formato de salida y declara: "El prototipo no descarga nada. La fidelidad de formato se dimensiona en el change de runtime." No muestra progreso ni archivo generado. |
| Importar | "El prototipo no sube archivos." |
| Duplicar | "El prototipo no crea archivos." |
| Dónde se está usando | "Datos de ejemplo rotulados. El prototipo no consulta datos reales." |
| Datos de la biblioteca | Chip `EJEMPLO` en la cabecera de recientes y línea de estado en las tres superficies. |
| Estado vacío | No muestra ejemplos, y explica por qué: para no confundir material de muestra con el propio. |

## 6. Hoja Asignar: divergencia encontrada y resuelta

La spec exige reutilizar la hoja Asignar aprobada. Al inspeccionarla se encontró que las tres aprobadas de
Clases (`193:450` escritorio, `193:647` tablet, `193:844` móvil) tienen sus acciones cableadas con `SWAP`
hacia el editor de actividad de Clases (`193:423`). Reutilizar el nodo tal cual habría arrastrado al
docente al flujo interno de Clases y roto el retorno a Office que la propia spec exige.

Resolución: se **clonaron** las tres hojas aprobadas —conservando diseño, estructura y tokens— y se limpió
su cableado heredado para que cierren de vuelta a Office. Llevan un rótulo visible `DESDE OFFICE · #177`
para que en Present se distinga qué entrada representan. El contrato de la hoja compartida sigue siendo
propiedad de `cross-surface-assignment`; el runtime debe reutilizar el componente único, no duplicarlo.

## 7. Checklist Nielsen

| Heurística | Hallazgo | Severidad |
| --- | --- | ---: |
| Visibilidad del estado del sistema | Sync, offline y guardado local declarados en las tres superficies y en el tablero de estados | 0 |
| Correspondencia con el mundo real | Lenguaje docente: grupo, tarea, ciclo, planeación, cobros, asistencia | 0 |
| Control y libertad | `Volver` con acción `BACK` devuelve al origen exacto; todo overlay cierra | 0 |
| Consistencia y estándares | Tokens, tipografía y shell heredados de superficie aprobada | 0 |
| Prevención de errores | Ninguna acción destructiva; duplicar declara que el original no se toca | 0 |
| Reconocimiento antes que memoria | Tipos y plantillas visibles; filtros con estado visible | 0 |
| Flexibilidad y eficiencia | En blanco directo, o plantilla como atajo | 0 |
| Diseño estético y minimalista | Sin ornamento; se refutaron los patrones genéricos | 0 |
| Recuperación de errores | Error y conflicto nombran qué pasó y qué se conserva | 0 |
| Ayuda y documentación | Cada acción lleva descripción en hoja y menú | 0 |

**Severidad máxima abierta: 0.** Ninguna de estas evaluaciones sustituye el recorrido humano.

## 8. Lo que queda abierto para el gate humano

1. Si la zona de creación desplegada compite con la biblioteca en 390 con fuente ampliada.
2. Si el chip de filtro activo se lee como pulsable pese a no serlo.
3. Confirmar las dos decisiones derivadas: importar como acción persistente y el catálogo en familias.
4. Si el catálogo de plantillas de móvil debería ser por tipo en vez de una hoja única con los tres.
5. Contraste medido en runtime con daltonismo y alto contraste: fuera del alcance de Figma.
