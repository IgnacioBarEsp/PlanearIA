# Correccion de fugas de breakpoint en el candidate de Escritorio

**Fecha:** 2026-08-13
**Issue:** [#163](https://github.com/IgnacioBarEsp/PlanearIA/issues/163)
**Change:** `reconstruir-escritorio-experiencia`
**Alcance:** seccion Figma `307:965` unicamente. No se toco Clases approved, el draft raiz de #156, runtime,
backend, datos, storage ni sync.

## Motivo

El owner reporto que, recorriendo el prototipo en movil, abrir Office Docente terminaba en una superficie de
escritorio. La auditoria confirmo el sintoma y encontro que el candidate de #163 incumplia su propia SHALL:

> El prototipo SHALL mantener launcher, atencion y continuidad en movil `<768`, tablet `768-1279` y web
> `>=1280`. [...] ningun hotspot SHALL llevar a un frame de otro breakpoint.
> — `specs/teacher-home-prototype-experience/spec.md`

Las tareas 3.1 y 3.3 estaban marcadas `[x]`. La evidencia que las respaldaba verificaba el retorno al
disparador, no los destinos hacia adelante.

## Metodo y correccion de la auditoria previa

Auditoria read-only por Plugin API sobre la pagina `60:2`, recorriendo cada `reactions[].actions[]`,
resolviendo el frame de nivel superior de origen y destino y excluyendo `navigation: 'OVERLAY'` (los modales
de 560/620/720 px no son superficies de dispositivo).

Se corrigen dos defectos de medicion de la evidencia anterior:

1. **Alcance.** La auditoria de #159 conto "cero cruces de breakpoint" contando solo las aristas internas de
   cada seccion. Las aristas que salen de una seccion hacia otra no entraban en el conteo, y ahi vive la
   mayoria de las fugas.
2. **Clasificacion.** Clasificar por nombre de frame es incorrecto en este archivo. Los frames
   `T-G · <modulo> · tablet · desktop-fallback · candidate` (`277:958`, `277:1034`, `277:1110`, `277:1262`,
   `277:1338`, `277:1414`, `277:1493`) se llaman `tablet` pero **miden 1440x960**. La clasificacion valida es
   por ancho: `390` movil, `768` tablet, `1440` escritorio.

Con clasificacion estricta por ancho, el estado previo a esta correccion era:

| Seccion | Aristas de navegacion | Fugas dispositivo a dispositivo |
| --- | ---: | ---: |
| `Escritorio 0.1 candidate · #163` | 57 | 19 |
| `Clases · approved v1.3 · #159` | 788 | 113 |
| Draft raiz `#156` | 309 | 17 |

## Las 19 fugas del candidate de #163

| Origen | Controles | Destino previo | Correccion |
| --- | ---: | --- | --- |
| `307:1046` Escritorio tablet | 8 hits del rail | hubs de escritorio 1440x960 | Clases a `189:207`; los otros 7 al estado tablet |
| `307:1046` Escritorio tablet | `Accion · abrir prioridad · tablet` | `151:123` documento escritorio | estado tablet |
| `310:69` selector tablet | 5 filas de tipo | editores de escritorio | estado tablet |
| `310:106` selector movil | 5 filas de tipo | editores de escritorio | estado movil |

El frame movil `307:1078` y el de escritorio `307:966` no tenian fugas.

**Causa raiz:** los frames candidate se clonaron de originales de escritorio y los clones conservaron el
`destinationId` de escritorio. No existe en el archivo ningun editor u objeto en 390 o 768 px: solo hay hubs
de modulo en movil. Cualquier accion de "abrir el objeto" desde movil o tablet no tenia a donde ir.

## Correccion aplicada

No se crearon editores moviles ni de tablet. Office, NotasPLAN, CalcuPLAN, PresentaPLAN, Diseno y Asistente
pertenecen a las olas `#157-O3` a `#157-O8` y son no objetivo declarado de #163. En su lugar, cada hotspot
que no tiene destino en su propio breakpoint lleva a un estado honesto que nombra el limite y devuelve el
control al docente.

Dos frames nuevos dentro de `307:965`, clonados de los selectores existentes para heredar tokens, variables
ligadas y tipografia sin introducir estilo nuevo:

| Frame | Id | Tamano | Salidas |
| --- | --- | ---: | --- |
| `Escritorio · superficie pendiente · movil · candidate · #163` | `345:968` | 390x844 | `Volver` (accion `BACK`, regresa al origen exacto) y `Ir al Escritorio` a `307:1078` |
| `Escritorio · superficie pendiente · tablet · candidate · #163` | `345:1006` | 768x1024 | `Volver` (accion `BACK`) y `Ir al Escritorio` a `307:1046` |

`BACK` es deliberado: devuelve a la superficie que abrio el estado sin declarar un destino fijo, de modo que
la salida siempre corresponde al origen y nunca cruza de tamano.

Ambos frames declaran en pantalla `CANDIDATE #163 · no se abre la version de escritorio para no cruzar
breakpoints`. No simulan un editor, no afirman guardado, envio, IA ni sincronizacion.

Capturas: `capturas-breakpoint/estado-pendiente-movil-345-968.png` y
`capturas-breakpoint/estado-pendiente-tablet-345-1006.png`.

## Verificacion posterior

Reejecucion de la misma auditoria read-only tras la correccion:

| Seccion | Aristas de navegacion | Fugas | Destinos rotos |
| --- | ---: | ---: | ---: |
| `Escritorio 0.1 candidate · #163` | 61 | **0** | 0 |
| `Clases · approved v1.3 · #159` | 788 | 113 | 0 |
| Draft raiz `#156` | 309 | 17 | 0 |

La seccion del change queda en cero fugas y suma 2 acciones `BACK`. Las otras dos secciones conservan
exactamente el mismo conteo previo, lo que confirma que la correccion no toco frames aprobados ni historicos.

Las 130 fugas restantes de `#159` y `#156` quedan fuera de este change y no se tocaron. Se registraron en el
motor de deuda como `debt-a40b2b029a63` (115 aristas de tablet) y `debt-b1d35a5b5915` (15 aristas de movil),
ambas `technical-debt`, `minor` y transversales bajo `uxui-navegacion-global`, con
`evidencia/debt-assessment-input.json` como entrada. El seguimiento vive en
[#166](https://github.com/IgnacioBarEsp/PlanearIA/issues/166), enlazado a #157.

No reabren la aprobacion visual de Clases: las superficies moviles propias de Clases (`192:292`, `192:358`,
`192:417`, `192:479`, `192:540`) no son origen de ninguna fuga; las fugas viven en los puentes `M-G` y `T-G`,
que #159 declaro `candidate` y fuera de su aprobacion.

Tras la captura, el plan `uxui-navegacion-global` queda en 4 de 5 unidades de presupuesto y `debt:check`
reporta PASS sin pausa. Una tercera deuda transversal dispararia saneamiento.

## Reglas que hereda toda auditoria posterior

1. Clasificar el breakpoint por ancho de frame, nunca por nombre.
2. Contar tambien las aristas que salen de la seccion, no solo las internas.
3. No marcar como cumplido un destino de movil o tablet sin verificar el ancho del frame de destino.

## Limites honestos

- Esta evidencia es auditoria estructural por API, no recorrido humano. Figma Present sigue pendiente
  (tarea 4.3) y la aprobacion visual del owner sigue siendo el gate real (tarea 4.5).
- Foco visible, contraste exacto, fuente ampliada y reducir movimiento no se declaran verificados: requieren
  Present.
- Los frames siguen `candidate`. No se promovio ninguno.
- El rollback no cambia: historial automatico de Figma, frames historicos sin inicio activo, seccion
  `307:965` identificada por modulo, estado y version, y reversion documental por PR.

---

# Segunda iteracion — hallazgos del recorrido humano del owner

**Fecha:** 2026-08-13.

El owner recorrio los tres breakpoints en Figma Present. Desktop y tablet se comportaron bien; **movil
seguia entregando rutas de escritorio** y el frame movil tenia texto encimado. Los hallazgos eran reales y
la primera iteracion no los cubria: se habia auditado por seccion, no por recorrido.

## Cambio de metodo: auditar por alcanzabilidad, no por seccion

Contar fugas por seccion mide si el change ensucia su propio patio. No mide lo que el docente vive, porque
el recorrido sale de la seccion en el primer toque. La auditoria valida es un BFS desde cada frame de
entrada siguiendo cada `reactions[].actions[]`, que responde: partiendo de aqui, ¿existe algun camino que
me saque de mi tamano de pantalla?

## Defectos encontrados y corregidos

### 1. Texto del frame movil `307:1078`

- Seis etiquetas del launcher contenian la secuencia literal `\n` en vez de un salto de linea real
  (`308:28`, `308:30`, `308:32`, `308:34`, `308:36`, `308:38`). Se renderizaban como
  `Notas\nDocumento`. Corregidas a saltos reales.
- `Presenta / Presentacion` era redundante; ahora es `Presenta / Laminas`, alineado con el lenguaje del
  plan para PresentaPLAN.
- `Subtitulo · movil` y la accion `Nuevo archivo` se solapaban en el eje x entre 250 y 354 px. Resuelto
  reflowando la cabecera completa.
- La accion `Nuevo archivo · movil` medía 116x32: por debajo del minimo de 44 pt que exige la propia spec.
  Ahora mide 168x44.
- El titulo bajó de 32 a 28 px con altura real de dos lineas, y toda la columna se recalculo. Verificacion
  automatica de solapamientos: cero pares que se cruzan, descontando contenedores y sus hijos.

### 2. Doce chips del launcher sin ninguna reaccion

`Launcher · movil · 1..6` y `Launcher · tablet · 1..6` no tenian reacciones: eran controles muertos. La
spec del change exige que activar una herramienta del launcher lleve al modulo correspondiente del mismo
breakpoint. Se conectaron los doce; los que no tienen superficie propia en su tamano resuelven en el estado
honesto de su breakpoint.

### 3. El recorrido movil salia al prototipo antiguo

Tres puertas encadenadas, ninguna visible desde un conteo por seccion:

| Puerta | Antes | Ahora |
| --- | --- | --- |
| Rail movil del candidate | hubs del draft `158:x`, cuya accion principal abre escritorio | puentes candidate `274:x` y Clases movil aprobado `192:292` |
| Accion principal de los 7 puentes `M-G` | frames de escritorio 1440x960 | estado honesto `345:968` |
| `Wordmark` e `Inicio` de los 8 puentes `M-G` | lanzador `198:809`, que reabre el draft | Escritorio candidate `307:1078` |

### 4. Ampliacion de superficie autorizada por el owner

Doce pantallas moviles **aprobadas** de Clases (`M0`–`M4`, sus estados y filtros), un frame de auditoria
de accesibilidad y la accion del lanzador `M-1` devolvian al Escritorio movil **antiguo** `164:115`. No fue
un error de #159: cuando Clases se aprobo, `164:115` era el unico Escritorio movil. Es un desfase que
aparece porque #163 introduce un Escritorio nuevo.

El owner autorizo explicitamente repuntar esas 15 aristas a `307:1078`. **Solo cambia el destino del
retorno**: no se movio, redimensiono ni reescribio ningun frame aprobado, y ninguna promocion cambio de
estado. El gate visual de #163 cubre por tanto tambien el retorno de Clases movil.

## Verificacion final por alcanzabilidad

BFS desde cada frame de entrada del candidate:

| Entrada | Frames alcanzables | Saltos de breakpoint | Puertas al draft `#156` | Chips muertos |
| --- | ---: | ---: | ---: | ---: |
| Movil `307:1078` | 38 | **0** | **0** | **0** |
| Escritorio `307:966` | 39 | **0** | 27 | **0** |
| Tablet `307:1046` | 74 | **106** | 36 | **0** |

- **Movil queda cerrado**: ningun camino sale del tamano ni del conjunto candidate. Los frames alcanzables
  bajaron de 86 a 38 justamente porque ya no se cae al prototipo antiguo.
- **Escritorio no tiene fugas.** Sus 27 entradas al draft `#156` son intencionales y todas de 1440 px: el
  candidate reutiliza deliberadamente las superficies de escritorio existentes.
- **Tablet conserva 106 saltos**, todos aguas abajo de Clases tablet: `T0`–`T4` y sus estados entregan los
  siete frames `T-G`, que se llaman tablet y miden 1440x960. El Escritorio tablet candidate ya no fuga por
  si mismo. Cerrar esto exige repuntar 7 controles en 13 frames aprobados de Clases tablet, lo que cambia
  lo que el docente ve al navegar entre modulos, no solo un retorno. Queda como decision abierta del owner
  y sigue cubierto por `debt-a40b2b029a63` y [#166](https://github.com/IgnacioBarEsp/PlanearIA/issues/166).

Captura del frame movil corregido: `capturas-breakpoint/escritorio-movil-307-1078-corregido.png`.

## Efecto sobre la deuda registrada

`debt-b1d35a5b5915` cubria 15 aristas moviles: 7 en los puentes `M-G` y 8 en los hubs del draft raiz. Las 7
de los puentes quedan corregidas y las 8 del draft dejan de ser alcanzables desde el candidate, aunque
siguen existiendo en el recorrido legacy. El item permanece **abierto** porque su alcance no se resolvio por
completo; el motor de deuda no admite resoluciones parciales y no se fuerza un cierre que no ocurrio.

---

# Tercera iteracion — coherencia en los tres breakpoints

**Fecha:** 2026-08-13. El owner autorizo cerrar tablet y todo lo pendiente que no dependa de su gate.

## 1. Tablet: 106 saltos aguas abajo de Clases

El Escritorio tablet candidate ya no fugaba, pero entrar a Clases tablet reabria el problema: `T0`-`T4`,
sus estados, filtros y el lanzador `T-1` entregaban los siete frames `T-G`, que se llaman tablet y miden
1440x960.

Se repuntaron **91 aristas en 13 frames aprobados de Clases tablet** mas la accion de prioridad de `T-1`.
Todo control cuyo destino era un `T-G` resuelve ahora en el estado honesto `345:1006`. Solo cambia el
destino: ningun frame aprobado se movio, redimensiono ni reescribio.

Consecuencia deliberada: los siete `T-G` quedan fuera del recorrido de tablet. Siguen existiendo en el
lienzo y conservan seis aristas entrantes desde superficies de escritorio, asi que no son huerfanos ni se
borran; su sustitucion por superficies tablet reales pertenece a la ola SDD de cada modulo.

## 2. Seis fichas de continuidad muertas

`Continuidad owner · tablet · 1..4` y las dos de movil no tenian ninguna reaccion: el journey E-03 solo
funcionaba en escritorio. Se conectaron respetando el owner de cada objeto y el breakpoint:

| Ficha | Breakpoint | Destino |
| --- | --- | --- |
| Planeacion · Ciencias 2B, Asistencia · 3A, Material visual, Mensaje · familias | tablet | `345:1006` (no existe superficie tablet de esos owners) |
| Planeacion · Clases | movil | `192:292`, entrada de Clases movil aprobada |
| Mensaje · familias | movil | `274:1147`, puente de Mensajeria movil |

## 3. Areas de toque por debajo de 44 pt

La spec exige 44 pt o justificacion documentada. Se corrigieron **22 controles del lado candidate** sin
mover un solo glifo, ampliando la caja y centrando verticalmente el texto:

- Diez fichas de continuidad: escritorio de 40 a 44, tablet y movil de 36 a 44.
- Cuatro `Back target` de los selectores y de los estados de limite: de 140x19 a 140x44.
- Ocho `Wordmark · movil` de los puentes `M-G`, que actuan como control de inicio: de 180x24 a 180x44.

## Verificacion final por alcanzabilidad

| Entrada | Frames alcanzables | Saltos de breakpoint | Puertas al draft | Destinos rotos | Controles muertos reales | Controles < 44 pt (candidate) |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Escritorio `307:966` | 39 | **0** | 27 intencionales | **0** | **0** | **0** |
| Tablet `307:1046` | 29 | **0** | **0** | **0** | **0** | **0** |
| Movil `307:1078` | 38 | **0** | **0** | **0** | **0** | **0** |

Comprobaciones adicionales: cero secuencias `\n` literales en toda la pagina y cero solapamientos reales en
las cinco superficies candidate; los dos pares que la deteccion marca son un rectangulo de accion y su
propia etiqueta.

Los cinco controles sin reaccion que quedan dentro del candidate son legitimos: tres `Nav hit · <bp> ·
escritorio`, que son el modulo activo y por contrato no navegan a si mismos, y dos contenedores
`Continuidad · <bp> · owners`, cuyas fichas hijas si llevan la reaccion.

Capturas: `capturas-breakpoint/escritorio-tablet-307-1046-final.png` y
`capturas-breakpoint/escritorio-movil-307-1078-corregido.png`.

## Lo que queda fuera y por que

- **Diecisiete controles por debajo de 44 pt en frames del draft `#156`** alcanzables desde el recorrido de
  escritorio (`Volver a Escritorio` y `Volver a Office` de 140x20, `Acción · Exportar PDF` de 154x36,
  `Abrir texto` de 108x20). Viven en la linea base archivada de `#156`, que el candidate de escritorio
  reutiliza de forma deliberada. Corregirlos altera el prototipo legacy para todos sus recorridos y
  pertenece a la ola del modulo que los posee.
- **Nueve aristas del Escritorio tablet del draft `162:115`** y las ocho de los hubs moviles `158:x`, ya no
  alcanzables desde el candidate pero vivas en el recorrido legacy.
- Ambos grupos siguen cubiertos por `debt-a40b2b029a63`, `debt-b1d35a5b5915` y
  [#166](https://github.com/IgnacioBarEsp/PlanearIA/issues/166).

Las dos deudas permanecen **abiertas**. Su enunciado de fondo no cambio: el prototipo sigue sin tener
superficies propias de tablet ni objetos en movil. Esta iteracion no las construyo, hizo honesto el limite.
Cerrarlas exige las olas `#157-O3` a `#157-O12`.
