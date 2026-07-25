// Fixture: pantalla migrada que convive con la infractora. Existe para probar
// que la guardia distingue y no reporta el archivo entero del arbol.
import { useAnchoFixture } from "../hooks/useBreakpoint";

export function useAnchoMigrado(): number {
  return useAnchoFixture();
}
