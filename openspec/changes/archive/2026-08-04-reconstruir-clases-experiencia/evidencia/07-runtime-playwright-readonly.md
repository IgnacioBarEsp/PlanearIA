# Comparación runtime read-only con Playwright

Fecha: 2026-08-03  
URL local: `http://127.0.0.1:8081`  
Ruta observada: `ClasesTab`

## Ejecución

1. Se levantó `expo start --web --port 8081` en modo CI.
2. Se obtuvo HTTP 200 antes de abrir el navegador.
3. Se navegó desde el shell actual a Clases.
4. Se capturaron tres breakpoints con Playwright.
5. Se guardó el log de consola y se detuvo el proceso; el puerto 8081 quedó libre.

No se modificó código, configuración, datos, backend ni navegación runtime.

## Capturas

| Breakpoint | Tamaño | Evidencia |
| --- | ---: | --- |
| Web `>=1280` | 1440 × 960 | `runtime-compare/runtime-clases-desktop-1440x960.png` |
| Tablet `768–1279` | 1024 × 768 | `runtime-compare/runtime-clases-tablet-1024x768.png` |
| Móvil `<768` | 390 × 844 | `runtime-compare/runtime-clases-mobile-390x844.png` |

Consola completa: `runtime-compare/runtime-clases-console.log`.

## Comportamiento real observado

- El shell responde en sidebar, rail y barra inferior de cinco hubs.
- Clases muestra `Tus clases`, Crear clase/Importar, KPIs `Cursos`, `Alumnos`, `Pendientes`, pestañas
  `Cursos`, `Calendario`, `Pendientes` y un vacío `Crea tu primera clase`.
- El estado `Guardado en este dispositivo` es visible.
- El móvil conserva la barra inferior, pero recorta el subtítulo del header (`Organiza cursos, unidades,
  materiales…`) y mantiene la arquitectura legacy anterior al candidato.
- No hubo datos remotos disponibles durante la sesión local.

## Drift

| Fuente | Drift | Impacto | Recomendación |
| --- | --- | --- | --- |
| Runtime actual (`ClasesTab`) vs visión #157/#159 | KPIs Cursos/Alumnos/Pendientes y pestañas Cursos/Calendario/Pendientes sustituyen Entrada + Tablón/Trabajo/Personas/Seguimiento. | Implementar por copia conservaría el dashboard y borraría la decisión “el grupo llega antes que el trámite”. | Tratar runtime solo como brownfield; el future change deberá migrar composición y rutas con compatibilidad. |
| Runtime móvil | Labels compactos `Inicio`, `Office`, `Asistente`, `Más`; subtítulo recortado. | Nomenclatura y fuente ampliada no alcanzan el contrato candidate. | Resolver en el handoff runtime sin reabrir #156: mapear labels canónicos y probar FontSizeContext. |
| Backend desplegado vs origen local | CORS permite `https://planearai.com`, no `http://127.0.0.1:8081`; fallaron `/api/grupos`, notificaciones y mensajes. | La sesión no valida datos reales ni sync; repetir errores elevó el conteo de consola. | Usar fixtures/local backend o política CORS autorizada en el future change; no alterar producción desde esta ola Figma. |
| Runtime empty state | Alterna `Crear clase`, `Crear grupo` y `Classroom`; no muestra “Lo que sigue”. | Mezcla nomenclatura y no permite comparar journeys con datos. | Fijar glosario y estados empty en el change runtime posterior. |

La comparación no prueba paridad, implementación ni aprobación del prototipo.
