# Paridad del harness

> Change: `fortalecer-guardrail-anti-slop` · Fecha: 2026-07-31.

## Fuente y espejos

La fuente editable se modificó solamente en:

- `.agents/instructions/core.md`
- `.agents/skills/ux-ui-design/SKILL.md`
- `.agents/skills/awwwards/SKILL.md`

Se ejecutó `npm run agent:harness:sync`. El renderer idempotente actualizó cuatro espejos: `AGENTS.md`, `CLAUDE.md`, `.codex/skills/ux-ui-design/SKILL.md` y `.codex/skills/awwwards/SKILL.md`.

## Resultados reproducibles

| Comando | Resultado | Interpretación |
| --- | --- | --- |
| `npm run agent:harness:check` | `OK (36 mirrors in parity)` | Ningún mirror difiere de su fuente. |
| `npm run agent:opsx:patch:check` | `OK (CLI local y sin comandos zombi)` | El cambio no invadió los workflows OPSX cuyo owner es la CLI. |
| Búsqueda de las reglas nuevas en fuente y espejos | Coincidencias en `.agents`, `AGENTS.md`, `CLAUDE.md` y skills Codex | Un agente sin soporte de skills obtiene el núcleo desde `AGENTS.md`; los que sí las soportan reciben el preflight detallado. |

La política degrada de forma explícita: sin Figma, prueba la composición con texto/esquema; sin Playwright, declara la evidencia visual pendiente. Ninguna degradación afirma paridad visual ni cierra un gate humano.
