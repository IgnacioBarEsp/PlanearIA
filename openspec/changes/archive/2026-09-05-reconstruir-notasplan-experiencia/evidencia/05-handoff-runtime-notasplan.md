# Handoff runtime de NotasPLAN `#180`

**Fecha:** 2026-09-05
**Qué es:** el contrato que un change de runtime posterior tendría que respetar si se decide implementar
NotasPLAN. **Qué no es:** autorización. No crea issue, no crea change y no autoriza tocar `src/`.

## 1. La asimetría de esta ola

A diferencia de Office, aquí **el runtime llegó más adelantado que el prototipo**. `DocEditorScreen` ya
implementa siete secciones en ocho componentes, formato A4 y Carta con medidas reales, dos ranuras de logo,
alternancia de vistas, texto enriquecido sobre tentap con fallback web, barra de siete comandos, IA por
sección, autoguardado, deshacer y guardia de salida.

Lo que el prototipo aporta no es UI nueva sobre un vacío: es **una decisión de arquitectura** que cambia
dónde vive la verdad del documento.

## 2. El costo mayor: documento-primero

| | Runtime hoy | Aprobado en #180 |
| --- | --- | --- |
| Fuente de verdad | `PlaneacionDocumento` tipado: las secciones son campos y el texto rico vive dentro | El documento: las secciones son encabezados con nombre dentro de él |
| Vista formulario | Es la fuente de verdad | Es una proyección sobre los encabezados |
| Exportar a `.docx` | Requiere mapear campo a campo | Directo: ya es un documento |
| Editar fuera y volver | La estructura se pierde: Word no tiene dónde guardar que un párrafo es el propósito de la sesión 2 | La estructura vuelve, porque viaja dentro del archivo |

**Esto es migración de almacenamiento con datos existentes, no reescritura de UI.** Los ocho componentes de
sección se conservan: pasan de editar campos de un modelo a editar los bloques bajo un encabezado. Es el
trabajo más grande que esta ola le deja al runtime y no debe presentarse como un detalle.

Riesgo a dimensionar antes de empezar: qué pasa con las planeaciones ya guardadas en el modelo tipado, y si
la migración es reversible.

## 3. Lo que el prototipo promete y el runtime no tiene

| Promesa | Estado | Costo |
| --- | --- | --- |
| Historial con puntos de guardado con nombre | Sólo borrador automático y deshacer en memoria | Medio. Exige almacenar versiones y decidir qué pasa sin conexión |
| Enlace de sólo lectura y revocable | No existe | Alto. Exige identidad del receptor, estado de permiso por documento y revocación |
| Solicitud de permiso para editar | No existe | Alto, y ligado al anterior |
| Compartir fuera de la app | No existe | Bajo o medio, según si se usa el control nativo del sistema |
| Tres niveles de plantilla | Modo `plantilla` existe, sin niveles | Medio. Es un cambio del modelo de plantillas, no sólo de UI |
| Descarga con fidelidad de formato | `ExportarPlaneacion` existe para planeaciones | **Sin dimensionar.** Heredado de #177 y agravado aquí por el requisito del viaje de vuelta |

## 4. Decisión de privacidad que el runtime hereda

Una planeación puede nombrar alumnos. El contrato aprobado es explícito y no debe relajarse al
implementar:

- El enlace compartido es de **sólo lectura** y **revocable** por el docente.
- Editar exige **cuenta en PlanearIA** y una **solicitud de permiso** que el docente concede o rechaza.
- **No hay edición anónima**, y no hay enlace sin revocación.

Cualquier atajo aquí es una decisión de producto con implicaciones de datos de menores, no una
simplificación técnica.

## 5. Lo que la interfaz decidió no contar

El owner retiró del prototipo el aviso sobre qué elementos degradan al editar el documento fuera de la app.
Su razón: no le corresponde al docente. La spec lo recoge.

**Para quien implementa, el límite sigue existiendo:** sobreviven texto, encabezados con nombre, listas,
tablas, imágenes y formato de página; degradan SmartArt, macros, campos automáticos y objetos flotantes
complejos. El runtime debe decidir qué hace ante lo que no sobrevive —conservarlo como contenido plano,
descartarlo, o avisar en un plano de diagnóstico— pero no debe cargarle esa explicación al docente.

## 6. Contratos que el runtime debe conservar

- Ruta `DocEditor` y sus modos `crear`, `editar` y `plantilla`.
- MVVM: pantallas delgadas, hooks como ViewModels, servicios para I/O.
- `src/sync` como único motor de sincronización.
- Aislamiento por `userId`.
- Claves legacy `@planearia:*`; AsyncStorage por defecto y SQLite opt-in.
- IA sólo por `backend/lib/aiGateway.js`, a petición y con resultado revisable que no sobrescribe el
  original sin confirmación.
- Objetivo táctil de 44 pt sin depender de `hitSlop`, incluida la barra compacta.
- `useAppTheme`, `useBreakpoint` y fábrica `getStyles`; nada de `COLORS` estático.

## 7. Estados que el runtime debe poder representar

Ocho: documento nuevo, guardando y guardado, cambios sin guardar al salir, error al guardar, offline, sync
pendiente, sync en conflicto e IA no disponible. Dos condiciones heredadas de la spec:

1. **Sync pendiente y sync en conflicto no pueden verse iguales**, ni presentarse como éxito remoto.
2. **Escribir no puede depender de que la nube responda.**

## 8. Lo que este handoff no decide

- No decide si NotasPLAN se implementa ahora ni en qué orden respecto de CalcuPLAN y PresentaPLAN.
- No autoriza la migración a documento-primero: eso requiere su propio issue, gate y change.
- No cierra el issue #87.
- No sustituye las entrevistas docentes, pausadas en #47, ni el contraste con planeaciones reales, cuyo
  contenido está externalizado fuera del repositorio.
