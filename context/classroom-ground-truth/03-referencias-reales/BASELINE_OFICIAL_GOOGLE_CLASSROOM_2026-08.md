# Baseline oficial de Google Classroom para Clases

> **Versión:** 0.1, aprobada por el owner el 2026-08-03.
> **Fecha de consulta:** 2026-08-03.
> **Alcance:** modelo mental, arquitectura de información, tareas docentes y estados.
> **Fuentes:** documentación oficial pública de Google for Education y Classroom Help.
> **No autoriza por sí solo:** crear pantallas, modificar Figma, copiar el producto de Google ni declarar paridad visual.

## 1. Propósito

Este baseline reemplaza temporalmente el respaldo histórico externalizado con evidencia oficial vigente.
Busca que Clases sea reconocible para quien conoce Classroom sin convertir PlanearIA en un clon. Separa:

- **Evidencia:** comportamiento o estructura descrita por Google.
- **Inferencia:** patrón transferible a una suite docente offline-first.
- **Decisión PlanearIA:** adaptación aprobada o recomendada para `#157-O1`.

La evidencia oficial orienta reconocimiento y orden de tareas. No define paleta, componentes, copy final,
modelo de datos, implementación ni composición visual de PlanearIA.

## 2. Fuentes oficiales

| ID | Fuente oficial | Evidencia útil | Vigencia/límite |
| --- | --- | --- | --- |
| GCR-01 | [Página de producto de Google Classroom](https://edu.google.com/workspace-for-education/products/classroom/) | El producto organiza creación, gestión y medición del aprendizaje dentro de Workspace for Education. | Mensaje de producto; no sustituye los flujos detallados. |
| GCR-02 | [Navegar Classroom con lector de pantalla](https://support.google.com/edu/classroom/answer/9849192?hl=en) | Portada modular; lista de clases; áreas Stream, Classwork, People y Grades; tareas docentes y orden accesible. | Fuente estructural principal; algunos módulos dependen de licencia/configuración. |
| GCR-03 | [Navegar la portada de Classroom](https://support.google.com/edu/classroom/answer/17231999?hl=en) | Trabajo reciente por revisar, señales de progreso y tarjetas de clases activas; módulos vacíos se ocultan. | La portada actual puede variar por cuenta, edición o rollout. |
| GCR-04 | [Crear una clase](https://support.google.com/edu/classroom/answer/6020273?co=GENIE.Platform%3DDesktop&hl=en) | Entrada desde la lista de clases y datos académicos básicos de la clase. | No obliga a copiar el formulario ni su terminología administrativa. |
| GCR-05 | [Crear una actividad](https://support.google.com/edu/classroom/answer/6020265?co=GENIE.Platform%3DDesktop&hl=en) | Título requerido; instrucciones, destinatarios, puntos, fecha, tema, rúbrica y adjuntos opcionales; publicar, programar o guardar borrador. | Integraciones Drive/Workspace son específicas de Google. |
| GCR-06 | [Añadir materiales](https://support.google.com/edu/classroom/answer/9123621?co=GENIE.Platform%3DDesktop&hl=en) | Material breve con descripción, tema, destinatarios, adjuntos y ciclo borrador/programado/publicado. | Un material no debe convertirse en editor profundo dentro de Clases. |
| GCR-07 | [Organizar por temas](https://support.google.com/edu/classroom/answer/9093681?co=GENIE.Platform%3DDesktop&hl=en) | Los temas agrupan, ordenan y filtran trabajo de clase por unidad, semana u objetivo. | PlanearIA debe validar su correspondencia con Unidad/Tema de dominio. |
| GCR-08 | [Crear preguntas](https://support.google.com/edu/classroom/answer/6020293?co=GENIE.Platform%3DDesktop&hl=en) | Pregunta corta o de opción múltiple con destinatarios, fecha, tema, puntos y adjuntos opcionales. | No prueba todavía que todos los tipos deban entrar en el primer slice. |
| GCR-09 | [Publicar anuncios](https://support.google.com/edu/classroom/answer/6020270?co=GENIE.Platform%3DDesktop&hl=en) | Comunicación de clase separada de la actividad calificable; publicación inmediata, programada o borrador. | Tablón no se convierte por ello en feed social ni en inicio global. |
| GCR-10 | [Calificar y devolver una actividad](https://support.google.com/edu/classroom/answer/6020294?co=GENIE.Platform%3DDesktop&hl=en) | Estados de trabajo, revisión, retroalimentación, calificación y devolución al alumno. | El detalle de entrega debe validarse contra el dominio real de PlanearIA. |
| GCR-11 | [Ver o actualizar el libro de calificaciones](https://support.google.com/edu/classroom/answer/9199710?hl=en) | Vista conjunta de tareas, entregas y calificaciones; actualización desde el mismo contexto. | PlanearIA lo integra en Seguimiento; no crea una pestaña Grades separada. |
| GCR-12 | [Analítica para docentes](https://support.google.com/edu/classroom/answer/14221316?hl=en) | Señales como promedio, entregas y alumnado que puede necesitar apoyo. | Funcionalidad de ediciones específicas; solo inspira señales respaldadas por datos reales. |

## 3. Matriz evidencia → adaptación

| Evidencia oficial | Inferencia transferible | Decisión para PlanearIA | Diferencia deliberada |
| --- | --- | --- | --- |
| La portada agrupa clases activas y trabajo reciente. | El docente necesita orientarse entre clases antes de entrar a una. | Inicio de Clases tipo **clases primero**, con “Lo que sigue”, clases reconocibles y CTA Crear/Importar clase. | No incluye spotlight comercial, upsells ni tarjetas de funciones. |
| Classroom expone Stream, Classwork, People y Grades. | Cuatro áreas estables reducen memoria y preservan el modelo mental. | **Tablón, Trabajo de clase, Personas y Seguimiento**. | Grades se integra en Seguimiento por decisión del owner; la etiqueta visible no alterna con Calificaciones. |
| Stream aloja anuncios y puede reflejar actividad. | La comunicación de la clase necesita una superficie propia. | Tablón prioriza anuncios y novedades verificables de esa clase. | No es feed social, dashboard ni duplicado completo de Trabajo de clase. |
| Classwork concentra actividades, preguntas, materiales y temas. | La creación académica breve pertenece al contexto de la clase. | Trabajo de clase crea actividad, pregunta o material corto y organiza por tema/unidad. | La creación profunda de documento, hoja, presentación o diseño sale a su herramienta y retorna. |
| Los adjuntos de una actividad son opcionales. | Una actividad puede existir por sí sola. | Título y contrato académico bastan; adjuntar o crear un recurso es secundario y opcional. | Nunca se obliga a crear/adjuntar archivo para guardar, programar o asignar. |
| Las publicaciones admiten borrador, programación y publicación. | El docente necesita control temporal y reversibilidad. | Estados explícitos: borrador, programada, publicada/asignada y, cuando aplique, devuelta. | Offline/sync se muestran por separado; “publicada” no finge entrega remota. |
| People distingue docentes y alumnos y permite invitación. | La membresía de una clase requiere jerarquía y acciones claras. | Personas muestra roster, rol, estado e incorporación compatible con privacidad. | No se copian emails, guardianes o flujos administrativos sin alcance y evidencia propios. |
| Grades conecta tareas, entregas, revisión y devolución. | El seguimiento debe partir de evidencia accionable, no de KPI decorativo. | Seguimiento contiene tareas por revisar, entregas vencidas, promedio/riesgo y detalle trazable. | Color nunca es el único indicador; riesgo requiere criterio explicado y datos suficientes. |
| La portada actual muestra trabajo reciente y señales de progreso. | Algunas señales cruzan clases y ayudan a decidir qué atender. | Entrada a Clases muestra conteos/resumen compacto; el detalle vive en Seguimiento. | No se abre Tablón con métricas ni se replican analíticas de pago. |
| Las guías oficiales describen regiones, encabezados, tabs y tareas con lector de pantalla. | La arquitectura debe ser navegable semánticamente, no solo visualmente. | Regiones, foco, nombres accesibles, orden lógico, estados anunciados y controles táctiles mínimos de 44 pt. | PlanearIA aplica además contraste, reducción de movimiento y preferencias propias. |

## 4. Arquitectura de reconocimiento aprobada

```text
Clases
├── Lo que sigue
│   ├── Tareas por revisar
│   ├── Entregas vencidas
│   └── Promedio / riesgo con evidencia
├── Mis clases
│   ├── Crear clase
│   └── Importar clase
└── Clase seleccionada
    ├── Tablón
    ├── Trabajo de clase
    ├── Personas
    └── Seguimiento
```

La rama “Lo que sigue” es una síntesis cruzada y compacta. No sustituye las clases ni constituye un
dashboard analítico. Cada elemento abre la clase, tarea, entrega o alumno que lo sustenta.

## 5. Lo que no se importa de Google Classroom

- Marca, paleta, iconografía, ilustraciones, componentes, microcopy o disposición píxel a píxel.
- Dependencias obligatorias de Drive, Docs, Sheets, Slides, Forms, YouTube o cuentas Google.
- Spotlight de funciones, upsells, módulos condicionados a licencias o analítica no disponible.
- Modelo administrativo de organizaciones, tutores, dominios o dispositivos gestionados.
- Perspectiva completa de alumno/padre; `#157-O1` es una experiencia docente.
- Automatismos que oculten guardado, entrega, permisos, sincronización o acciones de IA.

## 6. Privacidad, licencia y honestidad

- Solo se enlaza documentación oficial pública; no se versionan capturas ni assets de Google.
- Toda evidencia futura con alumnos, escuelas, mensajes o calificaciones debe anonimizarse.
- “Promedio” y “riesgo” solo aparecen con fuentes de datos reales, explicación y estado de datos
  insuficientes. No se inventan números para llenar la interfaz.
- Publicar/asignar offline debe distinguir guardado local, pendiente de sincronización y confirmación
  remota. La apariencia no puede prometer una entrega que no ocurrió.

## 7. Gate cruzado y brecha visual restante

El owner aprobó explícitamente la versión 0.1 el 2026-08-03. Antes de esa aprobación se completaron el
inventario de frames/hotspots, la comparación con runtime y Anti-Slop, y la revisión humana de jerarquía y
fuentes oficiales. Por ello este documento es ground truth suficiente para iniciar diseño candidato.

La brecha restante es visual: construir una composición propia por breakpoint, compararla de forma
proporcional y someterla a Present y aprobación humana. GitNexus, Playwright, Figma API y tests aportan
evidencia, pero nunca sustituyen la aprobación del destino visual.
