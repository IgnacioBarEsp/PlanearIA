// Fixture: lectura congelada. No toca useWindowDimensions, asi que la
// invariante de consumidor no autorizado no la ve; es la via de evasion mas
// barata y la spec la prohibe desde #79 sin que nada la verificara.
import { Dimensions } from "react-native";

const ANCHO = Dimensions.get("window").width;

export const esEscritorio = ANCHO >= 1280;
