## MODIFIED Requirements

### Requirement: El color estatico queda prohibido salvo en la lista legacy rastreada

El repositorio SHALL fallar la validacion cuando un archivo importe los colores estaticos sin estar en una lista explicita de archivos legacy autorizados. Esa lista SHALL ser el registro rastreable del rollout pendiente.

El registro SHALL estar respaldado por una verificacion ejecutable y reproducible en local y en CI, que falle cuando el registro deje de corresponder al codigo real. La verificacion SHALL comprobar tres invariantes: que toda entrada apunte a un archivo existente, que todo archivo listado siga importando los colores estaticos, y que el registro no crezca por encima de su techo declarado. La ausencia de un fallo de lint SHALL NOT considerarse evidencia de que el registro este sincronizado, porque una entrada muerta es precisamente aquella que el lint ya no puede observar.

#### Scenario: Archivo nuevo intenta usar color estatico

- **WHEN** un archivo fuera de la lista legacy importa los colores estaticos
- **THEN** la validacion del repositorio falla nombrando el archivo y el punto de consumo que debe usar

#### Scenario: Archivo legacy autorizado

- **WHEN** un archivo presente en la lista legacy importa los colores estaticos
- **THEN** la validacion pasa, porque el fallback legacy sigue siendo valido hasta su rollout

#### Scenario: Una pantalla migrada no puede reincidir

- **WHEN** una pantalla se migra y sale de la lista legacy
- **THEN** cualquier reintroduccion posterior del color estatico en ese archivo falla la validacion

#### Scenario: El pendiente del rollout es verificable

- **WHEN** alguien necesita saber cuanto falta del rollout de theming
- **THEN** la lista legacy lo responde y la verificacion ejecutable la mantiene sincronizada con el codigo real

#### Scenario: Una entrada apunta a un archivo que ya no existe

- **WHEN** un archivo listado se borra del repositorio sin retirar su entrada del registro
- **THEN** la verificacion falla nombrando la entrada huerfana

#### Scenario: Una entrada corresponde a un archivo ya migrado

- **WHEN** un archivo listado deja de importar los colores estaticos pero conserva su entrada en el registro
- **THEN** la verificacion falla nombrando la entrada muerta, porque el registro estaria declarando un pendiente que ya no existe

#### Scenario: Alguien intenta hacer crecer el registro

- **WHEN** una modificacion deja el registro con mas entradas que su techo declarado
- **THEN** la verificacion falla indicando el exceso, de modo que ampliar el pendiente solo pueda ser un acto deliberado y visible en revision

#### Scenario: El registro no se puede leer de forma reconocible

- **WHEN** la configuracion deja de exponer exactamente un bloque reconocible que autorice el color estatico legacy
- **THEN** la verificacion falla de forma explicita en vez de pasar sin comprobar nada

## ADDED Requirements

### Requirement: Toda pantalla legacy tocada sale del registro en el mismo cambio

El rollout de theming SHALL avanzar por la politica fix-on-touch: cuando un cambio migra una pantalla legacy al punto de consumo en runtime, ese mismo cambio SHALL retirar su entrada del registro. El registro SHALL encoger de forma monotona, y su tamano SHALL ser la medida vigente del trabajo pendiente.

Una pantalla SHALL considerarse migrada cuando deja de importar los colores estaticos y obtiene del punto de consumo en runtime las cuatro preferencias que la capability exige: tema, modo daltonismo, escala tipografica y refuerzo de contraste. Retirar su entrada del registro SHALL NOT admitirse mientras la pantalla honre solo una parte de ellas.

Esa condicion SHALL NOT interpretarse como que la pantalla obtiene la totalidad de sus colores de tokens: los colores fijos escritos directamente en el archivo son una condicion distinta, ajena a este registro, y SHALL declararse por pantalla en la evidencia del cambio en vez de darse por resuelta.

#### Scenario: Un cambio migra una pantalla legacy

- **WHEN** un cambio convierte una pantalla legacy al punto de consumo en runtime
- **THEN** el mismo cambio retira su entrada del registro y la verificacion queda en verde

#### Scenario: Un cambio migra una pantalla y olvida el registro

- **WHEN** un cambio deja una pantalla sin importar los colores estaticos pero conserva su entrada
- **THEN** la verificacion falla, de modo que la migracion no pueda quedar sin registrar

#### Scenario: Una pantalla migrada conserva colores fijos en el archivo

- **WHEN** una pantalla migrada conserva valores de color escritos directamente en su codigo
- **THEN** sale igualmente del registro, porque ya no importa los colores estaticos, y la evidencia del cambio declara cuantos valores fijos conserva sin afirmar que la pantalla obtiene todos sus colores de tokens

#### Scenario: Una pantalla sale del registro honrando solo el tema

- **WHEN** un cambio convierte una pantalla al punto de consumo pero deja su tipografia con tamanos fijos, sin pasar por la escala tipografica
- **THEN** la pantalla no se considera migrada y su entrada no puede retirarse, porque el docente que agranda la fuente seguiria sin ver efecto

#### Scenario: Una pantalla figura en el registro sin usar los colores estaticos

- **WHEN** una pantalla aparece en el registro pero nunca consumio realmente los colores estaticos que importaba
- **THEN** su entrada se retira junto con la importacion no utilizada, porque el registro solo describe pendientes reales
