## 1. Gate de inicio e inventario

- [ ] 1.1 Verificar en #163 la aprobación humana explícita de proposal, design, specs y tasks antes de cualquier mutación Figma; si falta, detener `apply` sin marcar tareas.
- [ ] 1.2 Revalidar por API/captura el archivo `VBK5tK7EQS83tdTmtuBpI9`, los nodos `198:695`, `198:776`, `198:809`, sus hotspots y estado real; registrar drift y confirmar que el write no sobrescribirá frames históricos.
- [ ] 1.3 Crear una sección/version `Escritorio 0.1 candidate` con rollback por historial, frames previos, identificación de estado y destino documentado de restauración; no afirmar un checkpoint nombrado si la herramienta no lo confirma.

## 2. Componentes, jerarquía y estados de Escritorio

- [ ] 2.1 Preparar componentes/variantes compartidos con tokens vigentes para launcher, fila de jornada, continuidad, estado sync y selector tipo-primero; documentar labels, foco, 44 pt y señales no-color.
- [ ] 2.2 Construir desktop 1440×960 con dock completo, línea del día priorizada y continuidad auxiliar, incluyendo estado con datos y vacío de docente nuevo sin hero, KPIs, bento o cards inertes.
- [ ] 2.3 Construir tablet 768×1024 con rail y las mismas tres capas, adaptando densidad/panes sin reducir la experiencia a una tarjeta ni cambiar owners o labels.
- [ ] 2.4 Construir móvil 390×844 con cinco hubs, launcher compacto, más de una salida accionable y continuidad, asegurando que labels/controles críticos no queden ocultos o truncados.
- [ ] 2.5 Completar una matriz proporcional de loading, empty, error parcial, offline, sync pendiente/conflicto y datos insuficientes para launcher, atención y continuidad, con recuperación manual y datos sintéticos rotulados.
- [ ] 2.6 Representar la sugerencia IA secundaria, descartable y revisable junto con IA no configurada/error temporal; demostrar confirmación docente y flujo manual completo sin éxito simulado.

## 3. Navegación y retornos verificables

- [ ] 3.1 Conectar “Nuevo archivo” al selector documento/hoja/presentación/diseño/preguntar a la IA, con chip de intención descartable, cancelación y retorno al disparador del mismo breakpoint.
- [ ] 3.2 Conectar prioridades y continuidad hacia objetos owners específicos —Clases/Seguimiento, Office/Contenido, Mensajería, Agenda y Asistente— con contexto y retorno a la jornada, sin homes genéricos.
- [ ] 3.3 Conservar navegación global, hub activo y destinos del mismo breakpoint en móvil, tablet y web; verificar que overlays devuelven foco/origen y ningún hotspot afirma guardado, envío o sync real.
- [ ] 3.4 Actualizar `MATRIZ_NAVEGACION.md` con E-01 iniciar/atender, E-02 crear tipo-primero, E-03 continuar/volver y E-04 offline/sync, registrando frame, control, owner, destino, retorno, estado y breakpoint.

## 4. QA visual y gate humano

- [ ] 4.1 Ejecutar Anti-Slop y auditoría Nielsen/accesibilidad sobre las tres capas y breakpoints; corregir severidad 3–4 y verificar labels, foco visible/recuperable, contraste, 44 pt, fuente ampliada y reducir movimiento.
- [ ] 4.2 Levantar Expo web, esperar HTTP 200 en el origen canónico y capturar móvil, tablet y desktop con Playwright como comparación read-only del placeholder runtime; clasificar consola y no modificar código.
- [ ] 4.3 Recorrer manualmente en Figma Present E-01 a E-04 en desktop, tablet y móvil; adjuntar enlaces/capturas a #163 y registrar todo hotspot roto, éxito falso, pérdida de owner o salto de breakpoint.
- [ ] 4.4 Ejecutar revisión adversarial independiente de frames, contratos y evidencia; resolver Blockers/Majors y clasificar hallazgos residuales mediante Debt Control Loop.
- [ ] 4.5 Presentar la versión candidate al owner y detener el flujo hasta aprobación visual humana explícita; no promover frames, declarar Escritorio listo ni iniciar cierre por evidencia automática.

## 5. Trazabilidad, handoff y cierre SDD

- [ ] 5.1 Sólo después de aprobación humana, enlazar la evidencia en #163, promover exclusivamente los frames autorizados y actualizar ground truth, plan/matriz sin reinterpretar la aprobación de Clases.
- [ ] 5.2 Documentar el handoff runtime con proyecciones cross-context, MVVM, placeholder, `AppShell`, `SyncStatusChip`, `src/sync`, `userId`, IA gateway y compatibilidad legacy; no crear issue/change runtime sin autorización.
- [ ] 5.3 Ejecutar `openspec validate --all --strict --no-interactive`, `agent:harness:check`, validaciones documentales afectadas y `git diff --check`; registrar resultados sin fingir typecheck/tests de código no tocado como evidencia de implementación.
- [ ] 5.4 Actualizar `TLDR.md`, `brownfield-baseline.md` y `readiness.json` con resultados reales, capturar assessment de deuda incluso si es `clean` y ejecutar `openspec:ready:archive -- --change reconstruir-escritorio-experiencia --run-local` hasta PASS.
