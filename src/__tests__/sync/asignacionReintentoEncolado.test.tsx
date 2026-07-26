import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "../../context/ThemeContext";
import { FontSizeProvider } from "../../context/FontSizeContext";
import { DaltonismoProvider } from "../../context/DaltonismoContext";
import { AccessibilityPreferencesProvider } from "../../context/AccessibilityPreferencesContext";
import { RecursosProvider } from "../../context/RecursosContext";
import { EntregablesProvider } from "../../context/EntregablesContext";
import AssignSheet from "../../components/assign/AssignSheet";
import { SYNC_ENTITIES, reconcileWithPending } from "../../sync/services/entitySync";
import { flushQueue, getPendingOps } from "../../sync/services/syncEngine";
import { expectConsoleError } from "../helpers/consoleSignal";

/**
 * Reintento de una escritura parcial, por el camino real de sincronizacion (#152).
 *
 * La reanudacion vive en el ViewModel, pero lo que hay que proteger es su efecto sobre el
 * motor: que lo escrito antes del fallo quede encolado y sobreviva al pull, que el reintento
 * complete lo pendiente, y que al reconectar suba todo con el destino puesto. Por eso la
 * cola, el almacenamiento y la reconciliacion son los de `src/sync` y no dobles: un mock de
 * la cola no podria mostrar ninguna de las tres cosas.
 *
 * El fallo se inyecta donde de verdad puede ocurrir: la persistencia de la lista de recursos,
 * que es lo que `RecursosContext.persist` hace antes de encolar.
 */

/**
 * Cual escritura de la lista de recursos debe fallar, contando desde el ultimo reinicio.
 *
 * Vive en `globalThis` porque el factory de `jest.mock` se evalua antes que el modulo y no
 * puede cerrar sobre una variable local. Solo se sabotea esa clave: la cola y las
 * preferencias deben seguir funcionando, o la prueba estaria observando un almacenamiento
 * roto en vez de un fallo de escritura.
 */
jest.mock("@react-native-async-storage/async-storage", () => {
  let store: Record<string, string> = {};
  let escriturasDeRecursos = 0;
  return {
    __reiniciarContador: () => {
      escriturasDeRecursos = 0;
    },
    getItem: jest.fn(async (key: string) => store[key] ?? null),
    setItem: jest.fn(async (key: string, value: string) => {
      if (key === "@planearia:recursos") {
        escriturasDeRecursos += 1;
        const objetivo = (globalThis as { __escrituraQueFalla?: number }).__escrituraQueFalla ?? 0;
        if (objetivo !== 0 && escriturasDeRecursos === objetivo) {
          throw new Error("almacenamiento lleno");
        }
      }
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
      escriturasDeRecursos = 0;
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

jest.mock("../../context/GruposContext", () => ({
  useGruposContext: () => ({ grupos: [{ id: 7, nombre: "2do A" }], isLoading: false }),
}));

jest.mock("../../services/classroom/classroomFacade", () => ({
  classroomFacade: {
    getUnidadesByGrupoId: jest.fn().mockResolvedValue([]),
    getActividadesByGrupoId: jest.fn().mockResolvedValue([]),
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

const RECURSO_BASE = {
  tipo: "documento",
  descripcion: "",
  asignadoComoTarea: false,
  tags: [],
  acceso: "privado",
  origen: "manual",
  profesorId: 1,
  versionActual: 1,
};

const RECURSO_1 = { ...RECURSO_BASE, id: 1, titulo: "Guia de fracciones" };
const RECURSO_2 = { ...RECURSO_BASE, id: 2, titulo: "Examen de fracciones" };

const ELEMENTOS = [
  { id: 1, titulo: "Guia de fracciones", tipo: "recurso" as const },
  { id: 2, titulo: "Examen de fracciones", tipo: "recurso" as const },
];

const Proveedores: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <FontSizeProvider>
      <DaltonismoProvider>
        <AccessibilityPreferencesProvider>
          <EntregablesProvider>{children}</EntregablesProvider>
        </AccessibilityPreferencesProvider>
      </DaltonismoProvider>
    </FontSizeProvider>
  </ThemeProvider>
);

const conRecursos = (children: React.ReactNode) => (
  <Proveedores>
    <RecursosProvider>{children}</RecursosProvider>
  </Proveedores>
);

const leerRecursos = async (): Promise<Array<{ id: number; grupoId?: number }>> =>
  JSON.parse((await AsyncStorage.getItem(SYNC_ENTITIES.recursos.storageKey)) ?? "[]");

const fijarFallo = (numeroDeEscritura: number) => {
  (globalThis as { __escrituraQueFalla?: number }).__escrituraQueFalla = numeroDeEscritura;
};

/**
 * Reinicia el conteo de escrituras de recursos.
 *
 * Contar desde el arranque del test ataria el numero a cuantas veces persistan los
 * proveedores al montar, que no es algo que esta prueba quiera fijar. Reiniciando justo
 * antes de confirmar, "la escritura 2" significa siempre "el segundo elemento".
 */
const reiniciarConteoDeEscrituras = () => {
  (AsyncStorage as unknown as { __reiniciarContador: () => void }).__reiniciarContador();
};

describe("reintento de una escritura parcial sobre el motor real", () => {
  let logSpy: jest.SpyInstance;

  beforeEach(async () => {
    // El motor registra su operacion normal por logger en __DEV__: ruido esperado.
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    await AsyncStorage.clear();
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockConectado = true;
    fijarFallo(0);
    await AsyncStorage.setItem(
      SYNC_ENTITIES.recursos.storageKey,
      JSON.stringify([RECURSO_1, RECURSO_2])
    );
  });

  afterEach(() => {
    fijarFallo(0);
    logSpy.mockRestore();
  });

  const montarYElegirDestino = async () => {
    const utils = render(
      <AssignSheet visible elementos={ELEMENTOS} onClose={jest.fn()} testID="hoja" />,
      { wrapper: ({ children }) => conRecursos(children) }
    );
    await act(async () => {});
    fireEvent.press(utils.getByTestId("hoja-clase-7"));
    await waitFor(() =>
      expect(utils.getByTestId("hoja-confirmar").props.accessibilityState.disabled).toBe(false)
    );
    return utils;
  };

  it("conserva lo escrito, lo completa al reintentar y lo sube al reconectar", async () => {
    expectConsoleError(/La asignacion fallo/);

    // Sin conexion la operacion se queda en cola, que es donde hay que poder observarla.
    mockConectado = false;
    mockFetch.mockRejectedValue(new Error("Network request failed"));

    const utils = await montarYElegirDestino();

    // A partir de aqui, la escritura 1 es el elemento 1 y la 2 es el elemento 2.
    reiniciarConteoDeEscrituras();
    fijarFallo(2);

    await act(async () => {
      fireEvent.press(utils.getByTestId("hoja-confirmar"));
    });

    // ─── Fallo parcial: la hoja nombra lo que ya quedo guardado ───
    await waitFor(() => expect(utils.getByTestId("hoja-error-escritura")).toBeTruthy());
    expect(
      utils.getByText(
        "No se pudo completar la asignacion. Se guardo 1 elemento y queda 1 pendiente. Reintentar continua desde ahi."
      )
    ).toBeTruthy();

    // Lo escrito quedo ademas ENCOLADO: es lo que hace que sobreviva al pull.
    const trasFallo = await leerRecursos();
    expect(trasFallo.find((r) => r.id === 1)).toMatchObject({ grupoId: 7 });
    expect(trasFallo.find((r) => r.id === 2)?.grupoId).toBeUndefined();
    const pendientesTrasFallo = await getPendingOps("recursos");
    expect(pendientesTrasFallo).toHaveLength(1);

    // no-local-loss: un pull cuya lista remota aun no conoce la asignacion no puede borrarla.
    const reconciliado = reconcileWithPending(
      [...trasFallo],
      [{ ...RECURSO_1 }, { ...RECURSO_2 }],
      pendientesTrasFallo
    );
    expect(reconciliado.find((item) => (item as { id: number }).id === 1)).toMatchObject({
      grupoId: 7,
    });

    // ─── Reintento: completa lo pendiente ───
    fijarFallo(0);
    await act(async () => {
      fireEvent.press(utils.getByText("Reintentar"));
    });

    await waitFor(() => expect(utils.getByTestId("hoja-resultado")).toBeTruthy());
    // El conteo acumula los dos intentos: no dice "1 elemento" por el ultimo.
    expect(utils.getByText("2 elementos asignados a 2do A.")).toBeTruthy();

    const trasReintento = await leerRecursos();
    expect(trasReintento.find((r) => r.id === 1)).toMatchObject({ grupoId: 7 });
    expect(trasReintento.find((r) => r.id === 2)).toMatchObject({ grupoId: 7 });

    // Una operacion por elemento, no una por intento.
    const pendientes = await getPendingOps("recursos");
    expect(pendientes).toHaveLength(2);
    expect(pendientes.map((op) => (op.payload as { id: number }).id).sort()).toEqual([1, 2]);

    // ─── Reconexion: sube sola, con el destino puesto ───
    mockConectado = true;
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true }) });

    const resultado = await flushQueue("recursos");

    expect(resultado.success).toBe(true);
    expect(resultado.processed).toBe(2);
    expect(await getPendingOps("recursos")).toHaveLength(0);

    // cross-device: el documento que llega al servidor lleva el destino, que es lo que otro
    // dispositivo vera al bajar.
    const cuerpos = mockFetch.mock.calls.map(([, opciones]) => JSON.parse(opciones.body));
    expect(cuerpos).toHaveLength(2);
    expect(cuerpos.every((cuerpo) => cuerpo.grupoId === 7)).toBe(true);
    expect(cuerpos.map((cuerpo) => cuerpo.id).sort()).toEqual([1, 2]);
  });
});
