## 1. Preparación segura del archivo Figma

- [x] 1.1 Revalidar en solo lectura los frames `38:2`, `90:48`, `125:65`, `127:166` y `158:150`, registrar cualquier drift nuevo y confirmar que el baseline 0.1/plan 1.1 siguen siendo aplicables antes de escribir. Evidencia: `evidencia/01-revalidacion-figma-pre-write.md`.
- [x] 1.2 Crear una sección/version `candidate` de Clases sin borrar, mover ni renombrar como aprobados los frames históricos; registrar el punto de rollback en historial Figma. Evidencia: `evidencia/02-seccion-candidate-rollback.md`.
- [x] 1.3 Definir los componentes/variantes compartidos, datos sintéticos y anotaciones de accesibilidad desde tokens PlanearIA, sin copiar marca/assets de Google ni introducir efectos prohibidos. Evidencia: `evidencia/03-libreria-local-clases.md`.

## 2. Superficies y estados candidatos

- [x] 2.1 Construir la entrada de Clases en desktop, tablet y móvil con “Lo que sigue”, clases activas, Crear/Importar y variantes loading/empty/error/offline/datos insuficientes. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.2 Construir el contexto de clase y la navegación interna Tablón, Trabajo de clase, Personas y Seguimiento en los tres breakpoints, conservando identidad, labels y objeto activo. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.3 Construir Tablón con anuncios/novedades, autor/fecha/estado, editor breve, cancelación y estados negativos, sin métricas ni duplicado de Trabajo de clase. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.4 Construir Trabajo de clase por Unidad/Tema con actividades, preguntas, materiales y sus estados, sin convertirlo en área de archivos u Office incrustado. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.5 Construir el recorrido de actividad breve con título requerido, adjunto opcional, borrador/programación/asignación y recuperación sin pérdida ante error/offline. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.6 Construir los handoffs opcionales Adjuntar existente y Crear recurso hacia Office Docente/Diseño, con cancelación, retorno al mismo borrador y confirmación antes de asociar. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.7 Construir Personas con roster, roles, estado/incorporación, privacidad y variantes loading/empty/error/offline usando únicamente datos sintéticos. Evidencia: `evidencia/04-superficies-estados-figma.md`.
- [x] 2.8 Construir Seguimiento con revisión, vencimientos, asistencia, calificación, promedio/riesgo explicable, datos insuficientes y retorno al filtro/objeto de origen. Evidencia: `evidencia/04-superficies-estados-figma.md`.

## 3. Navegación y recorridos verificables

- [x] 3.1 Conectar la navegación global hacia/desde Clases en cada breakpoint sin alterar los destinos cerrados por #156 y sin enviar hotspots móviles a frames desktop. Las iteraciones aislaron Escritorio/Office y luego todos los hubs globales alcanzables en desktop, tablet y móvil. Evidencia: `evidencia/05-grafo-candidate-figma.md`, `evidencia/11-iteracion-desktop-office.md` y `evidencia/12-puentes-globales-candidate.md`.
- [x] 3.2 Conectar los recorridos C-01 entrar/atender, C-02 actividad sin archivo, C-03 recurso opcional, C-04 revisar/devolver y C-05 anuncio, con origen, destino y retorno explícitos. Evidencia: `evidencia/05-grafo-candidate-figma.md`.
- [x] 3.3 Conectar cancelación/cierre de cada overlay al disparador correcto y asegurar que ningún hotspot afirme publicación, asignación, devolución, IA o sync real sin confirmación visible. Evidencia: `evidencia/05-grafo-candidate-figma.md`.
- [x] 3.4 Completar y versionar `MATRIZ_NAVEGACION.md` con frame ID, breakpoint, acción, destino, retorno, estado y resultado de cada journey. Evidencia: `Documentacion/03-validacion/prototipo-figma-ola2/MATRIZ_NAVEGACION.md` v1.1.

## 4. QA visual y gate humano

- [x] 4.1 Ejecutar el checklist Anti-Slop y la auditoría Nielsen/accesibilidad sobre las cinco superficies; corregir toda severidad 3–4 y verificar labels, foco, contraste, 44 pt, fuente ampliada y reducción de movimiento. Evidencia: `evidencia/06-auditoria-visual-accesibilidad.md`.
- [x] 4.2 Levantar Expo web, esperar HTTP 200 y capturar con Playwright los breakpoints `<768`, `768–1279` y `>=1280` como comparación read-only del runtime; no tratarla como destino ni modificar código. Evidencia: `evidencia/07-runtime-playwright-readonly.md`.
- [x] 4.3 Recorrer manualmente en Figma Present los cinco journeys en desktop, tablet y móvil; adjuntar capturas/enlaces a #159 y registrar hotspots rotos, éxitos falsos o drift. Las correcciones solicitadas por owner revalidaron Escritorio → Office → Clases → Escritorio y el tránsito global entre hubs candidate por breakpoint. Evidencia: `evidencia/08-figma-present-recorridos.md`, `evidencia/11-iteracion-desktop-office.md`, `evidencia/12-puentes-globales-candidate.md` y `evidencia/figma-present/`.
- [x] 4.4 Ejecutar una revisión adversarial independiente del prototipo, contratos y evidencia; resolver Blockers/Majors y clasificar cualquier hallazgo residual con el Debt Control Loop. La reauditoría de navegación no encontró enlaces globales hacia Clases legacy ni destinos inexistentes en los tres breakpoints. Evidencia: `evidencia/09-revision-adversarial.md` y `evidencia/12-puentes-globales-candidate.md`.
- [x] 4.5 Presentar la versión `candidate` al owner y detener el flujo hasta obtener aprobación visual humana explícita; no marcar frames `approved`, no declarar prototipo listo y no continuar al cierre sin esa evidencia. Presentado en [#159](https://github.com/RitualBoat/PlanearIA/issues/159#issuecomment-5164346763), iterado tras feedback del owner en [#159](https://github.com/RitualBoat/PlanearIA/issues/159#issuecomment-5173441287), corregido con puentes globales en [#159](https://github.com/RitualBoat/PlanearIA/issues/159#issuecomment-5180875043) y aprobado explícitamente en [#159](https://github.com/RitualBoat/PlanearIA/issues/159#issuecomment-5182823974).

## 5. Trazabilidad, handoff y cierre SDD

- [x] 5.1 Tras la aprobación humana, registrar el enlace/evidencia en #159, promover solo los frames aprobados y actualizar ground truth, plan 1.1 y matriz sin cerrar #46 por inferencia. Evidencia: `evidencia/13-aprobacion-promocion-clases.md`; 83 frames de Clases promovidos, 22 puentes/fallbacks externos conservados como `candidate`.
- [x] 5.2 Documentar el handoff runtime con gaps de anuncios, EntregaTarea, rutas legacy, MVVM/facade/`src/sync`, compatibilidad y validaciones; no crear el issue/change posterior sin autorización del owner. Evidencia: `evidencia/14-handoff-runtime-clases.md`; no se creó issue/change runtime.
- [x] 5.3 Verificar `npm exec --yes=false -- openspec validate --all --strict --no-interactive`, `npm run agent:harness:check`, `npm run typecheck`, `npm run lint -- --quiet`, tests afectados y `git diff --check`, conservando salidas como evidencia. Todo PASS; 6 suites/21 tests de Clases. Evidencia: `evidencia/15-validacion-cierre.md`.
- [x] 5.4 Actualizar `TLDR.md`, `brownfield-baseline.md` y `readiness.json` con resultados reales, capturar el assessment de deuda incluso si es `clean` y ejecutar `npm run openspec:ready:archive -- --change reconstruir-clases-experiencia --run-local` hasta PASS. Assessment capturado en `.project-os/debt/assessments/reconstruir-clases-experiencia.json`; gate de archive ejecutado en cierre.
