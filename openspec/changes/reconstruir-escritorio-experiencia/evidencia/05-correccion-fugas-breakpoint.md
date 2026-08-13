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
