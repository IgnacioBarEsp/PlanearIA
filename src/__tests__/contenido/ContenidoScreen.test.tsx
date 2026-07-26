import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ContenidoScreen from "../../screens/contenido/ContenidoScreen";
import {
  ContenidoItem,
  CategoriaContenido,
  ContenidoViewModel,
} from "../../hooks/useContenidoViewModel";

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    isDark: false,
    colors: {
      primary: "#1676D2",
      background: "#EEF3FA",
      surfaceContainerLowest: "#FFFFFF",
      surfaceContainerLow: "#f1f4f8",
      surfaceContainer: "#ebeef2",
      surfaceContainerHigh: "#e3e8ef",
      onSurface: "#181c1f",
      onSurfaceVariant: "#43474e",
      outlineVariant: "#c0c7d4",
      primaryContainer: "#0576d2",
      error: "#BA1A1A",
      shadowBlue: "rgba(0,93,168,0.06)",
    },
  }),
}));

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  return {
    LinearGradient: ({ children, ...props }: any) =>
      React.createElement("View", { ...props, testID: "linear-gradient" }, children),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
let mockRouteParams: Record<string, unknown> = {};
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({ navigate: mockNavigate, goBack: mockGoBack }),
  useRoute: () => ({ params: mockRouteParams }),
}));

/**
 * La hoja compartida se sustituye por una sonda que expone el payload recibido.
 *
 * Lo que esta suite verifica es la responsabilidad de la pantalla: a que elementos ofrece la
 * accion y que entrega al selector canonico. El comportamiento interno de la hoja ya lo cubre
 * assignSheet.test.tsx, y el camino completo hasta la cola lo cubre
 * src/__tests__/sync/asignacionContenidoEncolada.test.tsx con la hoja real y sin mocks.
 */
jest.mock("../../components/assign", () => {
  const ReactModule = require("react");
  return {
    AssignSheet: ({ elementos }: { elementos: unknown[] }) =>
      ReactModule.createElement("View", {
        testID: "assign-sheet-sonda",
        accessibilityLabel: JSON.stringify(elementos),
      }),
  };
});

const PRESENTACION_SINCRONIZADA = {
  estado: "sincronizado" as const,
  tono: "exito" as const,
  icono: "cloud-done" as const,
  titulo: "Todo sincronizado",
  detalle: null,
  etiquetaA11y: "Todo sincronizado",
  accion: null,
  ocupado: false,
  complementoGuardado: null,
};

let mockPresentacionSync: Record<string, unknown> = { ...PRESENTACION_SINCRONIZADA };
jest.mock("../../hooks/useSyncPresentation", () => ({
  useSyncPresentation: () => mockPresentacionSync,
}));

const mockAsignarRecursos = jest.fn().mockResolvedValue(1);
const mockAsignarEntregables = jest.fn().mockResolvedValue(1);
jest.mock("../../services/grupoAsignacionesService", () => ({
  asignarRecursosAGrupo: (...args: unknown[]) => mockAsignarRecursos(...args),
  asignarEntregablesAGrupo: (...args: unknown[]) => mockAsignarEntregables(...args),
}));

jest.mock("../../context/MensajesContext", () => ({
  useMensajes: () => ({
    enviarMensaje: jest.fn(),
    crearConversacionDesdeContacto: jest.fn(),
    conversaciones: [],
    isLoading: false,
    error: null,
    eliminarConversacion: jest.fn(),
    refreshMensajes: jest.fn(),
  }),
}));

const mockIsAvailableAsync = jest.fn().mockResolvedValue(true);
const mockShareAsync = jest.fn().mockResolvedValue(undefined);
jest.mock("expo-sharing", () => ({
  isAvailableAsync: () => mockIsAvailableAsync(),
  shareAsync: (...args: unknown[]) => mockShareAsync(...args),
}));

const mockExportPdf = jest
  .fn()
  .mockResolvedValue({ uri: "file:///tmp/plan.pdf", name: "plan.pdf", sizeBytes: 1024 });
const mockExportDocx = jest
  .fn()
  .mockResolvedValue({ uri: "file:///tmp/plan.docx", name: "plan.docx", sizeBytes: 2048 });
jest.mock("../../services/planeacionExportService", () => ({
  exportPlaneacionToPdf: (...args: unknown[]) => mockExportPdf(...args),
  exportPlaneacionToDocx: (...args: unknown[]) => mockExportDocx(...args),
}));

// ─── ViewModel mock ───

const mockSetCategoriaActiva = jest.fn();
const mockSetSearchQuery = jest.fn();
const mockSetFiltroTipo = jest.fn();
const mockSetFiltroFecha = jest.fn();
const mockSetFiltroEstado = jest.fn();
const mockLimpiarFiltros = jest.fn();
const mockEliminarItem = jest.fn();
const mockDuplicarItem = jest.fn();
const mockRetryLoad = jest.fn();

const mockItems: ContenidoItem[] = [
  {
    id: "plan-1",
    tipo: "planeaciones",
    titulo: "Fracciones equivalentes",
    subtitulo: "Matemáticas · 3° A",
    fechaModificacion: "2024-06-10T12:00:00.000Z",
    esBorrador: false,
    progreso: 100,
    raw: { id: "plan-1", nivelAcademico: "primaria" } as any,
  },
  {
    id: "rec-1",
    tipo: "recursos",
    titulo: "Video de Historia",
    subtitulo: "Video",
    tipoRecurso: "video",
    fechaModificacion: "2024-06-08T00:00:00.000Z",
    esBorrador: false,
    raw: { id: 1 } as any,
  },
];

const mockBorradores: ContenidoItem[] = [
  {
    id: "plan-borr",
    tipo: "planeaciones",
    titulo: "Borrador historia",
    subtitulo: "Historia · 2° B",
    fechaModificacion: "2024-06-09T00:00:00.000Z",
    esBorrador: true,
    progreso: 33,
    raw: { id: "plan-borr", nivelAcademico: "secundaria" } as any,
  },
];

const defaultVm: ContenidoViewModel = {
  items: mockItems,
  borradores: mockBorradores,
  totalItems: 3,
  isLoading: false,
  isError: false,
  isOffline: false,
  retryLoad: mockRetryLoad,
  categoriaActiva: "todo",
  setCategoriaActiva: mockSetCategoriaActiva,
  searchQuery: "",
  setSearchQuery: mockSetSearchQuery,
  filtroTipo: "",
  setFiltroTipo: mockSetFiltroTipo,
  filtroFecha: "",
  setFiltroFecha: mockSetFiltroFecha,
  filtroEstado: "",
  setFiltroEstado: mockSetFiltroEstado,
  filtrosActivos: 0,
  limpiarFiltros: mockLimpiarFiltros,
  conteos: { todo: 3, planeaciones: 2, recursos: 1, entregables: 0, plantillas: 0 },
  eliminarItem: mockEliminarItem,
  duplicarItem: mockDuplicarItem,
};

let mockCurrentVm = { ...defaultVm };

jest.mock("../../hooks/useContenidoViewModel", () => ({
  useContenidoViewModel: () => mockCurrentVm,
  CategoriaContenido: {},
  ContenidoItem: {},
}));

const ITEM_ENTREGABLE: ContenidoItem = {
  id: "ent-9",
  tipo: "entregables",
  titulo: "Ensayo de Historia",
  subtitulo: "Tarea",
  fechaModificacion: "2024-06-07T00:00:00.000Z",
  esBorrador: false,
  raw: { id: 9 } as never,
};

const ITEM_PLANTILLA: ContenidoItem = {
  id: "pla-4",
  tipo: "plantillas",
  titulo: "Plantilla de examen",
  subtitulo: "Plantilla",
  fechaModificacion: "2024-06-06T00:00:00.000Z",
  esBorrador: false,
  raw: { id: 4 } as never,
};

/** Monta la pantalla con un unico elemento y abre su menu de opciones. */
const abrirMenuDe = (item: ContenidoItem) => {
  mockCurrentVm = { ...defaultVm, items: [item], borradores: [], totalItems: 1 };
  const utils = render(<ContenidoScreen />);
  fireEvent.press(utils.getAllByLabelText("Más opciones")[0]);
  return utils;
};

describe("ContenidoScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentVm = { ...defaultVm };
    mockRouteParams = {};
    mockPresentacionSync = { ...PRESENTACION_SINCRONIZADA };
    mockAsignarRecursos.mockResolvedValue(1);
    mockAsignarEntregables.mockResolvedValue(1);
  });

  it("renderiza el header con título y conteo", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Mi Contenido")).toBeTruthy();
    expect(getByText("3 elementos")).toBeTruthy();
  });

  it("renderiza la barra de búsqueda", () => {
    const { getByPlaceholderText } = render(<ContenidoScreen />);

    expect(getByPlaceholderText("Buscar planeaciones, recursos, tareas...")).toBeTruthy();
  });

  it("renderiza las pills de categoría", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Todo")).toBeTruthy();
    expect(getByText("Planeaciones")).toBeTruthy();
    expect(getByText("Recursos")).toBeTruthy();
    expect(getByText("Entregables")).toBeTruthy();
    expect(getByText("Plantillas")).toBeTruthy();
  });

  it("renderiza los items de contenido", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Fracciones equivalentes")).toBeTruthy();
    expect(getByText("Video de Historia")).toBeTruthy();
  });

  it("renderiza la sección de borradores", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Borradores")).toBeTruthy();
    expect(getByText("Borrador historia")).toBeTruthy();
  });

  it("renderiza badges de conteo en pills", () => {
    const { getByText } = render(<ContenidoScreen />);

    // Conteos: planeaciones 2, recursos 1, entregables 0, plantillas 0
    expect(getByText("2")).toBeTruthy();
    expect(getByText("1")).toBeTruthy();
  });

  it("muestra estado vacío cuando no hay contenido", () => {
    mockCurrentVm = { ...defaultVm, items: [], borradores: [], totalItems: 0 };

    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Tu contenido aparecerá aquí")).toBeTruthy();
    expect(getByText("Crear planeación")).toBeTruthy();
    expect(getByText("Subir recurso")).toBeTruthy();
    expect(getByText("Ver plantillas")).toBeTruthy();
  });

  it("navega a CrearPlaneacion al presionar 'Crear planeación' en empty state", () => {
    mockCurrentVm = { ...defaultVm, items: [], borradores: [], totalItems: 0 };

    const { getByText } = render(<ContenidoScreen />);
    fireEvent.press(getByText("Crear planeación"));

    expect(mockNavigate).toHaveBeenCalledWith("CrearPlaneacion");
  });

  it("muestra skeleton cuando isLoading", () => {
    mockCurrentVm = { ...defaultVm, isLoading: true };

    const { getByText, queryByText } = render(<ContenidoScreen />);

    expect(getByText("Mi Contenido")).toBeTruthy();
    // Should NOT show content items in loading state
    expect(queryByText("Fracciones equivalentes")).toBeNull();
  });

  it("muestra estado de error con botón Reintentar", () => {
    mockCurrentVm = { ...defaultVm, isError: true };

    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("No se pudo cargar tu contenido")).toBeTruthy();
    expect(getByText("Revisa tu conexión a internet e intenta de nuevo")).toBeTruthy();
    expect(getByText("Reintentar")).toBeTruthy();
  });

  it("llama retryLoad al presionar Reintentar en estado de error", () => {
    mockCurrentVm = { ...defaultVm, isError: true };

    const { getByText } = render(<ContenidoScreen />);
    fireEvent.press(getByText("Reintentar"));

    expect(mockRetryLoad).toHaveBeenCalled();
  });

  it("muestra banner offline cuando isOffline es true", () => {
    mockCurrentVm = { ...defaultVm, isOffline: true };

    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Sin conexión — Mostrando datos guardados")).toBeTruthy();
  });

  it("no muestra banner offline cuando isOffline es false", () => {
    mockCurrentVm = { ...defaultVm, isOffline: false };

    const { queryByText } = render(<ContenidoScreen />);

    expect(queryByText("Sin conexión — Mostrando datos guardados")).toBeNull();
  });

  it("muestra opciones Exportar y Compartir en context menu", () => {
    const { getAllByLabelText, getByText } = render(<ContenidoScreen />);

    const moreButtons = getAllByLabelText("Más opciones");
    fireEvent.press(moreButtons[0]);

    expect(getByText("Exportar")).toBeTruthy();
    expect(getByText("Compartir")).toBeTruthy();
  });

  it("muestra botón cerrar en context menu", () => {
    const { getAllByLabelText } = render(<ContenidoScreen />);

    const moreButtons = getAllByLabelText("Más opciones");
    fireEvent.press(moreButtons[0]);

    expect(getAllByLabelText("Cerrar menú").length).toBeGreaterThan(0);
  });

  // ─── Asignar a grupo: adopcion del selector canonico (#114) ───

  describe("accion Asignar a grupo", () => {
    it("ofrece la accion en un recurso y abre el selector canonico con ese elemento", () => {
      const { getByText, getByTestId } = abrirMenuDe(mockItems[1]);

      fireEvent.press(getByText("Asignar a grupo"));

      // El payload es el contrato con la hoja: id de la entidad real (no del prefijo de
      // presentacion "rec-1"), titulo y tipo traducido al vocabulario del selector.
      expect(getByTestId("assign-sheet-sonda").props.accessibilityLabel).toBe(
        JSON.stringify([{ id: 1, titulo: "Video de Historia", tipo: "recurso" }])
      );
    });

    it("ofrece la accion en un entregable y traduce su tipo", () => {
      const { getByText, getByTestId } = abrirMenuDe(ITEM_ENTREGABLE);

      fireEvent.press(getByText("Asignar a grupo"));

      expect(getByTestId("assign-sheet-sonda").props.accessibilityLabel).toBe(
        JSON.stringify([{ id: 9, titulo: "Ensayo de Historia", tipo: "entregable" }])
      );
    });

    it("no ofrece la accion en una planeacion", () => {
      const { queryByText } = abrirMenuDe(mockItems[0]);

      expect(queryByText("Asignar a grupo")).toBeNull();
    });

    it("no ofrece la accion en una plantilla", () => {
      const { queryByText } = abrirMenuDe(ITEM_PLANTILLA);

      expect(queryByText("Asignar a grupo")).toBeNull();
    });

    it("no sustituye la accion ausente por un aviso de disponibilidad futura", () => {
      const alertSpy = jest.spyOn(Alert, "alert");
      const { queryByText } = abrirMenuDe(mockItems[0]);

      // Ni control inerte ni promesa: la opcion simplemente no existe para ese tipo.
      expect(queryByText("Asignar a grupo")).toBeNull();
      expect(queryByText("Próximamente")).toBeNull();
      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it("conserva el resto de opciones del menu en un tipo no asignable", () => {
      const { getByText } = abrirMenuDe(mockItems[0]);

      expect(getByText("Editar")).toBeTruthy();
      expect(getByText("Duplicar")).toBeTruthy();
      expect(getByText("Compartir en Feed")).toBeTruthy();
      expect(getByText("Enviar por chat")).toBeTruthy();
      expect(getByText("Eliminar")).toBeTruthy();
    });

    it("no monta el selector mientras no se dispara la accion", () => {
      const { queryByTestId } = abrirMenuDe(mockItems[1]);

      expect(queryByTestId("assign-sheet-sonda")).toBeNull();
    });

    it.each([
      ["nulo", null],
      ["cadena vacia", ""],
      ["cero", 0],
      ["texto", "abc"],
      ["ausente", undefined],
    ])("no ofrece la accion cuando el id de la entidad es %s", (_caso, idBruto) => {
      // Number(null) y Number("") valen 0, que es finito: sin un filtro estricto estos registros
      // pasarian, se ofreceria la accion y la escritura acabaria en "no se asigno nada".
      const { queryByText } = abrirMenuDe({
        ...mockItems[1],
        raw: { id: idBruto } as never,
      });

      expect(queryByText("Asignar a grupo")).toBeNull();
    });

    it("acepta un id numerico entregado como cadena", () => {
      const { getByText, getByTestId } = abrirMenuDe({
        ...mockItems[1],
        raw: { id: "77" } as never,
      });

      fireEvent.press(getByText("Asignar a grupo"));

      expect(getByTestId("assign-sheet-sonda").props.accessibilityLabel).toBe(
        JSON.stringify([{ id: 77, titulo: "Video de Historia", tipo: "recurso" }])
      );
    });
  });

  it("ejecuta búsqueda al escribir en el campo", () => {
    const { getByPlaceholderText } = render(<ContenidoScreen />);

    fireEvent.changeText(
      getByPlaceholderText("Buscar planeaciones, recursos, tareas..."),
      "historia"
    );

    expect(mockSetSearchQuery).toHaveBeenCalledWith("historia");
  });

  it("muestra sección Reciente con conteo de elementos", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("Reciente")).toBeTruthy();
    expect(getByText("2 elementos")).toBeTruthy();
  });

  it("no muestra borradores cuando la lista de borradores está vacía", () => {
    mockCurrentVm = { ...defaultVm, borradores: [] };

    const { queryByText } = render(<ContenidoScreen />);

    expect(queryByText("Borradores")).toBeNull();
  });

  it("muestra badge BORRADOR en draft cards", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("BORRADOR")).toBeTruthy();
  });

  it("muestra porcentaje de progreso en borradores", () => {
    const { getByText } = render(<ContenidoScreen />);

    expect(getByText("33%")).toBeTruthy();
    expect(getByText("PROGRESO")).toBeTruthy();
  });

  // ─── Context menu export/share tests ───

  it("muestra opciones Compartir y Exportar en el context menu", () => {
    const { getAllByLabelText, getByText } = render(<ContenidoScreen />);

    const moreButtons = getAllByLabelText("Más opciones");
    fireEvent.press(moreButtons[0]);

    expect(getByText("Compartir")).toBeTruthy();
    expect(getByText("Exportar")).toBeTruthy();
    expect(getByText("Editar")).toBeTruthy();
    expect(getByText("Duplicar")).toBeTruthy();
    expect(getByText("Eliminar")).toBeTruthy();
  });

  it("compartir planeación genera PDF y abre sharing", async () => {
    const { getAllByLabelText, getByText } = render(<ContenidoScreen />);

    const moreButtons = getAllByLabelText("Más opciones");
    fireEvent.press(moreButtons[0]);
    fireEvent.press(getByText("Compartir"));

    await waitFor(() => {
      expect(mockExportPdf).toHaveBeenCalled();
      expect(mockShareAsync).toHaveBeenCalledWith(
        "file:///tmp/plan.pdf",
        expect.objectContaining({ mimeType: "application/pdf" })
      );
    });
  });

  it("compartir recurso muestra alerta Próximamente", () => {
    const alertSpy = jest.spyOn(Alert, "alert");
    // Use a VM with only a recurso item
    mockCurrentVm = {
      ...defaultVm,
      items: [mockItems[1]], // recurso only
      borradores: [],
    };

    const { getAllByLabelText, getByText } = render(<ContenidoScreen />);

    const moreButtons = getAllByLabelText("Más opciones");
    fireEvent.press(moreButtons[0]);
    fireEvent.press(getByText("Compartir"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Próximamente",
      expect.stringContaining("próxima actualización")
    );
    alertSpy.mockRestore();
  });

  it("exportar planeación muestra selector de formato PDF/Word", () => {
    const alertSpy = jest.spyOn(Alert, "alert");

    const { getAllByLabelText, getByText } = render(<ContenidoScreen />);

    const moreButtons = getAllByLabelText("Más opciones");
    fireEvent.press(moreButtons[0]);
    fireEvent.press(getByText("Exportar"));

    expect(alertSpy).toHaveBeenCalledWith(
      "Exportar planeación",
      "Selecciona el formato de exportación",
      expect.arrayContaining([
        expect.objectContaining({ text: "PDF" }),
        expect.objectContaining({ text: "Word (.docx)" }),
        expect.objectContaining({ text: "Cancelar" }),
      ])
    );
    alertSpy.mockRestore();
  });

  // ─── Modo seleccion: el resultado se afirma segun el hecho real (#114) ───

  describe("modo seleccion", () => {
    /**
     * Entra en modo seleccion, elige el recurso y confirma.
     *
     * `targetGroupId` viaja como cadena porque asi lo manda DetalleGrupo (`String(grupoId)`).
     */
    const confirmarSeleccion = async (items: ContenidoItem[] = [mockItems[1]]) => {
      mockRouteParams = { selectionMode: true, targetGroupId: "7" };
      mockCurrentVm = { ...defaultVm, items, borradores: [], totalItems: items.length };

      const utils = render(<ContenidoScreen />);
      for (const item of items) fireEvent.press(utils.getByText(item.titulo));
      fireEvent.press(utils.getByText("Asignar a Grupo"));
      return utils;
    };

    it("afirma el resultado y vuelve atras cuando si hubo escritura", async () => {
      const alertSpy = jest.spyOn(Alert, "alert");
      mockAsignarRecursos.mockResolvedValueOnce(1);

      await confirmarSeleccion();

      await waitFor(() =>
        expect(alertSpy).toHaveBeenCalledWith(
          "Listo",
          expect.stringContaining("1 elemento asignado al grupo.")
        )
      );
      expect(mockGoBack).toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it("convierte el grupo destino a numero antes de escribir", async () => {
      // DetalleGrupo navega con String(grupoId). Escribir la cadena dejaba grupoId "7" donde el
      // resto de la app compara contra 7, asi que la asignacion se guardaba invisible.
      await confirmarSeleccion();

      await waitFor(() => expect(mockAsignarRecursos).toHaveBeenCalled());
      expect(mockAsignarRecursos).toHaveBeenCalledWith(7, [1]);
      expect(mockAsignarRecursos.mock.calls[0][0]).toStrictEqual(7);
    });

    it("distingue encolado de sincronizado con el vocabulario compartido", async () => {
      const alertSpy = jest.spyOn(Alert, "alert");
      mockPresentacionSync = {
        ...PRESENTACION_SINCRONIZADA,
        estado: "sin-conexion",
        titulo: "Sin conexión",
      };
      mockAsignarRecursos.mockResolvedValueOnce(1);

      await confirmarSeleccion();

      await waitFor(() =>
        expect(alertSpy).toHaveBeenCalledWith(
          "Listo",
          expect.stringContaining("Sin conexión. Se asignara en el servidor cuando vuelva la conexion.")
        )
      );
      // El texto de falta de conexion viene de la fuente unica, no de un literal de esta pantalla.
      expect(alertSpy).not.toHaveBeenCalledWith("Listo", expect.stringContaining("ya está sincronizada"));
      alertSpy.mockRestore();
    });

    it("afirma sincronizado cuando la cola quedo drenada", async () => {
      const alertSpy = jest.spyOn(Alert, "alert");
      mockAsignarRecursos.mockResolvedValueOnce(1);

      await confirmarSeleccion();

      await waitFor(() =>
        expect(alertSpy).toHaveBeenCalledWith(
          "Listo",
          expect.stringContaining("La asignación ya está sincronizada.")
        )
      );
      alertSpy.mockRestore();
    });

    it("no deja elegir tipos que la asignacion no puede escribir", async () => {
      mockRouteParams = { selectionMode: true, targetGroupId: "7" };
      mockCurrentVm = {
        ...defaultVm,
        items: [mockItems[0], ITEM_PLANTILLA],
        borradores: [],
        totalItems: 2,
      };

      const { getByText } = render(<ContenidoScreen />);
      // Tocar la tarjeta es el otro camino de seleccion: tampoco debe admitir estos tipos.
      fireEvent.press(getByText("Fracciones equivalentes"));
      fireEvent.press(getByText("Plantilla de examen"));
      fireEvent.press(getByText("Asignar a Grupo"));

      // Sin seleccion valida no se llama al servicio: antes se descartaban en silencio y el docente
      // aterrizaba siempre en "no se asigno nada".
      expect(mockAsignarRecursos).not.toHaveBeenCalled();
      expect(mockAsignarEntregables).not.toHaveBeenCalled();
      expect(getByText("0 elementos seleccionados")).toBeTruthy();
    });

    it("no afirma exito ni vuelve atras cuando no hubo ninguna escritura", async () => {
      const alertSpy = jest.spyOn(Alert, "alert");
      // El servicio ya devuelve 0 cuando ningun id coincide: ids que desaparecieron, o que ya
      // pertenecian al grupo destino. Antes ese conteo se descartaba y se afirmaba exito igual.
      mockAsignarRecursos.mockResolvedValueOnce(0);

      await confirmarSeleccion();

      await waitFor(() =>
        expect(alertSpy).toHaveBeenCalledWith(
          "No se asignó nada",
          expect.stringContaining("Ningún elemento cambió de destino")
        )
      );
      expect(alertSpy).not.toHaveBeenCalledWith("Éxito", expect.anything());
      expect(mockGoBack).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });
  });
});
