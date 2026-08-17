## Context

`scripts/testProjectEngineeringOsConsumer.mjs` fija `EXPECTED_VERSION = "0.1.4"` y compara cuatro fuentes:
el `devDependencies` de `package.json`, la entrada del lockfile, la `version` del paquete instalado y la
salida de `project-os --version`. El contrato de consumidor ya es fuerte en **número de versión**, y por eso
el drift de versión no ocurre.

El hueco está en otra dimensión: ninguna de esas comprobaciones mira `repository`, `homepage`, `bugs` ni
`author` del paquete instalado. La release `0.1.4` declara los cuatro con `RitualBoat`, y como el número
coincide en las cuatro fuentes, todos los checks pasan en verde. El renombrado de handle atravesó el
repositorio entero sin que nada señalara que la dependencia fijada seguía apuntando a un owner inexistente.

El upstream ya publicó `0.1.5` con la identidad corregida, así que la parte de datos está resuelta. Lo que
queda es la subida deliberada y la verificación que impide que esto vuelva a pasar callado.

## Goals / Non-Goals

**Goals:**

- Dejar el pin en una release cuya identidad declarada corresponda al owner vigente.
- Convertir la identidad del upstream en algo verificado por herramienta, no por memoria.
- Tratar cualquier cambio de comportamiento de `0.1.5` en gates, harness o deuda como bloqueante del propio
  change, no como daño colateral aceptable.

**Non-Goals:**

- No abrir el pin exacto a un rango ni a `latest`: el contrato vigente lo prohíbe explícitamente.
- No saltar a `0.1.6`, que existe en el repositorio pero no está publicada en npm.
- No modificar el upstream: ya está correcto.
- No cambiar configuración del motor de deuda ni de los gates aprovechando la subida.
- No verificar identidad por red. La comprobación es local, sobre el paquete instalado.

## Decisions

**1. La verificación de identidad vive en el test de contrato, no en el doctor.**
El doctor clasifica salud operativa y corre a menudo; el contrato de consumidor es el lugar donde ya se
afirma "esta es exactamente la release que administra mis archivos". La identidad es parte de esa
afirmación. Además el test ya lee `publicPackage`, así que la aserción se suma a tres líneas de distancia de
las que existen.

**2. El owner esperado se deriva, no se escribe a mano en dos sitios.**
Escribir `IgnacioBarEsp` como literal en el script crearía la misma clase de deuda que este change corrige:
un dato de identidad duplicado que un renombrado futuro dejaría stale. El valor esperado se toma de una
única fuente ya presente en el repositorio y se compara contra los campos del paquete instalado.

**3. La comprobación es sobre el paquete instalado, no sobre el registro npm.**
Consultar npm en cada corrida haría el test dependiente de red y lo volvería inestable en CI. Lo que importa
es lo que está fijado en el árbol, que es local y determinista.

**4. Fallo duro, no aviso.**
Un aviso reproduce el problema original: algo que nadie lee mientras el verde sigue verde. Si la identidad
declarada no corresponde al owner vigente, el contrato falla.

**5. La subida se verifica antes de fijarse.**
El orden es instalar, correr `constructor:check`, `test:project-os-contract` y `debt:check`, y sólo entonces
consolidar. Si algo cambia de comportamiento, el resultado válido del change es documentar la limitación y
quedarse en `0.1.4`, no forzar el número.

## Risks / Trade-offs

| Riesgo | Trade-off asumido |
| --- | --- |
| `0.1.5` altera gates, harness o motor de deuda | Se acepta que el change pueda cerrar sin subir la versión, documentando por qué. Un pin viejo con identidad stale es peor que un cierre honesto, pero mucho mejor que un cierre que rompe el motor de deuda |
| La aserción de identidad puede fallar en un fork legítimo | Se acepta: un fork que quiera otro owner ajusta la fuente única de la que se deriva el valor esperado, y ese ajuste es visible en el diff |
| Verificar sólo lo instalado no detecta una release futura mal publicada | Se acepta: detectarlo exigiría red en CI. El contrato cubre lo que este repositorio realmente consume |
| Un salto de patch parece trivial y podría normalizar subir sin verificar | Mitigado porque el registro de cadencia exige razón y evidencia por salto, y el criterio de aceptación obliga a correr los tres checks |
