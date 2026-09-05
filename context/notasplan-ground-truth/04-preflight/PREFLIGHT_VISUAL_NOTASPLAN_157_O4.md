# Preflight visual — NotasPLAN `#157-O4`

> **Estado:** PASS documental para `propose`; pendiente de gate humano para `apply`.
> **Fecha:** 2026-09-05.
> **Fuentes obligatorias:** `DISENO_ANTI_SLOP.md`, plan UX/UI #101, matriz de decisiones e inventario de
> esta ola, y las specs aprobadas de #163 y #177.

## Tarea docente

Escribir la planeación que va a entregar, viéndola como quedará impresa, y poder sacarla de la app sin que
deje de ser un documento editable.

## Zona de intensidad

**Baja.** Es la superficie de trabajo más densa y más larga de la suite: el docente pasa aquí una hora, no
diez segundos. Todo lo que no sea su texto debe retirarse. El sistema visual acompaña la lectura y no
compite con ella.

Es la zona de menor intensidad de todas las olas hasta ahora: Escritorio era media, Office media-baja.

## Jerarquía

1. La hoja y su contenido.
2. La barra compacta, presente pero discreta, que refleja dónde está el cursor.
3. El índice de secciones, para orientarse sin perder el sitio.
4. El estado del documento: guardado, borrador, offline.
5. Las acciones del documento, alcanzables sin ocupar espacio permanente.
6. La IA, secundaria y a petición.

## Estructura responsive

- **Escritorio 1440:** índice lateral permanente, hoja centrada con su formato real, panel de formulario
  simultáneo cuando se pide, barra sobre la hoja.
- **Tablet 768:** hoja centrada con densidad reducida; índice y formulario desplegables desde controles con
  label visible; barra sobre la hoja.
- **Móvil 390:** la hoja ocupa la pantalla y se edita en línea; índice y formulario a un toque; barra
  compacta anclada que no tapa la línea que se escribe.

## Firma útil

**La hoja que es el archivo.** Lo que distingue a NotasPLAN no es una decoración: es que lo que el docente
ve en pantalla es literalmente lo que se descarga, con su formato de página, sus encabezados y su
estructura, y que eso vuelve intacto si lo edita fuera. Ningún editor escolar que arranque de un formulario
puede prometer eso.

## Patrón genérico refutado

Se rechaza el **clon de Word**: cinta de pestañas con quince comandos, la mayoría inertes en un prototipo y
la mayoría irrelevantes para escribir una planeación. Es lo que hoy tiene el draft `62:3` y lo que la
entrevista descartó explícitamente. Familiaridad no significa copiar la densidad de escritorio de 2007 a una
pantalla de 390 px.

Se rechaza también el **formulario con vista previa**: rellenar campos a la izquierda y mirar el resultado a
la derecha convierte el documento en un subproducto y rompe el viaje de vuelta desde Word.

Y se rechaza el **editor con IA al frente**: un panel permanente que sugiere antes de que el docente
escriba invierte quién redacta la planeación.

## Tokens y componentes

- Tokens de `PlanearIA / Color`, `Layout` y `Typography`. Cero hex nuevo.
- Se clonan superficies aprobadas para heredar tokens y variables ligadas, como en #177.
- El estado de límite reutiliza el patrón aprobado en #163 y ya replicado en #177.
- La hoja usa el formato de página real que el runtime ya implementa, no una proporción inventada.

Sin glass, sin blur, sin gradientes, sin halos, sin bento, sin sombras decorativas y sin animación
ornamental. Ninguna excepción del catálogo anti-slop se invoca.

## Arte generado

Evaluado y **descartado** para esta superficie. Un editor de documentos no tiene estado vacío ilustrable ni
zona de marca: su vacío es una hoja en blanco con encabezados, que es exactamente lo que debe ser. Añadir
ilustración aquí competiría con el contenido del docente. No se solicita generación con ComfyUI.

## Estados negativos

Documento nuevo vacío, guardando y guardado, cambios sin guardar al salir, error al guardar, offline, sync
pendiente, sync en conflicto, IA no disponible y reimportado desde Word. Los nueve están declarados en el
baseline con su salida.

El de reimportación es propio de esta ola y el más delicado: debe declarar **qué se conservó y qué no**
sobrevivió al viaje, en vez de presentar el documento como si nada hubiera cambiado.

## Accesibilidad

- Objetivo táctil de 44 pt sin depender de `hitSlop`, incluida la barra compacta, que es donde más tienta
  apretar controles.
- Labels textuales en toda acción. Los iconos de formato llevan label accesible, como ya hace
  `EditorToolbar` con `accessibilityLabel`.
- Foco visible y orden de recorrido lógico entre índice, hoja y barra.
- Fuente ampliada no debe romper la hoja ni desbordar la barra.
- Contraste por tokens en ambos temas; el texto del documento es el elemento de mayor exigencia.
- Reducir movimiento produce resultado equivalente.
- La hoja debe seguir siendo legible con daltonismo activo: ningún significado codificado sólo por color.

## Evidencia siguiente durante `apply`

1. Revalidación Figma read-only antes de escribir.
2. Auditoría del grafo por ancho de frame: cero fugas, contando aristas salientes, y comprobación de que
   cada destino es el correcto y no sólo del ancho correcto. Esta segunda comprobación se añadió al gate
   tras el defecto que #177 dejó pasar.
3. Capturas por breakpoint en ambos temas.
4. Recorrido de los nueve estados.
5. Checklist Nielsen con severidad y auditoría de accesibilidad.
6. Figma Present por breakpoint y veredicto humano explícito.
7. Revisión adversarial sin Blockers ni Majors.
8. Captura de deuda, incluso si el resultado es `clean`.

## Resultado

**PASS documental.** Autoriza `propose`. No autoriza escribir en Figma ni declarar aprobación visual.
