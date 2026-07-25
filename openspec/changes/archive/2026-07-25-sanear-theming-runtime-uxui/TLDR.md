# TLDR: sanear el rollout de theming runtime (Ola 2a)

## Que problema resuelve y por que ahora (Proposal)

El rollout de theming quedo a medias y su registro dejo de decir la verdad. La lista de pantallas legacy en `.eslintrc.cjs` declara 61 archivos autorizados a usar colores estaticos, pero solo 57 los usan: dos ya no existen y dos ya se migraron sin salir de la lista. La causa raiz no son las pantallas, es que nadie verifica la lista. El comentario afirma que CI la revisa en cada PR, y en todo el repositorio no hay ni una sola comprobacion. Por eso el drift crecio en silencio. Este change cierra `debt-b279f64f815b` del plan UX/UI.

## Como se va a construir (Design)

La guardia vive en un script propio y no en la regla de lint, porque una entrada muerta es justo la que el lint ya no puede ver: su silencio parece exito. El script lee la lista desde `.eslintrc.cjs`, sin copiarla, y comprueba tres cosas: que cada archivo exista, que siga importando colores estaticos y que la lista no crezca. Cada pantalla migrada pasa a `useAppTheme()` con una fabrica de estilos memoizada. Se usa `useAppTheme` y no `useTheme` porque solo el primero aplica el filtro de daltonismo.

## Que comportamiento queda garantizado (Spec)

El registro pasa a estar respaldado por una verificacion ejecutable que falla ante una entrada huerfana, una entrada muerta o una lista que crece, y falla explicitamente si no logra leer el registro. Se agrega la politica fix-on-touch: toda pantalla que un cambio toque sale de la lista en ese mismo cambio, y la lista solo puede encoger. La spec define ademas que "migrada" significa que la pantalla ya no importa colores estaticos, no que obtenga todos sus colores de tokens; el residuo se declara en vez de darse por resuelto.

## Plan de trabajo (Tasks)

Primero la guardia y el saneamiento del registro, para que toda migracion posterior nazca protegida. Luego se retira la importacion no utilizada de ContenidoScreen. Despues se migran seis pantallas, una por tarea, retirando su entrada y bajando el techo en el mismo paso; la mas grande va aislada. Siguen las pruebas de repintado en runtime y de daltonismo, y por ultimo la evidencia: capturas por breakpoint en tema claro y oscuro, checklist Nielsen, React Doctor, revision adversarial y assessment de deuda.

## Resumen integral del change

La lista pasa de 61 entradas declaradas a 50 reales y gana la verificacion que su propia spec ya exigia pero nadie habia escrito. Seis pantallas de trabajo dejan de congelar el tema y repintan de verdad al cambiarlo. ContenidoScreen sale del registro porque importaba colores sin usarlos; su paleta propia, que no cabe en los tokens actuales, queda registrada con excepcion en vez de perderse. Los colores fijos que sobreviven en las pantallas migradas se documentan con numeros y se proponen aparte. En tema claro nada cambia de aspecto, porque los colores estaticos y el tema claro son el mismo valor.
