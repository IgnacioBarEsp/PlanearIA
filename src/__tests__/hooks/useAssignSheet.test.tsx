import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useAssignSheet, type ElementoAsignable } from "../../hooks/useAssignSheet";
import { expectConsoleError } from "../helpers/consoleSignal";

/**
 * ViewModel del selector transversal (change assign-sheet, #84).
 *
 * Lo que estas pruebas protegen no es el aspecto de la hoja: es que toda asignacion pase
 * por el camino que encola y que el destino quede coherente. El defecto que cerro este
 * change fue invisible para la suite anterior justo por no verificar ninguna de las dos cosas.
 */

const mockActualizarRecurso = jest.fn().mockResolvedValue({ syncOk: true });
const mockActualizarEntregable = jest.fn().mockResolvedValue({ syncOk: true });
const mockObtenerRecursoPorId = jest.fn((id: number) => (id === 404 ? undefined : { id }));
const mockObtenerEntregablePorId = jest.fn((id: number) => (id === 404 ? undefined : { id }));

let mockGruposCargando = false;

jest.mock("../../context/GruposContext", () => ({
  useGruposContext: () => ({
    grupos: mockGruposCargando
      ? []
      : [
          { id: 1, nombre: "2do A" },
          { id: 2, nombre: "3ro B" },
        ],
    isLoading: mockGruposCargando,
  }),
}));

jest.mock("../../context/RecursosContext", () => ({
  useRecursos: () => ({
    actualizarRecurso: (...args: unknown[]) => mockActualizarRecurso(...args),
    obtenerRecursoPorId: (id: number) => mockObtenerRecursoPorId(id),
  }),
}));

jest.mock("../../context/EntregablesContext", () => ({
  useEntregables: () => ({
    actualizarEntregable: (...args: unknown[]) => mockActualizarEntregable(...args),
    obtenerEntregablePorId: (id: number) => mockObtenerEntregablePorId(id),
  }),
}));

const mockGetUnidades = jest.fn();
const mockGetActividades = jest.fn();

jest.mock("../../services/classroom/classroomFacade", () => ({
  classroomFacade: {
    getUnidadesByGrupoId: (grupoId: number) => mockGetUnidades(grupoId),
    getActividadesByGrupoId: (grupoId: number) => mockGetActividades(grupoId),
  },
}));

const RECURSO: ElementoAsignable = { id: 1, titulo: "Guia", tipo: "recurso" };

describe("useAssignSheet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGruposCargando = false;
    mockGetUnidades.mockResolvedValue([
      { id: "u1", grupoId: 1, nombre: "Unidad 1", posicion: 0 },
    ]);
    mockGetActividades.mockResolvedValue([{ id: 50, titulo: "Ensayo" }]);
  });

  const montar = (elementos: ElementoAsignable[] = [RECURSO]) =>
    renderHook(() => useAssignSheet(elementos));

  it("no permite confirmar sin clase elegida", () => {
    const { result } = montar();
    expect(result.current.puedeConfirmar).toBe(false);
  });

  it("asigna solo la clase y encola por el camino del contexto", async () => {
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    await act(async () => {
      await result.current.asignar();
    });

    expect(mockActualizarRecurso).toHaveBeenCalledWith(1, {
      grupoId: 1,
      unidadId: undefined,
      tareaId: undefined,
      asignadoComoTarea: false,
    });
    expect(result.current.resultado).toEqual({ asignados: 1, syncOk: true });
  });

  it("fija tareaId y asignadoComoTarea juntos al elegir actividad", async () => {
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.actividades).toHaveLength(1));
    await act(async () => {
      result.current.elegirActividad(50);
    });
    await act(async () => {
      await result.current.asignar();
    });

    expect(mockActualizarRecurso).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ tareaId: 50, asignadoComoTarea: true })
    );
  });

  it("limpia la marca de actividad cuando no se elige ninguna", async () => {
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.actividades).toHaveLength(1));
    await act(async () => {
      result.current.elegirActividad(50);
    });
    await act(async () => {
      result.current.elegirActividad(null);
    });
    await act(async () => {
      await result.current.asignar();
    });

    expect(mockActualizarRecurso).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ tareaId: undefined, asignadoComoTarea: false })
    );
  });

  it("descarta unidad y actividad al cambiar de clase", async () => {
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.unidades).toHaveLength(1));
    await act(async () => {
      result.current.elegirUnidad("u1");
    });
    await act(async () => {
      result.current.elegirActividad(50);
    });

    await act(async () => {
      result.current.elegirClase(2);
    });

    expect(result.current.destino).toEqual({ grupoId: 2, unidadId: null, tareaId: null });
  });

  it("asigna un entregable por su propio contexto, sin marca de actividad", async () => {
    const { result } = montar([{ id: 10, titulo: "Ensayo", tipo: "entregable" }]);

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    await act(async () => {
      result.current.elegirUnidad("u1");
    });
    await act(async () => {
      await result.current.asignar();
    });

    expect(mockActualizarEntregable).toHaveBeenCalledWith(10, { grupoId: 1, unidadId: "u1" });
    expect(mockActualizarRecurso).not.toHaveBeenCalled();
  });

  it("no ofrece actividad como destino de un entregable", async () => {
    // `Tarea` no declara `tareaId`: si el nivel se ofreciera, la eleccion se descartaria en
    // silencio y la confirmacion nombraria un destino que la escritura no aplica.
    const { result } = montar([{ id: 50, titulo: "Ensayo", tipo: "entregable" }]);

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.admiteActividad).toBe(false);
    expect(result.current.actividades).toHaveLength(0);
  });

  it("no ofrece actividad si la seleccion mezcla recursos y entregables", async () => {
    const { result } = montar([
      { id: 1, titulo: "Guia", tipo: "recurso" },
      { id: 50, titulo: "Ensayo", tipo: "entregable" },
    ]);

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));

    expect(result.current.admiteActividad).toBe(false);
  });

  it("no declara al docente sin clases mientras el contexto aun carga", () => {
    mockGruposCargando = true;
    const { result } = montar();

    // La hoja distingue "cargando" de "no tienes clases": afirmar lo segundo durante el
    // arranque del contexto es falso para un docente que si tiene clases.
    expect(result.current.clases).toHaveLength(0);
    expect(result.current.cargando).toBe(true);
  });

  it("no escribe ni afirma exito sobre un elemento inexistente", async () => {
    const { result } = montar([{ id: 404, titulo: "Fantasma", tipo: "recurso" }]);

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    await act(async () => {
      await result.current.asignar();
    });

    expect(mockActualizarRecurso).not.toHaveBeenCalled();
    expect(result.current.resultado).toEqual({ asignados: 0, syncOk: true });
  });

  it("reporta encolado cuando la cola no quedo drenada", async () => {
    mockActualizarRecurso.mockResolvedValueOnce({ syncOk: false });
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.cargando).toBe(false));
    await act(async () => {
      await result.current.asignar();
    });

    expect(result.current.resultado).toEqual({ asignados: 1, syncOk: false });
  });

  it("nombra el destino completo para que la confirmacion no sea generica", async () => {
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.unidades).toHaveLength(1));
    await act(async () => {
      result.current.elegirUnidad("u1");
    });

    expect(result.current.resumenDestino).toBe("2do A - Unidad 1");
  });

  it("ofrece reintentar cuando falla la carga de destinos", async () => {
    mockGetUnidades.mockRejectedValueOnce(new Error("sin datos"));
    // El hook registra el fallo de carga que este test provoca a proposito.
    expectConsoleError(/No se pudieron cargar los destinos/);
    const { result } = montar();

    await act(async () => {
      result.current.elegirClase(1);
    });
    await waitFor(() => expect(result.current.errorCarga).not.toBeNull());
    // El fallo de carga no puede aparecer como fallo de escritura: son campos distintos.
    expect(result.current.errorEscritura).toBeNull();

    mockGetUnidades.mockResolvedValue([
      { id: "u1", grupoId: 1, nombre: "Unidad 1", posicion: 0 },
    ]);
    await act(async () => {
      result.current.reintentarCarga();
    });

    await waitFor(() => expect(result.current.unidades).toHaveLength(1));
    expect(result.current.errorCarga).toBeNull();
  });

  /**
   * Semantica de errores separada (#152, debt-9f9d7019d927).
   *
   * El defecto original: un unico campo `error` para dos fallos, y una hoja que siempre
   * anunciaba el de carga con un reintento que recargaba destinos. Si la escritura fallaba
   * tras haber escrito y encolado parte del trabajo, el docente veia el titulo equivocado,
   * un reintento que no reintentaba lo que fallo y ningun rastro de lo ya guardado.
   */
  describe("fallo de escritura", () => {
    const DOS: ElementoAsignable[] = [
      { id: 1, titulo: "Guia", tipo: "recurso" },
      { id: 2, titulo: "Examen", tipo: "recurso" },
    ];

    const elegirYAsignar = async (result: { current: ReturnType<typeof useAssignSheet> }) => {
      await act(async () => {
        result.current.elegirClase(1);
      });
      await waitFor(() => expect(result.current.puedeConfirmar).toBe(true));
      await act(async () => {
        await result.current.asignar();
      });
    };

    it("no lo confunde con el fallo de carga y cuenta lo ya escrito", async () => {
      expectConsoleError(/La asignacion fallo/);
      // El primero se escribe y encola; el segundo revienta.
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: true })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { result } = montar(DOS);
      await elegirYAsignar(result);

      expect(result.current.errorCarga).toBeNull();
      expect(result.current.errorEscritura).toEqual({
        mensaje: "No se pudo completar la asignacion.",
        asignados: 1,
        pendientes: 1,
      });
      // No hay resultado: afirmar "listo" tras un fallo seria la mentira que #114 cerro.
      expect(result.current.resultado).toBeNull();
    });

    it("reintentar retoma lo pendiente sin reescribir lo ya encolado", async () => {
      expectConsoleError(/La asignacion fallo/);
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: true })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { result } = montar(DOS);
      await elegirYAsignar(result);
      expect(mockActualizarRecurso).toHaveBeenCalledTimes(2);

      mockActualizarRecurso.mockResolvedValue({ syncOk: true });
      await act(async () => {
        await result.current.asignar();
      });

      // Tres llamadas en total, no cuatro: el elemento 1 ya estaba escrito y encolado. La
      // cola deduplica por id, asi que repetirlo no crearia una operacion de mas; lo que
      // evita saltarselo es reiniciar el conteo, pagar persistencia y flush por trabajo ya
      // hecho, y devolver al final de la cola una operacion que ya esperaba.
      expect(mockActualizarRecurso).toHaveBeenCalledTimes(3);
      expect(mockActualizarRecurso.mock.calls[2][0]).toBe(2);
      expect(result.current.errorEscritura).toBeNull();
      expect(result.current.resultado).toEqual({ asignados: 2, syncOk: true });
    });

    it("cambiar de destino tras un fallo parcial reescribe todo hacia el destino nuevo", async () => {
      expectConsoleError(/La asignacion fallo/);
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: true })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { result } = montar(DOS);
      await elegirYAsignar(result);
      expect(mockActualizarRecurso).toHaveBeenCalledTimes(2);

      mockActualizarRecurso.mockResolvedValue({ syncOk: true });
      await act(async () => {
        result.current.elegirClase(2);
      });
      await waitFor(() => expect(result.current.puedeConfirmar).toBe(true));
      await act(async () => {
        await result.current.asignar();
      });

      // Los dos elementos se reescriben: el primero quedo en la clase 1 y saltarselo lo
      // dejaria ahi mientras la hoja afirma que fueron a la clase 2.
      const haciaGrupo2 = mockActualizarRecurso.mock.calls.filter(
        (llamada) => (llamada[1] as { grupoId: number }).grupoId === 2
      );
      expect(haciaGrupo2).toHaveLength(2);
      expect(result.current.resultado).toEqual({ asignados: 2, syncOk: true });
    });

    it("conserva el encolado pendiente al acumular intentos", async () => {
      expectConsoleError(/La asignacion fallo/);
      // El primero queda en cola (syncOk false) y el segundo falla.
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: false })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { result } = montar(DOS);
      await elegirYAsignar(result);

      mockActualizarRecurso.mockResolvedValue({ syncOk: true });
      await act(async () => {
        await result.current.asignar();
      });

      // syncOk arrastra el intento anterior: el elemento 1 sigue en cola aunque el segundo
      // intento haya drenado. Reiniciarlo presentaria como sincronizado algo que no lo esta.
      expect(result.current.resultado).toEqual({ asignados: 2, syncOk: false });
    });

    it("reiniciar limpia el progreso para que la siguiente sesion no herede el conteo", async () => {
      expectConsoleError(/La asignacion fallo/);
      mockActualizarRecurso
        .mockResolvedValueOnce({ syncOk: true })
        .mockRejectedValueOnce(new Error("almacenamiento lleno"));

      const { result } = montar(DOS);
      await elegirYAsignar(result);
      expect(result.current.errorEscritura?.asignados).toBe(1);

      await act(async () => {
        result.current.reiniciar();
      });
      expect(result.current.errorEscritura).toBeNull();

      mockActualizarRecurso.mockResolvedValue({ syncOk: true });
      await elegirYAsignar(result);

      // Dos, no tres: el conteo de la sesion anterior no se arrastra al mismo destino.
      expect(result.current.resultado).toEqual({ asignados: 2, syncOk: true });
    });
  });
});
