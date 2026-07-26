import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppTheme } from "../../themes/useAppTheme";
import { radii, scaleType, spacing, typography } from "../../themes/tokens";
import type { ColorTokens, ThemedStylesInput } from "../../themes/types";
import { MIN_TOUCH_TARGET, minTargetBox, overflowMinTarget, useFocusRing } from "./primitives";
import type { ToneVariant } from "./primitives";

export interface BannerProps {
  tone?: ToneVariant;
  titulo: string;
  mensaje?: string;
  /** Accion opcional en linea, por ejemplo reintentar o revisar. */
  accion?: { label: string; onPress: () => void };
  onDismiss?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/**
 * Aviso persistente en linea con el contenido.
 *
 * A diferencia de `Toast`, no se va solo: comunica una condicion que sigue vigente. Cada
 * tono lleva icono propio ademas de color, porque el color por si solo no comunica a
 * quien no lo distingue; el icono y el texto sostienen el mensaje.
 */
const Banner: React.FC<BannerProps> = ({
  tone = "info",
  titulo,
  mensaje,
  accion,
  onDismiss,
  style,
  testID,
}) => {
  const { colors, isDark, scaled, highContrast } = useAppTheme();
  const accionFoco = useFocusRing();
  const cerrarFoco = useFocusRing();
  const styles = useMemo(
    () => getStyles({ colors, isDark, scaled, highContrast }),
    [colors, isDark, scaled, highContrast]
  );

  const paleta = TONOS[tone];

  return (
    <View
      style={[styles.banner, { backgroundColor: colors[paleta.fondo], borderColor: colors[paleta.borde] }, style]}
      accessibilityRole="alert"
      testID={testID}
    >
      <MaterialIcons name={paleta.icono} size={22} color={colors[paleta.borde]} style={styles.icono} />

      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        {accion ? (
          <Pressable
            style={[styles.accion, accionFoco.focused && styles.focusRing]}
            onPress={accion.onPress}
            onFocus={accionFoco.onFocus}
            onBlur={accionFoco.onBlur}
            accessibilityRole="button"
            accessibilityLabel={accion.label}
          >
            <Text style={[styles.accionLabel, { color: colors[paleta.borde] }]}>{accion.label}</Text>
          </Pressable>
        ) : null}
      </View>

      {onDismiss ? (
        <Pressable
          style={[styles.cerrar, cerrarFoco.focused && styles.focusRing]}
          onPress={onDismiss}
          onFocus={cerrarFoco.onFocus}
          onBlur={cerrarFoco.onBlur}
          accessibilityRole="button"
          accessibilityLabel="Descartar aviso"
          // Sin ancla propia el control no se puede medir en navegador, que es como se
          // detecto que su area tactil no llegaba a 44 puntos.
          testID={testID ? `${testID}-dismiss` : undefined}
        >
          <MaterialIcons name="close" size={18} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
};

/** Huella visual del boton de cerrar. La caja tactil es de 44 y desborda esto por lado. */
const ICONO_CERRAR = 28;

interface TonoPaleta {
  icono: keyof typeof MaterialIcons.glyphMap;
  fondo: keyof ColorTokens;
  borde: keyof ColorTokens;
}

const TONOS: Record<ToneVariant, TonoPaleta> = {
  info: { icono: "info", fondo: "primaryTint", borde: "primary" },
  success: { icono: "check-circle", fondo: "successLight", borde: "success" },
  warning: { icono: "warning-amber", fondo: "warningTint", borde: "warning" },
  error: { icono: "error-outline", fondo: "errorTint", borde: "error" },
};

const getStyles = ({ colors, scaled, highContrast }: ThemedStylesInput) =>
  StyleSheet.create({
    banner: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.md,
      borderWidth: 1,
    },
    icono: {
      marginTop: 2,
    },
    textos: {
      flex: 1,
    },
    titulo: {
      ...scaleType(typography.bodyStrong, scaled),
      color: colors.text,
    },
    mensaje: {
      ...scaleType(typography.caption, scaled),
      color: highContrast ? colors.text : colors.textSecondary,
      marginTop: spacing.xs,
    },
    accion: {
      alignSelf: "flex-start",
      justifyContent: "center",
      minHeight: MIN_TOUCH_TARGET,
      marginTop: spacing.xs,
      paddingRight: spacing.sm,
      borderRadius: radii.sm,
    },
    accionLabel: {
      ...scaleType(typography.bodyStrong, scaled),
    },
    cerrar: {
      ...minTargetBox(),
      // Ver Sheet: la caja llega a 44 y el desborde se absorbe en el padding del aviso, asi
      // que el alto del banner no cambia.
      marginVertical: -overflowMinTarget(ICONO_CERRAR),
      borderRadius: radii.sm,
    },
    focusRing: {
      boxShadow: `0px 0px 0px 3px ${colors.primary}`,
    },
  });

export default Banner;
