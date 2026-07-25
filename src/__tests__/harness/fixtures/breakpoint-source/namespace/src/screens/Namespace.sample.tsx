// Fixture: elusion por import de namespace. El import con nombre no la ve, asi
// que la guardia tambien mira el sitio de llamada. Sin esto, bastaria cambiar
// la forma del import para reintroducir la segunda fuente sin que nada falle.
import * as RN from "react-native";

export function useAnchoPorNamespace(): number {
  return RN.useWindowDimensions().width;
}
