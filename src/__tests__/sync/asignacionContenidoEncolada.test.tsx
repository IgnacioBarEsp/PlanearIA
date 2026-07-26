import React from "react";
import { act, fireEvent, render, waitFor, within } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "../../context/ThemeContext";
import { FontSizeProvider } from "../../context/FontSizeContext";
import { DaltonismoProvider } from "../../context/DaltonismoContext";
import { AccessibilityPreferencesProvider } from "../../context/AccessibilityPreferencesContext";
import { RecursosProvider } from "../../context/RecursosContext";
import { EntregablesProvider } from "../../context/EntregablesContext";
import ContenidoScreen from "../../screens/contenido/ContenidoScreen";
import { SYNC_ENTITIES, reconcileWithPending } from "../../sync/services/entitySync";
import { getPendingOps } from "../../sync/services/syncEngine";
import type { ContenidoItem, ContenidoViewModel } from "../../hooks/useContenidoViewModel";
import { expectConsoleError } from "../helpers/consoleSignal";

/**
 * La asignacion hecha desde Contenido encola y sobrevive al pull (#114).
 *
 * El modo de fallo que documenta #84 es concreto: escribir el destino en almacenamiento sin
 * encolar la operacion hace que el pull siguiente aplique `reconcileWithPending`, gane el remoto
 * y la asignacion desaparezca sin aviso. Adoptar la hoja en una superficie nueva puede
 * reintroducirlo si la superficie escribe por su cuenta, asi que la propiedad se verifica aqui
 * recorriendo el camino real y completo: pantalla -> hoja -> ViewModel -> contexto -> cola.
 *
 * Nada de este camino esta mockeado. La cola, el almacenamiento y la reconciliacion son los de
 * `src/sync`; lo unico simulado es el entorno alrededor de la pantalla.
 */

// Almacenamiento real en memoria, no un doble que devuelve null: la prueba necesita observar lo
// que quedo escrito. Incluye las variantes multi porque los proveedores de accesibilidad leen sus
// preferencias con `multiGet`.
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

// Sin API configurada no hay flush remoto: la operacion se queda en cola, que es exactamente el
// estado que estas pruebas necesitan observar.
jest.mock("../../sync/config/apiConfig", () => ({
  API_CONFIG: { baseUrl: "https://test.api.com", timeout: 5000 },
  SYNC_CONFIG: { debugMode: false, maxRetries: 5, retryDelay: 10 },
  isAPIConfigured: () => false,
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

const mockGoBack = jest.fn();
// `navigate` se declara aqui y no dentro del factory: una `jest.fn()` nueva por llamada no
// deja observar a donde salio el docente, que es justo lo que verifica el caso del estado
// vacio.
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: {} }),
}));

jest.mock("../../context/MensajesContext", () => ({
  useMensajes: () => ({
    enviarMensaje: jest.fn(),
    crearConversacion: jest.fn(),
    getConversacionByContacto: jest.fn(),
  }),
}));

let mockGrupos: Array<{ id: number; nombre: string }> = [{ id: 7, nombre: "2do A" }];

jest.mock("../../context/GruposContext", () => ({
  useGruposContext: () => ({ grupos: mockGrupos, isLoading: false }),
}));

const mockGetUnidades = jest.fn();
const mockGetActividades = jest.fn();

jest.mock("../../services/classroom/classroomFacade", () => ({
  classroomFacade: {
    getUnidadesByGrupoId: (grupoId: number) => mockGetUnidades(grupoId),
    getActividadesByGrupoId: (grupoId: number) => mockGetActividades(grupoId),
  },
}));

jest.mock("../../hooks/useSyncPresentation", () => ({
  useSyncPresentation: () => ({
    estado: "sincronizado",
    tono: "exito",
    icono: "cloud-done",
    titulo: "Todo sincronizado",
    detalle: null,
    etiquetaA11y: "Todo sincronizado",
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
  isOffline: false,
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

const montar = async () => {
  const utils = render(<ContenidoScreen />, { wrapper: Proveedores });
  // Los proveedores cargan sus datos persistidos en un efecto al montar. Sin este flush esa
  // actualizacion inicial resuelve fuera de act().
  await act(async () => {});
  return utils;
};

/** Abre el menu del unico elemento y dispara la accion de asignar. */
const abrirHoja = async (utils: Awaited<ReturnType<typeof montar>>) => {
  fireEvent.press(utils.getAllByLabelText("Más opciones")[0]);
  fireEvent.press(utils.getByText("Asignar a grupo"));
  await waitFor(() => expect(utils.getByTestId("contenido-asignar-sheet")).toBeTruthy());
};

describe("asignar desde Contenido encola y sobrevive al pull (#114)", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockGrupos = [{ id: 7, nombre: "2do A" }];
    mockGetUnidades.mockResolvedValue([]);
    mockGetActividades.mockResolvedValue([]);
    await AsyncStorage.setItem(SYNC_ENTITIES.recursos.storageKey, JSON.stringify([RECURSO]));
  });

  it("conserva la asignacion cuando el servidor devuelve el recurso sin grupo", async () => {
    const utils = await montar();
    await abrirHoja(utils);

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

    const local = JSON.parse(
      (await AsyncStorage.getItem(SYNC_ENTITIES.recursos.storageKey)) ?? "[]"
    );
    const pendientes = await getPendingOps("recursos");

    // La escritura local ocurrio y quedo encolada, no solo escrita.
    expect(local.find((item: { id: number }) => item.id === 1)).toMatchObject({ grupoId: 7 });
    expect(pendientes).toHaveLength(1);
    expect(pendientes[0].type).toBe("update");

    // El pull llega con la lista remota que todavia no conoce la asignacion. Sin operacion en
    // cola el remoto ganaria y el trabajo del docente desapareceria sin aviso.
    const reconciliado = reconcileWithPending([...local], [{ ...RECURSO }], pendientes);
    expect(reconciliado.find((item) => (item as { id: number }).id === 1)).toMatchObject({
      grupoId: 7,
    });
  });

  it("cancelar no escribe ni encola nada", async () => {
    const utils = await montar();
    await abrirHoja(utils);

    fireEvent.press(utils.getByTestId("contenido-asignar-sheet-clase-7"));
    await act(async () => {
      fireEvent.press(utils.getByTestId("contenido-asignar-sheet-cancelar"));
    });

    const local = JSON.parse(
      (await AsyncStorage.getItem(SYNC_ENTITIES.recursos.storageKey)) ?? "[]"
    );

    expect(local.find((item: { id: number }) => item.id === 1).grupoId).toBeUndefined();
    expect(await getPendingOps("recursos")).toHaveLength(0);
    expect(utils.queryByTestId("contenido-asignar-sheet")).toBeNull();
  });

  it("no afirma exito cuando el elemento ya no existe y no escribe nada", async () => {
    // El recurso desaparecio entre el render de la lista y la confirmacion. El ViewModel de la
    // hoja descarta ids inexistentes en vez de crear una entidad fantasma por upsert.
    await AsyncStorage.setItem(SYNC_ENTITIES.recursos.storageKey, JSON.stringify([]));

    const utils = await montar();
    await abrirHoja(utils);

    fireEvent.press(utils.getByTestId("contenido-asignar-sheet-clase-7"));
    await waitFor(() =>
      expect(
        utils.getByTestId("contenido-asignar-sheet-confirmar").props.accessibilityState.disabled
      ).toBe(false)
    );

    await act(async () => {
      fireEvent.press(utils.getByTestId("contenido-asignar-sheet-confirmar"));
    });

    await waitFor(() => expect(utils.getByText("No se asigno nada")).toBeTruthy());
    expect(utils.getByText("Ningun elemento cambio de destino.")).toBeTruthy();
    expect(await getPendingOps("recursos")).toHaveLength(0);
  });

  /**
   * Estado vacio y estado de error desde ESTA superficie (#152, debt-7f36f0586032).
   *
   * `assignSheet.test.tsx` ya cubre ambos a nivel de componente con el ViewModel real, pero
   * no cubre lo que esta pantalla aporta: que la salida `onCrearClase` de Contenido lleve al
   * formulario de crear grupo del hub de Clases. Ese cableado es propio de la superficie y
   * era lo unico sin prueba ni captura al cerrar #114.
   */
  describe("estados de la hoja desde Contenido", () => {
    it("sin clases ofrece crear una y su salida lleva a CrearGrupo", async () => {
      mockGrupos = [];

      const utils = await montar();
      await abrirHoja(utils);

      expect(utils.getByTestId("contenido-asignar-sheet-vacio")).toBeTruthy();
      // Sin clases no hay nada que confirmar: el pie de la hoja no ofrece la accion.
      expect(utils.queryByTestId("contenido-asignar-sheet-confirmar")).toBeNull();

      await act(async () => {
        fireEvent.press(utils.getByText("Crear clase"));
      });

      // La salida no es generica: aterriza en el formulario de crear grupo del hub Clases.
      expect(mockNavigate).toHaveBeenCalledWith("MainTabs", {
        screen: "ClasesTab",
        params: { screen: "CrearGrupo", params: undefined },
      });
      // Y salir cierra la hoja en vez de dejarla montada sobre la pantalla nueva.
      expect(utils.queryByTestId("contenido-asignar-sheet")).toBeNull();
      expect(await getPendingOps("recursos")).toHaveLength(0);
    });

    it("si falla la carga de destinos avisa y permite reintentar sin perder el elemento", async () => {
      expectConsoleError(/No se pudieron cargar los destinos/);
      mockGetUnidades.mockRejectedValueOnce(new Error("sin red"));

      const utils = await montar();
      await abrirHoja(utils);

      fireEvent.press(utils.getByTestId("contenido-asignar-sheet-clase-7"));
      await waitFor(() =>
        expect(utils.getByTestId("contenido-asignar-sheet-error-carga")).toBeTruthy()
      );
      // El aviso nombra la causa real, no el fallo de escritura.
      expect(utils.getByText("No se pudieron cargar los destinos")).toBeTruthy();
      expect(utils.queryByTestId("contenido-asignar-sheet-error-escritura")).toBeNull();

      mockGetUnidades.mockResolvedValue([
        { id: "u1", grupoId: 7, nombre: "Unidad 1", posicion: 0 },
      ]);
      await act(async () => {
        fireEvent.press(utils.getByText("Reintentar"));
      });

      await waitFor(() =>
        expect(utils.queryByTestId("contenido-asignar-sheet-error-carga")).toBeNull()
      );
      // La hoja sigue abierta con el elemento intacto: el fallo no la cerro ni perdio la
      // seleccion, y ahora si ofrece la unidad que antes no pudo cargar.
      expect(utils.getByTestId("contenido-asignar-sheet")).toBeTruthy();
      expect(utils.getByTestId("contenido-asignar-sheet-unidad-u1")).toBeTruthy();
      // El resumen se busca DENTRO del panel: el mismo titulo tambien esta en la lista de
      // Contenido que quedo detras, y una busqueda global no distinguiria una de otra.
      const panel = within(utils.getByTestId("contenido-asignar-sheet-panel"));
      expect(panel.getByText("Guia de fracciones")).toBeTruthy();
      // Un fallo de carga no escribe ni encola nada.
      expect(await getPendingOps("recursos")).toHaveLength(0);
    });
  });
});
