/**
 * Reactividad de los consumidores migrados a la fuente unica (spec: reactive-breakpoints).
 *
 * NO VACUIDAD. Aqui se mockea `useBreakpoint`, la fuente unica, y NO
 * `useWindowDimensions`. Es deliberado: si se mockeara la primitiva de
 * plataforma, una pantalla sin migrar la leeria igual que una migrada y el test
 * pasaria en ambos casos, que es exactamente el modo de fallo que la Ola 2a
 * documento ("un test que afirma sobre una sonda externa no prueba nada del
 * componente"). Al mockear la fuente unica con valores que CONTRADICEN las
 * dimensiones reales del entorno de pruebas, solo un consumidor que realmente
 * lea de ella puede satisfacer las aserciones.
 *
 * Verificado por mutacion: revirtiendo cualquiera de los tres consumidores a
 * `useWindowDimensions()` directo, su caso falla. Evidencia en
 * openspec/changes/sanear-breakpoints-uxui/evidencia/02-tests-no-vacuos.txt.
 */
import React from "react";
import { render, renderHook } from "@testing-library/react-native";

import type { BreakpointInfo } from "../../hooks/useBreakpoint";

const mockAncho: { actual: BreakpointInfo | null } = { actual: null };

jest.mock("../../hooks/useBreakpoint", () => {
  const actual = jest.requireActual("../../hooks/useBreakpoint");
  return {
    ...actual,
    useBreakpoint: () => mockAncho.actual ?? actual.useBreakpoint(),
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");
jest.mock("expo-linear-gradient", () => ({ LinearGradient: "LinearGradient" }));

import { CrearNuevoModal } from "../../components/CrearNuevoModal";
import ExpandedStatsModal from "../../components/ExpandedStatsModal";
import { getBreakpoint, BREAKPOINTS } from "../../hooks/useBreakpoint";
import { useEditorMode } from "../../hooks/useEditorMode";

function anchoVigente(width: number): void {
  const breakpoint = getBreakpoint(width);
  mockAncho.actual = {
    width,
    height: 900,
    fontScale: 1,
    breakpoint,
    isMobile: breakpoint === "mobile",
    isTablet: breakpoint === "tablet",
    isDesktop: breakpoint === "desktop",
  };
}

function arbol(element: React.ReactElement): string {
  return JSON.stringify(render(element).toJSON());
}

afterEach(() => {
  mockAncho.actual = null;
});

describe("Grupo A: el umbral canonico conmuta en el mismo punto que el shell", () => {
  const datos = {
    title: "Entregas",
    icon: "assignment",
    count: 3,
    items: [],
  };

  const modal = () => <ExpandedStatsModal visible data={datos as never} onClose={jest.fn()} />;

  // `handle`: width 36 / height 4, solo en movil. `cardDesktop`: maxWidth 560.
  const ASA_MOVIL = '"width":36,"height":4';
  const TARJETA_ESCRITORIO = '"maxWidth":560';

  // Cada caso afirma AMBOS lados del limite en la misma prueba. Es lo que la
  // hace discriminante: bajo mutacion, el consumidor sin migrar lee un ancho
  // constante del entorno y produce la misma salida a los dos anchos, asi que
  // una de las dos mitades falla siempre. Afirmar un solo lado dejaria que el
  // caso pasara por coincidencia con ese ancho constante.
  it("conmuta exactamente en 768: movil en 767, escritorio en 768", () => {
    anchoVigente(767);
    const angosto = arbol(modal());
    expect(angosto).toContain(ASA_MOVIL);
    expect(angosto).not.toContain(TARJETA_ESCRITORIO);

    anchoVigente(BREAKPOINTS.tablet);
    const ancho = arbol(modal());
    expect(ancho).toContain(TARJETA_ESCRITORIO);
    expect(ancho).not.toContain(ASA_MOVIL);
  });

  it("el punto de corte es el mismo que clasifica el shell", () => {
    // Ancla de rango, no de reactividad: fija que 768 es el limite que el shell
    // usa para pasar de barra inferior a rail. Si esta pantalla conmutara en
    // otro numero, ambos se desalinearian.
    expect(getBreakpoint(767)).toBe("mobile");
    expect(getBreakpoint(BREAKPOINTS.tablet)).toBe("tablet");
  });
});

describe("Grupo B: el umbral de contenido propio se conserva", () => {
  const modal = () => (
    <CrearNuevoModal visible onClose={jest.fn()} onNavigate={jest.fn()} />
  );

  const COPIA_ANGOSTA = "Selecciona plantilla y abre DocEditor.";
  const COPIA_ANCHA = "Elige plantilla y abre directo DocEditor tipo Word/Docs.";

  it("conmuta exactamente en 900: angosta en 899, ancha en 900", () => {
    anchoVigente(899);
    const angosto = arbol(modal());
    expect(angosto).toContain(COPIA_ANGOSTA);
    expect(angosto).not.toContain(COPIA_ANCHA);

    anchoVigente(900);
    const ancho = arbol(modal());
    expect(ancho).toContain(COPIA_ANCHA);
    expect(ancho).not.toContain(COPIA_ANGOSTA);
  });

  it("en 768 sigue angosta: su umbral es 900 y la migracion no lo normalizo", () => {
    // El caso que prueba que la migracion NO alineo los umbrales de contenido
    // con los rangos del shell. A 768 el shell ya es tablet, pero esta pantalla
    // necesita 900 para su presentacion ancha. Se contrasta contra 900 en la
    // misma prueba para que no pueda pasar por coincidencia.
    anchoVigente(BREAKPOINTS.tablet);
    const enLimiteDelShell = arbol(modal());
    expect(enLimiteDelShell).toContain(COPIA_ANGOSTA);
    expect(enLimiteDelShell).not.toContain(COPIA_ANCHA);

    anchoVigente(900);
    expect(arbol(modal())).toContain(COPIA_ANCHA);
  });
});

describe("Grupo C: las dimensiones crudas provienen de la fuente unica", () => {
  it("entrega el ancho y el alto vigentes sin clasificarlos en un rango", () => {
    anchoVigente(1000);
    const { result } = renderHook(() => useEditorMode());
    expect(result.current.width).toBe(1000);
    expect(result.current.height).toBe(900);
  });

  it("sigue al ancho cuando cambia, con su umbral configurable intacto", () => {
    anchoVigente(500);
    expect(renderHook(() => useEditorMode()).result.current.width).toBe(500);
    expect(renderHook(() => useEditorMode()).result.current.mode).toBe("mobile");

    anchoVigente(1000);
    expect(renderHook(() => useEditorMode()).result.current.width).toBe(1000);
    expect(renderHook(() => useEditorMode()).result.current.mode).toBe("standard");

    // El umbral es un parametro del hook, no un rango: subirlo por encima del
    // ancho vigente devuelve la pantalla al modo movil.
    anchoVigente(1000);
    expect(renderHook(() => useEditorMode({ breakpoint: 1200 })).result.current.mode).toBe("mobile");
  });
});
