# Design: restaurar-fixture-estructural-doctor

## Context

El check `gitnexus` del doctor falla con el indice fresco. La cadena de comprobacion es:
`diagnose` clasifica la frescura, y solo si es `fresh` se ejecuta `runStructuralVerification`, que
corre la query MVVM y un `impact` por UID exigiendo `target.id === FIXTURE_UID` y
`epistemic === 'exact'`.

**Estado verificado el 2026-07-25 sobre `development@b967275`:**

| Observacion | Evidencia |
| --- | --- |
| El binario fijado no cambio | La integridad del tarball en la cache de `npx` coincide con `dist.integrity` del registro; `1.6.10-rc.23` tiene una sola fecha de publicacion (`2026-07-14T16:28:07Z`), anterior al commit `c5d9a27` que la fijo |
| El simbolo no cambio | `src/hooks/useCrearPlaneacionViewModel.ts` sin modificaciones desde `2e5acfb` (#81) |
| El parser emite **dos** nodos | `Function:` y `Const:` para el mismo simbolo, ambos en la linea 367, ambos con relaciones |
| El nodo `Function` tenia el `id` vacio | `cypher` devolvia `Function` con `id` en blanco y 2 aristas entrantes; `Const` con `id` valido y 1 |
| El dano era masivo | 2272 de 2298 nodos `Function` sin `id` (solo 26 utilizables), mas 973 nodos `Section` |
| El rebuild completo lo repara | Tras `clean --force` + `analyze --index-only`: 2298/2298 con `id`, y el fixture resuelve `epistemic: exact` con 1 dependiente directo |

Ese ultimo resultado coincide exactamente con la evidencia del 2026-07-14
(`Documentacion/03-validacion/reparar-gitnexus-fts/README.md:17-21` y `:58-59`) y con el `PASS gitnexus`
que registro #112 el 2026-07-19
(`openspec/changes/archive/2026-07-19-gitnexus-frescura-doctor/evidencia/06-validacion-final.txt`).

**Contextos DDD tocados.** Ninguno de dominio. El change vive integramente en el contexto de soporte
*Harness y operacion SDD* (`scripts/`, espejos de agente, planes). No cruza Planeaciones, Classroom,
Sync, IA ni Cuenta; no lee ni escribe datos de usuario. El unico artefacto de dominio que aparece es el
simbolo del fixture, y se usa **como dato de prueba de solo lectura**, no como codigo bajo cambio.

## Goals / Non-Goals

**Goals:**

- Que la unica secuencia de recuperacion documentada recupere tambien un indice fresco pero
  estructuralmente degradado.
- Que `repair` no pueda declarar exito dejando el fixture sin resolver.
- Que exista una regresion que falle de forma informativa ante ese estado, en vez de que el estado solo
  se manifieste como un FAIL del doctor sin ruta de salida.
- Que el plan UX/UI deje de afirmar `pendiente` sobre trabajo archivado.

**Non-Goals:**

- Cambiar `FIXTURE_UID`, `FIXTURE_QUERY` o la version fijada de GitNexus.
- Hacer el fixture agnostico al kind, relajar `epistemic === 'exact'` o admitir prefijos alternativos.
- Convertir el FAIL del doctor en WARN, o excluir la verificacion estructural del doctor.
- Cambiar `scripts/harnessDoctor.mjs`.
- Corregir el rango caret de `npx` (se registra como riesgo, no se toca).
- Cualquier trabajo de producto UX/UI.

## Decisions

### D1. El fixture se conserva tal cual

**Decision:** `FIXTURE_UID` sigue siendo `Function:src/hooks/useCrearPlaneacionViewModel.ts:useCrearPlaneacionViewModel`.

**Por que.** Es el nodo que porta las aristas. En el indice sano resuelve `exact` con 1 dependiente
directo; en el indice degradado ese mismo nodo conservaba sus 2 aristas entrantes y solo habia perdido
su `id`.

**Alternativa descartada — cambiar el prefijo a `Const:`.** Habria puesto el doctor en verde, pero
apuntando al nodo con **0** impactados. La verificacion habria seguido pasando sobre un grafo cuyas
aristas de dependencia eran inalcanzables por UID: un falso verde con la misma forma que #112, donde
la salud se afirmaba por ausencia de fallos conocidos. Ademas seria una afirmacion falsa: el rebuild
demuestra que `Function:` es la clasificacion vigente del indexador fijado.

**Alternativa descartada — tolerar cualquier prefijo (anclar por ruta y nombre).** Es la opcion que
sugeria el issue original. La spec exige un fixture *UID-disambiguated* que resuelva *exactly*, y el
simbolo tiene dos candidatos: un fixture agnostico al kind elegiria arbitrariamente entre un nodo con
radio de impacto y otro sin el, y habria pasado en verde justo en el estado danado. Debilita la
deteccion en vez de corregir la causa.

### D2. La correccion pertenece a `repair`, no al verificador

**Decision:** `repair` verifica la estructura despues de restaurar la frescura, reutilizando
`runStructuralVerification`.

**Por que.** El sintoma es que el verificador falla; la causa es que la recuperacion no recupera. El
contrato vigente ya prohibe que la recuperacion reporte exito dejando el indice `stale`; la misma
logica aplica a un indice fresco cuyo grafo no resuelve. Sin esto, el unico remedio real es un `clean`
manual, y la spec prohibe exponer una segunda ruta de recuperacion paralela.

Se reutiliza `runStructuralVerification` en vez de reimplementar la comprobacion: la spec exige una
unica definicion compartida de "estructuralmente sano" para que los consumidores no deriven.

### D3. La escalada tiene un solo peldano nuevo, y es el verificado

**Decision:** ante un fallo estructural con indice fresco, `repair` ejecuta `clean --force` seguido de
`analyze --index-only --name PlanearIA .` y somete el resultado a las **mismas** post-condiciones que el
reindex inicial: sin diagnostico FTS, indice fresco y fixture resuelto. Si alguna sigue incumplida, o si
el borrado o el reindex no se pueden ejecutar, lanza nombrando el paso concreto.

**Por que las mismas y no solo la estructural.** La revision adversarial encontro que comprobar en el
camino escalado unicamente el fixture reproducia en pequeno el defecto que este change corrige: un
rebuild que resolviera el fixture dejando el indice stale habria terminado en 0. Las post-condiciones
viven en una funcion compartida (`recoveryFailure`) precisamente para que ningun camino de exito pueda
saltarse una.

**Un verificador que no puede correr cuenta como no resuelto.** `runStructuralVerification` clasifica
sus desenlaces previstos, pero el runner lanza si el CLI sale con codigo distinto de cero. Sin envolver
esa llamada, el modo de fallo mas ruidoso era el unico que salia de `repair` por excepcion, saltandose
la escalada entera. Es la misma leccion de #112: la ausencia de un veredicto no es un veredicto.

**Por que exactamente ese peldano.** Es el unico remedio comprobado end to end contra el estado
observado en esta sesion. `analyze --force` esta documentado como "force full re-index even if up to
date" y seria mas barato, pero **no se pudo verificar** que repare el blanqueo de `id`, porque el
estado danado no se reprodujo. Anadirlo seria un peldano supuesto, no medido; se omite.

`--index-only` se conserva en el reindex posterior porque es la bandera que impide que `analyze`
escriba en los archivos de agente. `clean` solo borra el indice local, que esta en `.gitnexus/` e
ignorado por git; no toca fuentes, datos ni configuracion.

**Limite honesto.** Un commit seguido de `analyze --index-only` sobre el indice sano **no** reprodujo
el blanqueo: 2298/2298 conservaron su `id`. El mecanismo de acumulacion queda sin probar. El diseno no
depende de conocerlo: la escalada se dispara por una comprobacion observable del resultado, no por una
hipotesis sobre la causa.

### D4. El doctor no se toca

**Decision:** `scripts/harnessDoctor.mjs` queda igual.

**Por que.** Su retorno temprano ante un indice `stale` no es un descuido: la spec lo exige
explicitamente ("it fails on freshness before evaluating its fixtures"). Ese orden es el que
enmascaro la degradacion durante dias, pero la correccion no es evaluar fixtures sobre un grafo
atrasado, sino que un indice no pueda quedar fresco y danado tras una recuperacion exitosa. Con D2 el
enmascaramiento deja de tener donde esconderse.

### D5. La regresion se prueba por mutacion

**Decision:** la cobertura nueva usa el runner inyectable ya existente y afirma tres cosas: que
`repair` escala al rebuild cuando la verificacion estructural falla tras un reindex exitoso; que
`repair` lanza si tras el rebuild sigue sin resolver; y que la comprobacion es **no vacua**, es decir
que contra un UID que no coincide con el fixture la verificacion falla en vez de pasar.

**Por que por mutacion.** Una prueba que solo afirma el camino feliz habria pasado igual durante todo
el periodo en que el indice estaba danado. La no vacuidad es lo que distingue una guardia de un
adorno; es la leccion que ya dejaron #110 y la Ola 2a de #141.

## Risks / Trade-offs

- **`repair` se vuelve mas lento en el camino feliz** (anade una query y un impact, unos segundos) →
  Aceptable: es el precio de que su exito signifique algo. El rebuild completo, que si cuesta ~30 s,
  solo corre cuando la verificacion falla.
- **`clean` borra el indice local** → Es estado generado e ignorado por git, reconstruible con el mismo
  comando; no toca fuentes ni datos. Solo se ejecuta cuando el indice ya esta inservible para su
  proposito.
- **El mecanismo de la corrupcion sigue sin conocerse** → La escalada se dispara por resultado
  observable, no por causa; si el estado reaparece por otra via, la recuperacion igual lo detecta. Si
  el rebuild dejara de bastar, `repair` falla con causa accionable en vez de declarar exito.
- **Las pruebas fijan la secuencia exacta de subcomandos de `repair`** → Se conserva esa forma porque
  es lo que permite afirmar que la ruta de solo lectura no reindexa; se actualizan las listas
  esperadas, sin relajar la asercion.
- **El rango caret de `npx` sigue abierto** → Se registra como `external-risk` con evidencia. Hoy no
  afecta: el binario resuelto es rc.23 y su integridad coincide con la del registro.

## Migration Plan

No hay migracion de datos ni de esquema. El despliegue es el merge del PR. Rollback: revertir el PR
restaura `repair` a su forma actual; el fixture no cambia porque este change no lo toca. El indice
local se reconstruye con la secuencia documentada.

## Open Questions

Ninguna que bloquee. Queda anotado para un flujo futuro, si reaparece: identificar que secuencia de
operaciones incrementales blanquea los `id`, para poder prevenirlo en vez de repararlo.
