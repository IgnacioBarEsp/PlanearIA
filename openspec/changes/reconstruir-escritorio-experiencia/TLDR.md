# TLDR: reconstruir Escritorio Docente

## Intención — Proposal

Escritorio dejó de reducirse a una tarjeta en tablet y móvil: el apply produjo un candidate Figma reversible
con launcher, jornada accionable, continuidad y creación tipo-primero. Runtime queda fuera; los frames aún
son candidate y requieren Figma Present y aprobación visual humana.

## Enfoque — Design

Se preservaron los puentes históricos y se creó la sección `307:965` con frames `307:966`, `307:1046`,
`307:1078`, selectors `310:3`, `310:69`, `310:106` y los estados de límite `345:968` y `345:1006`. Las tres
capas mantienen la arquitectura responsive; Office, Clases, Seguimiento, Mensajería y Agenda conservan
ownership. IA es secundaria y confirmable; sync/offline se comunica sin éxito ficticio. Figma Present y
aprobación del owner siguen siendo el gate real.

## Comportamiento — Specs

El candidate abre en Escritorio, muestra herramientas, prioridades y continuidad, y ofrece cinco tipos
antes de la intención escolar. Loading, empty, error, offline, sync pendiente/conflicto e IA ausente tienen
matriz contractual con salida manual. Labels y superficies de control están revisados estáticamente; foco,
contraste, fuente ampliada y reducir movimiento aún requieren Present.

## Plan de trabajo — Tasks

El apply revalidó Figma, creó la sección candidate, construyó las tres variantes y selectors, conectó los
entry actions y ejecutó validación estricta, harness parity, runtime HTTP read-only y revisión adversarial.
Una auditoría posterior halló 19 hotspots que cruzaban de breakpoint contra la propia SHALL del change; se
corrigieron con estados honestos y la sección quedó en cero fugas. Quedan Present, matriz maestra,
promoción, handoff y archive detenidos por la aprobación visual humana.

## Resumen integral

#163 deja un candidate reversible y navegable donde el docente reconoce herramientas, decide qué atender y
retoma trabajo con contexto, incluso offline, sin convertir Escritorio en dashboard genérico. No se editó
runtime ni se promovieron frames. La siguiente acción válida es recorrer Figma Present y emitir aprobación o
hallazgos humanos antes de actualizar la matriz, promover o archivar.
