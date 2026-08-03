# Recorridos manuales en modo Present

> **Estado:** aceptado por la persona responsable de producto el 2026-08-02 para el alcance de #156.
> **Cómo registrar:** marcar `PASS` o `FAIL`, anotar el paso que falló y adjuntar o enlazar una captura si hay fallo. Un fallo de visión o fidelidad por módulo se deriva al epic #157; un fallo de navegación de este change se corrige antes de archivar.

## Preparación única

1. Abre [Escritorio Docente](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=87-47) y pulsa **Present**.
2. Empieza el recorrido desde el frame mostrado; no elijas un flow de Office ni uses el botón Back del navegador como salida principal.
3. En cada paso, confirma que el nombre del módulo y la salida visible coinciden con la tabla.

## Registro

| ID | Breakpoint | Pasos | Resultado esperado | Estado / evidencia |
| --- | --- | --- | --- | --- |
| GJ-FIG-01 | Escritorio | Office Docente → Escritorio | Office abre su hub y el rail devuelve a Escritorio Docente. | PASS por aceptación de producto |
| GJ-FIG-02 | Escritorio | Nuevo archivo → Documento nuevo → Escritorio Docente | Se abre el selector de Escritorio; el editor vuelve a Escritorio, nunca a Office. | PASS por aceptación de producto |
| GJ-FIG-03 | Escritorio | Clases → Abrir clase → Crear actividad → Cancelar | El diálogo pertenece a Clases y cancelarlo revela la misma superficie. | PASS por aceptación de producto |
| GJ-FIG-04 | Escritorio | Asistente de IA → conversación → Asistente de IA | No se visita el selector de Office; sigue existiendo retorno global. | PASS por aceptación de producto |
| GJ-FIG-05 | Escritorio | Mensajería → conversación → Confirmar envío → resultado → Mensajería | El resultado dice que es prototipo, no un envío real, y vuelve a Mensajería. | PASS por aceptación de producto |
| GJ-FIG-06 | Escritorio | Reportes → Cuenta → Office Docente → Escritorio | Los nueve nombres permanecen visibles, estables y el activo es legible. | PASS; la regresión de label activo se corregió durante QA y su guardia queda en #157 |
| GJ-FIG-07 | Tablet | Abre [Escritorio tablet](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=162-115) en Present; Office Docente → Escritorio | El rail conserva los nueve módulos y el retorno es inequívoco. | PASS por aceptación de producto |
| GJ-FIG-08 | Móvil | Abre [Escritorio móvil](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=164-115) en Present; Office → Inicio | La barra inferior conserva cinco accesos; Inicio devuelve al Escritorio móvil. | PASS por aceptación de producto |
| GJ-FIG-09 | Móvil | Abre [Más móvil](https://www.figma.com/design/VBK5tK7EQS83tdTmtuBpI9/PlanearIA-%E2%80%94-UX-UI-Ola-2?node-id=158-200); Reportes → Más → Inicio | Reportes está disponible bajo Más, conserva el nombre y se puede regresar sin historial implícito. | PASS por aceptación de producto |

## Criterio de aceptación manual

El responsable de producto aceptó el resultado de los recorridos y autorizó el cierre de #156. Durante la
QA se encontró que algunos labels activos podían ocultarse; las 24 instancias auditadas se restauraron y
la inspección posterior confirmó labels visibles. #157 conserva una guardia visual para que esa regresión
se vuelva a detectar al rediseñar módulos, no una deuda abierta atribuida a este change.
