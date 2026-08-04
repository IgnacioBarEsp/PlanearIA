# Preflight visual de Clases `#157-O1`

> **Versión:** 0.1.
> **Fecha:** 2026-08-03.
> **Deriva de:** plan #157 v1.1 y baseline de Clases 0.1, ambos aprobados.
> **Estado:** contrato previo al diseño completo; no es una composición Figma ni aprobación visual.

## 1. Tarea docente y criterio de éxito

El docente entra a Clases para reconocer sus grupos, decidir qué requiere atención, comunicar novedades,
crear trabajo escolar breve y revisar evidencia. El éxito perceptual exige reconocer el modelo Classroom
sin explicación y descubrir después la continuidad propia de PlanearIA con Office, Diseño, Asistente,
Agenda y Reportes.

La zona de trabajo será sobria y de intensidad media-alta: información escaneable, acciones explícitas y
densidad adaptada. No se usa una landing promocional, feed global, bento de funciones ni dashboard de
KPIs como sustituto de la tarea.

## 2. Jerarquía transversal

1. identidad y contexto de Clases o de la clase seleccionada;
2. acción o señal principal correspondiente a la tarea actual;
3. objeto real: clase, anuncio, actividad, persona, entrega o alumno;
4. estado de dominio y de sync, siempre distinguibles;
5. acciones secundarias y handoffs a herramientas especializadas;
6. ayuda contextual, nunca como contenido dominante.

La firma útil de Clases es la continuidad entre señal, objeto y resolución: una prioridad abre el filtro de
Seguimiento que la sustenta; un recurso creado fuera vuelve al borrador de actividad sin asociarse hasta
que el docente confirme.

## 3. Preflight por superficie

| Superficie | Tarea y zona | Estructura mínima | Patrón genérico refutado | Evidencia siguiente |
| --- | --- | --- | --- | --- |
| Entrada a Clases | Decidir qué atender entre clases; intensidad media | “Lo que sigue”, clases activas, Crear/Importar clase y estados honestos | Dashboard de métricas, hero, carrusel o catálogo de herramientas | Frames desktop/tablet/móvil y prueba de reconocimiento |
| Tablón | Leer/publicar comunicación de una clase; intensidad media | Contexto de clase, anuncios, autor/fecha/estado y acción de publicar | Feed social, analítica o duplicado de Trabajo de clase | Recorrido publicar/programar/offline y revisión Nielsen |
| Trabajo de clase | Crear, ordenar y abrir trabajo; intensidad alta | Unidad/tema, actividades/materiales/preguntas, estados y creación breve | Área de archivos, Office incrustado o modal que exige adjunto | Recorridos actividad sin archivo y handoff opcional con retorno |
| Personas | Comprender roster, roles y estado; intensidad media | Docentes, alumnos, incorporación y estados de privacidad/sync | Directorio global, perfil social o Cuenta | Revisión de orden semántico, acciones y datos anonimizados |
| Seguimiento | Resolver revisión, vencimientos, asistencia y calificación; intensidad alta | Filtros trazables, evidencia por tarea/alumno, estado de entrega y acción de devolución | KPI decorativo, riesgo opaco o pestaña Grades separada | Datos representativos anonimizados, recorridos revisar/devolver y “datos insuficientes” |

## 4. Tokens, forma y efectos

- Color, tipografía, espaciado, radios, elevación y motion salen exclusivamente de `src/themes` y de la
  biblioteca base vigente; no se inventa una paleta Classroom.
- La jerarquía depende primero de estructura, tamaño, peso, espacio y orden; el color no es el único
  indicador de riesgo, estado o selección.
- Cards, chips y pills solo aparecen cuando expresan agrupación, estado o acción reales. No se apilan
  contenedores por decoración.
- No se prescriben glass, blur, gradientes, halos ni sombras nuevas. Cualquier efecto futuro requiere
  propósito, contraste, fallback sólido, reducción de movimiento, presupuesto Android y rollback.
- La microinteracción significativa será transición de estado/retorno o feedback de guardado/sync; no
  movimiento ornamental. Se definirá con tokens y `react-native-reanimated` durante el design técnico.

## 5. Estados negativos y confianza

Cada superficie candidata representa loading, vacío, error recuperable y offline. Las escrituras
distinguen guardado local, pendiente de sincronización, conflicto y confirmación remota. “Publicada”,
“asignada” o “devuelta” nunca se muestra solo porque el prototipo avanzó de frame.

Promedio/riesgo exige datos suficientes, fuente explicable y salida accionable. La IA no es requisito y,
si aparece, entrega propuesta revisable sin sobrescribir ni ejecutar acciones importantes.

## 6. Accesibilidad y adaptación

- Misma arquitectura y etiquetas en móvil `<768`, tablet `768–1279` y web `>=1280`.
- Orden de foco y lectura sigue contexto → área → objeto → estado → acción.
- Controles con nombre accesible, estado anunciado y área mínima de 44 pt.
- Contraste por tokens, zoom/tamaño de fuente sin truncar acciones críticas y color nunca como única señal.
- Reduce motion preserva comprensión y feedback; el foco vuelve al disparador al cerrar overlays.
- Lista + detalle en anchos amplios solo cuando conserva objeto, retorno y navegación por teclado.

## 7. Gate antes de declarar diseño listo

El change debe producir frames candidatos conectados para las cinco superficies, recorridos desktop,
tablet y móvil, estados negativos y handoffs. Después se requiere Present manual, comparación proporcional
con el baseline, checklist Nielsen sin severidad 3–4 y aprobación visual explícita. Figma API, capturas,
Playwright y tests son evidencia; ninguno aprueba el diseño por sí solo.
