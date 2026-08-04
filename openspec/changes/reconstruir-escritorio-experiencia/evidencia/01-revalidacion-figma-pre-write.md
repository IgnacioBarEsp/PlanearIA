# Revalidación Figma pre-write — Escritorio Docente

Fecha: 2026-08-04
Change: `reconstruir-escritorio-experiencia`
Issue: #163

## Aprobación y alcance

- La aprobación humana del plan de Escritorio está registrada en el hilo de trabajo del issue #163.
- El cambio de saneamiento previo no se reutiliza como change activo: su salida vive en `openspec/changes/archive/2026-08-04-sanear-residuales-post-clases-uxui/` y en el commit `43d5659`.
- Este apply se limita a producir el candidato Figma de Escritorio; no promueve frames ni archiva el change antes del gate visual humano.

## Nodos revalidados en el archivo `VBK5tK7EQS83tdTmtuBpI9`

Página `09 Prototype · Office files` (`60:2`):

| Superficie | Nodo | Estado observado |
|---|---:|---|
| Desktop | `87:47` | Baseline editorial existente; tiene rail global, dock de seis herramientas, `LO INMEDIATO`, continuidad y estado local/offline. |
| Tablet | `162:115` | Draft con rail y una tarjeta prioritaria; carece de dock y continuidad equivalentes. |
| Mobile | `164:115` | Draft con una tarjeta prioritaria y CTA genérico a Office; carece de launcher/continuidad. |
| Puente Clases desktop | `198:695` | Approved bridge existente; no se modifica. |
| Puente Clases tablet | `198:776` | Approved bridge existente; no se modifica. |
| Puente Clases mobile | `198:809` | Approved bridge existente; no se modifica. |

## Contratos descubiertos

- El producto no fija `fontFamily` en `src/themes/typography.ts`; el candidato conserva las fuentes tipográficas del archivo Figma existente y no inventa una fuente de marca.
- El frame desktop ya usa el sistema local de variables (`bg/*`, `text/*`, `space/*`, `radius/*`) y un componente `Button` publicado; los clones preservarán esas instancias y bindings.
- No hay imágenes en las superficies revalidadas; no aplica captura raster de `generate_figma_design`.

## Riesgo conocido

Los drafts tablet/mobile son material de partida, no ground truth de destino. Si su estructura sigue pareciendo una copia genérica del Escritorio al concluir el candidato, el gate visual debe rechazarse y abrir una iteración específica antes de promover.
