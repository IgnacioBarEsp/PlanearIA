# QA anti-slop, accesibilidad y estados — NotasPLAN `#180`

**Fecha:** 2026-09-05
**Alcance:** sección `516:974`. Revisión estática y por Plugin API. **No sustituye el gate humano.**

## 1. Tokens y tema

Todo color se enlaza a variables de `PlanearIA / Color`; no se escribió ningún hex. La prueba es de
comportamiento: al forzar el modo `Oscuro` en los tres editores, los valores resueltos cambian y vuelven al
restaurar `Claro`.

| Superficie | Fondo claro | Fondo oscuro | Hoja clara | Hoja oscura |
| --- | --- | --- | --- | --- |
| Editor escritorio | 242,244,239 | 11,30,26 | 255,255,255 | 23,50,44 |
| Editor tablet | 242,244,239 | 11,30,26 | 255,255,255 | 23,50,44 |
| Editor móvil | 242,244,239 | 11,30,26 | 255,255,255 | 23,50,44 |

Las tres restauran exactamente sus valores claros. Que **la hoja** cambie es lo relevante: es la superficie
que más texto lleva y donde un color escrito a mano habría quedado en evidencia.

Se aplicó desde el inicio la corrección aprendida en #177: cada paint se crea con el valor resuelto de la
cadena de alias, no con negro. No apareció ningún relleno negro en esta ola.

## 2. Objetivo táctil

**0 controles interactivos bajo 44 pt**, desde la primera auditoría. Se dimensionaron a 44 en construcción,
en vez de corregirlos después como hubo que hacer dos veces en #177.

La barra compacta es el punto de mayor riesgo —siete comandos en 390 px— y sus botones miden 44 de alto sin
recurrir a `hitSlop`, que es la excepción de deuda vigente que esta ola no amplía.

## 3. Controles inertes: de dieciséis a cero

Es la lección que dejó la ronda 1 del gate de Office: el owner confirmó que un control con aspecto pulsable
que no hace nada es un defecto, no una omisión.

| Control | Antes | Ahora |
| --- | --- | --- |
| `Formato · A4` y `Formato · Carta`, en cinco superficies | Dos píldoras que fingían un interruptor | Un **indicador de estado**: "A4 · 794 × 1123 · se elige al crear". Sin píldora, sin borde, sin promesa |
| `Acción · plantilla` | Sin destino | Lleva a Office, donde queda la plantilla propia |
| `Acción · IA aceptar` y `Acción · IA descartar` | Sin destino | Abren la propuesta, donde se compara y se decide |
| `Acción · formulario · agregar sesión` | Sin destino | Lleva a la hoja, donde aparece la sesión |

**Cero controles inertes.** Office cerró con tres aceptados; esta ola cierra con ninguno.

Sobre el formato de página: el prototipo no puede mostrar A4 y Carta sin duplicar cada superficie. Fingir el
cambio con un interruptor que no cambia nada habría sido peor que declararlo. El runtime sí implementa
ambos, y el handoff lo recoge.

## 4. Patrón genérico refutado

| Patrón | Cómo se evitó |
| --- | --- |
| Clon de Word | No hay cinta de pestañas. La barra tiene siete comandos, refleja el cursor y cabe en 390 px. El draft `62:3` tenía seis pestañas y quince comandos |
| Formulario con vista previa | La hoja es el archivo. El formulario se declara en pantalla como "una vista de lo que ya está en el documento" |
| IA al frente | La IA sólo actúa a petición, sobre la sección activa, y su resultado se compara antes de aplicarse |
| Hero, bento, KPIs, glass, blur, gradientes | Ausentes. La hoja es el protagonista |

## 5. La barra refleja el cursor: demostrado, no afirmado

La spec exige un escenario concreto: con el cursor en una lista, la barra muestra `Lista` activo. Se
construyeron tres variantes —`526:980`, `526:1098`, `526:1149`— donde el comando activo cambia de `Negrita`
a `Lista` y la línea de contexto pasa de "Estás en 04 · Sesiones" a "Cursor en una lista". Los comandos
alternan entre el editor y su variante, así que el comportamiento se recorre en Present en vez de leerse.

## 6. Honestidad de lo que el prototipo no hace

| Acción | Cómo se declara |
| --- | --- |
| Descargar | "El prototipo no descarga nada. La fidelidad de formato y el viaje de vuelta se dimensionan en el change de runtime" |
| Historial | "El prototipo no restaura nada. El historial con puntos de guardado no existe todavía en la app" |
| Permisos | "Nadie edita tu planeación de forma anónima. Los permisos revocables no existen todavía en la app" |
| Propuesta de IA | "El prototipo no genera texto: esta propuesta es un ejemplo rotulado" |
| Contenido de la hoja | Rótulo "CONTENIDO DE EJEMPLO · PROTOTIPO" al pie de las tres hojas |
| Formato de página | "se elige al crear", en vez de un interruptor que no cambia nada |

## 7. Los nueve estados

Diseñados en `525:980`, no sólo declarados: documento nuevo, guardado, cambios sin guardar, error al
guardar, offline, sync pendiente, sync en conflicto, IA no disponible y reimportado desde otro editor.

El noveno es el propio de esta ola y el más delicado. No dice "listo": dice qué volvió —encabezados, texto,
listas, tablas e imágenes— y qué no —dos objetos flotantes y un campo automático—. Esa es la diferencia
entre acotar una promesa y venderla.

Pendiente y conflicto tienen rótulo, texto y salida distintos, que es la confusión que la spec prohíbe.

## 8. Checklist Nielsen

| Heurística | Hallazgo | Severidad |
| --- | --- | ---: |
| Visibilidad del estado | Guardado, borrador local y sync declarados en cabecera y en el tablero | 0 |
| Correspondencia con el mundo real | Lenguaje docente y estructura de entregable escolar | 0 |
| Control y libertad | `Volver` con `BACK` al origen exacto; todo overlay cierra; la IA se descarta | 0 |
| Consistencia | Tokens y shell heredados de superficie aprobada | 0 |
| Prevención de errores | Guardia de cambios sin guardar; restaurar no borra lo actual; duplicar no toca el original | 0 |
| Reconocimiento antes que memoria | Índice visible, secciones nombradas, barra que refleja el cursor | 0 |
| Flexibilidad y eficiencia | Tres niveles de plantilla, hoja o formulario, escritorio o móvil | 0 |
| Estético y minimalista | La hoja domina; el sistema visual se aparta | 0 |
| Recuperación de errores | Error, conflicto y reimportación nombran qué pasó y qué se conserva | 0 |
| Ayuda y documentación | Cada acción lleva descripción; los avisos declaran los límites | 0 |

**Severidad máxima abierta: 0.** Ninguna evaluación automática sustituye el recorrido humano.

## 9. Lo que queda abierto para el gate humano

1. Si editar en línea sobre la hoja en 390 px es cómodo en la sección Sesiones, que lleva tarjetas.
2. Si el índice de siete secciones es el que la escuela pide.
3. Si los tres niveles de plantilla se distinguen entre sí al leerlos.
4. Si el estado de reimportación se entiende, o alarma de más.
5. Si el formato de página como indicador declarado se acepta, o el owner prefiere un cambio real con
   superficies duplicadas.
6. Confirmar las tres decisiones derivadas: nivel con valor por defecto, formulario no default en móvil, y
   las siete secciones como encabezados dentro del documento.
