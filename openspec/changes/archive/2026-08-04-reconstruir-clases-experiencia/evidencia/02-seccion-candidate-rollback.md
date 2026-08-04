# Sección candidate y rollback

Fecha: 2026-08-03  
Archivo Figma: `VBK5tK7EQS83tdTmtuBpI9`  
Issue activo: `#159`

## Resultado

- Se creó la sección aislada `Clases · v0.1 · candidate · #159`, nodo `177:115`.
- Se creó dentro el manifiesto `00 · Contrato candidate / rollback`, nodo `179:115`.
- El manifiesto declara el estado `candidate`, las cinco superficies y que no existe aprobación visual todavía.
- Los frames históricos `38:2`, `90:48`, `125:65`, `127:166` y `158:150` permanecen intactos: no fueron borrados, movidos ni renombrados como aprobados.
- La sección guarda metadata compartida con `state=candidate`, `issue=159` y el rollback concreto.

## Punto de rollback

El runtime de Plugin API disponible no soportó `figma.saveVersionHistoryAsync`; la llamada falló de forma atómica y no produjo escrituras parciales. Como fallback reversible, todo el trabajo nuevo queda contenido exclusivamente en la sección `177:115`. El rollback consiste en eliminar solo esa sección; el historial automático de Figma conserva además las revisiones del archivo.

## Verificación visual

Se inspeccionó el manifiesto mediante screenshot tras escribirlo. IBM Plex Sans cargó correctamente, el contenido quedó legible y no se detectaron recortes ni solapamientos.
