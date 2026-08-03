## Why

**Issue:** [#156](https://github.com/RitualBoat/PlanearIA/issues/156).

El prototipo Figma ya tiene una sola entrada, pero los enlaces todavía obedecen a subflujos accidentales: al abrir una experiencia se pierde el retorno a Escritorio, las acciones rápidas heredan el historial de Office y la navegación cambia de nombre o desaparece. Esto impide usarlo como estímulo confiable en entrevistas docentes y puede hacer que una persona interprete mal la arquitectura de PlanearIA.

## What Changes

- Definir un contrato único de navegación para el prototipo: Escritorio Docente es la única entrada y cada experiencia tiene entrada, estado de trabajo, resultado y salida semántica.
- Reemplazar retornos dependientes del historial de Figma por acciones visibles que regresan al origen o al módulo correcto.
- Normalizar el inventario y los nombres de la navegación global en escritorio, tablet y móvil, manteniendo el módulo activo como estado visual, no como una variante de la arquitectura.
- Inventariar y corregir hotspots, overlays y resultados para impedir destinos genéricos, callejones sin salida y falsos éxitos de integración.
- Añadir una matriz versionada de rutas y evidencia de los golden journeys para sostener la curaduría Figma y la futura implementación.

## Capabilities

### New Capabilities

- `figma-prototype-navigation`: contrato de flujo único, navegación global estable, retornos semánticos y evidencia de recorridos en el prototipo Figma.

### Modified Capabilities

- Ninguna. No existe una spec vigente que gobierne el comportamiento del prototipo Figma como contrato independiente.

## Impact

- Archivo Figma `VBK5tK7EQS83tdTmtuBpI9`, página `09 Prototype · Office files` y sus conexiones de prototipo.
- Documentación UX/UI y contexto de validación del hito #86; no se modifica código React Native, rutas de producción, datos, backend ni integraciones externas.
- Evidencia manual de Figma y capturas por breakpoint; los gates humanos #46 y #47 se preservan como posteriores.
