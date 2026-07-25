// Fixture: la fuente autorizada, sana. Todo src/ esta limpio en este arbol.
import { useWindowDimensions } from "react-native";

export function useAnchoFixture(): number {
  return useWindowDimensions().width;
}
