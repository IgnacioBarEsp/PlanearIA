# Baseline y auditoría del grafo Figma

> **Change:** `corregir-navegacion-prototipo-figma`.
> **Fecha de auditoría:** 2026-08-02.
> **Fuente:** archivo Figma `VBK5tK7EQS83tdTmtuBpI9`, página `09 Prototype · Office files`.
> **Alcance:** navegación de prototipo; no runtime ni integraciones reales.

## Baseline clasificado

El recorrido empezaba correctamente en Escritorio Docente, pero coexistían enlaces de subflujos: Office
no exponía siempre un retorno semántico a Escritorio, algunas acciones rápidas heredaban Office como
destino de vuelta y los nombres de experiencias variaban por frame. El riesgo era usar el historial del
visor Present como control de navegación y confundir la arquitectura ante docentes.

## Resultado automatizado

La auditoría mediante API Figma registró lo siguiente después de aplicar las correcciones:

| Comprobación | Resultado | Evidencia |
| --- | --- | --- |
| Punto de inicio activo | PASS | Exactamente uno: `87:47`, Escritorio Docente. |
| Destinos de reacciones | PASS | Cero destinos ausentes o eliminados. |
| Navegación escritorio | PASS | 17 frames auditados; cada uno tiene nueve labels, ocho rutas y un activo sin reacción. Hotspots: 228 x 44 pt. |
| Navegación tablet | PASS | Frame `162:115`; nueve labels, ocho rutas, activo Escritorio. Hotspots: 176 x 44 pt. |
| Navegación móvil | PASS | Diez hubs auditados; cinco controles inferiores por hub, uno activo y cuatro rutas. Hotspots: mínimo 78 x 72 pt. |
| Módulos bajo Más | PASS | Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta; cinco filas con un único destino y 294 x 44 pt. |
| Nombres heredados activos | PASS | Ninguno de `AsistePLAN`, `DiseñaPLAN`, `ConectaPLAN`, `AgendaPLAN` o `ReportaPLAN` persiste como label activo. |
| Overlays y confirmaciones | PASS | Las acciones de diálogo usan overlay y sus cierres revelan la superficie de origen. |
| Integraciones fingidas | PASS | Asistente declara proveedor no configurado y Mensajería confirma que no se realizó envío real. |

## Muestra visual revisada

- [Escritorio Docente](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=87-47): inicio único, rail estable y creación contextual.
- [Escritorio tablet](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=162-115): rail compacto de nueve experiencias.
- [Escritorio móvil](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=164-115): barra inferior y retorno explícito.
- [Más móvil](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=158-200): acceso semántico a módulos secundarios.

Las PNG de inspección están en `capturas-figma/`. Se revisaron contra el archivo editable: no hay texto
cortado ni superposición en las cuatro superficies de muestra; se usan IBM Plex Sans y los tokens ya
existentes de canvas, superficie, tinta, borde y selección. No se introdujeron gradientes, glass ni
integraciones aparentes.

## Estados de navegación

El prototipo no modela consultas dinámicas; por eso carga y ausencia dinámica son `N/A` en este change,
no un PASS ficticio. La recuperación de capacidades no disponibles sí es visible: el Asistente conserva
el trabajo manual sin proveedor y Mensajería preserva un borrador sin decir que lo envió. El siguiente
paso de cada superficie es visible y el retorno no depende del control Back del visor.

## Pendiente manual de cierre

La reproducción en modo Present de `GJ-FIG-01` a `GJ-FIG-09` permanece pendiente. El API valida el
grafo, pero no puede sustituir a una persona que haga clic en el visor. El resultado debe registrarse en
`02-recorridos-manuales.md` antes del gate pre-archive.
