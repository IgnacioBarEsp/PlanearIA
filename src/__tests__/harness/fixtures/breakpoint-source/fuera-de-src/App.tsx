// Fixture: el infractor vive FUERA de src/. .eslintrc.cjs declara App.tsx como
// superficie de producto, asi que una guardia que solo mire src/ deja el
// arranque de la app como punto ciego.
import { useWindowDimensions } from "react-native";

export function useAnchoDeArranque(): number {
  return useWindowDimensions().width;
}
