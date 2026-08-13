## Why

El README raíz terminó convertido en una presentación profesional demasiado extensa y dirigida de forma explícita a reclutadores. Esto dificulta entender PlanearIA como un proyecto de software normal: qué problema resuelve, cómo se ve, qué funciones reúne y dónde puede probarse.

El Issue [#167](https://github.com/IgnacioBarEsp/PlanearIA/issues/167) se corrige para que la portada presente primero el producto con la voz de su autor. La información personal queda como un dato adicional al final.

## What Changes

- Reescribir `README.md` en primera persona y con lenguaje directo.
- Explicar qué es PlanearIA antes de mostrar cualquier detalle técnico.
- Conservar tres capturas de la aplicación actual y tres del prototipo Figma bajo “Visión en desarrollo”.
- Incluir dos formas de probar el proyecto: demo web como invitado y APK desde GitHub Releases.
- Resumir funciones, tecnologías, estado y próximos pasos sin incluir instrucciones para levantar el entorno de desarrollo.
- Mantener una sola ruta hacia la documentación técnica detallada.
- Cerrar con una sección breve sobre Ignacio Barboza Espinoza, sus tecnologías y las prácticas empleadas en el proyecto.
- Conservar la licencia propietaria y la revisión de privacidad de las capturas.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `ai-friendly-repository-context`: el README funciona como portada clara del producto y dirige a la documentación técnica sin duplicarla.

## Impact

- Documentación: `README.md`, Issue #167 y artefactos de este change.
- Assets: se conservan las seis capturas públicas ya verificadas en `assets/readme/`.
- Runtime: sin cambios en aplicación, backend, datos, autenticación, sincronización, IA o despliegue.
- Dependencias y costo: ninguno.

## No objetivos

- No convertir el README en un CV, carta de presentación o texto dirigido a una vacante.
- No agregar instalación para colaboradores ni copiar la documentación interna en la portada.
- No presentar el prototipo de Figma como funcionalidad terminada.
- No rediseñar la app, editar Figma o modificar el runtime.
