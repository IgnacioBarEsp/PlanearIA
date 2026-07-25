import React, { useMemo } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  Switch,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FONT_SIZES } from "../../../../types";
import { useAppTheme } from "../../../themes/useAppTheme";
import type { ThemedStylesInput } from "../../../themes/types";
import WebScrollView from "../../../components/WebScrollView";
import { useCrearTareaGrupoViewModel } from "../../../hooks/useCrearTareaGrupoViewModel";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { AppRoutesParamList } from "../../../navigation/StackNavigator";

let DateTimePicker: React.ComponentType<any> | null = null;
try {
  DateTimePicker = require("@react-native-community/datetimepicker").default;
} catch {
  DateTimePicker = null;
}

/**
 * Pantalla para crear un nuevo entregable (View)
 * Diseño basado en Stitch screenshots — coincide con el diseño de Figma
 */
// El hook vive fuera del componente a proposito: componer el tema dentro sumaba
// lineas a un componente que ya rozaba el umbral de tamano de React Doctor, y la
// migracion no deberia empeorar ese diagnostico. Conserva la memoizacion porque
// la identidad del objeto de useAppTheme solo cambia con una preferencia.
function useThemedStyles() {
  const theme = useAppTheme();
  return useMemo(() => getStyles(theme), [theme]);
}

const CrearTareaGrupoScreen: React.FC = () => {
  const { colors: DT } = useAppTheme();
  const styles = useThemedStyles();

  const route = useRoute<RouteProp<AppRoutesParamList, "CrearTareaGrupo">>();
  const navigation = useNavigation();
  const vm = useCrearTareaGrupoViewModel(
    route.params.grupoId,
    route.params.entregableId,
    route.params.unidadId
  );

  const isExamen = vm.tipo === "examen";

  const tituloLabel = isExamen ? "Título del Examen" : "TÍTULO DEL ENTREGABLE";
  const valorLabel = isExamen ? "Valor porcentual (%)" : "VALOR (PUNTOS)";
  const fechaEntregaLabel = isExamen ? "Fecha de Aplicación" : "FECHA DE ENTREGA";

  const headerText = vm.isEditMode ? "Editar\nEntregable" : "Crear\nEntregable";
  const saveText = vm.isEditMode ? "Guardar Cambios" : "Guardar Entregable";

  const fechaAsignacionValue = useMemo(() => new Date(), [vm.showFechaAsignacionPicker]);
  const fechaEntregaValue = useMemo(() => new Date(), [vm.showFechaEntregaPicker]);
  const fechaLimiteValue = useMemo(() => new Date(), [vm.showFechaLimitePicker]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={DT.primary} barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.headerBackButton, pressed && { opacity: 0.6 }]}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text style={styles.headerTitle}>{headerText}</Text>
          <View style={{ flex: 1 }} />
          {vm.isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Pressable
              style={({ pressed }) => [styles.headerSaveButton, pressed && { opacity: 0.6 }]}
              onPress={vm.handleGuardar}
            >
              <Text style={styles.headerSaveText}>{saveText}</Text>
            </Pressable>
          )}
        </View>

        <WebScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Type selector */}
            <Text style={styles.sectionLabel}>TIPO DE ENTREGABLE</Text>
            <View style={styles.tipoContainer}>
              {vm.tipoOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => [
                    styles.tipoPill,
                    vm.tipo === option.value && styles.tipoPillActive,
                    pressed && { opacity: 0.6 },
                  ]}
                  onPress={() =>
                    vm.setTipo(option.value as "tarea" | "examen" | "proyecto" | "investigacion")
                  }
                >
                  <Text
                    style={[
                      styles.tipoPillText,
                      vm.tipo === option.value && styles.tipoPillTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Form card */}
            <View style={styles.formCard}>
              {/* Grupo asignado */}
              <View style={styles.grupoCard}>
                <View style={styles.grupoIconContainer}>
                  <MaterialIcons name="groups" size={24} color={DT.primary} />
                </View>
                <View>
                  <Text style={styles.grupoLabel}>GRUPO ASIGNADO</Text>
                  <Text style={styles.grupoNombre}>{vm.grupoNombre}</Text>
                </View>
              </View>

              {/* Título */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{tituloLabel}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Ensayo sobre la Revolución Industrial"
                  value={vm.titulo}
                  onChangeText={vm.setTitulo}
                  placeholderTextColor={DT.textSecondary}
                />
              </View>

              {/* Valor */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{valorLabel}</Text>
                <View style={styles.valorRow}>
                  <TextInput
                    style={[styles.input, styles.valorInput]}
                    placeholder={isExamen ? "30" : "100"}
                    value={vm.valor}
                    onChangeText={vm.setValor}
                    keyboardType="numeric"
                    placeholderTextColor={DT.textSecondary}
                  />
                  {isExamen && <Text style={styles.valorSuffix}>%</Text>}
                </View>
              </View>

              {/* Descripción / Instrucciones */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  {isExamen ? "Descripción e Instrucciones" : "DESCRIPCIÓN / INSTRUCCIONES"}
                </Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe detalladamente los requisitos de la entrega..."
                  value={vm.descripcion}
                  onChangeText={vm.setDescripcion}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={DT.textSecondary}
                />
              </View>

              {/* Dates */}
              {!isExamen && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>FECHA DE ASIGNACIÓN</Text>
                  <Pressable
                    style={({ pressed }) => [styles.dateInput, pressed && { opacity: 0.6 }]}
                    onPress={() => vm.setShowFechaAsignacionPicker(true)}
                  >
                    <MaterialIcons name="event" size={20} color={DT.primary} />
                    <Text
                      style={[styles.dateInputText, !vm.fechaAsignacion && styles.datePlaceholder]}
                    >
                      {vm.fechaAsignacion || "dd/mm/aaaa"}
                    </Text>
                    <MaterialIcons name="calendar-today" size={20} color={DT.textSecondary} />
                  </Pressable>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{fechaEntregaLabel}</Text>
                <Pressable
                  style={({ pressed }) => [styles.dateInput, pressed && { opacity: 0.6 }]}
                  onPress={() => vm.setShowFechaEntregaPicker(true)}
                >
                  <MaterialIcons
                    name={isExamen ? "event" : "event-busy"}
                    size={20}
                    color={isExamen ? DT.primary : DT.error}
                  />
                  <Text style={[styles.dateInputText, !vm.fechaEntrega && styles.datePlaceholder]}>
                    {vm.fechaEntrega || "dd/mm/aaaa"}
                  </Text>
                  <MaterialIcons name="calendar-today" size={20} color={DT.textSecondary} />
                </Pressable>
              </View>

              {/* Late submission toggle */}
              <View style={styles.toggleContainer}>
                <View style={styles.toggleInfo}>
                  <MaterialIcons name="schedule" size={22} color={DT.text} />
                  <View style={styles.toggleTextContainer}>
                    <Text style={styles.toggleTitle}>Permitir entrega tardía</Text>
                    <Text style={styles.toggleSubtitle}>
                      {vm.permitirEntregaTardia
                        ? "El sistema marcará los envíos fuera de tiempo."
                        : 'SE MARCARÁ COMO "RETRASADA" EN EL CALIFICADOR'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={vm.permitirEntregaTardia}
                  onValueChange={vm.setPermitirEntregaTardia}
                  trackColor={{
                    false: DT.borderLight,
                    true: DT.primary,
                  }}
                  thumbColor="white"
                />
              </View>

              {/* Extended date when toggle is on */}
              {vm.permitirEntregaTardia && (
                <View style={styles.extendedDateContainer}>
                  <Pressable
                    style={({ pressed }) => [styles.extendedDateRow, pressed && { opacity: 0.6 }]}
                    onPress={() => vm.setShowFechaLimitePicker(true)}
                  >
                    <MaterialIcons name="event-busy" size={18} color={DT.primary} />
                    <Text style={styles.extendedDateLabel}>Fecha límite extendida:</Text>
                    <Text style={styles.extendedDateValue}>
                      {vm.fechaLimiteEntregaTardia || "dd/mm/aaaa"}
                    </Text>
                  </Pressable>
                </View>
              )}

              {/* Notas */}
              {!isExamen && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>NOTAS ADICIONALES (OPCIONAL)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Recordatorios internos para el docente..."
                    value={vm.notas}
                    onChangeText={vm.setNotas}
                    placeholderTextColor={DT.textSecondary}
                  />
                </View>
              )}
            </View>

            {/* Bottom buttons */}
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                vm.isSaving && styles.saveButtonDisabled,
                pressed && { opacity: 0.6 },
              ]}
              onPress={vm.handleGuardar}
              disabled={vm.isSaving}
            >
              {vm.isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.saveButtonText}>{saveText}</Text>
                  <MaterialIcons name="save" size={20} color="white" />
                </>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.6 }]}
              onPress={vm.handleCancelar}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>

            {vm.isEditMode && (
              <Pressable
                style={({ pressed }) => [styles.deleteButton, pressed && { opacity: 0.6 }]}
                onPress={vm.handleEliminar}
              >
                <MaterialIcons name="delete" size={20} color={DT.error} />
                <Text style={styles.deleteButtonText}>Eliminar Entregable</Text>
              </Pressable>
            )}
          </View>
        </WebScrollView>

        {/* Date Pickers */}
        {DateTimePicker && vm.showFechaAsignacionPicker && (
          <DateTimePicker
            value={fechaAsignacionValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={vm.onFechaAsignacionChange}
          />
        )}
        {DateTimePicker && vm.showFechaEntregaPicker && (
          <DateTimePicker
            value={fechaEntregaValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={vm.onFechaEntregaChange}
          />
        )}
        {DateTimePicker && vm.showFechaLimitePicker && (
          <DateTimePicker
            value={fechaLimiteValue}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={vm.onFechaLimiteChange}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const getStyles = ({ colors: DT, isDark, scaled, highContrast }: ThemedStylesInput) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: DT.background,
    },
    safeArea: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: DT.primary,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    headerBackButton: {
      marginRight: 12,
    },
    headerTitle: {
      fontSize: FONT_SIZES.medium,
      fontWeight: "bold",
      color: "white",
    },
    headerSaveButton: {
      backgroundColor: "rgba(255,255,255,0.2)",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
    },
    headerSaveText: {
      color: "white",
      fontSize: FONT_SIZES.small,
      fontWeight: "bold",
    },
    scrollView: {
      flex: 1,
    },
    content: {
      width: "100%",
      maxWidth: 960,
      alignSelf: "center",
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 110,
    },
    sectionLabel: {
      fontSize: FONT_SIZES.small,
      fontWeight: "600",
      color: DT.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 10,
    },
    tipoContainer: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 20,
    },
    tipoPill: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: DT.border,
      backgroundColor: DT.surface,
    },
    tipoPillActive: {
      backgroundColor: DT.primary,
      borderColor: DT.primary,
    },
    tipoPillText: {
      fontSize: FONT_SIZES.medium,
      fontWeight: "600",
      color: DT.text,
    },
    tipoPillTextActive: {
      color: "white",
    },
    formCard: {
      backgroundColor: DT.surface,
      borderWidth: 1,
      borderColor: DT.borderLight,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    grupoCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${DT.primary}08`,
      borderRadius: 12,
      padding: 14,
      marginBottom: 20,
      gap: 12,
    },
    grupoIconContainer: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: `${DT.primary}15`,
      justifyContent: "center",
      alignItems: "center",
    },
    grupoLabel: {
      fontSize: FONT_SIZES.small,
      fontWeight: "bold",
      color: DT.primary,
      letterSpacing: 0.5,
      marginBottom: 2,
    },
    grupoNombre: {
      fontSize: FONT_SIZES.medium,
      fontWeight: "bold",
      color: DT.text,
    },
    inputGroup: {
      marginBottom: 18,
    },
    label: {
      fontSize: FONT_SIZES.small,
      fontWeight: "600",
      color: DT.textSecondary,
      letterSpacing: 0.3,
      marginBottom: 8,
    },
    input: {
      backgroundColor: DT.backgroundSoft,
      borderWidth: 1,
      borderColor: DT.borderLight,
      borderRadius: 10,
      padding: 14,
      fontSize: FONT_SIZES.medium,
      color: DT.text,
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },
    valorRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    valorInput: {
      flex: 1,
    },
    valorSuffix: {
      fontSize: FONT_SIZES.large,
      fontWeight: "600",
      color: DT.textSecondary,
      marginLeft: 10,
    },
    dateInput: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: DT.backgroundSoft,
      borderWidth: 1,
      borderColor: DT.borderLight,
      borderRadius: 10,
      padding: 14,
      gap: 10,
    },
    dateInputText: {
      flex: 1,
      fontSize: FONT_SIZES.medium,
      color: DT.text,
    },
    datePlaceholder: {
      color: DT.textSecondary,
    },
    toggleContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: `${DT.primary}08`,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
    },
    toggleInfo: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 10,
    },
    toggleTextContainer: {
      flex: 1,
    },
    toggleTitle: {
      fontSize: FONT_SIZES.medium,
      fontWeight: "bold",
      color: DT.text,
    },
    toggleSubtitle: {
      fontSize: FONT_SIZES.small,
      color: DT.textSecondary,
      marginTop: 2,
    },
    extendedDateContainer: {
      backgroundColor: DT.backgroundSoft,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: DT.borderLight,
      padding: 14,
      marginBottom: 16,
    },
    extendedDateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    extendedDateLabel: {
      fontSize: FONT_SIZES.small,
      color: DT.textSecondary,
    },
    extendedDateValue: {
      fontSize: FONT_SIZES.medium,
      fontWeight: "bold",
      color: DT.text,
      marginLeft: "auto",
    },
    saveButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DT.primary,
      paddingVertical: 16,
      borderRadius: 30,
      gap: 8,
      marginBottom: 12,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: "white",
      fontSize: FONT_SIZES.medium,
      fontWeight: "bold",
    },
    cancelButton: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: DT.border,
      backgroundColor: DT.surface,
    },
    cancelButtonText: {
      color: DT.text,
      fontSize: FONT_SIZES.medium,
      fontWeight: "600",
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 14,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: DT.error,
      backgroundColor: "#FFF5F5",
      marginTop: 8,
      gap: 8,
    },
    deleteButtonText: {
      color: DT.error,
      fontSize: FONT_SIZES.medium,
      fontWeight: "600",
    },
  });

export default CrearTareaGrupoScreen;
