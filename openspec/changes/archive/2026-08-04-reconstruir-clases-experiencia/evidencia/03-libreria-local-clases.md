# Librería local de Clases

Fecha: 2026-08-03  
Archivo Figma: `VBK5tK7EQS83tdTmtuBpI9`  
Sección candidate: `177:115`

## Componentes creados

- Librería editable `01 · Componentes locales Clases`: `181:115`.
- Tabs internos, set Default/Actual: `181:123`; variantes `181:119`, `181:121`.
- Banners de estado, set Info/Offline/Error/Success/Empty: `181:135`; variantes `181:125`, `181:127`, `181:129`, `181:131`, `181:133`.
- Señal accionable: `181:136`.
- Tarjeta de clase: `181:140`.
- Objeto de trabajo: `181:145`.
- Persona: `181:150`.

## Contrato aplicado

- Tipografía: IBM Plex Sans mediante estilos locales PlanearIA.
- Color, bordes y radios: variables locales PlanearIA cuando existe el token.
- Propiedades de texto editables en los componentes de contenido.
- Estados con texto visible y diferenciación estructural, no solo por color.
- Controles internos de navegación con altura mínima de 44 pt.
- Datos exclusivamente sintéticos y anotados como tales.
- Sin marca, assets ni copia literal de Google Classroom.
- Sin blur, glass, halos, gradientes, sombras decorativas ni movimiento necesario.

## Verificación

La librería fue inspeccionada con `get_design_context` y screenshot a tamaño natural. Se corrigió un recorte de contenedor aumentando el frame a `2400 × 1200` y desactivando el clip. La verificación final reportó cero nodos de texto fuera de IBM Plex Sans y mostró todos los componentes sin solapamiento ni corte.
