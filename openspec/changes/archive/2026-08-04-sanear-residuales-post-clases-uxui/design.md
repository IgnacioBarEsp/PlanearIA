# Design: sanear-residuales-post-clases-uxui

## Context

El assessment inmutable de `reconstruir-clases-experiencia` abrio cuatro Minors: rollback Figma sin
version nombrada, ausencia de un contrato Figma -> tokens, ausencia de un modo Figma para daltonismo y
rechazo CORS durante QA local. En conjunto pausaron el plan `uxui-navegacion-global` en 7/5.

La verificacion posterior separa causa y consecuencia:

- el conector Figma rechazo de forma atomica la operacion de version nombrada, pero el archivo conserva
  historial automatico, frames previos, seccion versionada y evidencia de aprobacion;
- `ThemeContext`, `DaltonismoContext`, `src/themes/colors.ts` y `src/themes/useAppTheme.ts` son el contrato
  real de preferencias; Figma no es dependencia del runtime;
- `backend/lib/auth.js` admite `http://localhost:8081`, mientras la sesion fallida se abrio desde
  `http://127.0.0.1:8081`; el runbook y Golden Journeys ya prescriben `localhost:8081`.

### Contexto DDD

El owner primario es **Experiencia y Preferencias**: gobierna tokens, estados perceptuales, accesibilidad
y navegacion. **Seguridad y autorizacion** conserva ownership exclusivo de CORS, autenticacion y origenes
permitidos; este change no modifica ese contrato, solo impide que QA use un origen distinto sin declararlo.
No se intercambian entidades ni datos entre bounded contexts, no aplican `userId`/`src/sync` y no se crea
un contrato cruzado de dominio. La direccion documental es QA/Figma -> evidencia -> futuro change runtime;
el consumidor nunca toma ownership de tokens, preferencias o CORS.

El contrato se aplica igual a movil `<768`, tablet `768-1279` y web `>=1280`: cambia la evidencia por
breakpoint, no la semantica de roles, rollback o accesibilidad. No se crean archivos por plataforma.

## Goals / Non-Goals

**Goals:**

- Resolver los cuatro IDs con reglas observables y evidencia reproducible.
- Evitar que los siguientes modulos repitan los mismos residuales.
- Mantener separados el destino visual Figma, la implementacion por tokens y la validacion funcional de
  preferencias.
- Preservar el default CORS seguro y volver reproducible la QA que necesita backend.
- Dejar el plan reanudable solo si el motor de deuda lo demuestra tras un assessment limpio.

**Non-Goals:**

- Modificar Figma, runtime, backend, datos, storage, sync o dependencias.
- Elegir nuevos hex, crear tokens o cambiar la paleta aprobada de Clases.
- Simular daltonismo en Figma como sustituto de `DaltonismoContext`.
- Redisenar Escritorio, Office u otro modulo.
- Editar manualmente el registro de deuda o las specs principales.
- Ejecutar `apply` antes de la aprobacion explicita del owner.

## Decisions

### Decision 1 - Resolver por evidencia nueva, nunca reescribir el assessment original

El cierre creara un assessment `kind: remediation`, `result: clean`, `candidates: []` y cuatro entradas
`resolves`, cada una con evidencia especifica. El assessment de Clases permanece inmutable. Solo
`debt:capture` podra mutar el registro y solo `debt:sync` actualizara #161.

**Alternativa descartada:** editar `registry.json`, reducir unidades o reclasificar el assessment de
Clases. Eso destruye trazabilidad y contradice el Debt Control Loop.

### Decision 2 - Rollback Figma por capacidad soportada, no por nombre de API

Una ola Figma cumple rollback cuando conserva simultaneamente:

1. historial automatico accesible en el archivo;
2. frames historicos sin punto de inicio activo;
3. seccion identificada por modulo, estado y version;
4. evidencia enlazada del gate humano y del destino de restauracion.

Un checkpoint nombrado se registra solo si la herramienta activa lo soporta y confirma. Su ausencia no
es deuda cuando las cuatro condiciones anteriores existen. Si falla una, el frame no puede promoverse.

**Alternativas descartadas:** exigir una API no disponible, duplicar todo el archivo o borrar versiones
anteriores. Aumentan fragilidad o eliminan el propio rollback.

### Decision 3 - Handoff por roles semanticos; runtime conserva el valor final

Figma expresa intencion; runtime decide el token resoluble. La evidencia de cada modulo usa esta tabla
de familias, sin afirmar equivalencia fija 1:1:

| Rol Figma | Familia runtime candidata | Invariante |
| --- | --- | --- |
| `bg/canvas` | `background`, `backgroundSoft` | plano base, no accion |
| `bg/surface` | `surface*`, `surfaceContainer*` | jerarquia por capa |
| `text/primary` | `text`, `onSurface` | contraste de lectura |
| `text/secondary` | `textSecondary`, `onSurfaceVariant` | no informacion critica aislada |
| `border/divider` | `border*`, `divider`, `outlineVariant` | separacion sin card por defecto |
| `action/primary` | `primary*`, `primaryContainer`, `textOnPrimary` | una accion dominante por paso |
| `selection` | `primaryTint`, `toggleActive` | acompanada por label/estado textual |
| `success/warning/danger` | familias `success`, `warning`, `error`/`danger` y sus tintes | nunca color como unica señal |
| `overlay/elevation` | `overlay`, `shadowBlue*`, tokens de elevacion | fallback solido y contraste |

El futuro change runtime debe inventariar el rol, elegir un token existente o proponer uno versionado,
justificar cualquier diferencia y probar `useAppTheme` en claro, oscuro, alto contraste y modos de
daltonismo. Copiar un hex Figma a una pantalla no satisface el handoff.

**Alternativa descartada:** reemplazar hoy el primario azul runtime por terracota/verde. Eso seria una
decision visual y de migracion fuera de este saneamiento, con blast radius no aprobado.

### Decision 4 - Daltonismo perceptual en Figma, funcional en runtime

Figma debe demostrar que estado, riesgo, seleccion, exito, error y offline se entienden mediante texto,
estructura o iconografia ademas del color. No se exige por defecto una coleccion/mode por protanopia,
deuteranopia o tritanopia. La validacion funcional corresponde a `DaltonismoContext` compuesto por
`useAppTheme`.

La decision se reabre si una prueba con docentes, una auditoria de contraste o una comparacion runtime
demuestra un defecto cromatico no detectable con las señales no-color y propone un modo Figma como
control preventivo concreto.

**Alternativa descartada:** crear tres modos Figma ahora. Duplicaria una simulacion que el prototipo no
ejecuta y podria divergir silenciosamente de los filtros reales.

### Decision 5 - `localhost:8081` es el origen canonico de QA web

El procedimiento levanta Expo web, espera HTTP 200 en `http://localhost:8081` y navega esa misma URL. Si
la prueba consume backend remoto, verifica antes el preflight para el origen exacto. Otro host, puerto o
dominio solo puede usarse con `ALLOWED_ORIGINS` explicito y evidencia de autorizacion; si no, la QA puede
evaluar UI local pero no afirmar datos, backend o sync.

**Alternativas descartadas:** agregar `127.0.0.1` al default solo para acomodar una ejecucion desviada, o
ignorar los errores CORS. La primera amplia configuracion sin necesidad y la segunda produce evidencia
engañosa.

### Decision 6 - El saneamiento no habilita automaticamente el siguiente modulo

Tras `apply`, la revision adversarial, el assessment y archive/finish siguen siendo gates independientes.
Escritorio solo puede entrar a enrich/propose cuando `debt:check` reporte el plan activo. Sus artefactos
tambien requeriran aprobacion humana separada antes de su propio `apply`.

## Risks / Trade-offs

- **[Contrato documental sin adopcion]** -> delta specs normativas, checklist en tasks y evidencia por ID;
  los siguientes changes deben citar estas reglas.
- **[Mapeo demasiado abstracto]** -> tabla de familias y obligacion de justificar token por rol en cada
  handoff runtime; no se inventa una equivalencia universal falsa.
- **[Conformidad Figma confundida con accesibilidad runtime]** -> fronteras y criterios de reapertura
  explicitos; ninguna aprobacion Figma declara daltonismo funcional.
- **[QA visual local sin datos remotos]** -> clasificar la limitacion y prohibir afirmaciones de backend o
  sync cuando el preflight no pasa.
- **[Cierre nominal de deuda]** -> `resolves` exige evidencia, la revision adversarial puede impedir la
  captura y el plan sigue pausado si el motor no baja de umbral.

## Migration Plan

1. Tras aprobacion del owner, aplicar solo cambios documentales, delta specs y evidencia.
2. Reproducir matriz CORS, contratos runtime y rollback con comandos/artefactos read-only.
3. Ejecutar revision adversarial; corregir todo Blocker/Major sin ampliar alcance.
4. Preparar y capturar assessment de saneamiento con los cuatro `resolves` y cero candidatos nuevos.
5. Confirmar `debt:check`, readiness de archive y `debt:sync` antes de cerrar #161.
6. Archivar por la CLI OpenSpec y finalizar por PR normal.

**Rollback:** revertir el PR documental. Las specs principales solo cambian por archive; los assessments
no se borran. Si un ID no queda demostrado, se omite de `resolves` y el plan permanece pausado.

## Open Questions

Ninguna decision tecnica abierta. La aprobacion de estos artefactos y la orden posterior de `apply` son
gates humanos pendientes y no se infieren de la aprobacion de Clases.

