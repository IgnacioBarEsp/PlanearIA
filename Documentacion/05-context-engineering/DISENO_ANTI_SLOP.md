# Diseño Anti-Slop Para PlanearIA

> **Estado:** vigente.
> **Uso:** lectura obligatoria antes de decidir o construir una superficie visible en Figma, React Native u otra herramienta visual.
> **Fuente de verdad:** esta guía operacionaliza el [estándar UX/UI](../01-planes-maestros/PLAN_UXUI_NAVEGACION_GLOBAL.md#19-estandar-de-excelencia-visual); IHC, ground truth y accesibilidad mantienen sus gates.
> **No usar para:** imponer una paleta, fingir aprobación humana, reemplazar evidencia o saltar SDD.

## Regla Principal

“Anti-slop” no significa minimalismo ni una moda concreta. Significa que cada decisión visual expresa una tarea docente, un estado o una jerarquía real. Glass, gradientes, bento, tarjetas, pills, iconos, avatares, sombras o copy genérico nunca son la salida automática de un generador.

Antes de diseñar, el agente consulta esta guía, el plan UX/UI, `IHC_DISCOVERY_DOCENTE.md` y el ground truth disponible. Si falta ground truth, lo declara y construye un draft para revisión; no inventa paridad ni aprobación.

Ruta en menos de tres saltos:

```text
AGENTS.md
  -> Documentacion/05-context-engineering/README.md
    -> DISENO_ANTI_SLOP.md
```

## Preflight Obligatorio Por Superficie

Copiar y completar este registro antes de crear o alterar composición, paleta, tipografía, controles o motion. Puede vivir como nota del frame Figma, en `design.md`, en la evidencia de QA o en los tres cuando el cambio sea versionado.

```md
### Preflight visual — <superficie>

- Estado: draft | candidato a aprobación | aprobado | obsoleto.
- Tarea docente y resultado: <qué logra la persona y qué deja claro al terminar>.
- Zona: trabajo sobrio | Escritorio medio | onboarding/empty alto | landing máximo.
- Ground truth / evidencia: <link, captura o ausencia declarada>.
- Jerarquía: <acción principal, información de soporte, salida segura>.
- Estructura: <por qué lista, línea temporal, documento, tabla, canvas o panel resuelve la tarea>.
- Firma visual única y útil: <detalle que mejora orientación, continuidad o confianza>.
- Riesgo genérico refutado: <patrón detectado y alternativa elegida>.
- Tokens / tipografía: <roles semánticos y jerarquía; no valores inventados>.
- Estados: loading / empty / error / offline-sincronización; justificar cada N/A.
- Accesibilidad: foco/teclado, texto visible, contraste, 44 pt, escalado y no depender solo del color.
- Efectos: ninguno | excepción con propósito, fallback sólido, reduce motion y presupuesto.
- Evidencia siguiente: <screenshot, prueba, entrevista o revisión requerida>.
```

Una casilla sin decisión concreta no pasa el preflight. “Se ve moderno”, “es premium” o “lo genera la herramienta” no son justificaciones.

### Roles semánticos y frontera Figma-runtime

El preflight nombra el rol visual, no un hex aislado. La familia de runtime es una hipótesis de handoff que
debe validar el change dueño mediante `useAppTheme`:

| Rol Figma | Familia runtime candidata | Señal obligatoria |
| --- | --- | --- |
| `bg/canvas`, `bg/surface` | `background*`, `surface*`, `surfaceContainer*` | jerarquía de capas |
| `text/primary`, `text/secondary` | `text`, `onSurface`, `textSecondary`, `onSurfaceVariant` | contraste y lectura |
| `border/divider` | `border*`, `divider`, `outlineVariant` | separación sin ruido |
| `action/primary`, `selection` | `primary*`, `primaryContainer`, `primaryTint`, `toggleActive` | verbo/label visible |
| `success`, `warning`, `danger` | familias de estado y tintes | texto, icono o estructura además del color |
| `overlay/elevation` | `overlay`, `shadowBlue*`, elevación | fallback sólido y reduce motion |

El prototipo no necesita modos Figma específicos de daltonismo por defecto. Sus estados deben sobrevivir
sin color; el comportamiento funcional se prueba en runtime con `DaltonismoContext` compuesto por
`useAppTheme`. La decisión se reabre solo con un defecto cromático concreto y un control preventivo
demostrable. El rollback visual exige historial automático, frames históricos, sección/version identificable
y destino documentado; una versión nombrada del conector es opcional.

## Intensidad Correcta

| Zona | Decisión correcta | Se evita |
| --- | --- | --- |
| Trabajo diario: editor, lista, asistencia, calificación | Precisión, familiaridad, densidad legible y rutas de salida | Espectáculo que compite con lectura o edición |
| Escritorio docente | Orientación de jornada, prioridades reales y continuidad | Dashboard de métricas o cuadrícula de tarjetas intercambiables |
| Onboarding, empty state y transición | Una firma memorable que enseñe el siguiente paso | Efectos que ocultan la acción o no tienen versión estática |
| Landing web separada | Mayor expresión de marca con contenido, rendimiento y accesibilidad propios | Trasladar estética web DOM a React Native |

La firma visual es una sola idea por superficie. En Escritorio puede ser una línea de jornada; en un editor, el ritmo tipográfico y la continuidad del documento. Cinco efectos pequeños no suman una firma.

## Decisiones Que Un Agente Debe Defender

### Composición y contenido

- Elegir primero la estructura que sirve a la tarea: documento, tabla, lista, agenda, conversación, canvas o panel. No empezar con un grid de tres cards.
- Toda card tiene trabajo, entrada y salida. Si no los tiene, usar agrupación, división o espacio negativo.
- El copy usa objetos y verbos docentes reales. Nada de nombres vacíos como “Workspace”, “Insights” o “Explore”.

### Color, tipografía y forma

- El color distribuye atención y estado; la señal de acción no rellena toda la interfaz. Neutros, texto y bordes sostienen lectura antes que marca.
- La tipografía declara orientación, título, contenido, etiqueta y dato. No se simula jerarquía con tamaños aleatorios o cinco pesos sin motivo.
- Los controles usan verbo, contraste y área táctil. Un icono necesita etiqueta visible o nombre accesible inequívoco; no es una decoración circular por defecto.
- Radio, borde y sombra expresan relación espacial. Pills se reservan para etiquetas compactas o estados, no para toda acción y contenedor.

### Estados y confianza

- Loading, empty, error y offline se diseñan desde el inicio. Error explica recuperación; empty enseña una acción; offline no culpa al docente.
- La IA propone de forma silenciosa y revisable. Nunca toma el control del layout ni oculta qué se aplicará.
- Pressed, foco y confirmación explican cambio de estado, no solo animan por adornar.

## Patrones Que Deben Refutarse

| Patrón por inercia | Pregunta de refutación | Sustitución habitual |
| --- | --- | --- |
| Gradiente, halo o brillo | ¿Comunica capa, error o prioridad real? | Superficie sólida, borde o jerarquía tipográfica |
| Glass o blur como fondo | ¿Es overlay de baja frecuencia y hay fallback sólido medido? | Superficie opaca o modal con borde y contraste |
| Bento de tarjetas | ¿Cada bloque sirve una prioridad docente mejor que lista o agenda? | Línea de jornada, lista priorizada, tabla o panel único |
| Pills en todo | ¿Es etiqueta breve y no acción o contenedor? | Botón compacto, texto enlazado o borde moderado |
| Iconos sin texto | ¿Una persona nueva puede nombrar la acción sin adivinar? | Verbo visible, label accesible o quitar control |
| Avatares, métricas o copy de relleno | ¿Representan contenido real o enseñan siguiente paso? | Datos anonimizados reales, empty accionable o espacio negativo |

## Excepción Para Efectos Visuales

Un efecto expresivo no se presume. Su nota responde: propósito de capa/transición, zona que lo admite, contraste, fallback sólido, reducir movimiento, presupuesto de rendimiento y rollback. Si falta una respuesta, el efecto es deuda de diseño, no mejora opcional.

Blur no se usa en listas largas ni superficies extensas de trabajo. Una animación frecuente no sustituye feedback de estado.

## Evidencia Y Aprobación

Un screenshot bonito no es validación completa. Antes de pedir aprobación de un frame se reúne, según la superficie:

- Preflight completo y link al frame/ground truth.
- Estados negativos representados o un N/A explicado.
- Contraste y foco/teclado previstos; 44 pt en controles táctiles.
- Screenshot por breakpoint y, al implementar, QA Playwright/Nielsen según el plan.
- Excepción visual y fallback si aplica.
- Estado explícito `draft`, `candidato a aprobación`, `aprobado` u `obsoleto`.

La aprobación Figma (#46) y las entrevistas docentes (#47) son gates humanos: documentación, Figma MCP o tests no los cierran por sí solos.

## Registro Provisional: Prototipo Figma Ola 2

| Superficie | Estado | Preflight resumido | Evidencia |
| --- | --- | --- | --- |
| Foundations v2 | Draft con dirección aprobada; no cierra #46 | Sistema editorial-operativo: tinta/mineral/señal, IBM Plex Sans, bordes y ritmo; refuta azul SaaS, radios amplios y cards por defecto. | [Figma `18:4`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=18-4) |
| Button v2 | Draft validado estructuralmente | Acción verbal, 44/48 px, estados visibles y forma compacta; no usa pill, halo ni sombra blanda. | [Figma `21:33`](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=21-33) |
| Foundations/Button v1 | Rechazado, conservado | Dirección SaaS genérica; se conserva para trazabilidad y rollback visual. | Archivo Figma `Archive` |

Los próximos frames añaden su propio preflight antes de ser candidatos a aprobación.

## Si Falta Una Herramienta

- Sin Figma o MCP: usar guía y contexto versionado; describir el frame en `design.md` y solicitar revisión humana. No afirmar que existe ni fue inspeccionado.
- Sin skill: `AGENTS.md` dirige a esta guía. La obligación no desaparece.
- Sin ground truth: registrar ausencia, diseñar un draft reversible y no declarar paridad alta.
- Sin rendimiento medible: usar superficies sólidas y motion estático/reducido; dejar la excepción pendiente de validación antes de implementación.

## Investigación Consultada

El término “AI slop” no es una norma profesional. Esta política lo traduce a condiciones comprobables y usa las siguientes fuentes como apoyo, con distinta autoridad:

- **Normativa:** [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) fundamenta contraste, foco, tamaño de objetivo y alternativas para interacción accesible.
- **Contexto docente:** [estudio de carga de trabajo docente y herramientas digitales (ERIC, PDF)](https://files.eric.ed.gov/fulltext/EJ1497420.pdf) respalda priorizar continuidad, reducción de fragmentación y claridad sobre ornamento.
- **Horizon scan no normativo:** [Built In: AI makes bad design look good enough](https://builtin.com/articles/ai-design-slop-era) y [Forgehouse: avoid AI slop](https://forgehouse.ai/guides/avoid-ai-slop-design/) describen la uniformidad visual, referencias explícitas y decisiones de composición que esta guía convierte en preflight. No sustituyen pruebas con docentes ni WCAG.

## Rollback

Revertir el PR que introdujo esta guía y ejecutar `npm run agent:harness:sync` restaura los espejos. Las decisiones Figma se conservan como nodos draft/rechazados hasta que evidencia humana indique otra cosa.
