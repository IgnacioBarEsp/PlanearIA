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

El apply creó la sección candidate, las tres variantes y los selectores. Cuatro iteraciones de corrección
siguieron: 19 hotspots que cruzaban de breakpoint contra la propia SHALL, el texto y el layout de móvil,
dieciocho controles sin reacción, las áreas de toque, tablet aguas abajo de Clases y 44 retornos que
apuntaban al Escritorio antiguo. Cambió también el método: auditar por alcanzabilidad desde cada entrada,
no por sección. El owner recorrió Present dos veces y emitió el veredicto sin hallazgos. Se promovieron los
ocho frames propios, se actualizaron matriz, plan y ground truth, y se documentó el handoff runtime.

## Resumen integral

#163 deja un Escritorio aprobado y navegable donde el docente reconoce herramientas, decide qué atender y
retoma trabajo con contexto, incluso offline, sin convertir Escritorio en dashboard genérico. Los tres
breakpoints resuelven en su propio tamaño y, donde una superficie aún no existe, el prototipo lo dice en vez
de saltar a escritorio. No se editó runtime. Quedan abiertas dos deudas de superficies responsive bajo #166
y la siguiente ola es #157-O3 Office.
