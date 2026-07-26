import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "../../context/ThemeContext";
import { FontSizeProvider } from "../../context/FontSizeContext";
import { DaltonismoProvider } from "../../context/DaltonismoContext";
import { AccessibilityPreferencesProvider } from "../../context/AccessibilityPreferencesContext";
import { RecursosProvider } from "../../context/RecursosContext";
import { EntregablesProvider } from "../../context/EntregablesContext";
import ContenidoScreen from "../../screens/contenido/ContenidoScreen";
import { SYNC_ENTITIES } from "../../sync/services/entitySync";
import { flushQueue, getPendingOps } from "../../sync/services/syncEngine";
import type { ContenidoItem, ContenidoViewModel } from "../../hooks/useContenidoViewModel";

/**
 * Ciclo offline -> reconexion -> subida, para la asignacion hecha desde Contenido (#114).
 *
 * La suite hermana (`asignacionContenidoEncolada`) prueba que la asignacion sobrevive al pull. Esta
 * prueba la otra mitad del contrato offline-first: que sin conexion la asignacion queda guardada y
 * encolada sin pedirle nada al docente, y que al volver la conexion sube sola con el documento
 * completo, dejando la cola vacia.
 *
 * El documento que viaja en esa subida es tambien la evidencia de que otro dispositivo vera la
 * asignacion: es lo unico que el servidor recibe de este flujo.
 */

jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn(async (key: string) => store[key] ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn(async (key: string) => {
      delete store[key];
    }),
    multiGet: jest.fn(async (keys: string[]) => keys.map((key) => [key, store[key] ?? null])),
    multiSet: jest.fn(async (pairs: [string, string][]) => {
      for (const [key, value] of pairs) store[key] = value;
    }),
    multiRemove: jest.fn(async (keys: string[]) => {
      for (const key of keys) delete store[key];
    }),
    getAllKeys: jest.fn(async () => Object.keys(store)),
    clear: jest.fn(async () => {
      store = {};
    }),
  };
});

let mockConectado = true;
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(async () => ({
    isConnected: mockConectado,
    isInternetReachable: mockConectado,
  })),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

jest.mock("../../sync/config/apiConfig", () => ({
  API_CONFIG: { baseUrl: "https://test.api.com", timeout: 5000 },
  SYNC_CONFIG: { debugMode: false, maxRetries: 5, retryDelay: 10 },
  isAPIConfigured: () => true,
}));

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

jest.mock("expo-linear-gradient", () => {
  const ReactModule = require("react");
  return {
    LinearGradient: ({ children, ...props }: Record<string, unknown>) =>
      ReactModule.createElement("View", { ...props }, children as React.ReactNode),
  };
});

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  useRoute: () => ({ params: {} }),
}));

jest.mock("../../context/MensajesContext", () => ({
  useMensajes: () => ({
    enviarMensaje: jest.fn(),
    crearConversacion: jest.fn(),
    getConversacionByContacto: jest.fn(),
  }),
}));

jest.mock("../../context/GruposContext", () => ({
  useGruposContext: () => ({ grupos: [{ id: 7, nombre: "2do A" }], isLoading: false }),
}));

jest.mock("../../services/classroom/classroomFacade", () => ({
  classroomFacade: {
    getUnidadesByGrupoId: jest.fn().mockResolvedValue([]),
    getActividadesByGrupoId: jest.fn().mockResolvedValue([]),
  },
}));

// La hoja expresa la falta de conexion con la fuente unica de presentacion (#83). Aqui se fija en
// "sin-conexion" para observar que informa sin bloquear la confirmacion.
jest.mock("../../hooks/useSyncPresentation", () => ({
  useSyncPresentation: () => ({
    estado: "sin-conexion",
    tono: "advertencia",
    icono: "cloud-off",
    titulo: "Sin conexión",
    detalle: null,
    etiquetaA11y: "Sin conexión",
    accion: null,
    ocupado: false,
    complementoGuardado: null,
  }),
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../../services/planeacionExportService", () => ({
  exportPlaneacionToPdf: jest.fn(),
  exportPlaneacionToDocx: jest.fn(),
}));

const RECURSO = {
  id: 1,
  titulo: "Guia de fracciones",
  tipo: "documento",
  descripcion: "",
  asignadoComoTarea: false,
  tags: [],
  acceso: "privado",
  origen: "manual",
  profesorId: 1,
  versionActual: 1,
};

const ITEM_RECURSO: ContenidoItem = {
  id: "rec-1",
  tipo: "recursos",
  titulo: "Guia de fracciones",
  subtitulo: "Documento",
  tipoRecurso: "documento",
  fechaModificacion: "2026-07-01T00:00:00.000Z",
  esBorrador: false,
  raw: RECURSO as never,
};

const mockVm: ContenidoViewModel = {
  items: [ITEM_RECURSO],
  borradores: [],
  totalItems: 1,
  isLoading: false,
  isError: false,
  isOffline: true,
  retryLoad: jest.fn(),
  categoriaActiva: "todo",
  setCategoriaActiva: jest.fn(),
  searchQuery: "",
  setSearchQuery: jest.fn(),
  filtroTipo: "",
  setFiltroTipo: jest.fn(),
  filtroFecha: "",
  setFiltroFecha: jest.fn(),
  filtroEstado: "",
  setFiltroEstado: jest.fn(),
  filtrosActivos: 0,
  limpiarFiltros: jest.fn(),
  conteos: { todo: 1, planeaciones: 0, recursos: 1, entregables: 0, plantillas: 0 },
  eliminarItem: jest.fn(),
  duplicarItem: jest.fn(),
};

jest.mock("../../hooks/useContenidoViewModel", () => ({
  useContenidoViewModel: () => mockVm,
}));

const Proveedores: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <FontSizeProvider>
      <DaltonismoProvider>
        <AccessibilityPreferencesProvider>
          <EntregablesProvider>
            <RecursosProvider>{children}</RecursosProvider>
          </EntregablesProvider>
        </AccessibilityPreferencesProvider>
      </DaltonismoProvider>
    </FontSizeProvider>
  </ThemeProvider>
);

describe("asignar sin conexion y subir al reconectar (#114)", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    // El motor de sync registra su operacion normal por logger en __DEV__: ruido esperado.
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockFetch.mockReset();
    await AsyncStorage.setItem(SYNC_ENTITIES.recursos.storageKey, JSON.stringify([RECURSO]));
  });

  afterEach(() => logSpy.mockRestore());

  it("guarda y encola sin conexion, y sube sola al reconectar sin intervencion del docente", async () => {
    // ─── Sin conexion ───
    mockConectado = false;
    mockFetch.mockRejectedValue(new Error("Network request failed"));

    const utils = render(<ContenidoScreen />, { wrapper: Proveedores });
    await act(async () => {});

    fireEvent.press(utils.getAllByLabelText("Más opciones")[0]);
    fireEvent.press(utils.getByText("Asignar a grupo"));
    await waitFor(() => expect(utils.getByTestId("contenido-asignar-sheet")).toBeTruthy());

    // La falta de conexion se informa y NO deshabilita confirmar: se puede asignar igual.
    expect(utils.getByTestId("contenido-asignar-sheet-offline")).toBeTruthy();

    fireEvent.press(utils.getByTestId("contenido-asignar-sheet-clase-7"));
    await waitFor(() =>
      expect(
        utils.getByTestId("contenido-asignar-sheet-confirmar").props.accessibilityState.disabled
      ).toBe(false)
    );

    await act(async () => {
      fireEvent.press(utils.getByTestId("contenido-asignar-sheet-confirmar"));
    });
    await waitFor(() => expect(utils.getByTestId("contenido-asignar-sheet-resultado")).toBeTruthy());

    // Guardada localmente y encolada, y el resultado NO afirma que ya subio.
    const local = JSON.parse(
      (await AsyncStorage.getItem(SYNC_ENTITIES.recursos.storageKey)) ?? "[]"
    );
    expect(local.find((r: { id: number }) => r.id === 1)).toMatchObject({ grupoId: 7 });
    expect(await getPendingOps("recursos")).toHaveLength(1);
    expect(utils.getByText(/Se asignara en el servidor cuando vuelva la conexion/)).toBeTruthy();

    // ─── Reconexion ───
    mockConectado = true;
    mockFetch.mockReset();
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });

    const resultado = await flushQueue("recursos");

    expect(resultado.success).toBe(true);
    expect(resultado.processed).toBe(1);
    expect(await getPendingOps("recursos")).toHaveLength(0);

    // El documento que llega al servidor lleva el destino: es lo que otro dispositivo vera al bajar.
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [[url, options]] = mockFetch.mock.calls;
    expect(url).toContain("/api/recursos");
    expect(JSON.parse(options.body)).toMatchObject({ id: 1, grupoId: 7 });
  });

  it("no pierde la asignacion si el primer intento de subida falla", async () => {
    mockConectado = false;
    mockFetch.mockRejectedValue(new Error("Network request failed"));

    const utils = render(<ContenidoScreen />, { wrapper: Proveedores });
    await act(async () => {});

    fireEvent.press(utils.getAllByLabelText("Más opciones")[0]);
    fireEvent.press(utils.getByText("Asignar a grupo"));
    await waitFor(() => expect(utils.getByTestId("contenido-asignar-sheet")).toBeTruthy());
    fireEvent.press(utils.getByTestId("contenido-asignar-sheet-clase-7"));
    await waitFor(() =>
      expect(
        utils.getByTestId("contenido-asignar-sheet-confirmar").props.accessibilityState.disabled
      ).toBe(false)
    );
    await act(async () => {
      fireEvent.press(utils.getByTestId("contenido-asignar-sheet-confirmar"));
    });
    await waitFor(() => expect(utils.getByTestId("contenido-asignar-sheet-resultado")).toBeTruthy());

    // Un flush con la red aun caida no debe consumir la operacion ni tocar el dato local.
    const fallido = await flushQueue("recursos");
    expect(fallido.processed).toBe(0);
    expect(await getPendingOps("recursos")).toHaveLength(1);

    const local = JSON.parse(
      (await AsyncStorage.getItem(SYNC_ENTITIES.recursos.storageKey)) ?? "[]"
    );
    expect(local.find((r: { id: number }) => r.id === 1)).toMatchObject({ grupoId: 7 });
  });
});
