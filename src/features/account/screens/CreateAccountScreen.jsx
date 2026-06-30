import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { Landmark, CheckCircle, ArrowLeft, PiggyBank } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useDashboard } from "../hooks/useDashboard";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import { useNavigation } from "@react-navigation/native";
import { Wallet } from "lucide-react-native";

const ACCOUNT_TYPES = [
    { key: "AHORRO", label: "Ahorro", description: "Cuenta de ahorros con intereses" },
    { key: "MONETARIA", label: "Monetaria", description: "Cuenta para uso diario" },
];

const CreateAccountScreen = () => {
    const navigation = useNavigation();
    const { fetchCrearCuenta } = useDashboard();

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [serverError, setServerError] = useState(null);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            tipo_cuenta: "",
            saldo: "",
            alias: "",
        },
    });

    const onSubmit = async (data) => {
        setServerError(null);
        setLoading(true);
        try {
            const result = await fetchCrearCuenta({
                tipo_cuenta: data.tipo_cuenta,
                saldo: data.saldo || "100",
                alias: data.alias,
            });
            setSuccessData(result);
            setShowSuccess(true);
        } catch (err) {
            setServerError(
                err.response?.data?.message || err.response?.data?.error || "Error al crear la cuenta"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        setShowSuccess(false);
        navigation.goBack();
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: COLORS.surface,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
            height: 56,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "700",
            color: COLORS.text_primary,
        },
        scrollContent: {
            flex: 1,
        },
        scrollContainer: {
            padding: SPACING.md,
            paddingTop: SPACING.lg,
        },
        label: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.text_secondary,
            marginBottom: SPACING.sm,
        },
        typeRow: {
            flexDirection: "row",
            gap: SPACING.sm,
            marginBottom: SPACING.md,
        },
        typeCard: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.md,
            padding: SPACING.lg,
            alignItems: "center",
            borderWidth: 2,
            borderColor: COLORS.border,
            ...SHADOWS.sm,
        },
        typeCardSelected: {
            borderColor: COLORS.primary,
            backgroundColor: COLORS.surface,
        },
        typeIconContainer: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.sm,
        },
        typeIconContainerSelected: {
            backgroundColor: COLORS.primary,
        },
        typeLabel: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: 4,
        },
        typeLabelSelected: {
            color: COLORS.primary,
        },
        typeDescription: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            textAlign: "center",
        },
        typeCheck: {
            position: "absolute",
            top: SPACING.sm,
            right: SPACING.sm,
        },
        errorText: {
            color: COLORS.error,
            fontSize: FONT_SIZE.xs,
            fontWeight: "700",
            marginBottom: SPACING.md,
            marginTop: -SPACING.sm,
        },
        hint: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            marginTop: -SPACING.sm,
            marginBottom: SPACING.md,
            paddingHorizontal: 4,
        },
        errorBanner: {
            backgroundColor: COLORS.light_error,
            padding: SPACING.md,
            borderRadius: SPACING.sm,
            marginBottom: SPACING.md,
        },
        errorBannerText: {
            color: COLORS.error,
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            textAlign: "center",
        },
        submitButton: {
            marginTop: SPACING.sm,
            marginBottom: SPACING.xl,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
        },
        modalContent: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.lg,
            padding: SPACING.xl,
            alignItems: "center",
            width: "100%",
            maxWidth: 340,
            ...SHADOWS.md,
        },
        modalTitle: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "800",
            color: COLORS.text_primary,
            marginTop: SPACING.lg,
            marginBottom: SPACING.sm,
        },
        modalMessage: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: SPACING.sm,
        },
        modalRef: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.primary,
            fontWeight: "600",
            marginBottom: SPACING.lg,
        },
        modalButton: {
            width: "100%",
        },
    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text_primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Solicitar Cuenta</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.label}>Tipo de Cuenta</Text>
                <Controller
                    control={control}
                    rules={{ required: "Selecciona un tipo de cuenta" }}
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.typeRow}>
                            {ACCOUNT_TYPES.map((type) => {
                                const isSelected = value === type.key;
                                return (
                                    <TouchableOpacity
                                        key={type.key}
                                        style={[
                                            styles.typeCard,
                                            isSelected && styles.typeCardSelected,
                                        ]}
                                        onPress={() => onChange(type.key)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[
                                            styles.typeIconContainer,
                                            isSelected && styles.typeIconContainerSelected,
                                        ]}>
                                            <Wallet
                                                size={32}
                                                color={isSelected ? COLORS.surface : COLORS.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.typeLabel,
                                            isSelected && styles.typeLabelSelected,
                                        ]}>
                                            {type.label}
                                        </Text>
                                        <Text style={styles.typeDescription}>
                                            {type.description}
                                        </Text>
                                        {isSelected && (
                                            <CheckCircle
                                                size={20}
                                                color={COLORS.primary}
                                                style={styles.typeCheck}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                    name="tipo_cuenta"
                />
                {errors.tipo_cuenta && (
                    <Text style={styles.errorText}>{errors.tipo_cuenta.message}</Text>
                )}

                <Controller
                    control={control}
                    rules={{
                        validate: (value) => {
                            if (!value) return true;
                            const num = Number(value);
                            if (isNaN(num) || num < 100) return "El saldo mínimo es Q100.00";
                            return true;
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Saldo Inicial"
                            placeholder="Q100.00"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            error={errors.saldo?.message}
                            icon={<Wallet size={18} color={COLORS.text_secondary} />}
                        />
                    )}
                    name="saldo"
                />
                <Text style={styles.hint}>
                    Mínimo Q100.00. Si no se especifica, se asignará Q100.00 por defecto.
                </Text>

                <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Alias (opcional)"
                            placeholder="Ej: Mi cuenta de ahorros"
                            value={value}
                            onChangeText={onChange}
                        />
                    )}
                    name="alias"
                />

                {serverError && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{serverError}</Text>
                    </View>
                )}

                <Button
                    title="Solicitar Cuenta"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    variant="primary"
                    style={styles.submitButton}
                />
            </ScrollView>

            <Modal visible={showSuccess} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <CheckCircle size={64} color={COLORS.primary} />
                        <Text style={styles.modalTitle}>Solicitud Enviada</Text>
                        <Text style={styles.modalMessage}>
                            Tu cuenta ha sido creada exitosamente y está pendiente de aprobación por un administrador.
                        </Text>
                        {successData?.data?.solicitud && (
                            <Text style={styles.modalRef}>
                                Ref: {successData.data.solicitud.id_solicitud}
                            </Text>
                        )}
                        <Button
                            title="Ir al Dashboard"
                            onPress={handleGoBack}
                            variant="primary"
                            style={styles.modalButton}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};


export default CreateAccountScreen;