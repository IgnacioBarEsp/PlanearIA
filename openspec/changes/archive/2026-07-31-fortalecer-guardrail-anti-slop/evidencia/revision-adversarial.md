# Revisión adversarial

> Change: `fortalecer-guardrail-anti-slop` · Alcance revisado: documentación, fuente del harness y espejos; no runtime de producto. · Fecha: 2026-07-31.

## Preguntas de refutación

| Pregunta | Evidencia revisada | Resultado |
| --- | --- | --- |
| ¿Impone una estética de moda en vez de combatir lo genérico? | Guía canónica: tarea y zona antes de estilo; tabla de refutación y contrato de excepción. | No. El resultado puede ser sobrio, editorial o expresivo según la tarea. |
| ¿Vuelve glass, gradientes, píldoras o bento una prohibición absoluta? | Sección de excepciones y evidencia comparativa. | No. Son excepciones explícitas, reversibles y justificadas, no defaults. |
| ¿Un agente sin Figma/MCP queda bloqueado o produce un falso verde? | Degradación declarada en guía y skills. | No. Puede documentar la decisión, pero debe declarar evidencia visual pendiente. |
| ¿Figma sustituye los gates IHC, accesibilidad o aprobación humana? | Guía, plan activo y evidencia Figma. | No. El borrador se etiqueta como ground truth de diseño, no validación de producto. |
| ¿Se creó una segunda fuente de verdad para las instrucciones? | Fuente `.agents`, renderer, `agent:harness:check` 36/36 y OPSX patch check. | No. Los mirrors son generados y OPSX conserva ownership separado. |
| ¿Se alteró el dominio, stack o runtime de PlanearIA? | Diff del change, proposal y brownfield baseline. | No. El cambio es sólo de gobernanza de diseño y documentación. |

## Hallazgos

| Severidad | Hallazgo | Decisión |
| --- | --- | --- |
| Minor | No existe un linter capaz de decidir semánticamente si una composición es “slop”. | Intencional: el preflight, la evidencia visual, Nielsen, accesibilidad e IHC son gates trazables; no se simula cobertura automática. |
| Minor | La validación real de contraste, teclado, zoom y estados depende de cada superficie implementada. | Ya queda como obligación de cada change UI; no se declara satisfecha por esta política. |

## Veredicto

**PASS con 2 Minors gobernados.** No hay Blockers ni Majors. El change puede pasar al gate pre-archive. Las dos limitaciones no son deuda nueva: son fronteras explícitas entre una política de diseño y la validación por superficie futura.
