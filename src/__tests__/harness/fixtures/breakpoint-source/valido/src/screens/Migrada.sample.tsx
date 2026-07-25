// Fixture: pantalla MIGRADA que ademas NOMBRA la primitiva en un comentario.
// Existe para probar que la guardia describe comportamiento y no prosa: si el
// comentario contara como consumo, documentar la regla la violaria.
// Antes esta pantalla llamaba useWindowDimensions() directo.
import { useAnchoFixture } from "../hooks/useBreakpoint";

export function useAnchoMigrado(): number {
  return useAnchoFixture();
}
