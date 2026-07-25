// Fixture de la guardia del registro de theming: entrada VIVA.
// Importa COLORS de verdad, como lo hace una pantalla legacy aun sin migrar,
// asi que su entrada en el registro es legitima. Vive bajo src/__tests__/, que
// la regla no-restricted-imports excluye del rollout.
import { COLORS } from "../../../../../types";

export const fondoLegacy = COLORS.background;
