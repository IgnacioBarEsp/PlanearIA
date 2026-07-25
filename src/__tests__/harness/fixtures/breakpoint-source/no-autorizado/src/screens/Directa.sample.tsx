// Fixture: pantalla que reintroduce la lectura directa. Es el caso que la
// guardia existe para atrapar.
import { useWindowDimensions } from "react-native";

export function useAnchoDirecto(): number {
  return useWindowDimensions().width;
}
