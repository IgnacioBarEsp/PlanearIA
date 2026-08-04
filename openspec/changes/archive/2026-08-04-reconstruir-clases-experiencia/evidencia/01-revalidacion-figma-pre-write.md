# Revalidación Figma previa a escritura

> Fecha: 2026-08-03.
> Archivo: `VBK5tK7EQS83tdTmtuBpI9`.
> Método: Figma Plugin API y screenshots, solo lectura.

## Frames revalidados

| Frame | Resultado |
| --- | --- |
| `38:2` Concept · Clases | Existe, sigue `draft`, sin interacciones. |
| `90:48` Clases · grupos · escritorio | Existe, sigue `draft`; conserva navegación global y drift de grupos/archivos. |
| `125:65` Clases · Ciencias 2B · escritorio | Existe, sigue `draft`; home/detalle repetidos y solapamiento/truncamiento visible en la composición. |
| `127:166` Clases · nueva actividad | Existe, sigue `draft`; aún exige “elegir borrador” y navega al documento `62:3`. |
| `158:150` Clases · grupos · móvil | Existe, sigue `draft`; solo representa una prioridad y abre el detalle desktop. |

No se observó drift que invalide el plan 1.1 o el baseline 0.1. Los frames viven en la página
`60:2` (`09 Prototype · Office files`) y permanecieron sin mutación durante esta tarea.

## Sistema visual reutilizable

- Variables locales: `PlanearIA / Primitives`, `Color`, `Layout` y `Typography`.
- Tipografía local: IBM Plex Sans con estilos Display, Title, Body y Label.
- Component set Button `21:33`: tamaños Compacto/Estándar, Primario/Secundario y estados
  Default/Pressed/Disabled; objetivo mínimo 44 pt.
- Component set Navigation item `29:25`: Default/Actual/Foco.
- Component set Ribbon command `57:81`: Default/Actual/Foco.
- No se encontraron componentes locales dentro de la página del prototipo; las nuevas piezas específicas
  de Clases deben quedar en una sección candidate y reutilizar estos fundamentos.

## Decisión

El apply continúa. Se conservarán todos los frames históricos y se creará una sección candidate separada.
La composición nueva usa los tokens/estilos existentes, no copia Google Classroom y no modifica runtime.
