/**
 * ViewModel del selector transversal de asignar y adjuntar (change assign-sheet, #84).
 *
 * Existe porque asignar ocurria en cuatro superficies y tres de ellas perdian el trabajo
 * del docente: escribian el destino en almacenamiento sin encolar la operacion, asi que el
 * pull siguiente aplicaba `reconcileWithPending` y el remoto ganaba. Aqui la escritura pasa
 * por los contextos que ya llaman a `queueEntityOperation`, que es el unico camino sancionado.
 *
 * La hoja renderiza lo que este hook resuelve; no decide destinos ni ejecuta escrituras.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Recurso, Tarea } from "../../types";
import type { UnidadClassroom } from "../../types/unidadClassroom";
import { useGruposContext } from "../context/GruposContext";
import { useRecursos } from "../context/RecursosContext";
import { useEntregables } from "../context/EntregablesContext";
import { classroomFacade } from "../services/classroom/classroomFacade";
import logger from "../utils/logger";

export type ElementoAsignableTipo = "recurso" | "entregable";

export interface ElementoAsignable {
  id: number;
  titulo: string;
  tipo: ElementoAsignableTipo;
}

export interface OpcionDestino {
  id: string;
  label: string;
}

export interface DestinoAsignacion {
  grupoId: number | null;
  unidadId: string | null;
  tareaId: number | null;
}

export interface ResultadoAsignacion {
  /** Elementos que el camino de escritura modifico de verdad. */
  asignados: number;
  /** True solo si la cola quedo drenada para todos: distingue sincronizado de encolado. */
  syncOk: boolean;
}

/**
 * Fallo de la escritura, con lo que alcanzo a ocurrir antes de fallar.
 *
 * Los conteos no son decoracion: los elementos ya escritos quedaron ademas encolados, asi
 * que se subiran igual. Callarlos haria creer al docente que no se guardo nada y lo
 * llevaria a rehacer un trabajo que ya existe.
 */
export interface ErrorEscritura {
  mensaje: string;
  /** Elementos escritos y encolados hacia el destino vigente, acumulados entre intentos. */
  asignados: number;
  /** Elementos que aun no se intentaron y que un reintento tomaria. */
  pendientes: number;
}

export interface AssignSheetViewModel {
  clases: OpcionDestino[];
  unidades: OpcionDestino[];
  actividades: OpcionDestino[];
  /** Falso cuando algun elemento no puede referenciar una actividad: el nivel no se ofrece. */
  admiteActividad: boolean;
  destino: DestinoAsignacion;
  elegirClase: (grupoId: number | null) => void;
  elegirUnidad: (unidadId: string | null) => void;
  elegirActividad: (tareaId: number | null) => void;
  /** Nombre legible del destino, para que la confirmacion no sea una formula generica. */
  resumenDestino: string | null;
  puedeConfirmar: boolean;
  cargando: boolean;
  /**
   * Fallo al cargar los destinos de la clase elegida.
   *
   * Separado de `errorEscritura` a proposito: con un solo campo, los dos caminos se pisaban
   * y la hoja anunciaba siempre la causa equivocada con una accion que no reparaba nada.
   */
  errorCarga: string | null;
  /** Recuperacion del fallo de carga: vuelve a pedir los destinos de la clase elegida. */
  reintentarCarga: () => void;
  errorEscritura: ErrorEscritura | null;
  ejecutando: boolean;
  resultado: ResultadoAsignacion | null;
  /** Ejecuta la asignacion. Reinvocarla tras un fallo es el reintento: retoma lo pendiente. */
  asignar: () => Promise<void>;
  reiniciar: () => void;
}

const DESTINO_VACIO: DestinoAsignacion = { grupoId: null, unidadId: null, tareaId: null };

/**
 * Identidad del destino, para que el progreso de escritura no pueda cruzarse de destino.
 *
 * Lo ya escrito apunta al destino con el que se escribio. Si el docente cambia de destino
 * tras un fallo parcial, saltarse esos elementos los dejaria en el destino anterior sin que
 * nadie lo note. Comparar esta clave hace la invariante estructural: no depende de acordarse
 * de limpiar el progreso en cada `elegir*`.
 */
const claveDestino = (destino: DestinoAsignacion): string =>
  `${destino.grupoId}|${destino.unidadId}|${destino.tareaId}`;

/** Marca estable de un elemento dentro de un intento de escritura. */
const marcaElemento = (elemento: ElementoAsignable): string => `${elemento.tipo}:${elemento.id}`;

interface ProgresoEscritura {
  clave: string;
  /** Elementos ya resueltos: escritos, o descartados por no existir. No se reintentan. */
  procesados: Set<string>;
  asignados: number;
  syncOk: boolean;
}

const PROGRESO_VACIO = (): ProgresoEscritura => ({
  clave: claveDestino(DESTINO_VACIO),
  procesados: new Set<string>(),
  asignados: 0,
  syncOk: true,
});

export function useAssignSheet(elementos: ElementoAsignable[]): AssignSheetViewModel {
  const { grupos, isLoading: cargandoClases } = useGruposContext();
  const { actualizarRecurso, obtenerRecursoPorId } = useRecursos();
  const { actualizarEntregable, obtenerEntregablePorId } = useEntregables();

  const [destino, setDestino] = useState<DestinoAsignacion>(DESTINO_VACIO);
  const [unidadesGrupo, setUnidadesGrupo] = useState<UnidadClassroom[]>([]);
  const [actividadesGrupo, setActividadesGrupo] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [errorEscritura, setErrorEscritura] = useState<ErrorEscritura | null>(null);
  const [ejecutando, setEjecutando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAsignacion | null>(null);
  const [intento, setIntento] = useState(0);

  // Una respuesta lenta de un grupo abandonado no debe pisar la de su reemplazo.
  const grupoVigente = useRef<number | null>(null);

  // Vive en una ref y no en estado porque no se pinta: lo que la hoja muestra son los
  // conteos ya volcados en `errorEscritura` y en `resultado`. Guardarlo en estado forzaria
  // un render por elemento escrito sin cambiar nada de lo que se ve.
  const progreso = useRef<ProgresoEscritura>(PROGRESO_VACIO());

  useEffect(() => {
    const grupoId = destino.grupoId;
    grupoVigente.current = grupoId;

    if (grupoId === null) {
      setUnidadesGrupo([]);
      setActividadesGrupo([]);
      setCargando(false);
      setErrorCarga(null);
      return;
    }

    let vigente = true;
    setCargando(true);
    setErrorCarga(null);

    void (async () => {
      try {
        const [unidades, actividades] = await Promise.all([
          classroomFacade.getUnidadesByGrupoId(grupoId),
          classroomFacade.getActividadesByGrupoId(grupoId),
        ]);
        if (!vigente || grupoVigente.current !== grupoId) return;
        setUnidadesGrupo(unidades);
        setActividadesGrupo(actividades);
      } catch (err) {
        if (!vigente || grupoVigente.current !== grupoId) return;
        logger.error("[useAssignSheet] No se pudieron cargar los destinos:", err);
        setUnidadesGrupo([]);
        setActividadesGrupo([]);
        setErrorCarga("No se pudieron cargar los destinos de esta clase.");
      } finally {
        if (vigente && grupoVigente.current === grupoId) setCargando(false);
      }
    })();

    return () => {
      vigente = false;
    };
  }, [destino.grupoId, intento]);

  const clases = useMemo<OpcionDestino[]>(
    () =>
      grupos
        .filter((grupo): grupo is typeof grupo & { id: number } => typeof grupo.id === "number")
        .map((grupo) => ({
          id: String(grupo.id),
          label: grupo.nombre ?? `Clase ${grupo.id}`,
        })),
    [grupos]
  );

  const unidades = useMemo<OpcionDestino[]>(
    () => unidadesGrupo.map((unidad) => ({ id: unidad.id, label: unidad.nombre })),
    [unidadesGrupo]
  );

  /**
   * La actividad como destino solo aplica a recursos.
   *
   * Un entregable no tiene campo para referenciar a otro entregable: `Tarea` no declara
   * `tareaId`. Ofrecer el nivel igualmente dejaria al docente eligiendo un destino que la
   * escritura descarta en silencio, y la confirmacion nombraria algo que no va a ocurrir.
   * Con un solo entregable en juego, el nivel desaparece.
   */
  const admiteActividad = useMemo(
    () => elementos.length > 0 && elementos.every((item) => item.tipo === "recurso"),
    [elementos]
  );

  const actividades = useMemo<OpcionDestino[]>(
    () =>
      admiteActividad
        ? actividadesGrupo.map((actividad) => ({
            id: String(actividad.id),
            label: actividad.titulo,
          }))
        : [],
    [actividadesGrupo, admiteActividad]
  );

  const elegirClase = useCallback((grupoId: number | null) => {
    // Cambiar de clase invalida los niveles inferiores: una unidad pertenece a una clase.
    setDestino({ grupoId, unidadId: null, tareaId: null });
    setResultado(null);
  }, []);

  const elegirUnidad = useCallback((unidadId: string | null) => {
    setDestino((prev) => ({ ...prev, unidadId, tareaId: null }));
    setResultado(null);
  }, []);

  const elegirActividad = useCallback((tareaId: number | null) => {
    setDestino((prev) => ({ ...prev, tareaId }));
    setResultado(null);
  }, []);

  const reintentarCarga = useCallback(() => setIntento((valor) => valor + 1), []);

  const reiniciar = useCallback(() => {
    setDestino(DESTINO_VACIO);
    setResultado(null);
    setErrorCarga(null);
    setErrorEscritura(null);
    // La clave de destino ya impide cruzar progreso entre destinos, pero no distingue volver
    // a abrir la hoja y elegir el mismo destino: sin este reset el conteo de la sesion
    // anterior se arrastraria a la nueva.
    progreso.current = PROGRESO_VACIO();
  }, []);

  const resumenDestino = useMemo(() => {
    if (destino.grupoId === null) return null;
    const clase = clases.find((opcion) => opcion.id === String(destino.grupoId));
    if (!clase) return null;
    const partes = [clase.label];
    const unidad = unidades.find((opcion) => opcion.id === destino.unidadId);
    if (unidad) partes.push(unidad.label);
    const actividad = actividades.find((opcion) => opcion.id === String(destino.tareaId));
    if (actividad) partes.push(actividad.label);
    return partes.join(" - ");
  }, [destino, clases, unidades, actividades]);

  // `cargandoClases` cuenta como carga: sin el, un docente con clases ve "aun no tienes
  // clases" durante el arranque del contexto, que es una afirmacion falsa.
  const cargandoTodo = cargando || cargandoClases;

  const puedeConfirmar =
    destino.grupoId !== null && elementos.length > 0 && !ejecutando && !cargandoTodo;

  const asignar = useCallback(async () => {
    if (destino.grupoId === null || elementos.length === 0 || ejecutando) return;

    const grupoId = destino.grupoId;
    // `tareaId` y `asignadoComoTarea` viajan siempre juntos: un material marcado como tarea
    // sin tarea a la que pertenecer se anuncia como algo que no es.
    const tareaId = destino.tareaId ?? undefined;
    const asignadoComoTarea = destino.tareaId !== null;
    // El destino queda completamente especificado por la hoja: un `unidadId` heredado de
    // otra clase apuntaria a una unidad que ya no existe en este grupo.
    const unidadId = destino.unidadId ?? undefined;

    // Un intento sobre un destino distinto del que produjo el progreso empieza de cero: lo
    // escrito antes apunta al destino anterior y hay que reescribirlo hacia el nuevo.
    const clave = claveDestino(destino);
    if (progreso.current.clave !== clave) {
      progreso.current = { clave, procesados: new Set<string>(), asignados: 0, syncOk: true };
    }
    const avance = progreso.current;

    setEjecutando(true);
    setErrorEscritura(null);

    try {
      for (const elemento of elementos) {
        const marca = marcaElemento(elemento);
        // Reintentar no reescribe lo ya resuelto: `actualizar*` encola en el motor, asi que
        // repetirlo duplicaria operaciones en la unica cola sancionada sin cambiar el
        // destino final.
        if (avance.procesados.has(marca)) continue;

        if (elemento.tipo === "recurso") {
          // Un id inexistente no se asigna: los contextos hacen upsert sobre el merge, asi
          // que escribir a ciegas crearia una entidad fantasma y despues se afirmaria que
          // se asigno algo que no existe.
          if (!obtenerRecursoPorId(elemento.id)) {
            // Resuelto aunque no cuente como asignado: reintentarlo volveria a descartarlo.
            avance.procesados.add(marca);
            continue;
          }
          const cambios: Partial<Recurso> = {
            grupoId,
            unidadId,
            tareaId,
            asignadoComoTarea,
          };
          const salida = await actualizarRecurso(elemento.id, cambios);
          if (!salida.syncOk) avance.syncOk = false;
        } else {
          if (!obtenerEntregablePorId(elemento.id)) {
            avance.procesados.add(marca);
            continue;
          }
          const cambios: Partial<Tarea> = { grupoId, unidadId };
          const salida = await actualizarEntregable(elemento.id, cambios);
          if (!salida.syncOk) avance.syncOk = false;
        }
        // Despues del await: si la escritura lanza, el elemento queda pendiente y el
        // reintento lo toma.
        avance.procesados.add(marca);
        avance.asignados += 1;
      }

      setResultado({ asignados: avance.asignados, syncOk: avance.syncOk });
    } catch (err) {
      logger.error("[useAssignSheet] La asignacion fallo:", err);
      setErrorEscritura({
        mensaje: "No se pudo completar la asignacion.",
        asignados: avance.asignados,
        pendientes: elementos.filter((item) => !avance.procesados.has(marcaElemento(item))).length,
      });
    } finally {
      setEjecutando(false);
    }
  }, [
    destino,
    elementos,
    ejecutando,
    actualizarRecurso,
    actualizarEntregable,
    obtenerRecursoPorId,
    obtenerEntregablePorId,
  ]);

  return {
    clases,
    unidades,
    actividades,
    admiteActividad,
    destino,
    elegirClase,
    elegirUnidad,
    elegirActividad,
    resumenDestino,
    puedeConfirmar,
    cargando: cargandoTodo,
    errorCarga,
    reintentarCarga,
    errorEscritura,
    ejecutando,
    resultado,
    asignar,
    reiniciar,
  };
}

export default useAssignSheet;
