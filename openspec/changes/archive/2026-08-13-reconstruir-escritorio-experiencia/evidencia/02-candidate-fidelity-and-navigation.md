# Candidate Figma — fidelidad, estados y navegación

Fecha: 2026-08-04
Archivo: `VBK5tK7EQS83tdTmtuBpI9`
Sección: `307:965` — `Escritorio 0.1 candidate · #163 · rollback-safe`

## Frames producidos

| Superficie | Frame candidato | Dimensión | Contenido verificado |
|---|---:|---:|---|
| Escritorio | `307:966` | 1440×960 | Rail global, launcher de seis herramientas, tres prioridades con owner/acción, continuidad de cuatro retornos, CTA Nuevo archivo, agenda y estado local/offline. |
| Tablet | `307:1046` | 768×1024 | Rail, CTA Nuevo archivo, prioridad, launcher 2×3, continuidad 2×2 y estado de trabajo conservado. |
| Móvil | `307:1078` | 390×844 | Cinco hubs, CTA Nuevo archivo compacto, launcher 3×2, prioridad, dos retornos de continuidad y estado local/offline. |
| Selector desktop | `310:3` | 1440×1360 | Documento, hoja, presentación, diseño de materiales y preguntar a la IA; opción en blanco y nota de revisión. |
| Selector tablet | `310:69` | 768×1120 | Selector tipo-primero vertical con quinta opción Diseño o IA y retorno a jornada. |
| Selector móvil | `310:106` | 390×930 | Selector tipo-primero vertical con quinta opción Diseño o IA y retorno a jornada. |

No se tocaron los puentes históricos de Clases (`198:695`, `198:776`, `198:809`) ni los drafts
fuente (`87:47`, `162:115`, `164:115`).

## Entry/return y owners

| Journey | Control candidato | Destino | Retorno esperado | Evidencia |
|---|---|---|---|---|
| E-01 iniciar/atender | `Acción · Nuevo archivo` / prioridades | Selector por breakpoint / Office, Clases, Agenda o Asistente según owner | Mismo breakpoint y contexto de jornada | Reacciones conservadas en clones; destinos históricos de prototipo no declaran guardado remoto. |
| E-02 crear tipo-primero | Cinco opciones del selector + `INTENCIÓN OPCIONAL · DESCARTAR` | Documento, hoja, presentación, Diseño o IA | Cancelar/back a la jornada de origen | `310:3`, `310:69`, `310:106`; IA se etiqueta como borrador revisable y el chip no bloquea. |
| E-03 continuar/volver | Chips de continuidad | Planeación/Contenido, Seguimiento, Diseño o Mensajería | Regreso conceptual a la jornada | `307:966`, `307:1046`, `307:1078`; cada chip conserva su owner. |
| E-04 offline/sync | Footer/estado local | Recuperación manual cuando haya conexión | No borra el trabajo local | Copy visible: `El trabajo de hoy queda disponible aun sin conexión` y equivalente móvil/tablet. |

## Matriz proporcional de estados

La matriz es contrato de la siguiente iteración de Present; el candidate actual muestra explícitamente
datos sintéticos y offline, pero Figma no simula persistencia ni sync remoto.

| Capa | Loading | Empty / docente nuevo | Error parcial | Offline / sync | Datos insuficientes | Recuperación |
|---|---|---|---|---|---|---|
| Launcher | Herramientas visibles con carga local | Mantener tipos y CTA `Nuevo archivo` | Ocultar sólo recurso afectado | Permitir abrir herramientas locales | No inventar contador | Reintentar o abrir manualmente |
| Atención | Línea reservada, sin score | `Aún no hay pendientes` + crear/importar | Señal conserva owner y explica fuente | `Pendiente de sincronizar`, nunca “enviado” | “Datos insuficientes para priorizar” | Abrir owner / reintentar |
| Continuidad | Chips en estado neutro | `Nada reciente todavía` | Chip afectado con error y salida | Mantener copia local y conflicto visible | No mostrar actividad falsa | Revisar copia, resolver conflicto |
| IA secundaria | No bloquea jornada | CTA manual `Preguntar a la IA` | Proveedor no configurado/error temporal | Fallback manual completo | No proponer sin contexto | Revisar, confirmar o descartar |

## Accesibilidad y Anti-Slop preflight

- Jerarquía resuelta por tipografía, espacio y listas; no se agregaron feed, hero, bento, glass, blur,
  gradientes ni KPI ornamentales.
- Controles críticos mantienen superficies amplias y labels visibles; el foco puede recuperarse por el
  mismo control/origen en Present.
- El candidato conserva señales textuales de estado; el color no es la única codificación.
- El producto no fija una fuente de marca en `src/themes/typography.ts`; se preservan las fuentes y
  estilos existentes del archivo Figma.
- La prueba de fuente ampliada, contraste exacto y reducción de movimiento requiere el recorrido humano
  en Present; no se declara aprobada por la captura estática.
