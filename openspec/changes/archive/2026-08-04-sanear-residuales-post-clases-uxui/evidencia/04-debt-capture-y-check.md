# Debt Control Loop — captura y check

`npm run debt:capture -- --flow sanear-residuales-post-clases-uxui --input
openspec/changes/sanear-residuales-post-clases-uxui/evidencia/debt-assessment-input.json`

Resultado: **PASS**. Se capturó el assessment `clean` y se resolvieron exactamente:

- `debt-facadc732321`
- `debt-281fc7a2c9b0`
- `debt-763ed774bc1e`
- `debt-5be12c1b2fa0`

`npm run debt:check`: **PASS**. El plan `plan-uxui-navegacion-global` queda en `0/5` unidades,
con `0` flujos con deuda abierta y sin triggers de pausa. El registro fue mutado únicamente por
`debt:capture`; no se editó a mano y los assessments previos permanecen inmutables.
