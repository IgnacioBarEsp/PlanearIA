## Intención de la propuesta

El estándar visual existente ya advertía contra el diseño genérico, pero aún dejaba que patrones como azul SaaS, bento o glass se interpretaran como receta. Este change convierte el criterio aprobado para PlanearIA en una regla previa, encontrable y verificable antes de crear interfaces.

## Enfoque de diseño

Habrá una guía canónica anti-slop. Context Engineering, el plan UX/UI, las instrucciones universales y las skills fuente la enlazarán. La guía pide decidir tarea docente, zona, jerarquía, firma visual útil, estados y accesibilidad; los efectos solo se aceptan como excepción documentada.

## Comportamiento esperado de la spec

Un agente consulta la guía antes de diseñar en Figma, código u otra herramienta. No adopta glass, gradientes, bento, pills, cards o copy genérico por inercia. Si usa un efecto, declara propósito, contraste, fallback, reducir movimiento y rendimiento. Un frame sigue draft sin evidencia humana de aprobación.

## Plan práctico de tareas

Se crea la guía, se actualizan enlaces y el estándar UX/UI, se cambian solo fuentes `.agents/`, se regeneran espejos y se registra el preflight de Figma v2. Después se validan OpenSpec, paridad y el patch de OPSX, y se hace una revisión adversarial.

## Resumen integral del change

La nueva política protege a docentes y a futuros agentes de una estética intercambiable sin imponer una receta visual rígida. Conserva espacio para una excepción intencional, pero obliga a justificarla y degradarla con seguridad. No cambia runtime ni declara cerrados gates humanos de Figma o entrevistas.
