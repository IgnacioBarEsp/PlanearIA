## 1. Revalidación previa a escribir en Figma

- [x] 1.1 Revalidar read-only los nodos `257:951`, `277:958` y `274:958` y confirmar que sus tamaños y estructura siguen siendo los del inventario del 2026-09-04
- [x] 1.2 Localizar la sección `307:965` de Escritorio y confirmar que los frames `345:968` y `345:1006` y los selectores `310:3`, `310:69` y `310:106` siguen disponibles para clonar y para verificar
- [x] 1.3 Registrar en `evidencia/01-revalidacion-figma-pre-write.md` el estado previo, el punto de restauración y el alcance exacto que se va a tocar

## 2. Sección candidate y escritorio 1440

- [x] 2.1 Crear la sección candidate de Office conservando intactos los tres frames heredados
- [x] 2.2 Construir el frame de escritorio clonando de `307:965` para heredar tokens y variables ligadas, sin introducir estilo nuevo
- [x] 2.3 Construir la zona de creación con documento, hoja y presentación desplegados y sin modal intermedio
- [x] 2.4 Construir el catálogo de plantillas por familias y presets, colocado después del tipo
- [x] 2.5 Conservar `Recientes` y los cuatro filtros por tipo, y retirar el bloque `Inicio por intención docente`
- [x] 2.6 Construir la fila de archivo conectado con tipo, nombre, grupo, último uso y las cinco acciones con label visible
- [x] 2.7 Colocar importar como acción persistente del hub

## 3. Tablet 768 y móvil 390 como superficies propias

- [x] 3.1 Construir el frame de tablet en 768 con las tres capas y densidad reducida, sin clonar el de 1440
- [x] 3.2 Agrupar las cinco acciones en tablet tras un control con label visible, nunca tras un icono mudo
- [x] 3.3 Construir el frame de móvil en 390 con los tres tipos visibles sin scroll y la biblioteca de recientes con filtros
- [x] 3.4 Construir la hoja de acciones de móvil desde la fila del archivo
- [x] 3.5 Clonar el estado de límite de editor para 768 y 390 con acción `BACK` que devuelve al origen exacto

## 4. Estados y recorridos

- [x] 4.1 Construir el estado vacío con creación, plantillas e importar, sin ejemplos falsos ni tarjetas inertes
- [x] 4.2 Construir cargando, error, offline, sync pendiente y sync en conflicto, distinguiendo pendiente de conflicto
- [x] 4.3 Conectar asignar a la hoja Asignar aprobada y adjuntar a Mensajería, con retorno declarado a Office
- [x] 4.4 Conectar ver dónde se está usando y duplicar para otro grupo
- [x] 4.5 Representar descargar como afordancia que nombra el formato y declara que la descarga no ocurre en el prototipo
- [x] 4.6 Rotular todo dato de ejemplo

## 5. Auditoría del grafo y cierre de la deuda de #166

- [x] 5.1 Auditar por Plugin API cada `reactions[].actions[]` de la sección, resolviendo el frame de nivel superior de origen y destino y excluyendo overlays
- [x] 5.2 Clasificar por ancho de frame y contar también las aristas que salen de la sección
- [x] 5.3 Corregir dentro de este change toda fuga detectada y volver a auditar hasta reportar cero
- [x] 5.4 Verificar que los selectores tipo-primero de Escritorio siguen intactos y alcanzables tras la desviación de D3
- [x] 5.5 Registrar el resultado en `evidencia/02-auditoria-grafo-por-ancho.md` con el conteo antes y después

## 6. Evidencia visual y accesibilidad

- [x] 6.1 Capturar los tres breakpoints en tema claro y oscuro, y verificar que las capturas son demostrablemente distintas
- [x] 6.2 Recorrer los siete estados y capturarlos
- [x] 6.3 Auditar objetivo táctil de 44 pt sin hitSlop, foco visible, orden de recorrido y contraste por tokens
- [x] 6.4 Verificar fuente ampliada y alto contraste sobre la fila de archivo y la zona de creación
- [x] 6.5 Completar checklist Nielsen con severidad y registrar el resultado en `evidencia/03-qa-anti-slop-accesibilidad.md`

## 7. Gate humano

- [x] 7.1 Preparar los recorridos de Figma Present por breakpoint
- [x] 7.2 Recorrer Present con el owner y recoger condiciones
- [x] 7.3 Confirmar en Present las dos decisiones derivadas: importar como acción persistente y el catálogo en familias
- [x] 7.4 Corregir dentro de este change las condiciones emitidas y volver a recorrer
- [x] 7.5 Registrar el veredicto humano explícito en el issue #177 y en `evidencia/04-gate-visual-issue-177.md`
- [x] 7.6 Promover los frames aprobados y renombrar la sección sólo después del veredicto

## 8. Cierre

- [x] 8.1 Actualizar la matriz de navegación y el ground truth de Office con las superficies aprobadas
- [x] 8.2 Documentar el handoff runtime en `evidencia/05-handoff-runtime-office.md`, incluido el costo no dimensionado de la descarga con fidelidad de formato
- [x] 8.3 Crear `readiness.json` y `brownfield-baseline.md` completos y verificar `TLDR.md`
- [x] 8.4 Ejecutar la revisión adversarial y corregir Blockers y Majors dentro del change
- [x] 8.5 Capturar la deuda con `npm run debt:capture`, incluso si el resultado es `clean`, y verificar que el plan no supera su presupuesto
- [x] 8.6 Ejecutar `npm run openspec:ready:archive -- --change reconstruir-office-experiencia --run-local` y resolver cada FAIL
