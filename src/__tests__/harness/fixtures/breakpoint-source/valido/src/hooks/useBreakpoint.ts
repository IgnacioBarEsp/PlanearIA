// Fixture de la guardia de fuente de dimensiones: entrada AUTORIZADA y VIVA.
// Es la unica fuente que puede leer la primitiva de plataforma, igual que el
// hook real del repositorio.
import { useWindowDimensions } from "react-native";

export function useAnchoFixture(): number {
  return useWindowDimensions().width;
}
