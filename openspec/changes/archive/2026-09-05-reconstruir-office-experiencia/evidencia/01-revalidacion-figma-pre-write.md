# Revalidación Figma previa a escribir

**Fecha:** 2026-09-04
**Issue:** [#177](https://github.com/IgnacioBarEsp/PlanearIA/issues/177)
**Change:** `reconstruir-office-experiencia`
**Método:** `get_metadata` read-only sobre `VBK5tK7EQS83tdTmtuBpI9`. Ninguna escritura.

## 1. Los tres nodos heredados de Office siguen como los describió el inventario

| Nodo | Nombre | Tamaño | Confirmado |
| --- | --- | ---: | --- |
| `257:951` | `D-2 · Office Docente · desktop · candidate` | 1440x960 | Sí |
| `277:958` | `T-G · Office Docente · tablet · desktop-fallback · candidate` | **1440x960** | Sí |
| `274:958` | `M-G · Office Docente · móvil · bridge · candidate` | 390x844 | Sí |

`277:958` se verificó elemento por elemento contra `257:951`: mismo rail de 264 px con nueve destinos,
misma área de archivos de 1176 px, mismos nombres de capa, mismo bloque `Inicio por intención docente` con
las mismas cuatro sugerencias. Es un clon, no una adaptación.

`274:958` conserva header de 76 px, un único `Panel · prioridad · móvil` con una sola acción
(`Acción · abrir prioridad · móvil`), línea de estado y barra compacta de cinco hubs. Sin launcher, sin
biblioteca, sin filtros y sin creación.

## 2. Los activos aprobados que este change va a clonar siguen disponibles

### Estados de límite de #163

| Nodo | Nombre actual | Tamaño |
| --- | --- | ---: |
| `345:968` | `Escritorio · superficie pendiente · móvil · approved · #163` | 390x844 |
| `345:1006` | `Escritorio · superficie pendiente · tablet · approved · #163` | 768x1024 |

Ambos fueron promovidos a `approved` en el cierre de #163. Estructura: back target, eyebrow, título, intro,
regla de cabecera, label y dos filas de acción —`Volver a la pantalla anterior` e `Ir al Escritorio`— más
una línea de estado de borrador. Las filas miden 342x78 en móvil y 688x86 en tablet, ambas por encima de
44 pt.

### Selector tipo-primero de Escritorio

`310:3` `Nuevo archivo · selector · escritorio · approved · #163`, 1440x1360.

**Hallazgo relevante para el diseño de Office.** El selector aprobado ya resuelve la relación entre crear en
blanco y las sugerencias, y lo hace en el orden que la entrevista de Office confirmó. Cada tipo es una
tarjeta de 396x388 con:

1. Chip de formato de 72x42 (`DOCX`, `XLSX`, `PPTX`).
2. Tipo y subtipo.
3. Botón `En blanco` de 348x52 como acción primaria.
4. Label `Sugerencias` y tres líneas de ejemplo debajo.

Es decir: **en blanco primero, sugerencias después**, dentro de la misma tarjeta. La zona de creación de
Office puede clonar estas tarjetas y sustituir las tres líneas de ejemplo por las familias de plantillas
acordadas, heredando tokens, tipografía y jerarquía ya aprobadas en vez de inventar una composición nueva.

El selector contiene además `Chip · intención escolar · descartable` (`313:2`), que materializa D3: la
intención escolar aparece después del tipo. Office no lo duplica; su equivalente es el catálogo de
plantillas dentro de cada tarjeta.

Las tarjetas `Crear Diseño de materiales · selector candidate` (`310:47`) y
`Preguntar a la IA · selector candidate` (`310:58`) existen en el selector global y **no** se replican en
Office, que sólo crea sus tres tipos.

## 3. Punto de restauración y alcance

- **Punto de restauración:** los nodos `257:951`, `277:958` y `274:958` quedan intactos. La reconstrucción
  vive en una sección candidate nueva, recuperable por historial de Figma.
- **Alcance de escritura:** únicamente la sección candidate nueva de Office en la página `60:2`.
- **Fuera de alcance de escritura:** la sección `307:965` de Escritorio y sus frames `approved`, la sección
  de Clases `177:115`, el draft raíz de #156 y los puentes globales de otros módulos.
- **Verificación posterior obligatoria:** que `310:3`, `310:69` y `310:106` sigan intactos y alcanzables
  tras introducir la creación desplegada de Office (tarea 5.4).
