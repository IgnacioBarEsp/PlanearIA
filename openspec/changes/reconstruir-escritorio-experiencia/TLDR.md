# TLDR: reconstruir Escritorio Docente

## Intención — Proposal

Escritorio debe dejar de ser una experiencia completa sólo en desktop y una tarjeta genérica en tablet o
móvil. El change propone un prototipo Figma candidate con launcher, jornada accionable y continuidad,
creación tipo-primero, objetos propietarios y estados honestos. Runtime queda fuera y `apply` requiere
aprobación humana previa de estos artefactos.

## Enfoque — Design

Se preservarán los puentes históricos y se trabajará en una sección candidate reversible. Las tres capas
mantienen la misma arquitectura en móvil, tablet y web. Escritorio sólo proyecta referencias: Office,
Clases, Seguimiento, Mensajería y Agenda conservan ownership. IA es secundaria y confirmable; sync/offline
se comunica sin éxito ficticio. Figma Present y aprobación del owner son el gate real.

## Comportamiento — Specs

El prototipo abre en Escritorio, muestra herramientas, prioridades y continuidad, y lleva cada acción al
objeto correcto del mismo breakpoint con retorno explícito. “Nuevo archivo” ofrece cinco tipos antes de la
intención escolar. Loading, empty, error, offline, sync pendiente/conflicto e IA ausente conservan una
salida manual. Labels, foco, contraste, 44 pt y reducir movimiento son verificables.

## Plan de trabajo — Tasks

Tras aprobar este paquete, `apply` revalidará Figma, creará la sección candidate y construirá las tres
variantes con estados. Luego conectará cuatro journeys, actualizará la matriz, ejecutará QA visual,
accesibilidad y revisión adversarial, y se detendrá de nuevo para aprobación visual. Sólo después podrá
promover frames, documentar handoff runtime y cerrar el ciclo SDD.

## Resumen integral

#163 prepara una experiencia inicial que representa la suite sin copiar un dashboard genérico. El
resultado esperado es un prototipo reversible y navegable donde el docente reconoce herramientas, decide
qué atender y retoma trabajo con contexto, incluso offline. Este paquete no edita Figma ni código, no
aprueba Escritorio y no habilita runtime. La siguiente acción válida es una aprobación humana explícita de
los artefactos antes de `apply`.
