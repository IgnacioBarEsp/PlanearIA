# Preflight visual — Office Docente `#157-O3`

> **Estado:** PASS documental para `propose`; pendiente de gate humano para `apply`.
> **Fecha:** 2026-09-04.
> **Fuente obligatoria:** `Documentacion/05-context-engineering/DISENO_ANTI_SLOP.md`, plan UX/UI #101,
> `BASELINE_OFFICE_PLANEARIA_157_O3.md` e inventario del 2026-09-04.

## Tarea docente

Hacer un material nuevo para la clase, y volver por el que ya se hizo para reutilizarlo, mandarlo a un
grupo o entregarlo en el formato que la escuela pide.

## Zona de intensidad

**Media-baja.** Office es superficie de trabajo recurrente, no de bienvenida. Crear tiene que ser
inmediato y la biblioteca legible en escaneo; nada compite con esas dos cosas. El editor —la zona densa
de verdad— no vive en esta ola.

## Jerarquía

1. Crear: los tres tipos desplegados, con sus plantillas como atajo opcional.
2. Importar: acción persistente junto a crear, no escondida en el estado vacío.
3. Biblioteca: recientes primero, agrupación por tipo mediante filtros.
4. Acciones por archivo: cinco, disponibles sin abrir el objeto.
5. Estado: sync y trabajo local, sin ocupar jerarquía principal.

No hay hero, no hay saludo grande, no hay contador de archivos como métrica decorativa.

## Estructura responsive

- **Escritorio 1440:** sidebar global + zona de creación en fila con plantillas visibles + biblioteca con
  filtros + acciones visibles en la fila del archivo.
- **Tablet 768:** rail + misma jerarquía con densidad reducida. Las plantillas siguen accesibles sin
  ocultar el tipo; las acciones se agrupan tras un control con label visible, nunca tras un icono mudo.
- **Móvil 390:** cinco hubs + tres tipos compactos visibles sin scroll + lista de recientes + hoja de
  acciones desde la fila. **No es una tarjeta única** y no salta a escritorio.

## Firma útil

**La fila de archivo conectado.** Cada archivo declara tipo, nombre, grupo, último uso y dónde se está
usando, y ofrece sus cinco acciones sin abrirlo. Es reconocible por lo que resuelve —el archivo sabe a qué
clase pertenece y sale en su formato real— y no por ornamento. Es lo que un Office suelto o un Drive no
pueden dar.

## Patrón genérico refutado

Se rechaza el **gestor de archivos genérico**: lista plana de nombres con icono de tipo, menú de tres
puntos mudo y una barra de búsqueda como única affordance. Resuelve almacenar, no enseñar, y borra el
contexto docente que es la razón de existir del módulo.

Se rechaza también el **mosaico de plantillas como portada**: hace intención-primero, contradice D3 y
convierte una decisión de tipo en una compra de catálogo.

Se refuta específicamente el bloque `Inicio por intención docente` que hoy existe en `257:951`: ofrece
Planeación, Material de lectura, Rúbrica y Bibliografía **antes** del tipo, al fondo de la página. Su
función legítima —dar atajos docentes— la cubre el catálogo de plantillas, colocado después del tipo.

## Tokens y componentes

- Tokens de `src/themes/` para color, espaciado, radios, tipografía y elevación. Cero hex nuevo.
- Se reutilizan las variables y estilos ya ligados en la sección aprobada de Escritorio `307:965`,
  clonando frames existentes para heredarlos en vez de introducir estilo nuevo.
- La hoja Asignar reutiliza el componente ya aprobado en el change `assign-sheet`.
- Estado de límite: se clona el patrón `345:968` / `345:1006` de #163, no se inventa otro.

Sin glass, sin blur, sin gradientes, sin halos, sin bento, sin sombras decorativas y sin animación
ornamental. Ninguna excepción del catálogo anti-slop se invoca en esta ola.

## Estados negativos

Vacío, cargando, error, offline, sync pendiente, sync en conflicto y editor no disponible en este tamaño.
Los siete tienen salida o recuperación honesta y están declarados en el baseline §4. Ninguno simula
guardado, envío, red, IA o descarga real. Los datos de ejemplo van rotulados.

## Accesibilidad

- Objetivo táctil mínimo de 44 pt **sin depender de hitSlop**: hay una excepción de deuda vigente por 25
  controles que sí dependen de él en web, y esta ola no la amplía.
- Labels visibles y textuales en toda acción; ningún icono mudo como único portador de significado,
  especialmente en las cinco acciones por archivo.
- Foco visible, orden lógico de recorrido y contraste por tokens en ambos temas.
- Fuente ampliada y alto contraste no rompen la fila de archivo ni la zona de creación.
- Reducir movimiento produce un resultado equivalente.

## Evidencia siguiente durante `apply`

1. Revalidación Figma read-only antes de escribir.
2. Auditoría del grafo por ancho de frame: cero fugas de breakpoint, contando aristas salientes.
3. Capturas por breakpoint en ambos temas, demostrablemente distintas.
4. Recorrido de los siete estados negativos.
5. Checklist Nielsen con severidad y auditoría de accesibilidad.
6. Figma Present por breakpoint y veredicto humano explícito del owner.
7. Revisión adversarial sin Blockers ni Majors.
8. Captura de deuda con `debt:capture`, incluso si el resultado es `clean`.

## Resultado

**PASS documental.** El preflight autoriza `propose`. No autoriza escribir en Figma: eso lo habilita el
gate de la propia ola, y la aprobación visual sigue siendo humana.
