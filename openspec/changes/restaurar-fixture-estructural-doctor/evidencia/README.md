# Evidencia: restaurar-fixture-estructural-doctor (#149)

Levantada sobre `development@b967275` y la rama `feat/restaurar-fixture-estructural-doctor`, el
2026-07-25, con GitNexus `1.6.10-rc.23` y Node `v26.4.0` en Windows.

## Indice

| Archivo | Que prueba |
| --- | --- |
| `01-indice-degradado.txt` | Estado del indice que producia el FAIL: `impact --uid Function:` responde `not found`, `impact` por nombre devuelve dos candidatos y el que tiene 202 impactados llega con `uid` vacio |
| `02-grafo-degradado.txt` | El grafo en ese estado: el nodo `Function` del fixture con `id` vacio y 2 aristas entrantes; 2272 de 2298 nodos `Function` sin `id`, mas 973 `Section` |
| `03-grafo-tras-rebuild.txt` | Tras `clean --force` + `analyze --index-only`: 2298/2298 nodos `Function` con `id` y el fixture resolviendo `epistemic: exact` con 1 dependiente directo |
| `04-no-vacuidad-mutacion.txt` | Las dos mutaciones que la regresion nueva debe detectar, con el exit real de la suite |
| `05-version-fijada.txt` | Refutacion de la hipotesis de version, y el hallazgo lateral del rango caret de `npx` |
| `06-verificacion-documental.txt` | Contraste programatico de cada `**Estado:**` del plan UX/UI contra `openspec/changes/archive/` |
| `07-validacion.txt` | Suite de validacion tecnica |
| `08-doctor-antes-despues.txt` | `harness:doctor` antes y despues |

## Conclusion de la investigacion

La hipotesis del issue (el indexador reclasifico el simbolo, luego el fixture estaba obsoleto) quedo
refutada. El fixture describe la verdad: `Function:` es el nodo que porta las aristas del simbolo, y en
un indice sano resuelve exacto con 1 dependiente directo, igual que el 2026-07-14 y el 2026-07-19. Lo
que se degrado fue el indice local.

El defecto corregido es que `gitnexus:repair` medía su exito solo por la frescura, de modo que sobre un
indice fresco y estructuralmente degradado era un no-op que reportaba exito. Ahora comprueba tambien la
resolucion estructural y escala a un rebuild completo antes de rendirse.

## Limites declarados

- **El mecanismo de la corrupcion no se reprodujo.** Un commit seguido de `analyze --index-only` sobre
  el indice sano dejo 2298/2298 nodos con `id`. Se documenta el estado observado, no un mecanismo
  probado. El diseno no depende de conocerlo: la escalada se dispara por una comprobacion observable
  del resultado.
- **El peldano `analyze --force` se omitio a proposito.** Seria mas barato que `clean`, pero no se pudo
  medir contra el estado danado porque no se reprodujo. No se anade a la escalada un peldano supuesto.
- **El `harness:doctor` en FAIL no se capturo de primera mano** en esta sesion: la degradacion se
  diagnostico directamente sobre la verificacion estructural, que es la cadena que produce ese FAIL. El
  texto del FAIL se cita del issue #149 y la causa esta capturada en `01` y `02`.
- **`npm test` deja 1 fallo local conocido** (`spreadsheetDependency`, tarball vendorizado de SheetJS en
  Windows, de #133/#126): pasa en CI y es ajeno a este change. 884 de 885 en verde.
- **El rango caret de `npx` queda abierto.** Se registra como `external-risk` con evidencia; no se
  corrige aqui porque excede el alcance del issue y exigiria tocar la invocacion del wrapper.

## Sin QA visual

El change no toca UI: no hay `expo start --web`, capturas por breakpoint ni checklist Nielsen. Las
superficies declaradas son `harness` y `docs`.
