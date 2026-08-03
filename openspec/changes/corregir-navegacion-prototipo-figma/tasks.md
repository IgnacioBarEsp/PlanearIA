## 1. Baseline y contrato

- [x] 1.1 Capturar el baseline del archivo Figma: único inicio, frames activos, reacciones y destinos actualmente alcanzables.
- [x] 1.2 Registrar la matriz canónica de módulos, etiquetas, tipos de acción, destinos y retornos para escritorio, tablet y móvil.
- [x] 1.3 Revisar proposal, design y delta spec contra el issue #156 antes de tocar el prototipo; confirmar que no se modifica runtime ni integraciones reales.

## 2. Grafo navegable de Figma

- [x] 2.1 Corregir el shell de Escritorio y Office para que el acceso global sea estable y los retornos a Escritorio u Office sean explícitos.
- [x] 2.2 Crear destinos contextuales diferenciados para creación rápida desde Escritorio y creación desde Office, sin reutilizar un retorno de otro origen.
- [x] 2.3 Normalizar nombres y rutas globales en Clases, Asistente de IA, Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta.
- [x] 2.4 Corregir overlays, confirmaciones, estados de carga/vacío/no disponible y resultados para que cierren o continúen en el origen correcto, sin declarar integración real.
- [x] 2.5 Completar el patrón de navegación tablet y móvil: rail o barra compacta, acceso a Más y retornos explícitos equivalentes al escritorio.

## 3. Evidencia y QA del prototipo

- [x] 3.1 Documentar los hotspots y golden journeys reproducibles desde Escritorio, con origen, control, destino, retorno, breakpoint y estado de evidencia.
- [x] 3.2 Verificar visualmente en Figma el único punto de inicio, los nombres canónicos, áreas de toque, contraste y ausencia de callejones sin salida.
- [x] 3.3 Ejecutar los golden journeys desktop, tablet y móvil de forma manual en Figma y registrar capturas o enlaces de evidencia.

## 4. Cierre SDD

- [x] 4.1 Ejecutar la revisión adversarial independiente del grafo, corregir Blockers y Majors, y capturar el assessment de deuda del flujo.
- [x] 4.2 Ejecutar el gate pre-archive, archivar/sincronizar el change y actualizar issue #156, Product OS y el plan UX/UI con evidencia verificable.
