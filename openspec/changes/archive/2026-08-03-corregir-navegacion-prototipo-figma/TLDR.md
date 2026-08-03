## Intención de la propuesta

El prototipo de PlanearIA debe poder mostrarse desde un único inicio: Escritorio Docente. Hoy algunos enlaces conservan subflujos antiguos; por ello perder una ruta o usar Atrás puede llevar a Office aunque la tarea haya empezado en Escritorio. También se ocultan o cambian nombres de módulos. Este change vuelve la navegación demostrable y confiable para entrevistas docentes, sin cambiar la aplicación real ni simular integraciones.

## Enfoque de diseño

Se trata el archivo como un solo grafo de suite. El menú conserva siempre los mismos nueve módulos; únicamente cambia el resaltado del módulo activo. Cada acción se clasifica como global, contextual, creación, overlay o resultado. Cuando una misma pantalla necesitaría regresar a dos lugares, se crean destinos contextuales distintos en lugar de delegar el resultado al historial del visor de Figma.

## Comportamiento que queda cubierto

Escritorio es el único punto de inicio. Office, Clases, Asistente de IA, Diseño de materiales, Mensajería, Agenda, Reportes y Cuenta pueden abrirse y abandonarse con controles visibles y labels siempre presentes. Crear desde Escritorio vuelve a Escritorio; crear desde Office vuelve a Office. Tablet y móvil mantienen accesos equivalentes mediante rail o Más. La carga y el vacío dinámicos no se simulan; las capacidades no disponibles se explican sin presentar IA, envío, red o sincronización como reales.

## Plan práctico de trabajo

Primero se captura el grafo real y una matriz de rutas. Después se corrige Escritorio y Office, se separan los retornos de creación y se normalizan los módulos, overlays y resultados. Se completa la navegación compacta para tablet y móvil. Finalmente se recorren los golden journeys, se registran capturas o enlaces, se revisa el diseño de forma adversarial y se ejecutan los gates de archivo, deuda, issue y Project.

## Resumen integral del change

Este change no implementa funcionalidades de PlanearIA: vuelve coherente el prototipo que las comunica. Reduce la ambigüedad de los recorridos, conserva una sola entrada y hace que los destinos y retornos digan claramente dónde está el docente y a dónde volverá. La evidencia versionada permitirá detectar enlaces rotos antes de las entrevistas y de la implementación de la interfaz real.
