## 1. Revalidación previa a escribir en Figma

- [x] 1.1 Revalidar read-only `62:3`, `66:40`, `151:77` y `151:123` y confirmar que los cuatro siguen midiendo 1440x960
- [x] 1.2 Confirmar que no existe ninguna superficie de editor en 768 ni en 390, barriendo la página por ancho de frame
- [x] 1.3 Localizar los patrones aprobados a clonar: estado de límite de #163, hoja Asignar y tokens de la sección de Office #177
- [x] 1.4 Registrar en `evidencia/01-revalidacion-figma-pre-write.md` el estado previo, el punto de restauración y el alcance

## 2. Sección candidate y escritorio 1440

- [x] 2.1 Crear la sección candidate conservando intactos los cuatro frames heredados
- [x] 2.2 Construir la hoja con su formato de página real y los siete encabezados con nombre
- [x] 2.3 Construir el índice del documento que refleja y navega esos encabezados
- [x] 2.4 Construir la barra compacta contextual con los siete comandos, y retirar toda cinta de pestañas
- [x] 2.5 Construir la lente de formulario sobre la sección activa, declarada como proyección
- [x] 2.6 Construir la barra de acciones del documento con las seis, todas con label visible
- [x] 2.7 Construir el panel de propuesta de IA con aceptar y descartar

## 3. Tablet 768 y móvil 390 como superficies propias

- [x] 3.1 Construir el editor en 768 con hoja centrada, índice y formulario desplegables desde controles con label
- [x] 3.2 Construir el editor en 390 con la hoja a pantalla completa y edición en línea
- [x] 3.3 Anclar la barra compacta en móvil de modo que no tape la línea que se escribe
- [x] 3.4 Construir el acceso al formulario a un toque desde la sección activa en móvil
- [x] 3.5 Clonar el estado de límite para las familias que no existen, en los tres anchos

## 4. Plantilla, acciones y estados

- [x] 4.1 Construir el selector de nivel con `sencillo`, `moderado` y `autocompletado`, con valor por defecto y sin bloquear
- [x] 4.2 Representar el nivel `autocompletado` marcando los datos prellenados como editables
- [x] 4.3 Conectar guardar en biblioteca, guardar como plantilla propia y asignar a un grupo
- [x] 4.4 Construir descargar declarando formato y que el prototipo no descarga
- [x] 4.5 Construir compartir con copia y enlace, rutas interna y externa, y la declaración de sólo lectura y revocable
- [x] 4.6 Construir la solicitud de permiso de edición estilo cuenta más aprobación del docente
- [x] 4.7 Construir el historial con puntos de guardado con nombre, previsualización y restaurar
- [x] 4.8 Construir los ocho estados; el de reimportación se retira de la interfaz por decisión del owner y su límite queda en el handoff
- [x] 4.9 Rotular todo dato de ejemplo

## 5. Auditoría del grafo

- [x] 5.1 Auditar cada `reactions[].actions[]` de la sección resolviendo frames de nivel superior y excluyendo overlays
- [x] 5.2 Clasificar por ancho de frame y contar también las aristas que salen de la sección
- [x] 5.3 Verificar la corrección de destino de cada control de índice, nivel de plantilla y acción del documento
- [x] 5.4 Corregir dentro de este change toda fuga o destino incorrecto y volver a auditar hasta reportar cero
- [x] 5.5 Registrar el resultado en `evidencia/02-auditoria-grafo-por-ancho.md` con el conteo antes y después

## 6. Evidencia visual y accesibilidad

- [x] 6.1 Capturar los tres breakpoints en tema claro y oscuro y verificar que difieren
- [x] 6.2 Recorrer y capturar los nueve estados
- [x] 6.3 Auditar objetivo táctil de 44 pt sin hitSlop, incluida la barra compacta
- [x] 6.4 Verificar labels accesibles en los iconos de formato, foco visible y orden de recorrido
- [x] 6.5 Verificar fuente ampliada sobre hoja y barra, y que ningún significado dependa sólo del color
- [x] 6.6 Completar checklist Nielsen con severidad en `evidencia/03-qa-anti-slop-accesibilidad.md`

## 7. Gate humano

- [x] 7.1 Preparar los recorridos de Figma Present por breakpoint
- [x] 7.2 Recorrer Present con el owner y recoger condiciones
- [x] 7.3 Confirmar en Present las tres decisiones derivadas: nivel con default, formulario no default en móvil y secciones como encabezados
- [ ] 7.4 Corregir dentro de este change las condiciones emitidas y volver a recorrer
- [ ] 7.5 Registrar el veredicto humano explícito en el issue #180 y en `evidencia/04-gate-visual-issue-180.md`
- [ ] 7.6 Promover los frames aprobados y renombrar la sección sólo después del veredicto

## 8. Cierre

- [ ] 8.1 Actualizar la matriz de navegación y el ground truth de NotasPLAN con las superficies aprobadas
- [ ] 8.2 Documentar el handoff runtime en `evidencia/05-handoff-runtime-notasplan.md`, con los cuatro costos declarados
- [ ] 8.3 Completar `readiness.json` y `brownfield-baseline.md` y actualizar `TLDR.md`
- [ ] 8.4 Ejecutar la revisión adversarial y corregir Blockers y Majors dentro del change
- [ ] 8.5 Capturar la deuda con `npm run debt:capture`, incluso si el resultado es `clean`
- [ ] 8.6 Ejecutar `npm run openspec:ready:archive -- --change reconstruir-notasplan-experiencia --run-local` y resolver cada FAIL
