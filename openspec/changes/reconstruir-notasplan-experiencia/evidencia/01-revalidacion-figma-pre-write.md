# Revalidación Figma previa a escribir — NotasPLAN

**Fecha:** 2026-09-05
**Issue:** [#180](https://github.com/IgnacioBarEsp/PlanearIA/issues/180)
**Método:** `use_figma` read-only sobre `VBK5tK7EQS83tdTmtuBpI9`. Ninguna escritura.

## 1. Los cuatro frames heredados siguen como los describió el inventario

| Nodo | Nombre | Tamaño | Clasificación |
| --- | --- | ---: | --- |
| `62:3` | `Documento · planeación · escritorio · draft` | 1440x960 | escritorio |
| `66:40` | `Documento nuevo · plantillas · escritorio · draft` | 1440x960 | escritorio |
| `151:77` | `Documento nuevo · plantillas · desde Escritorio · draft` | 1440x960 | escritorio |
| `151:123` | `Documento · planeación · desde Escritorio · draft` | 1440x960 | escritorio |

## 2. Confirmado: no existe editor en 768 ni en 390

El barrido por ancho de frame sobre toda la página devuelve tres superficies en esos anchos cuyo nombre
menciona documento, y **ninguna es un editor**:

| Nodo | Nombre | Qué es |
| --- | --- | --- |
| `477:974` | `Office · plantillas · documento · móvil · approved · #177` | Hoja de plantillas de Office |
| `495:1254` | `Office · biblioteca filtrada · documentos · tablet · approved · #177` | Vista de biblioteca |
| `495:1468` | `Office · biblioteca filtrada · documentos · móvil · approved · #177` | Vista de biblioteca |

Tablet y móvil son reconstrucción total: no hay nada que conservar.

## 3. Patrones aprobados disponibles para clonar

| Nodo | Nombre | Tamaño | Uso previsto |
| --- | --- | ---: | --- |
| `345:968` | Estado de límite móvil, approved #163 | 390x844 | Familias de documento que aún no existen |
| `345:1006` | Estado de límite tablet, approved #163 | 768x1024 | Idem |
| `467:968` | Estado de límite escritorio, approved #177 | 1440x960 | Idem |
| `471:968` / `471:986` / `471:1004` | Hoja Asignar de Office, approved #177 | 720x660 / 520x660 / 358x650 | Acción de asignar desde el editor |
| `461:969` | Office Docente escritorio, approved #177 | 1440x1240 | Donante de tokens y de shell |

## 4. Qué del draft `62:3` se conserva y qué se retira

| Parte | Nodo | Decisión |
| --- | --- | --- |
| Documento cabecera | `62:4` | Se conserva la idea: volver a Office, título, estado de guardado |
| Tabs ribbon | `62:11` | **Se retira.** Cinta de seis pestañas refutada en el preflight |
| Comandos ribbon | `62:21` | **Se retira.** Quince comandos sustituidos por barra compacta de siete |
| Índice del documento | `62:51` | Se conserva la idea, con las **siete** secciones del runtime en vez de las seis del draft |
| Hoja de documento | `62:66` | Se conserva y pasa a ser la superficie principal, con formato de página declarado |
| Panel de contexto | `62:79` | Se conserva: destino y asignar |
| Panel de revisión IA | `62:88` | Se conserva: es el patrón de propuesta revisable que la entrevista confirmó |

## 5. Punto de restauración y alcance

- **Punto de restauración:** los cuatro nodos heredados quedan intactos. La reconstrucción vive en una
  sección candidate nueva, recuperable por historial de Figma.
- **Posición:** la página termina en x=50700, tras la sección de Office. La sección de NotasPLAN se coloca
  en x=51600, con holgura.
- **Fuera de alcance de escritura:** la sección de Office `461:968`, la de Escritorio `307:965`, la de
  Clases `177:115` y el draft raíz de #156.
- **Verificación posterior obligatoria:** que las superficies aprobadas de Office sigan intactas y que la
  entrada desde Office al editor siga resolviendo en su propio ancho.
