import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import ListaGruposScreen from "../../screens/grupos/ListaGruposScreen";
import { ThemeProvider } from "../../context/ThemeContext";
import { FontSizeProvider } from "../../context/FontSizeContext";
import { DaltonismoProvider } from "../../context/DaltonismoContext";
import { AccessibilityPreferencesProvider } from "../../context/AccessibilityPreferencesContext";

// La pantalla migro a useAppTheme (#145), que compone ThemeContext y este lee la
// preferencia persistida. Sin el mock, el modulo nativo de AsyncStorage es null
// en Jest y la suite ni siquiera carga.
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

// Presentational back button uses useNavigation; stub it (no NavigationContainer here)
jest.mock("../../components/ScreenBackButton", () => "ScreenBackButton");

const mockSetSearchQuery = jest.fn();

jest.mock("../../hooks/useGrupos", () => ({
  useGrupos: () => ({
    gruposFiltrados: [
      {
        id: 7,
        nombre: "3o A Secundaria",
        materia: "Pensamiento Matemático III",
        carrera: "ISC",
        semestre: 3,
        cantidadAlumnos: 24,
        estado: "activo",
      },
    ],
    isLoading: false,
    error: null,
    searchQuery: "",
    setSearchQuery: mockSetSearchQuery,
    conteoGrupos: 1,
    syncStatus: "synced",
    pendingSyncCount: 0,
    isOnline: true,
    sincronizarGrupos: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Tras migrar a useAppTheme (#145) la pantalla obtiene sus colores en runtime y
// exige los cuatro proveedores de preferencia. No hay fallback a color estatico
// a proposito: esa ausencia es lo que garantiza que la pantalla repinte.
const Proveedores: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <FontSizeProvider>
      <DaltonismoProvider>
        <AccessibilityPreferencesProvider>{children}</AccessibilityPreferencesProvider>
      </DaltonismoProvider>
    </FontSizeProvider>
  </ThemeProvider>
);

const renderPantalla = (navigation: any) =>
  render(<ListaGruposScreen navigation={navigation} />, { wrapper: Proveedores });

describe("ListaGruposScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza lista de grupos", () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = renderPantalla(navigation);

    expect(getByText("Mis Grupos")).toBeTruthy();
    expect(getByText("3o A Secundaria")).toBeTruthy();
    expect(getByText("1 grupos activos")).toBeTruthy();
  });

  it("aplica búsqueda al escribir", () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByPlaceholderText } = renderPantalla(navigation);

    fireEvent.changeText(getByPlaceholderText("Buscar grupo..."), "secundaria");

    expect(mockSetSearchQuery).toHaveBeenCalledWith("secundaria");
  });

  it("navega a detalle al tocar un grupo", () => {
    const navigation = { navigate: jest.fn() } as any;
    const { getByText } = renderPantalla(navigation);

    fireEvent.press(getByText("3o A Secundaria"));

    expect(navigation.navigate).toHaveBeenCalledWith("DetalleGrupo", {
      grupoId: 7,
      grupoNombre: "3o A Secundaria",
    });
  });
});
