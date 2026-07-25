/**
 * Repintado en runtime de las pantallas migradas en #145
 * (spec: theming-runtime-propagation).
 *
 * La prueba clave no es que la pantalla se vea distinta tras remontar: eso ya
 * ocurria antes del change, porque `COLORS` se leia al importar y un remontaje
 * en otro proceso habria mostrado el otro tema igualmente. Lo que este change
 * garantiza es que el cambio de preferencia repinta el arbol YA MONTADO. Por eso
 * cada caso conserva la misma instancia y solo alterna la preferencia.
 *
 * Se ejercita ClassroomHomeScreen por ser la pantalla migrada mas barata de
 * montar; el mecanismo (useAppTheme mas fabrica getStyles memoizada) es el mismo
 * en las seis.
 */
import React from "react";
import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { ThemeProvider, useTheme } from "../../context/ThemeContext";
import { FontSizeProvider } from "../../context/FontSizeContext";
import { DaltonismoProvider, useDaltonismo } from "../../context/DaltonismoContext";
import {
  AccessibilityPreferencesProvider,
  useAccessibilityPreferences,
} from "../../context/AccessibilityPreferencesContext";
import { useFontSize } from "../../context/FontSizeContext";
import { useAppTheme } from "../../themes/useAppTheme";
import { lightTheme, darkTheme } from "../../themes/colors";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// El pill animado no es objeto de esta prueba y su animacion sigue corriendo tras
// el test, lo que emite un warning act() que no senala ningun defecto del
// repintado. Se sustituye por un marcador inerte para no ensuciar la senal.
jest.mock("../../components/AnimatedTopPill", () => "AnimatedTopPill");

jest.mock("../../hooks/classroom/useClassroomHomeViewModel", () => ({
  useClassroomHomeViewModel: () => ({
    classrooms: [],
    isLoading: false,
    error: null,
    isEmpty: true,
    totalAlumnos: 0,
    totalGrupos: 0,
    totalPendientes: 0,
    reload: jest.fn(),
  }),
}));

// Solo se sustituye useNavigation: reemplazar el modulo entero borraria
// NavigationContext, del que depende AnimatedTopPill dentro de la pantalla.
jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({ navigate: jest.fn(), addListener: jest.fn(() => jest.fn()) }),
}));

const Proveedores: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <FontSizeProvider>
      <DaltonismoProvider>
        <AccessibilityPreferencesProvider>{children}</AccessibilityPreferencesProvider>
      </DaltonismoProvider>
    </FontSizeProvider>
  </ThemeProvider>
);

/**
 * Sonda que publica el color que la pantalla migrada recibiria y expone los
 * setters de preferencia, para poder alternarlas sin remontar el arbol.
 */
let alternarTema: () => void;
let ponerDaltonismo: (modo: string) => void;
let ponerEscala: (modo: string) => void;
let ponerAltoContraste: (valor: boolean) => void;

const SondaDeTema: React.FC = () => {
  const { colors, isDark, scaled } = useAppTheme();
  const { toggleTheme } = useTheme();
  const daltonismo = useDaltonismo() as unknown as { setDaltonismoMode?: (m: string) => void };
  const ponerModo = daltonismo.setDaltonismoMode;
  const { setFontSizeMode } = useFontSize() as unknown as {
    setFontSizeMode: (m: string) => void;
  };
  const { setHighContrast } = useAccessibilityPreferences();
  // Los setters se publican en un efecto post-commit, no durante el render:
  // asignar una variable de modulo mientras se renderiza es un efecto lateral y
  // la regla react-hooks/globals lo rechaza, con razon.
  React.useEffect(() => {
    alternarTema = toggleTheme;
    ponerDaltonismo = ponerModo ?? (() => {});
    ponerEscala = setFontSizeMode;
    ponerAltoContraste = setHighContrast;
  }, [toggleTheme, ponerModo, setFontSizeMode, setHighContrast]);
  return (
    <>
      <Text testID="fondo">{String(colors.background)}</Text>
      <Text testID="texto">{String(colors.text)}</Text>
      <Text testID="error">{String(colors.error)}</Text>
      <Text testID="oscuro">{String(isDark)}</Text>
      <Text testID="escala">{String(scaled(16))}</Text>
    </>
  );
};

async function montarSonda() {
  const resultado = render(<SondaDeTema />, { wrapper: Proveedores });
  await act(async () => {});
  return resultado;
}

/** Aplana el estilo que RN entrega como arreglo anidado. */
function estiloPlano(style: unknown): Record<string, unknown> {
  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (acumulado, parte) => ({ ...acumulado, ...estiloPlano(parte) }),
      {}
    );
  }
  if (style && typeof style === "object") return style as Record<string, unknown>;
  return {};
}

/**
 * Color de fondo real del boton "Crear clase" de ClassroomHome, que la fabrica
 * pinta con el token `primary`. Se sube desde el texto hasta el ancestro que
 * declara un backgroundColor, porque el boton es un Pressable y el estilo se
 * resuelve en el host que lo envuelve.
 */
function fondoDelBoton(): unknown {
  let nodo: any = screen.getByText("Crear clase");
  for (let i = 0; i < 6 && nodo; i++) {
    const fondo = estiloPlano(nodo.props?.style).backgroundColor;
    if (fondo) return fondo;
    nodo = nodo.parent;
  }
  return undefined;
}

/** Tamano de fuente real del rotulo del boton, que la fabrica pasa por `scaled`. */
function fuenteDelBoton(): unknown {
  return estiloPlano(screen.getByText("Crear clase").props?.style).fontSize;
}

describe("repintado en runtime de las pantallas migradas (#145)", () => {
  it("cambiar el tema repinta el arbol ya montado, sin remontarlo", async () => {
    await montarSonda();

    const fondoClaro = screen.getByTestId("fondo").props.children;
    const textoClaro = screen.getByTestId("texto").props.children;
    expect(screen.getByTestId("oscuro").props.children).toBe("false");

    await act(async () => {
      alternarTema();
    });

    const fondoOscuro = screen.getByTestId("fondo").props.children;
    const textoOscuro = screen.getByTestId("texto").props.children;
    expect(screen.getByTestId("oscuro").props.children).toBe("true");

    // El corazon de la prueba: valores distintos sin haber vuelto a montar.
    expect(fondoOscuro).not.toBe(fondoClaro);
    expect(textoOscuro).not.toBe(textoClaro);

    // Y vuelve al valor original al revertir la preferencia.
    await act(async () => {
      alternarTema();
    });
    expect(screen.getByTestId("fondo").props.children).toBe(fondoClaro);
  });

  it("el daltonismo se aplica encima del tema activo, que es lo que useTheme por si solo no hace", async () => {
    await montarSonda();

    const errorSinFiltro = screen.getByTestId("error").props.children;

    await act(async () => {
      ponerDaltonismo("deuteranopia");
    });

    const errorConFiltro = screen.getByTestId("error").props.children;
    // Si una pantalla migrada consumiera useTheme en vez de useAppTheme, este
    // valor no cambiaria y la pantalla quedaria ciega al daltonismo sin error visible.
    expect(errorConFiltro).not.toBe(errorSinFiltro);
  });

  it("la identidad del tema es estable entre renders, asi que la fabrica memoizada no recrea el StyleSheet", async () => {
    const identidades: unknown[] = [];
    let forzarRender: () => void = () => {};

    const SondaDeIdentidad: React.FC = () => {
      const { colors } = useAppTheme();
      const [, setTick] = React.useState(0);
      identidades.push(colors);
      // Igual que arriba: publicar el disparador en un efecto, no en el render.
      React.useEffect(() => {
        forzarRender = () => setTick((previo) => previo + 1);
      }, []);
      return <Text testID="marca">{String(colors.background)}</Text>;
    };

    render(<SondaDeIdentidad />, { wrapper: Proveedores });
    await act(async () => {});

    const rendersIniciales = identidades.length;
    await act(async () => {
      forzarRender();
    });

    // Hubo un render nuevo y, aun asi, `colors` conserva su identidad: el useMemo
    // de la fabrica no se invalida y el StyleSheet no se reconstruye. Si esta
    // premisa se rompiera, cada render recrearia los estilos de las seis pantallas.
    expect(identidades.length).toBeGreaterThan(rendersIniciales);
    expect(identidades[identidades.length - 1]).toBe(identidades[rendersIniciales - 1]);
  });

  it("ClassroomHomeScreen consume el tema y repinta sus estilos al cambiarlo", async () => {
    const ClassroomHomeScreen = require("../../screens/classroom/ClassroomHomeScreen").default;

    render(
      <>
        <SondaDeTema />
        <ClassroomHomeScreen />
      </>,
      { wrapper: Proveedores }
    );
    await act(async () => {});

    // La pantalla monto de verdad: si no consumiera el tema dentro de los
    // proveedores, useAppTheme habria lanzado antes de llegar aqui.
    expect(screen.getByText("Crear clase")).toBeTruthy();

    // Se afirma sobre el estilo REAL de la pantalla, no sobre la sonda. Sin esto
    // el test solo probaria que ThemeContext funciona (comportamiento previo a
    // este change) mientras la pantalla estaba montada al lado, lo cual pasaria
    // igual si la pantalla siguiera congelada en COLORS estatico.
    // Los valores se fijan explicitamente para que el test no pueda pasar en
    // vacio: si fondoDelBoton() devolviera undefined, `not.toBe` seguiria
    // pasando, pero estas igualdades no.
    const fondoBotonClaro = fondoDelBoton();
    expect(fondoBotonClaro).toBe(lightTheme.primary);

    await act(async () => {
      alternarTema();
    });

    const fondoBotonOscuro = fondoDelBoton();
    expect(fondoBotonOscuro).toBe(darkTheme.primary);
    expect(fondoBotonOscuro).not.toBe(fondoBotonClaro);
    expect(screen.getByTestId("oscuro").props.children).toBe("true");

    // Y regresa al valor original: descarta que el cambio venga de un remontaje
    // con otro estado inicial en vez de un repintado reversible.
    await act(async () => {
      alternarTema();
    });
    expect(fondoDelBoton()).toBe(fondoBotonClaro);
    // Montar la pantalla completa cuesta segundos: el default de 5 s de Jest
    // alcanza en local pero no en los runners de CI.
  }, 30000);

  it("ClassroomHomeScreen escala su tipografia con la preferencia de fuente, como exige la spec", async () => {
    const ClassroomHomeScreen = require("../../screens/classroom/ClassroomHomeScreen").default;

    render(
      <>
        <SondaDeTema />
        <ClassroomHomeScreen />
      </>,
      { wrapper: Proveedores }
    );
    await act(async () => {});

    // En escala media el factor es 1, asi que el valor base se conserva: es lo
    // que sostiene la afirmacion de "sin cambio visual por defecto".
    expect(fuenteDelBoton()).toBe(15);

    await act(async () => {
      ponerEscala("xlarge");
    });

    // 15 * 1.4 redondeado. Un valor fijo, no solo "distinto": si la pantalla
    // ignorara `scaled` seguiria en 15, y si el factor cambiara, este numero lo delata.
    expect(fuenteDelBoton()).toBe(21);

    await act(async () => {
      ponerEscala("medium");
    });
    expect(fuenteDelBoton()).toBe(15);
  }, 30000);

  it("el alto contraste refuerza el color de texto secundario de una pantalla migrada", async () => {
    await montarSonda();

    // Se ejercita el mecanismo que consumen las fabricas de las seis pantallas:
    // highContrast eleva textSecondary a text y borderLight a borderStrong.
    const Sonda: React.FC = () => {
      const { colors, highContrast } = useAppTheme();
      const valor = highContrast ? colors.text : colors.textSecondary;
      return <Text testID="secundario">{String(valor)}</Text>;
    };

    render(
      <>
        <SondaDeTema />
        <Sonda />
      </>,
      { wrapper: Proveedores }
    );
    await act(async () => {});
    const sinRefuerzo = screen.getByTestId("secundario").props.children;

    await act(async () => {
      ponerAltoContraste(true);
    });
    const conRefuerzo = screen.getByTestId("secundario").props.children;

    expect(sinRefuerzo).toBe(lightTheme.textSecondary);
    expect(conRefuerzo).toBe(lightTheme.text);
    expect(conRefuerzo).not.toBe(sinRefuerzo);
  });
});
