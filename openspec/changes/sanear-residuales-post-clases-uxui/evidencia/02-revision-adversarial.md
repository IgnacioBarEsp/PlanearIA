# Revisión adversarial — saneamiento post-Clases

**Alcance:** issue #161 / change `sanear-residuales-post-clases-uxui`, antes de archive.

**Fuentes revisadas:** `proposal.md`, `design.md`, las dos delta specs, `tasks.md`, `TLDR.md`,
`brownfield-baseline.md`, `evidencia/01-resolucion-residuales.md` y el diff contra `87f65d1`.
La revisión cubre únicamente documentación, specs delta y evidencia; no hay PR ni cambio de código
que auditar.

## Alineación spec/tareas

- El objetivo es resolver cuatro IDs de deuda sin editar el assessment original ni ampliar el alcance.
- Las reglas de rollback, roles semánticos, daltonismo y QA local tienen escenarios WHEN/THEN y una
  frontera explícita entre Figma, runtime y Seguridad/autorización.
- El diff no incluye Figma, `src/`, `backend/`, datos, storage, sync, dependencias ni
  `openspec/specs/`; las specs principales quedan para el escritor único de archive.
- La aprobación humana de los artefactos está enlazada en #161 y no se usa para autorizar Escritorio ni
  otra ola.

## Pase adversarial

| Severidad | Área | Hallazgo | Evidencia | Resolución |
|---|---|---|---|---|
| Minor | Rollback Figma | Un checkpoint nombrado podría no existir aunque alguien lo cite por costumbre. | La delta spec exige confirmación del conector y deja el checkpoint como opcional; evidencia 01 conserva la limitación. | Resuelto en artefactos: no se afirma una capacidad no demostrada. |
| Minor | Handoff visual | Familias runtime abstractas podrían confundirse con equivalencia 1:1 o copiar hex. | Tabla de `design.md`/Anti-Slop exige familia candidata, justificación y `useAppTheme`; prohíbe literales incidentales. | Resuelto en artefactos; el change runtime futuro debe probar los cuatro contextos. |
| Minor | Accesibilidad | Una maqueta con color suficiente podría omitir la señal semántica. | Specs exigen texto, estructura o iconografía para estados y separan Figma de `DaltonismoContext`. | Resuelto en artefactos; reapertura condicionada a defecto cromático concreto. |
| Minor | QA/CORS | Una sesión desde `127.0.0.1:8081` puede producir una falsa afirmación de backend o sync. | Golden Journeys fija `localhost:8081`, preflight exacto y clasificación `local-only`; evidencia 01 reproduce ambos orígenes. | Resuelto en artefactos; no se agrega origen al default. |
| Pregunta/suposición | Adopción | El contrato documental no obliga por sí solo a que un futuro change lo cite. | `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md`, delta specs y tasks lo convierten en gate heredado; cada ola conserva aprobación separada. | Aceptado como control de proceso, no como claim de paridad automática. |

## Veredicto

**PASS CON HUECOS CONTROLADOS.** No quedan Blockers ni Majors. Los cuatro Minors se convierten en
reglas observables y evidencia trazable; el único hueco restante es la adopción futura, gobernada por
los gates del plan y por revisión humana. Archivar es aconsejable después de completar las validaciones,
el assessment limpio y el readiness gate.

## Siguientes pasos antes de archivar

1. Ejecutar validación estricta de OpenSpec, harness, diff y checks documentales.
2. Actualizar TLDR, baseline y readiness con la evidencia final.
3. Capturar el assessment `kind: remediation`, confirmar `debt:check` sin triggers y ejecutar `debt:sync`.
4. Ejecutar el gate de readiness, luego archive/finish por la CLI canónica.
