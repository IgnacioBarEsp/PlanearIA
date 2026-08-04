# Revisión adversarial

**Fecha:** 2026-08-03  
**Alcance:** issue #159 / change `reconstruir-clases-experiencia`  
**Fuentes:** `proposal.md`, `design.md`, dos delta specs, `tasks.md`, baseline brownfield, evidencia 01–08, sección Figma candidate `177:115`, matriz v1.1 y diff documental.  
**Independencia práctica:** pase separado del camino de construcción, siguiendo `adversarial-review`; no equivale a aprobación humana ni a revisión por una segunda persona.

## Criterios refutados

- La entrada debe ser clases-primero y cada señal debe aterrizar en evidencia, no en KPIs.
- Una clase debe mantener Tablón, Trabajo de clase, Personas y Seguimiento en cada breakpoint.
- Actividad y anuncio deben distinguir borrador, confirmación y sync sin éxito remoto falso.
- Adjuntar/Crear recurso debe conservar owner, borrador, cancelación y confirmación.
- Seguimiento debe conservar clase/tarea/alumno, explicar datos insuficientes y permitir devolución.
- Loading, empty, error, offline, conflicto, IA ausente y título inválido deben tener recuperación.
- El grafo no debe romper destinos, cruzar breakpoints ni alterar #156.
- El artefacto debe conservar 44 pt, tipografía/tokens, contraste, fuente ampliada y modo oscuro sin depender de color.
- El resultado debe permanecer `candidate` hasta aprobación visual explícita.

## Hallazgos y resolución

| Severidad | Área | Hallazgo adversarial | Evidencia | Resolución |
|---|---|---|---|---|
| Major | Delta de navegación | La spec prometía entrar al nuevo candidato desde Office, Asistente y Más, aunque el change preserva #156 y solo creó launchers candidate de Escritorio. | `figma-prototype-navigation/spec.md` vs `05-grafo-candidate-figma.md`. | Corregido en spec: el escenario exige los tres launchers candidate y preserva explícitamente los destinos de #156. |
| Major | Handoff | `Crear recurso` listaba Office/Diseño pero ofrecía un único “Simular retorno”, por lo que owner y elección no eran verificables. | Present inicial C-03 y overlays `193:466`, `193:663`, `193:860`. | Resuelto: botones separados, cancelación propia y seis variantes tipadas (`224:8`, `224:25`, `224:56`, `224:73`, `224:104`, `224:121`). Present verificó Diseño desktop, Office tablet y cancelación móvil. |
| Major | Accesibilidad/tema | La muestra oscura reveló 97 estados con tinta fija `#141a24` sobre superficies oscuras. | Audit `230:1007`; componente `181:149`. | Resuelto en el componente fuente vinculando `State` a `text/primary`. Reauditoría: cero textos candidate con color fijo; ratios oscuros 7.00–17.29:1. |
| Minor | Estados | La matriz no nombraba explícitamente el error de título vacío. | Celda `197:712` vs escenario de actividad sin título. | Resuelto: “Título vacío: corregir sin perder valores” más conflicto local/remoto; screenshot sin recorte. |
| Minor | Cobertura Present | C-03 había recorrido Crear recurso, pero no el selector Adjuntar existente. | Evidencia Present inicial. | Resuelto en desktop/tablet/móvil; las tres capturas muestran tipo, owner y confirmación separada. |
| Minor | Trazabilidad | Matriz y auditoría aún decían que Present estaba pendiente. | Matriz v1.1 y evidencia 06. | Resuelto: se registró la reproducción completada y se mantiene solo la aprobación humana como pendiente. |

## Reauditoría final

- 603 aristas; cero destinos inexistentes; cero cruces de breakpoint.
- Cero targets interactivos menores de 44 pt.
- Cero textos menores de 12 pt, truncados o con color fijo.
- Cero efectos, sombras o gradientes nuevos.
- C-01 a C-05 pasan en desktop, tablet y móvil; el selector de referencia y las dos ramas del handoff tienen owner/retorno explícitos.
- Antes del gate humano, el candidato, los launchers y las variantes históricas permanecieron aislados dentro de `177:115`; los frames de #156 no se modificaron.

## Addendum — iteración de flujo desktop tras feedback del owner

El owner señaló que desktop se percibía como copias genéricas del Escritorio, incluido Office Docente.
La inspección del grafo confirmó un problema de continuidad, no una afirmación que deba descartarse:
`Nav hit · office` desde el candidate iba al frame histórico `61:2` y los retornos `Nav hit · escritorio`
iban a `87:47`. Aunque `61:2` ya tenía jerarquía propia de Office, esa fuga de grafo invalidaba el
aislamiento del recorrido candidate y explicaba la percepción.

| Severidad | Hallazgo | Resolución verificable |
| --- | --- | --- |
| Major | Los enlaces desktop de Office/Escritorio desde Clases candidate y sus estados derivados cruzaban a `61:2`/`87:47`. | Se creó `257:951` (`D-2 · Office Docente · desktop · candidate`) como copia aislada de la superficie de archivos. Se redirigieron 26 enlaces desktop de Office/Escritorio a `257:951`/`198:695`; `Dock · Clases` y `Nuevo archivo` del launcher usan `186:115`/`257:951`. |

Reverificación API: 26 enlaces revisados, cero rutas legacy de Office/Escritorio, dos destinos internos
resueltos y cero destinos inexistentes. Figma Present reprodujo `198:695 → 257:951 → 186:115 → 198:695`.
La captura es `evidencia/figma-present/desktop-office-candidate-iteration-2026-08-03.png`.

Los enlaces de los módulos globales fuera de Escritorio, Office y Clases siguen siendo fronteras al grafo
histórico de #156: no son parte de esta corrección ni una declaración de paridad de esos módulos. #156 y
sus frames no se modificaron.

## Addendum — aislamiento del tránsito global

El siguiente feedback del owner encontró que esas fronteras aún rompían el journey: los hubs históricos
tenían retorno a Clases legacy. Se corrigió sin modificar #156 mediante puentes candidate por breakpoint.
La auditoría posterior revisó 425 controles globales (171 desktop, 159 tablet, 95 móvil): cero destinos
inexistentes y cero enlaces globales candidate hacia Clases legacy. La rama `Más` móvil conserva sus seis
destinos dentro del candidate.

Esto resuelve continuidad del hub, no paridad del contenido profundo. Tablet sigue usando fallback visual
desktop para los módulos aún sin superficie propia; cada rediseño será un change SDD posterior y no puede
declararse aprobado por esta corrección.

## Clasificación Debt Control Loop

La captura inmutable del assessment se reserva para task 5.4, después del gate humano. Los residuales verificados se preclasifican así:

| Categoría | Severidad | Residual | Verificación / tratamiento |
|---|---|---|---|
| `external-risk` | Minor | La API disponible no soportó versión nombrada de Figma. | Fallo atómico reproducido; mitigado por sección aislada `177:115` e historial automático. |
| `decision-required` | Minor | Figma usa roles semánticos terracota/verde y runtime aún usa primario azul. | Drift verificado; el futuro change runtime debe mapear roles y validar los tres contexts, no copiar hex. |
| `external-risk` | Minor | El backend desplegado rechaza el origen local Expo por CORS. | Reproducido en la comparación runtime; no afecta el artefacto Figma y requiere decisión operativa posterior. |
| `decision-required` | Minor | Figma no define modo de variables específico para daltonismo. | Verificado en colecciones locales; candidate no depende de color, pero el futuro runtime deberá probar `DaltonismoContext`. |
| `false-positive` | — | Errores/advertencias de consola del host Figma Present. | No impidieron carga ni interacción y no provienen del runtime/código de PlanearIA. |

La aprobación humana se obtuvo el 2026-08-04 y quedó enlazada en #159; no era deuda y no autoriza ampliar
este change a runtime. Ningún residual anterior es Blocker/Major del prototipo aprobado.

`npm run debt:check -- --json` terminó en `PASS`: el plan `uxui-navegacion-global` permanece activo,
con presupuesto 0/5, cero flujos con deuda abierta y ningún trigger o pausa. Este check es read-only; no se
capturó todavía el assessment inmutable de task 5.4.

## Veredicto

**PASS CON HUECOS.** No quedan Blockers ni Majors abiertos. El owner aprobó la v1.3 después de la
reauditoría global. Los gaps residuales se conservan como riesgos/decisiones de un futuro runtime o SDD de
otros módulos; el bloque 5 completa trazabilidad, validación y readiness antes de archive.
