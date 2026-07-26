# Los dos estados de error, vistos en el navegador

El cambio de UX central de este change es que la hoja deje de anunciar siempre el fallo de
carga. Las capturas se tomaron sobre la app real, en `AssignSheet` abierta desde Contenido.

## Como se forzo cada estado

Ninguno de los dos se puede provocar desde la interfaz: uno exige que falle la lectura de
destinos y el otro que falle la escritura. Se forzaron con un **parche temporal en
`src/hooks/useAssignSheet.ts`**, se capturo el estado, y el parche se revirtio con
`git checkout HEAD -- src/hooks/useAssignSheet.ts`.

Comprobado despues de revertir:

```
$ grep -rn "QA: fallo forzado" src/
ninguno
$ git status --short   # sin fuentes modificadas
```

Los parches nunca se commitearon. Durante el intercambio de uno por otro el bundler de Expo
se cayo (`Unable to resolve "../../hooks/useAssignSheet"`) porque leyo el archivo a medio
escribir; se relanzo `expo start --web`, se confirmo **HTTP 200** con `curl` antes de volver
a navegar, y la captura se tomo sobre el servidor nuevo.

## Fallo de carga de destinos

`estado-error-carga-1280-oscuro.png`

Estado observado en el DOM:

```json
{
  "bannerCargaPresente": true,
  "bannerEscrituraPresente": false,
  "textoCarga": "No se pudieron cargar los destinos | No se pudieron cargar los destinos de esta clase. | Reintentar"
}
```

Tono `warning`. La accion "Reintentar" vuelve a pedir los destinos, que es lo que fallo.

## Fallo de escritura

`estado-error-escritura-1280-oscuro.png`

```json
{
  "bannerCargaPresente": false,
  "bannerEscrituraPresente": true,
  "textoEscritura": "No se pudo completar la asignacion | No se pudo completar la asignacion. No se guardo ningun elemento. | Reintentar"
}
```

Tono `error`, distinto del `warning` de carga: no comparten ni titulo ni tratamiento. La
accion "Reintentar" reinvoca la asignacion.

**Los dos banners nunca coexisten en estas capturas, y esa es la prueba de que la separacion
llego al DOM**: en el codigo anterior habia un unico banner que servia a los dos fallos.

## El caso parcial

Contenido asigna un elemento a la vez, asi que desde esa superficie el fallo de escritura
siempre da "No se guardo ningun elemento". El caso interesante —parte guardada, parte
pendiente— necesita varios elementos y se verifica por prueba, con la cadena exacta:

> No se pudo completar la asignacion. Se guardo 1 elemento y queda 1 pendiente. Reintentar
> continua desde ahi.

Afirmado en `src/__tests__/components/assign/assignSheet.test.tsx` y, sobre el motor real de
sincronizacion, en `src/__tests__/sync/asignacionReintentoEncolado.test.tsx`. Ambos fallan
contra el codigo sin el cambio (ver `05-mutacion.md`).

## Capturas de geometria

| Archivo | Que muestra |
| --- | --- |
| `antes-assignsheet-1280-claro.png` | Hoja antes del cambio, 1280, claro |
| `antes-sheet-1280-claro.png` | Hoja del catalogo antes del cambio |
| `despues-assignsheet-1280-claro.png` | Despues, 1280, claro |
| `despues-assignsheet-768-claro.png` | Despues, 768, claro |
| `despues-assignsheet-375-claro.png` | Despues, 375, claro |
| `despues-assignsheet-1280-oscuro.png` | Despues, 1280, oscuro |
| `despues-assignsheet-375-oscuro.png` | Despues, 375, oscuro |
| `despues-sheet-1280-claro.png` | Hoja del catalogo despues |
| `estado-error-carga-1280-oscuro.png` | Banner de fallo de carga |
| `estado-error-escritura-1280-oscuro.png` | Banner de fallo de escritura |

Las diez tienen md5 distinto. La comparacion antes/despues de la geometria **no se hace por
imagen** sino por medicion: panel y encabezado dan exactamente los mismos numeros, y eso esta
en `02-medicion-area-tactil.md`.

## Checklist de la seccion 1.9

- **No parece plantilla.** No se introdujo layout nuevo; los dos avisos usan el `Banner` de la
  biblioteca base con sus tonos semanticos.
- **Cero placeholders genericos.** Los mensajes nombran el hecho real y, en el caso parcial,
  el conteo exacto.
- **Tipografia intencional.** Titulo y cuerpo del banner vienen de los tokens del componente;
  no se anadio ningun tamano suelto.
- **Estados disenados.** Carga, vacio, error de carga y error de escritura tienen cada uno su
  tratamiento y su salida. El de escritura es nuevo en este change.
- **Micro-interaccion.** La de la hoja (entrada con spring y su variante sin movimiento) no se
  toco; sigue respetando reduce-motion.
- **Densidad por breakpoint.** Verificada en 375/768/1280: el panel pasa a ancho completo en
  movil y se mantiene en 520 en tablet y escritorio.
- **Nielsen.** Sin hallazgos de severidad >= 3. El hallazgo de severidad 2 del change anterior
  —control de cierre de 28x28— es justo lo que este change cierra. Los controles del grupo B y
  C del inventario quedan por debajo de 44 y se registran como deuda con evidencia medida
  (`03-inventario-hitslop.md`); severidad 2, no bloqueante.
