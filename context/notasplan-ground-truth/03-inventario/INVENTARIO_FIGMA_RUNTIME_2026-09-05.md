# Inventario as-is de NotasPLAN — `#157-O4`

> **Fecha:** 2026-09-05.
> **Método Figma:** barrido read-only por Plugin API de la página `60:2`, filtrando frames de nivel
> superior cuyo nombre menciona documento, planeación o plantilla, y clasificando **por ancho de frame**
> según la regla que #166 impone a toda ola posterior.
> **Método runtime:** CodeGraph sobre el checkout, más lectura directa de los componentes de sección.
> Índice de GitNexus reparado el 2026-09-05 tras el merge de #179.

## 1. Figma: el editor sólo existe en escritorio

| Superficie | Nodo | Tamaño | Clasificación |
| --- | --- | ---: | --- |
| `Documento · planeación · escritorio · draft` | `62:3` | 1440x960 | escritorio |
| `Documento nuevo · plantillas · escritorio · draft` | `66:40` | 1440x960 | escritorio |
| `Documento · planeación · desde Escritorio · draft` | `151:123` | 1440x960 | escritorio |
| `Documento nuevo · plantillas · desde Escritorio · draft` | `151:77` | 1440x960 | escritorio |

**Cero superficies de editor en 768 y en 390.** Lo único que existe en esos anchos con nombre de documento
son superficies de Office aprobadas en #177 —vistas filtradas de biblioteca y hojas de plantillas—, que no
son editores. Es exactamente la brecha que #166 predijo y que hoy absorbe el estado de límite de Office.

### 1.1 Qué contiene el draft `62:3`

Verificado nodo a nodo:

- **Cabecera:** volver a Office, archivo activo, título, estado de guardado y `Acción · Compartir grupo`.
- **Cinta de pestañas** (`62:11`): Archivo, Inicio, Insertar, Diseño, Revisar y Vista, más `Exportar PDF`.
- **Cinta de comandos** (`62:21`): quince instancias en cinco grupos — Pegar; Fuente, Título, Lista; Tabla,
  Imagen, Enlace; Comentario, Cambios; Renombrar, Duplicar, Historial.
- **Índice del documento** (`62:51`): seis secciones —Propósito, Inicio, Desarrollo, Cierre, Materiales y
  Bibliografía— más un bloque `Plantilla aplicada` con opción de cambiarla.
- **Hoja de documento** (`62:66`): 642x658, con tipo, título, metadatos y cuerpos por sección, y un bloque
  `Selección revisable`.
- **Panel de contexto** (`62:79`): destino y `Acción · Asignar a grupo`.
- **Panel de revisión IA** (`62:88`): con `ver cambios` y `descartar`.

Es un clon de Word. Dos de sus decisiones contradicen lo confirmado en la entrevista: la cinta de seis
pestañas y un modelo de secciones que no coincide con el del runtime.

## 2. Runtime: hay un editor real y profundo

`DocEditorScreen` vive en `src/screens/planeaciones/` y se registra como ruta **raíz** `DocEditor` en
`StackNavigator`, no dentro de `OfficeStack`. Recibe `modo` (`crear`, `editar`, `plantilla`),
`planeacionId`, `plantillaId` y `nivelAcademico`.

### 2.1 Lo que ya funciona

| Capacidad | Detalle verificado |
| --- | --- |
| Siete secciones | `SeccionInfoInstitucional`, `SeccionDatosGenerales`, `SeccionCurricular`, `SeccionSesiones`, `SeccionEvaluacion`, `SeccionObservaciones` y `SeccionFirmas`, más `SesionCard` |
| Formato de página | `PAGE_PRESETS` con A4 794x1123 y Carta 816x1056 |
| Logos | Dos ranuras, TecNM e institución, con tope de 2 MB y 1500 px de lado |
| Vistas | Móvil alterna `documento` y `formulario`; escritorio alterna `mixto`, `documento` y `formulario`; existe pantalla completa de documento |
| Editor de texto | `RichTextEditor` sobre `@10play/tentap-editor`, con fallback propio para web y conversión entre TipTap JSON y HTML |
| Barra de herramientas | `EditorToolbar` con siete comandos: negrita, cursiva, lista, numerada, título, checklist y tabla. Se compacta en modo móvil y refleja el estado del cursor |
| IA | `AIToolbar` con `useCopiloto` y `copilotoService`, por sección |
| Borrador | Autoguardado con prefijo `DOC_DRAFT_PREFIX` y etiqueta de hora del último borrador |
| Deshacer | Reducer de historial con `past`, `present`, `future` e `isDirty` |
| Guardia de salida | Suscripción a `beforeRemove` que avisa de cambios sin guardar |
| Responsive | `useEditorMode` decide `standard` o `mobile` en 768, con detección de iPad |

### 2.2 La tensión que define esta ola

El runtime guarda un **modelo tipado** `PlaneacionDocumento`: las secciones son campos con forma propia y el
texto enriquecido vive dentro de esos campos. La entrevista aprobó lo contrario: el **documento** es la
fuente de verdad y las secciones viajan dentro de él como encabezados con nombre.

No es un detalle de implementación. Es lo que decide si el archivo sobrevive a Word:

| | Modelo tipado (hoy) | Documento-primero (aprobado) |
| --- | --- | --- |
| Exportar a `.docx` | Posible, con mapeo sección a sección | Directo: ya es un documento |
| Editar fuera y volver | La estructura se pierde: no hay forma de que Word conserve que un párrafo es el propósito de la sesión 2 | La estructura vuelve, porque viaja como encabezados dentro del archivo |
| Vista formulario | Es la fuente de verdad | Es una proyección sobre los encabezados |

La migración de almacenamiento es el costo real de la ola y pertenece al runtime, no a este change.

## 3. Brecha entre lo que existe y lo decidido

| Decisión de la entrevista | Estado en Figma | Estado en runtime | Brecha |
| --- | --- | --- | --- |
| Documento-primero con lente de formulario | La hoja existe; no hay vista formulario | Vista formulario existe, pero sobre modelo tipado | Prototipo: representar ambas vistas. Runtime: migrar almacenamiento |
| Barra compacta contextual | Cinta de seis pestañas y quince comandos | Barra de siete comandos, ya compacta | **Alineado con runtime.** Se retira la cinta del draft |
| Siete secciones del runtime | Seis secciones distintas en el índice | Las siete implementadas | Adoptar las del runtime en el prototipo |
| Tres niveles de plantilla | Bloque `Plantilla aplicada` sin niveles | Modo `plantilla` existe, sin niveles | Construcción nueva |
| Hoja primero en móvil, formulario a un toque | No hay superficie móvil | `mobileView` ya alterna documento y formulario | **El runtime ya resolvió el patrón.** Falta representarlo |
| IA a petición sobre la sección activa, revisable | Panel de revisión con ver cambios y descartar | `AIToolbar` por sección | **Alineado.** Se conserva |
| Historial con puntos de guardado | Comando `Historial` en la cinta | Sólo borrador y deshacer en memoria | Construcción nueva en ambos lados |
| Compartir copia y enlace, interno y externo | Sólo `Compartir grupo` | No existe | Construcción nueva |
| Enlace revocable con solicitud de permiso | No existe | No existe | Construcción nueva, con decisión de privacidad pendiente |
| Formato de página real | La hoja no declara formato | A4 y Carta implementados | Representarlo en el prototipo |

## 4. Consecuencia para el diseño del candidate

1. **Reconstrucción total en 768 y 390.** No hay nada que conservar: el editor no existe en esos anchos.
2. **Sustitución en 1440.** La cinta y el índice de seis secciones se retiran; la hoja, el panel de contexto
   y el panel de revisión IA son la parte aprovechable del draft.
3. **El prototipo no puede prometer menos que el runtime.** Formato de página, alternancia de vistas, estado
   de borrador y guardia de cambios sin guardar ya existen en la app y deben aparecer.
4. **El prototipo tampoco puede prometer lo que nadie ha medido.** Historial con versiones, enlace revocable
   y viaje de vuelta desde Word se representan como afordancias y se declaran en el handoff con su costo.

## 5. Límite de este inventario

`context/planeaciones-reales/` conserva únicamente su README: el contenido está externalizado fuera del
repositorio. Esta ola no puede contrastar el andamiaje de la plantilla contra planeaciones reales desde el
repositorio, y lo declara en vez de suponer que el modelo de siete secciones ya está validado en campo.
