// Fixture de la guardia: la fuente autorizada, sana.
import { useWindowDimensions } from "react-native";

export function useAnchoFixture(): number {
  return useWindowDimensions().width;
}
