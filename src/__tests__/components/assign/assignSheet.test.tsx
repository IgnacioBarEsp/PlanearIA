import React from "react";
import { act, fireEvent, waitFor } from "@testing-library/react-native";
import { renderConProveedores } from "../base/renderConProveedores";
import { expectConsoleError } from "../../helpers/consoleSignal";
import AssignSheet from "../../../components/assign/AssignSheet";
import type { PresentacionSync } from "../../../hooks/syncPresentation";

/**
 * Hoja del selector transversal (change assign-sheet, #84).
 *
 * La hoja renderiza lo que resuelve el ViewModel. Estas pruebas verifican lo que el docente
 * percibe: que no puede confirmar sin destino, que su eleccion se anuncia sin depender del
 * color, que cerrar no escribe nada y que sin conexion puede asignar igual.
 */

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

const mockActualizarRecurso = jest.fn().mockResolvedValue({ syncOk: true });
let mockGrupos: Array<{ id: number; nombre: string }> = [{ id: 1, nombre: "2do A" }];

jest.mock("../../../context/GruposContext", () => ({
  useGruposContext: () => ({ grupos: mockGrupos, isLoading: false }),
}));

jest.mock("../../../context/RecursosContext", () => ({
  useRecursos: () => ({
    actualizarRecurso: (...args: unknown[]) => mockActualizarRecurso(...args),
    obtenerRecursoPorId: (id: number) => ({ id }),
  }),
}));

jest.mock("../../../context/EntregablesContext", () => ({
  useEntregables: () => ({
    actualizarEntregable: jest.fn(),
    obtenerEntregablePorId: (id: number) => ({ id }),
  }),
}));

const mockGetUnidades = jest.fn();
const mockGetActividades = jest.fn();

jest.mock("../../../services/classroom/classroomFacade", () => ({
  classroomFacade: {
    getUnidadesByGrupoId: (grupoId: number) => mockGetUnidades(grupoId),
    getActividadesByGrupoId: (grupoId: number) => mockGetActividades(grupoId),
  },
}));

const PRESENTACION_BASE: PresentacionSync = {
  estado: "sincronizado",
  tono: "exito",
  icono: "cloud-done",
  titulo: "Todo sincronizado",
  detalle: null,
  etiquetaA11y: "Todo sincronizado",
  accion: null,
  ocupado: false,
  complementoGuardado: null,
};

let mockPresentacion: PresentacionSync = PRESENTACION_BASE;

jest.mock("../../../hooks/useSyncPresentation", () => ({
  useSyncPresentation: () => mockPresentacion,
}));

const ELEMENTO = { id: 1, titulo: "Guia de fracciones", tipo: "recurso" as const };

const montar = async (props: Partial<React.ComponentProps<typeof AssignSheet>> = {}) =>
  await renderConProveedores(
    <AssignSheet
      visible
      elementos={[ELEMENTO]}
      onClose={props.onClose ?? jest.fn()}
      testID="hoja"
      {...props}
    />
  );

describe("AssignSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGrupos = [{ id: 1, nombre: "2do A" }];
    mockPresentacion = PRESENTACION_BASE;
    mockActualizarRecurso.mockResolvedValue({ syncOk: true });
    mockGetUnidades.mockResolvedValue([{ id: "u1", grupoId: 1, nombre: "Unidad 1", posicion: 0 }]);
    mockGetActividades.mockResolvedValue([]);
  });

  it("no permite confirmar mientras no hay clase elegida", async () => {
    const { getByTestId } = await montar();
    // La carga async de destinos resuelve tras el montaje; sin este flush su
    // actualizacion de estado cae fuera de act().
    await act(async () => {});
    expect(getByTestId("hoja-confirmar").props.accessibilityState.disabled).toBe(true);
  });

  it("anuncia la eleccion sin depender del color", async () => {
    const { getByTestId } = await montar();

    const clase = getByTestId("hoja-clase-1");
    expect(clase.props.accessibilityState.checked).toBe(false);

    fireEvent.press(clase);

    await waitFor(() => expect(getByTestId("hoja-clase-1").props.accessibilityState.checked).toBe(true));
    expect(getByTestId("hoja-clase-1").props.accessibilityLabel).toBe("2do A");
  });

  it("nombra el destino en la confirmacion y no una formula generica", async () => {
    const { getByTestId } = await montar();

    fireEvent.press(getByTestId("hoja-clase-1"));
    await waitFor(() => expect(getByTestId("hoja-unidad-u1")).toBeTruthy());
    fireEvent.press(getByTestId("hoja-unidad-u1"));

    await waitFor(() =>
      expect(getByTestId("hoja-confirmar").props.accessibilityHint).toBe(
        "Asignar Guia de fracciones a 2do A - Unidad 1"
      )
    );
  });

  it("no escribe nada si el docente cierra sin confirmar", async () => {
    const onClose = jest.fn();
    const { getByTestId } = await montar({ onClose });

    fireEvent.press(getByTestId("hoja-clase-1"));
    await waitFor(() => expect(getByTestId("hoja-clase-1").props.accessibilityState.checked).toBe(true));
    fireEvent.press(getByTestId("hoja-cancelar"));

    expect(mockActualizarRecurso).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("permite asignar sin conexion y lo informa sin bloquear", async () => {
    mockPresentacion = {
      ...PRESENTACION_BASE,
      estado: "sin-conexion",
      tono: "aviso",
      titulo: "Guardado en este dispositivo",
    };
    const { getByTestId } = await montar();

    expect(getByTestId("hoja-offline")).toBeTruthy();
    fireEvent.press(getByTestId("hoja-clase-1"));

    await waitFor(() =>
      expect(getByTestId("hoja-confirmar").props.accessibilityState.disabled).toBe(false)
    );
  });

  it("informa que quedo en cola cuando la sincronizacion no drena", async () => {
    mockActualizarRecurso.mockResolvedValueOnce({ syncOk: false });
    mockPresentacion = {
      ...PRESENTACION_BASE,
      estado: "sin-conexion",
      titulo: "Guardado en este dispositivo",
    };
    const { getByTestId, getByText } = await montar();

    fireEvent.press(getByTestId("hoja-clase-1"));
    // Confirmar sigue bloqueado mientras cargan los destinos: presionar antes seria un
    // clic que la hoja ignora, y la prueba pasaria a verificar nada.
    await waitFor(() =>
      expect(getByTestId("hoja-confirmar").props.accessibilityState.disabled).toBe(false)
    );
    fireEvent.press(getByTestId("hoja-confirmar"));

    await waitFor(() => expect(getByTestId("hoja-resultado")).toBeTruthy());
    expect(
      getByText("Guardado en este dispositivo. Se asignara en el servidor cuando vuelva la conexion.")
    ).toBeTruthy();
  });

  it("ofrece una salida cuando el docente no tiene ninguna clase", async () => {
    mockGrupos = [];
    const onCrearClase = jest.fn();
    const { getByTestId, getByText } = await montar({ onCrearClase });

    // Mismo flush de la carga async de destinos.
    await act(async () => {});
    expect(getByTestId("hoja-vacio")).toBeTruthy();
    fireEvent.press(getByText("Crear clase"));
    expect(onCrearClase).toHaveBeenCalled();
  });

  /**
   * Cada fallo con su propio aviso (#152, debt-9f9d7019d927).
   *
   * Antes habia un solo banner con el titulo fijo "No se pudieron cargar los destinos" y
   * una accion cableada a la recarga de destinos. Un fallo de escritura se anunciaba con la
   * causa equivocada y su reintento no reintentaba lo que habia fallado.
   */
  describe("avisos de error", () => {
    it("el fallo de carga se anuncia como fallo de carga y recarga destinos", async () => {
      expectConsoleError(/No se pudieron cargar los destinos/);
      mockGetUnidades.mockRejectedValueOnce(new Error("sin red"));
      const { getByTestId, queryByTestId, getByText } = await montar();

      fireEvent.press(getByTestId("hoja-clase-1"));
      await waitFor(() => expect(getByTestId("hoja-error-carga")).toBeTruthy());

      expect(getByText("No se pudieron cargar los destinos")).toBeTruthy();
      // El otro aviso no aparece: son dos banners distintos, no uno con dos causas.
      expect(queryByTestId("hoja-error-escritura")).toBeNull();

      mockGetUnidades.mockResolvedValue([{ id: "u1", grupoId: 1, nombre: "Unidad 1", posicion: 0 }]);
      await act(async () => {
        fireEvent.press(getByText("Reintentar"));
      });
      // Reintentar aqui vuelve a pedir los destinos, que es lo que fallo.
      await waitFor(() => expect(queryByTestId("hoja-error-carga")).toBeNull());
      expect(getByTestId("hoja-unidad-u1")).toBeTruthy();
    });

    it("el fallo de escritura se anuncia como tal y nombra lo ya guardado", async () => {
      expectConsoleError(/La asignacion fallo/);
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: true })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { getByTestId, queryByTestId, getByText } = await montar({
        elementos: [ELEMENTO, { id: 2, titulo: "Examen", tipo: "recurso" as const }],
      });

      fireEvent.press(getByTestId("hoja-clase-1"));
      await waitFor(() =>
        expect(getByTestId("hoja-confirmar").props.accessibilityState.disabled).toBe(false)
      );
      await act(async () => {
        fireEvent.press(getByTestId("hoja-confirmar"));
      });

      await waitFor(() => expect(getByTestId("hoja-error-escritura")).toBeTruthy());
      // El titulo corresponde a la causa, no al fallo de carga.
      expect(getByText("No se pudo completar la asignacion")).toBeTruthy();
      expect(queryByTestId("hoja-error-carga")).toBeNull();
      // Y el docente sabe que parte del trabajo ya quedo guardado.
      expect(
        getByText(
          "No se pudo completar la asignacion. Se guardo 1 elemento y queda 1 pendiente. Reintentar continua desde ahi."
        )
      ).toBeTruthy();
    });

    it("reintentar el fallo de escritura reintenta la asignacion, no la carga", async () => {
      expectConsoleError(/La asignacion fallo/);
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: true })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { getByTestId, getByText } = await montar({
        elementos: [ELEMENTO, { id: 2, titulo: "Examen", tipo: "recurso" as const }],
      });

      fireEvent.press(getByTestId("hoja-clase-1"));
      await waitFor(() =>
        expect(getByTestId("hoja-confirmar").props.accessibilityState.disabled).toBe(false)
      );
      await act(async () => {
        fireEvent.press(getByTestId("hoja-confirmar"));
      });
      await waitFor(() => expect(getByTestId("hoja-error-escritura")).toBeTruthy());

      const llamadasAntes = mockGetUnidades.mock.calls.length;
      mockActualizarRecurso.mockResolvedValue({ syncOk: true });
      await act(async () => {
        fireEvent.press(getByText("Reintentar"));
      });

      // La escritura se retoma y la hoja llega al resultado.
      await waitFor(() => expect(getByTestId("hoja-resultado")).toBeTruthy());
      expect(getByText("2 elementos asignados a 2do A.")).toBeTruthy();
      // Y no se recargaron destinos: eso era la accion equivocada del defecto original.
      expect(mockGetUnidades.mock.calls.length).toBe(llamadasAntes);
    });
  });
});
