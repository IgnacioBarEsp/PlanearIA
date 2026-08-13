## Context

`README.md` es la portada pública del repositorio. Su versión anterior intentó atender al mismo tiempo a visitantes, reclutadores, colaboradores y agentes, por lo que terminó siendo extensa y poco natural. La nueva dirección separa responsabilidades: el README explica el proyecto; `Documentacion/README.md`, `AGENTS.md` y OpenSpec conservan el detalle operativo.

La evidencia visual mantiene dos estados distintos:

- **Aplicación actual:** recorrido público/invitado de `https://planearai.com`.
- **Visión en desarrollo:** prototipo Figma con frames candidate para computadora, tablet y móvil.

### Bounded contexts

El cambio es exclusivamente documental. No modifica dominios, navegación, datos, `userId`, `src/sync`, autenticación, IA, accesibilidad ni contratos entre módulos.

## Goals / Non-Goals

**Goals:**

- Explicar PlanearIA con la voz de su autor y en pocos bloques fáciles de recorrer.
- Mostrar primero el producto y después sus tecnologías.
- Distinguir con claridad la aplicación actual de la visión en desarrollo.
- Permitir probar la demo web o instalar el APK sin preparar un entorno de desarrollo.
- Dejar la presentación personal como información complementaria al final.

**Non-Goals:**

- Escribir para una empresa, vacante o tipo específico de lector.
- Documentar el flujo interno completo de agentes, SDD o arquitectura en la portada.
- Cambiar la aplicación, el prototipo o el despliegue.
- Afirmar que la visión beta ya está implementada o aprobada.

## Decisions

### 1. Voz en primera persona

La apertura usa “Creé PlanearIA para…” y explica el problema docente con frases sencillas. El resto mantiene una voz de proyecto normal, sin argumentos de venta ni secciones sobre lo que el repositorio “demuestra”.

### 2. Orden centrado en el producto

El orden será: nombre y descripción, qué es PlanearIA, capturas, funciones, cómo probarla, tecnologías, estado y próximos pasos, licencia, autor y contacto.

### 3. Capturas separadas por estado

Las tres capturas de la demo aparecen antes que las tres de Figma. El prototipo se rotula “Visión en desarrollo” y el texto aclara que todavía no es la interfaz final. Se conservan WebP, texto alternativo y pies breves.

### 4. Prueba sin entorno de desarrollo

La sección de uso enlaza a `https://planearai.com` para el recorrido invitado y a `https://github.com/IgnacioBarEsp/PlanearIA/releases/latest` para descargar el APK. No incluye `npm install`, comandos de backend ni validaciones internas.

### 5. Detalle técnico fuera de la portada

El README enumera el stack principal y enlaza a `Documentacion/README.md`. Arquitectura, mapa del repositorio, comandos, reglas de agentes y proceso SDD permanecen en sus documentos propios.

### 6. Autor como cierre

La sección final identifica a Ignacio Barboza Espinoza como Desarrollador de Software Junior especializado en React Native, TypeScript y Node.js. SDD, GitNexus, UX/UI y pruebas automatizadas se mencionan como prácticas adoptadas durante el proyecto, no como un discurso dirigido a terceros.

## Risks / Trade-offs

- **Confundir Figma con la app actual:** se mitiga con encabezados separados y una aclaración antes de las imágenes beta.
- **Ocultar información técnica útil:** se conserva el stack y un enlace directo al índice documental.
- **Enlace de APK obsoleto:** se usa la ruta estable de la release más reciente, no el nombre de un asset específico.
- **Capturas largas en móvil:** se mantiene un flujo vertical compatible con el render estándar de GitHub.

## Migration Plan

1. Reescribir el README con la estructura aprobada en entrevista.
2. Actualizar Issue #167 y los artefactos OpenSpec para retirar la orientación anterior.
3. Verificar assets, enlaces, render Markdown y ausencia de lenguaje dirigido a reclutadores.
4. Regenerar la evidencia documental y repetir los gates aplicables.
5. Revertir el cambio documental si una captura o enlace deja de ser seguro o verificable.

## Open Questions

No quedan decisiones bloqueantes. La aplicación pública, el APK más reciente y el prototipo Figma ya tienen rutas estables identificadas.
