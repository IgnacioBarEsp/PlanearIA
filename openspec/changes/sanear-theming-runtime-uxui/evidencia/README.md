# Evidencia de QA visual: sanear el rollout de theming runtime (Ola 2a)

Nivel aplicado: **N1**. El change no altera la estructura de layout ni de navegacion: sustituye el origen del color. Anchos exigidos por N1: 375, 768, 1280. Journey obligatorio: `arranque-y-alcance-del-shell`.

## Entorno

- Fecha: 2026-07-25. Rama `feat/sanear-theming-runtime-uxui`, commit `c032453` mas la correccion del diagnostico de tamano.
- Servidor: `npm run web` (`expo start --web`) en `http://localhost:8081`.
- **Gate HTTP 200 confirmado ANTES de navegar**: `curl http://localhost:8081` devolvio `200` (registro en `02-entorno-web.txt`).
- Herramienta: **Playwright MCP**, no el panel Browser. El panel no despacha el evento `resize` del DOM al redimensionar, asi que las mediciones por breakpoint hechas ahi no son fiables.
- Clics reales sobre los controles (no eventos sinteticos). Sesion de invitado, sin datos sembrados.
- Tema de las capturas del journey: claro, que es el estado por omision de la app. El par claro/oscuro de `ClassroomHome` documenta el repintado.

## Medicion por breakpoint

Capturas del journey en los tres anchos de N1: `arranque-y-alcance-del-shell-375.png`, `-768.png`, `-1280.png`. El shell conserva su presentacion por breakpoint (barra inferior en movil, rail en tablet, barra lateral en escritorio) y ninguna pantalla migrada cambia de layout.

Medicion del repintado, anclada al subarbol de `ClassroomHome` (ancla textual "Tus clases" y ascenso al contenedor de pantalla, no al wrapper full-viewport de RN Web):

| Color medido | Tema claro | Tema oscuro | Origen |
| --- | --- | --- | --- |
| Acento primario | `rgb(22, 118, 210)` | `rgb(91, 163, 230)` | token `primary`, **repinta** |
| Texto de metrica | `rgb(18, 32, 51)` | `rgb(18, 32, 51)` | literal `#122033`, congelado |
| Etiqueta de metrica | `rgb(100, 116, 139)` | `rgb(100, 116, 139)` | literal `#64748B`, congelado |
| Fondo de tarjeta | `rgb(255, 255, 255)` | `rgb(255, 255, 255)` | literal, congelado |

Diferencia de pixeles entre el par claro y oscuro, por region, en 1280x900:

| Region | Pixeles distintos | Porcentaje |
| --- | --- | --- |
| Toda la ventana | 274,850 / 1,152,000 | 23.86% |
| Barra lateral (shell, migrado en una ola anterior) | 201,600 / 201,600 | 100.00% |
| Encabezado (shell, migrado en una ola anterior) | 59,055 / 59,136 | 99.86% |
| **Contenido propio de `ClassroomHome`** | **14,195 / 891,264** | **1.59%** |

**Lectura honesta de este cuadro.** El 23.86% global corresponde casi por completo al shell, que ya estaba migrado antes de este change: atribuirlo a esta ola seria falso. La contribucion real de la migracion de `ClassroomHome` es **1.59%**, porque solo 12 de sus 67 decisiones de color venian de `COLORS` y las otras 55 son literales que este change no toca por decision aprobada.

`ClassroomHome` es el **peor caso** del batch, no el representativo. Cobertura de tematizacion por pantalla tras la migracion:

| Pantalla | Desde tokens | Literales | Tematizado |
| --- | --- | --- | --- |
| `ClassroomHomeScreen` (GJ0) | 12 | 55 | 18% |
| `ListaGruposScreen` (GJ3) | 40 | 11 | 78% |
| `DetalleGrupoScreen` (GJ2/GJ3) | 110 | 48 | 70% |
| `CapturarCalificacionesScreen` (GJ3) | 22 | 24 | 48% |
| `PromediosCalificacionesScreen` (GJ3) | 18 | 31 | 37% |
| `CrearTareaGrupoScreen` (GJ2) | 52 | 1 | 98% |
| **Total del batch** | **254** | **170** | **60%** |

## Journeys cubiertos

- `arranque-y-alcance-del-shell` (GJ0, estado vigente): recorrido ejecutado de punta a punta en sesion de invitado. Arranque sin sesion, Escritorio, y navegacion primaria a Office, Clases, Asistente y Mas. La ruta `ClassroomHome` de este journey es una de las pantallas migradas, asi que el journey obligatorio cubre superficie real del change. Capturas en los tres anchos de N1.
- `capturar-calificaciones` (GJ3, estado parcial): **no ejecutado**. Sus cinco rutas son legacy y cuatro de ellas exigen grupos y alumnos sembrados que la sesion de invitado no tiene. Se declara como limitacion, no como cobertura.
- `crear-planeacion-y-asignarla` (GJ2, estado parcial): **no ejecutado**, por la misma razon.

## Checklist Nielsen

Severidad Nielsen maxima: 1 (cosmetica), por debajo del umbral de bloqueo 3.

- Visibilidad del estado del sistema: el pill "Guardado en este dispositivo" y el estado de sincronizacion se conservan; el switch de tema informa "Actualmente activado/desactivado".
- Correspondencia con el mundo real: sin cambios de lenguaje ni de etiquetas.
- Control y libertad: la navegacion primaria y el retorno entre hubs no cambian.
- Consistencia y estandares: severidad 1. En tema oscuro, `ClassroomHome` muestra tarjetas claras dentro de un shell oscuro, porque sus superficies dominantes son literales. No es una regresion de este change (antes tampoco repintaba, solo que el desajuste era menos visible); queda declarado y su cierre pertenece al seguimiento de `design-tokens` (#80).
- Prevencion de errores, reconocimiento, flexibilidad, estetica, recuperacion y ayuda: sin cambios respecto al baseline.

## Checklist anti-slop

Este change es saneamiento en zona **sobria** (seccion 1.9.1: pantallas de trabajo, donde manda la calma). No se agregan micro-interacciones ni motion: hacerlo seria redisenio encubierto fuera del alcance aprobado. El checklist se aplica como verificacion de no regresion.

- No parece plantilla: la identidad azul docente, el ritmo y los radios se conservan; en tema claro la presentacion es identica por construccion, porque `COLORS` y `lightTheme` son la misma referencia.
- Cero placeholders genericos: los estados vacios existentes ("Crea tu primera clase", con accion) se conservan.
- Jerarquia tipografica: sin cambios; la migracion no toca tamanos ni pesos.
- Estados disenados: carga, vacio, error y sin conexion se conservan y ahora se pintan con la preferencia activa en la parte que viene de tokens.
- Micro-interaccion significativa: se conservan las existentes (press con opacidad, header que colapsa con `useAnimatedScrollHandler`).
- Densidad por breakpoint: verificada en los tres anchos; ninguna pantalla estira una columna movil.
- Nielsen sin severidad >= 3: cumplido.

## Consola

Errores observados en el navegador durante el recorrido, todos **preexistentes y ajenos a este change**:

- Multiples `401` desde `backend-eight-chi-54.vercel.app` (`/api/grupos`, `/api/notificaciones`, `/api/mensajes`). Esperados: la sesion de invitado no tiene token. No provienen de las pantallas migradas.
- Dos avisos de hidratacion por `<button>` anidado. El stack los ubica en el **menu de cuenta** (`aria-label="Cerrar menu de cuenta"` y `"Mi perfil"`), no en ninguna pantalla del batch. Defecto preexistente, registrado como seguimiento fuera de esta ola.

Ninguna pantalla migrada emitio error ni warning propio. En Jest, la guardia de consola quedo satisfecha: cero `console.error`/`console.warn` no declarados en la suite completa.

## Hallazgos de la revision adversarial y su correccion

La revision adversarial encontro tres defectos reales en la primera version de este change. Los tres se corrigieron antes de archivar; se documentan porque explican por que la implementacion final es distinta de la inicial.

**1. Major: las pantallas se declaraban migradas sin honrar la escala tipografica.** La capability exige que una pantalla migrada refleje tema, escala de fuente y daltonismo, y las pantallas migradas en #78 usan `scaled()` (45 usos en `CuentaScreen`, 10 en `AdminRolesScreen`, 8 en `SesionesActivasScreen`). Las seis de este batch usaban cero: retirarlas del registro habria declarado conformidad falsa, y el docente que agranda la fuente no habria visto efecto. Corregido cableando `scaled()` en 118 declaraciones numericas de `fontSize` y `lineHeight` mas 36 referencias a `FONT_SIZES`, y `highContrast` en 45 sitios de borde y texto secundario, con el mismo patron de #78 (`highContrast ? borderStrong : borderLight`, `highContrast ? text : textSecondary`). En escala media el factor es 1, asi que la presentacion por defecto no cambia. La spec gana un escenario que prohibe retirar una entrada cuando la pantalla honra solo parte de las preferencias.

**2. Major: los tests no probaban lo que sus nombres afirmaban.** El caso llamado "ClassroomHomeScreen repinta sus estilos" solo afirmaba sobre una sonda que consume `useAppTheme` directamente: probaba que `ThemeContext` funciona, comportamiento anterior a este change, y habria pasado igual con la pantalla congelada en `COLORS` estatico. Corregido afirmando sobre el estilo real del boton "Crear clase" de la pantalla, con valores anclados (`lightTheme.primary` y `darkTheme.primary`) para que no pueda pasar en vacio si el lector de estilo devolviera `undefined`, y comprobando que el valor regresa al original al revertir la preferencia.

**3. Minor: parametros muertos en las fabricas.** Cinco fabricas desestructuraban `isDark`, `scaled` y `highContrast` sin usarlos, anunciando un soporte inexistente; `@typescript-eslint/no-unused-vars` esta apagado, asi que nada lo atrapaba. Resuelto por la correccion del hallazgo 1: `scaled` y `highContrast` ahora se usan de verdad, e `isDark` salio de las firmas porque ninguna pantalla del batch lo necesita.

Ademas, la propia suite de pruebas nueva violaba `react-hooks/globals` al reasignar variables de modulo durante el render, que es la misma clase de defecto que corrigio la Ola 1. Se movio la publicacion de los setters a un efecto post-commit.

## Limitaciones

- **GJ2 y GJ3 no se ejecutaron.** Cuatro de las seis pantallas migradas (`ListaGrupos`, `DetalleGrupo`, `CapturarCalificaciones`, `PromediosCalificaciones`, `CrearTareaGrupo`) no son alcanzables en sesion de invitado sin grupos y alumnos sembrados, y esos journeys estan marcados `parcial` en el manifiesto precisamente por eso. Su migracion queda verificada por typecheck, por la suite y por la sustitucion mecanica del identificador, no por captura visual. No se fabricaron capturas de rutas inalcanzables.
- **La pantalla visualmente verificada es la de peor cobertura.** `ClassroomHome` tematiza 18%, frente al 60% del batch y al 98% de `CrearTareaGrupo`. El 1.59% de delta visual medido es, por tanto, el piso y no el promedio.
- **Migrada no significa tematizada al 100%.** Las seis pantallas conservan 170 referencias a literales de color (113 valores unicos), de los cuales 56 no tienen equivalente en los tokens actuales. Su reconciliacion se propone aparte contra `design-tokens` (#80), porque resolverla aqui exigiria duplicar la paleta (token sprawl, es decir deuda nueva) o consolidar con cambio visible (redisenio).
- **Medicion DOM no obligatoria en N1** (`medicionDomObligatoria: false`); se incluyo de todas formas porque el repintado no es observable de otra manera.
- Sin verificacion en dispositivo Android fisico: el presupuesto de 60fps de la seccion 1.9.4 no se remide, ya que el change no agrega animacion ni efectos.
