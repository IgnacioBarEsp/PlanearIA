---
name: generative-assets
description: Decide si PlanearIA debe usar arte generado localmente con ComfyUI (ilustración de estados vacíos y onboarding, texturas, arte de splash e iconografía de marca, imágenes de producto y video de fondo para la landing, moodboards y referencias para dirección visual, ambiente sonoro), en qué superficie se permite y con qué presupuesto. Úsala cuando una pantalla o pieza de marketing pida un asset que no existe y no se puede resolver con tokens, tipografía e iconos; cuando el usuario pida un logo, un video de fondo, ilustraciones o música; o cuando haya que decidir entre generar, comprar o no poner nada. Es la capa de DECISIÓN para PlanearIA; la mecánica de ComfyUI vive en la skill personal `comfyui-assets`. No es para editar capturas ni para reemplazar el design system.
version: 1.0.0
---

# generative-assets — arte generado con criterio en PlanearIA

PlanearIA tiene ComfyUI local (ver skill `comfyui-assets` para operarlo). Eso
elimina el argumento de "no hay presupuesto para arte", pero **no** el de
"presupuesto cero de rendimiento en Android gama media". Esta skill existe para
que la segunda restricción siga ganando.

Trabaja con las otras capas, no en lugar de ellas:

- `comfyui-assets` (personal) → cómo generar, optimizar e integrar.
- `awwwards` → en qué zona de intensidad estás y si el resultado aprueba.
- `impeccable` → vocabulario de diseño por elemento.
- `DISENO_ANTI_SLOP.md` + `PLAN_UXUI_NAVEGACION_GLOBAL.md` §1.9 → vinculantes.
  Un asset generado **no** exime del preflight anti-slop: lo hace más necesario,
  porque es exactamente donde se cuela el adorno sin trabajo.

## 0. Protocolo: ofrecer, no imponer

Cuando detectes que un asset generado mejoraría la superficie, ofrécelo en una
línea con costo y alternativa, y continúa con el resto de la tarea. No lo
generes por iniciativa propia dentro de una tarea que no lo pidió.

> El estado vacío de "Sin clases aún" está resuelto con un icono genérico. Puedo
> generar una ilustración propia coherente con la paleta (≈1 min, ~120 KB). ¿La
> hago o lo dejo con el icono?

Si el usuario ya pidió el asset o ya dijo "usa ComfyUI", genera sin volver a preguntar.

## 1. Qué se permite por zona

Las zonas son las de `awwwards` §1. El presupuesto es lo que cambia todo.

| Zona | Permitido | Prohibido |
| --- | --- | --- |
| **landing-web** (artefacto separado, DOM) | Todo: video de fondo, secuencias con scroll, producto, WebGL | Nada, salvo peso: ≤3 MB por pieza |
| **Onboarding, estados vacíos, transiciones** | Ilustración estática ≤150 KB, textura sutil, arte de un solo uso | Video. Lottie solo si ya está en el stack |
| **Escritorio (dock, tablero)** | Textura o fondo de baja frecuencia, arte de marca | Cualquier cosa que se anime en loop permanente |
| **Pantallas de trabajo** (NotasPLAN, CalcuPLAN, listas, calificación) | Nada decorativo | Ilustración, fondo, video, adorno de cualquier tipo |
| **Marca / store** (icono, splash, capturas de tienda) | Arte generado, iterado hasta que sirva | Texto generado dentro de la imagen |

Regla dura: **no hay video en la app RN.** Ni de fondo, ni en loop, ni "solo en
el hero del escritorio". El costo de decodificación continua en gama media se
paga en batería y en jank, y contradice el §1.9 de rendimiento. El video vive en
`landing-web`, que es DOM y donde ya se permite el tratamiento completo.

## 2. Reglas específicas de PlanearIA

- **Paleta.** El asset se genera para la paleta existente (`src/themes/colors.ts`),
  no al revés. Describe los colores en el prompt y verifica el resultado contra
  los tokens; si no coincide, regenera, no cambies los tokens.
- **Daltonismo.** `DaltonismoContext` existe por una razón: ninguna ilustración
  puede codificar significado solo con color. Si la imagen distingue estados,
  distínguelos también por forma o posición.
- **Tema claro y oscuro.** Todo asset visible en ambos temas se entrega en las
  dos variantes, o se genera sobre transparencia. Un PNG con fondo blanco
  quemado en tema oscuro es un defecto, no un detalle.
- **Tipografía.** Los modelos generan texto deforme. El nombre "PlanearIA" y
  cualquier palabra van en tipografía real sobre la imagen, nunca dentro de ella.
- **Familiaridad y calma.** El norte del producto es que se sienta como Office,
  Classroom, Canva y WhatsApp. Una ilustración exuberante en una pantalla de
  trabajo rompe la promesa aunque esté bien hecha.
- **Docentes reales.** Nada de retratos generados de personas presentados como
  usuarios o testimonios. Es la línea entre ilustrar y falsificar.

## 3. Dónde viven los archivos

```
assets/generated/<superficie>/     arte de la app (PNG/WebP, ≤150 KB)
assets/generated/ASSETS.md         receta de cada pieza: workflow, prompt, seed
landing-web/public/media/          video e imágenes de la landing (cuando exista)
context/<modulo>-ground-truth/     moodboards y referencias, NO se envían al build
```

Los moodboards y las referencias de dirección visual son material de trabajo:
van a `context/`, nunca a `assets/`, y no se commitean al bundle.

## 4. Flujo dentro de un change

1. Preflight anti-slop de la superficie (obligatorio, antes de generar nada).
2. Refuta el patrón genérico: ¿por qué un icono del set o un color plano no basta?
3. Ofrece el asset con costo y alternativa (§0).
4. Genera un borrador barato, revísalo contra tokens y estados; itera con seed fijo.
5. Optimiza al presupuesto de la zona antes de commitear.
6. Registra receta en `ASSETS.md` y declara en el PR que el asset es generado.
7. Estados negativos: la pantalla debe verse correcta **sin** el asset (fallo de
   carga, reduce-motion, tema contrario). Compruébalo, no lo asumas.

## 5. Cuándo NO generar

- La pieza es un icono de UI → usa `@expo/vector-icons`.
- La pieza comunica datos → es un gráfico, no una ilustración.
- Estás en una pantalla de trabajo → la respuesta es no.
- No puedes nombrar el trabajo que hace la imagen → todavía no sabes qué generar.
- El asset tendría que coincidir con un brand kit externo al pixel → no llegarás.
