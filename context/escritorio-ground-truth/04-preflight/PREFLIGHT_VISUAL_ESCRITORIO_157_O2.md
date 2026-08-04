# Preflight visual — Escritorio `#157-O2`

> **Estado:** PASS documental para `propose`; pendiente de gate humano para `apply`.
> **Fecha:** 2026-08-04.

## Tarea docente

Abrir una herramienta, decidir qué atender y retomar trabajo propio desde el punto inicial de la suite.

## Zona de intensidad

**Media.** La jornada debe permitir escaneo rápido y acción inmediata sin densidad de editor ni vacío de
landing. El objeto y el verbo dominan; el sistema visual acompaña.

## Jerarquía

1. Orientación: saludo/contexto temporal y estado sync, sin hero.
2. Launcher: herramientas reconocibles.
3. Requiere atención: objetos priorizados por acción/tiempo.
4. Continuidad: borradores y trabajo reciente propio.
5. Sugerencia IA opcional: secundaria y descartable.

## Estructura responsive

- Desktop: sidebar + contenido principal de prioridades + continuidad auxiliar; dock completo.
- Tablet: rail + la misma jerarquía con densidad reducida; no una tarjeta única.
- Móvil: cinco hubs + launcher compacto + prioridades + continuidad en flujo vertical; no salto a desktop.

## Firma útil

**Línea del día:** filas de objeto real que combinan owner, contexto, motivo, estado y próxima acción. Es
reconocible por su utilidad, no por ornamento.

## Patrón genérico refutado

Se rechaza “dashboard SaaS” con hero, saludo gigante, cuatro KPIs, bento de cards y CTA genérico. También se
rechaza un catálogo de apps sin jornada o una lista reciente sin intención docente.

## Tokens y componentes

- Reutilizar biblioteca/tokens Figma vigentes; no inventar paleta.
- Tipografía, espacio, divisores y alineación resuelven jerarquía antes que contenedores.
- Dock tiles sólo se justifican como launcher por reconocimiento; listas accionables no se convierten en
  cards individuales.
- Pills/chips sólo para tipo, estado o intención descartable.
- Sin glass, blur, halos, gradientes, sombras decorativas ni iconos ambiguos sin label.

## Estados negativos

Loading, empty nuevo/con historial, error parcial, offline, sync pendiente/conflicto, datos insuficientes e
IA no configurada. Cada estado conserva una salida manual y separa guardado local de confirmación remota.

## Accesibilidad

- Objetivos táctiles PlanearIA de al menos 44 pt.
- Nombre accesible y label visible en herramientas/acciones críticas.
- Orden de foco: contexto → launcher → prioridades → continuidad → auxiliar.
- Foco visible y recuperable; overlays devuelven foco al disparador.
- Contraste por tokens; color, posición o movimiento no son la única señal.
- Fuente ampliada no oculta verbos ni estados; reflow sin scroll horizontal bloqueante.
- Reducir movimiento conserva destino, confirmación y retorno.

## Evidencia siguiente durante `apply`

1. Revalidación Figma antes de escribir y registro de nodos históricos.
2. Sección `Escritorio 0.1 candidate` con componentes y rollback.
3. Frames con datos y vacío en desktop/tablet/móvil; matriz proporcional de estados.
4. Journeys E-01 iniciar/atender, E-02 crear tipo-primero, E-03 continuar/volver y E-04 offline/sync.
5. Auditoría Anti-Slop, Nielsen y accesibilidad sin severidad 3–4.
6. Figma Present manual y pausa hasta aprobación explícita en #163.

## Resultado

No hay bloqueo documental para crear los artefactos OpenSpec. El preflight no aprueba la composición ni
autoriza escribir Figma: el `apply` sigue bloqueado hasta orden humana explícita sobre proposal, design,
specs y tasks.
