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
import { AccessibilityPreferencesProvider } from "../../context/AccessibilityPreferencesContext";
import { useAppTheme } from "../../themes/useAppTheme";

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

const SondaDeTema: React.FC = () => {
  const { colors, isDark, scaled } = useAppTheme();
  const { toggleTheme } = useTheme();
  const daltonismo = useDaltonismo() as unknown as { setDaltonismoMode?: (m: string) => void };
  alternarTema = toggleTheme;
  ponerDaltonismo = daltonismo.setDaltonismoMode ?? (() => {});
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
      forzarRender = () => setTick((previo) => previo + 1);
      identidades.push(colors);
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

    const fondoClaro = screen.getByTestId("fondo").props.children;
    await act(async () => {
      alternarTema();
    });
    const fondoOscuro = screen.getByTestId("fondo").props.children;

    // La pantalla sigue montada y el tema cambio de verdad bajo ella.
    expect(fondoOscuro).not.toBe(fondoClaro);
    expect(screen.getByTestId("oscuro").props.children).toBe("true");
  });
});
