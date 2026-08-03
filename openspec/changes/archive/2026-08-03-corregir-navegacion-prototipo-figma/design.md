## Context

El archivo Figma de Ola 2 ya es la fuente de verdad visual de una suite docente conectada. Al reducir los puntos de inicio a Escritorio Docente quedó expuesto un defecto de composición: varias pantallas fueron creadas como prototipos locales y reutilizan navegación, etiquetas o destinos de otra experiencia. El resultado depende del historial del visor de Figma en lugar de expresar la arquitectura del producto.

Este change afecta únicamente el bounded context **Experiencia y Preferencias** en su representación Figma. No crea datos, entidades, contratos entre contextos, `userId`, llamadas a `src/sync` ni comunicación externa; por ello no requiere contrato cruzado ni cambios de runtime.

## Goals / Non-Goals

**Goals:**

- Mantener un solo inicio desde Escritorio Docente y una red dirigida de destinos alcanzables desde él.
- Separar navegación global, navegación contextual, creación, overlays y estados de resultado.
- Hacer visible la salida semántica de cada superficie y preservar nombres de módulos en todos los breakpoints.
- Dejar evidencia reproducible de enlaces y golden journeys antes de las entrevistas IHC.

**Non-Goals:**

- No implementar navegación React Native ni cambiar `routeManifest.ts`.
- No activar mensajería, IA, sincronización, envío, autenticación o persistencia real.
- No borrar exploraciones históricas ni cerrar los gates humanos #46 y #47.

## Decisions

### 1. Un grafo de suite, no subflujos por pantalla

El único flow starting point será Escritorio Docente. Todos los frames activos se conectarán desde ese grafo. Una pantalla histórica puede conservarse en el lienzo, pero no tendrá punto de inicio ni será una salida del recorrido. Alternativa descartada: mantener un flow por módulo. Hace más fácil editar de forma aislada, pero reproduce exactamente el retorno inconsistente reportado.

### 2. Inventario global canónico separado del estado activo

La navegación usa siempre estos nombres y destinos: Escritorio Docente, Office Docente, Clases, Asistente de IA, Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta. El estado activo cambia únicamente el resaltado y las propiedades visuales; nunca sustituye, oculta o renombra un módulo. En móvil, el quinto acceso es **Más**, que expone las experiencias secundarias con los mismos nombres; tablet usa rail y escritorio sidebar.

### 3. Retornos semánticos antes que historial implícito

Cada destino de creación, revisión o resultado tendrá un control visible de salida. La etiqueta declara el contexto: por ejemplo, `Volver a Escritorio`, `Volver a Office Docente` o `Volver a Clases`. El visor Back de Figma puede conservar historial, pero no será la única forma de salir ni decidirá el destino esperado. Alternativa descartada: un único botón ambiguo `Atrás`; no comunica dónde se vuelve y falla después de cruces entre módulos.

### 4. Contrato de acciones por tipo

Cada hotspot se clasifica como global, contextual, crear, overlay o resultado. Los globales navegan a una experiencia; los contextuales al objeto de origen; crear abre un selector o borrador correcto; overlays se cierran al origen; resultados ofrecen siguiente paso y salida. Ninguno puede apuntar a una experiencia genérica solo porque comparta layout.

### 5. Evidencia de navegación como artefacto versionado

Se crea una matriz de rutas y golden journeys con origen, control, destino, retorno y breakpoint. Se captura la verificación manual en Figma y screenshots. Alternativa descartada: confiar en flechas azules del lienzo; no revela labels perdidos, retornos ni falsos éxitos.

## Risks / Trade-offs

- [Un hotspot no visible puede conservar un destino antiguo] → inventario de todos los nodos con reacciones y verificación de destinos alcanzables.
- [El rediseño de shell duplica chrome por breakpoint] → un descriptor canónico de módulos y revisión de nombres en las tres variantes.
- [Un resultado de prototipo parece integración real] → copy explícito `prototipo` y estados que muestran confirmación sin afirmar envío, IA o sync reales.
- [La curaduría Figma rompe una exploración histórica] → no borrar frames; conservar historial separado y documentar rollback por historial de versiones de Figma.

## Migration Plan

1. Capturar baseline de puntos de inicio, frames y reacciones activas.
2. Diseñar y registrar la matriz canónica de módulos, acciones, destinos y retornos.
3. Corregir Figma por superficie, primero Escritorio y Office, después módulos y overlays, luego tablet/móvil.
4. Reproducir los golden journeys desde el único inicio, incluyendo vuelta explícita y el control Back del visor cuando aplique.
5. Registrar evidencia, ejecutar revisión adversarial y conservar los frames previos como rollback en el historial de Figma.

## Open Questions

- Ninguna bloqueante. La confirmación de la arquitectura, nomenclatura y cobertura responsive fue dada por el responsable de producto el 2026-08-02.
