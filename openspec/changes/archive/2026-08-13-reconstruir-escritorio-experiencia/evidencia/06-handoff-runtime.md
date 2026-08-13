# Handoff Figma a runtime — Escritorio Docente

**Fecha:** 2026-08-13
**Origen:** frames `approved` de la seccion `307:965` tras el gate visual de
[#163](https://github.com/IgnacioBarEsp/PlanearIA/issues/163#issuecomment-5286904053).
**Naturaleza:** documento de traspaso. **No autoriza crear issue ni change de runtime.** La implementacion
requiere una autorizacion posterior explicita del owner.

## Superficies aprobadas y su equivalente runtime

| Figma | Breakpoint | Pantalla runtime de referencia | Estado actual del codigo |
| --- | --- | --- | --- |
| `307:966` | web `>=1280` | `EscritorioPlaceholderScreen` bajo `InicioStack` | Placeholder honesto; no implementa launcher, jornada ni continuidad |
| `307:1046` | tablet `768-1279` | La misma; `AppShell` decide rail o sidebar | Igual |
| `307:1078` | movil `<768` | La misma; `AppShell` decide barra de cinco hubs | Igual |
| `310:3`, `310:69`, `310:106` | los tres | No existe selector tipo-primero en runtime | Por construir |
| `345:968`, `345:1006` | movil y tablet | No aplica: son un limite del prototipo | No se implementan como pantalla |

`345:968` y `345:1006` **no se portan a runtime**. Existen porque el prototipo no tiene editores en 390 y
768 px. En runtime la respuesta equivalente no es una pantalla de disculpa: es que la superficie del modulo
exista en su breakpoint, o que el control no se ofrezca. Un change runtime que reproduzca literalmente
estos frames estaria copiando una limitacion de prototipo.

## Roles semanticos, no valores hex

Conforme a la spec `figma-prototype-navigation`, el handoff nombra roles y familias candidatas de
`ColorTokens`, no literales. El drift documentado de `#161` sigue vigente: el prototipo usa un primario
terracota y el runtime un primario azul. **La decision de token pertenece al change runtime**, que puede
elegir una familia existente o versionar una nueva con contraste, compatibilidad y rollback.

| Rol perceptual en el prototipo | Familia candidata en `ColorTokens` | Nota |
| --- | --- | --- |
| Canvas de jornada | `background` | Fondo calido claro; verificar en oscuro |
| Superficie de tarjeta y panel | `surface` / `card` | Prioridad y continuidad usan superficie elevada sin sombra decorativa |
| Texto primario y secundario | `text` / `textSecondary` | Jerarquia resuelta por tipografia y espacio, no por color |
| Borde y regla | `border` | Reglas de 1 px separan zonas; no usar sombra en su lugar |
| Accion primaria | `primary` / `onPrimary` | Drift declarado terracota vs azul; decide el change runtime |
| Estado activo de navegacion | `selection` | El modulo activo se resalta y no navega a si mismo |
| Estado local y offline | `textSecondary` mas texto explicito | Nunca solo color |

Toda superficie implementada valida en claro, oscuro, alto contraste y daltonismo mediante `useAppTheme`,
que compone `ThemeContext`, `FontSizeContext`, `DaltonismoContext` y `AccessibilityPreferencesContext`. La
simulacion de daltonismo pertenece al runtime; el prototipo solo garantiza señales no dependientes del
color.

## Contratos que el runtime debe respetar

- **Arquitectura MVVM.** Pantalla delgada; un hook como ViewModel concentra jornada, continuidad y estado de
  sincronizacion. Nada de logica de dominio en la vista.
- **Un solo shell adaptativo.** `AppShell` ya resuelve rail, sidebar y barra inferior. No crear archivos
  `.web.tsx` o `.native.tsx` para Escritorio sin justificacion escrita.
- **Breakpoints reactivos.** Consumir `useBreakpoint`; no leer `useWindowDimensions` directo. El contrato
  visual usa movil `<768`, tablet `768-1279` y web `>=1280`.
- **Areas de toque.** Todo control interactivo con caja real de 44 pt o mas. `hitSlop` no funciona en React
  Native Web: usar padding o `minWidth`/`minHeight`. Precedente en `debt-31dcd5bbaa77`.
- **Sincronizacion.** El estado visible se deriva del contrato de `sync-status-presentation` y de
  `SyncStatusChip`. No inventar una fuente paralela ni afirmar exito remoto.
- **Datos por `userId`.** Toda entidad academica que alimente jornada o continuidad se filtra por `userId`.
- **IA.** Solo por `backend/lib/aiGateway.js`. La sugerencia es secundaria, descartable y confirmable; nunca
  sobrescribe un original sin confirmacion.
- **Offline primero.** El trabajo del dia se conserva local. Ningun estado declara envio, guardado remoto o
  sincronizacion que no ocurrio.
- **Compatibilidad legacy.** No borrar claves `@planearia:*` sin migracion validada y rollback. SQLite sigue
  opt-in.

## Proyecciones cross-context

| Origen | Objeto | Destino | Regla |
| --- | --- | --- | --- |
| Jornada | Planeacion, rubrica, documento | Office / contenido | Abre el objeto exacto y conserva retorno a Escritorio |
| Jornada | Asistencia, calificaciones | Clases / Seguimiento | El owner es Clases, no Office |
| Continuidad | Material visual | Diseno de materiales | Sin duplicar el owner |
| Continuidad | Mensaje a familias | Mensajeria | El objeto compartido conserva su owner |
| Creacion | Documento, hoja, presentacion, diseno, IA | Modulo correspondiente | Tipo primero; la intencion escolar es un chip descartable posterior |

## Lo que este handoff NO autoriza

- No autoriza crear el issue ni el change de runtime: hace falta autorizacion explicita del owner.
- No aprueba los modulos puente. Office, Asistente, Reportes, Diseno, Mensajeria, Agenda y Cuenta siguen
  `candidate` y pertenecen a `#157-O3` en adelante.
- No cierra `#46` ni las entrevistas IHC de `#47`.
- No declara paridad responsive de editores ni objetos: fuera de Clases no existe superficie de 768 px y no
  existe ningun objeto en 390 px.
