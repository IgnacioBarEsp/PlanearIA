# Matriz de decisiones — Escritorio `#157-O2`

> **Versión:** 0.1 candidate.
> **Fecha:** 2026-08-04.
> **Autoridad:** #101 → #157 → #163.

| Decisión | Fuente y ruta | Estado | Impacto para Figma | Condición concreta para reabrirla |
| --- | --- | --- | --- | --- |
| Escritorio es la ruta inicial y combina launcher con jornada accionable. | `VISION_ACTUAL.md`; `PLAN_UXUI_NAVEGACION_GLOBAL.md` §1 y §3; `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` §8 y §10. | Confirmada | Los tres breakpoints deben conservar acceso a herramientas, prioridades y continuidad. | Sólo si el owner aprueba una nueva promesa de producto versionada que cambie la ruta inicial o la tarea principal. |
| Escritorio no es feed, landing, tablero ejecutivo, hero ni mosaico bento. | `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md`; `DISENO_ANTI_SLOP.md`; matriz de decisiones de #157. | Confirmada | La jerarquía se resuelve con objetos y acciones reales; no con KPIs o cards de relleno. | Sólo con evidencia IHC y decisión explícita que demuestre una tarea docente mejor resuelta por otro patrón. |
| Crear es tipo-primero: documento, hoja, presentación, diseño o preguntar a la IA. | `VISION_ACTUAL.md`; #157; `PLAN_VISION_CONTRATO_EXPERIENCIA_157.md` §8. | Confirmada | “Nuevo archivo” abre un selector contextual; la intención escolar aparece después como chip descartable. | Si cambia el modelo de creación transversal y se versiona su contrato, incluidos fallback y retornos. |
| Cada prioridad abre el objeto owner, no el home genérico de su módulo. | #157; `PLAN_UXUI_NAVEGACION_GLOBAL.md`; `MAPA_DDD_ESTRATEGICO_LIGERO.md`. | Confirmada | Tarea, asistencia, borrador, mensaje o evento deben conservar owner, contexto y retorno. | Si el owner del objeto cambia en DDD/specs y se define una migración compatible. |
| Office Docente agrupa NotasPLAN, CalcuPLAN y PresentaPLAN; Diseño de materiales es otra experiencia. | #157; `VISION_ACTUAL.md`; `MAPA_MODULOS_ACTUALES.md` sólo como inventario. | Confirmada | El dock puede nombrar herramientas, pero no fusiona PresentaPLAN con Diseño ni alterna labels globales. | Sólo con decisión explícita de nomenclatura y arquitectura de experiencias. |
| La IA puede sugerir una acción secundaria, pero el docente confirma y el flujo manual permanece. | `IA_CHATBOT_LLM.md`; `VISION_ACTUAL.md`; #157. | Confirmada | Sugerencia discreta, descartable y revisable; sin proveedor no bloquea la jornada. | Si cambia el contrato de autonomía IA con análisis de seguridad, privacidad y rollback aprobado. |
| Offline-first, sync visible y estados honestos son no negociables. | `FLUJO_SINCRONIZACION.md`; `openspec/specs/sync-status-ui/`; #157. | Confirmada | Offline, pendiente, conflicto y error no se confunden con éxito remoto; existe recuperación manual. | Sólo mediante change de plataforma aprobado que mantenga equivalencia o mejore garantías de datos. |
| Móvil conserva cinco hubs, tablet usa rail y web sidebar/panel IA. | #156/PR #158; `PLAN_UXUI_NAVEGACION_GLOBAL.md`; `MAPA_NAVEGACION_ACTUAL.md`. | Confirmada | Cambia densidad y disposición; no cambia la arquitectura ni se enlazan breakpoints cruzados. | Si un change separado sustituye el shell global con aprobación visual y de navegación. |
| La línea del día prioriza urgencia accionable, siguiente compromiso y continuidad. | Síntesis de #157 y plan v1.3. | Supuesto a validar | Orden inicial recomendado: requiere acción, ocurre pronto, continuar; máximo visual según breakpoint. | Reabrir si prueba de Present o entrevistas docentes muestran que el orden no permite anticipar la jornada. |
| En móvil debe existir un launcher compacto visible y más de una señal útil, no una única tarjeta. | Contrato confirmado + inferencia responsive documentada. | Supuesto a validar | El candidate probará geometría compacta sin ocultar labels ni sacrificar jornada/continuidad. | Reabrir la composición si 390×844 no mantiene comprensión, objetivos de 44 pt o prioridad sin scroll excesivo. |
| Los frames `198:695`, `198:776` y `198:809` aprueban Escritorio. | Nombre de nodos Figma frente a `MATRIZ_NAVEGACION.md` y #157. | Drift | No editar ni promover por inferencia; clonarlos como punto de partida en sección `candidate`. | Cerrar el drift sólo con comentario explícito del owner que apruebe los frames de Escritorio después de Present. |
| “Nuevo archivo” puede desembocar en Office Home `257:951`. | Hotspot Figma actual frente al contrato tipo-primero. | Drift | Reemplazar en candidate por selector tipo-primero y retorno semántico. | Cerrar cuando el recorrido candidato demuestre cinco tipos, cancelación y destino del mismo breakpoint. |
| Tablet y móvil pueden resumir Escritorio en una tarjeta. | Frames `198:776` y `198:809` frente al plan. | Drift | Reconstruir ambos breakpoints con las tres capas de información. | Cerrar al recorrer launcher, prioridad y continuidad en ambos tamaños sin salto a desktop. |

## Decisiones abiertas

No hay decisiones de visión abiertas que bloqueen `propose`. La cantidad exacta de señales visibles, el
orden fino y la geometría del launcher son decisiones de composición reversibles: se validan en el frame
candidate y no autorizan `apply` por sí mismas.
