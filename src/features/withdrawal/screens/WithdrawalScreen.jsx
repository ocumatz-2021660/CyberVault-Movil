import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { Wallet, CheckCircle, ArrowLeft, ArrowDownCircle } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useWithdrawals } from "../hook/useWithdrawals";
import { useAuthStore } from "../../../shared/store/authStore";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import { useNavigation } from "@react-navigation/native";
import accountClient from "../../../shared/api/accountClient";

const CURRENCY_SYMBOLS = { GTQ: "Q", USD: "$", EUR: "€" };

const formatBalance = (amount, currency = "GTQ") => {
    const symbol = CURRENCY_SYMBOLS[currency] || "Q";
    return `${symbol}${Number(amount).toLocaleString("es-GT", { minimumFractionDigits: 2 })}`;
};

const WithdrawalScreen = () => {
    const navigation = useNavigation();
    const user = useAuthStore((state) => state.user);
    const { crearRetiro, loading } = useWithdrawals();

    const [cuentas, setCuentas] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [serverError, setServerError] = useState(null);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: { no_cuenta: "", monto: "" },
    });

    const selectedNoCuenta = watch("no_cuenta");
    const selectedCuenta = cuentas.find(c => c.no_cuenta === selectedNoCuenta);

    useFocusEffect(
        useCallback(() => {
            const loadCuentas = async () => {
                try {
                    const res = await accountClient.get(`/cuentas/usuario/${user?.id}`);
                    const activas = (res.data.data || []).filter(c => c.isActive);
                    setCuentas(activas);
                    if (activas.length === 1) setValue("no_cuenta", activas[0].no_cuenta);
                } catch (err) {
                    console.error("Error cargando cuentas:", err);
                }
            };
            loadCuentas();
        }, [])
    );

    const onSubmit = async (data) => {
        setServerError(null);
        try {
            const result = await crearRetiro({ no_cuenta: data.no_cuenta, monto: Number(data.monto) });
            setSuccessData(result);
            setShowSuccess(true);
        } catch (err) {
            setServerError(err.response?.data?.message || "Error al realizar el retiro");
        }
    };

    const handleGoBack = () => {
        setShowSuccess(false);
        navigation.goBack();
    };


    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: COLORS.background },
        header: {
            flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "transparent",
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border, height: 56,
        },
        backButton: {
            width: 40, height: 40, justifyContent: "center", alignItems: "center",borderRadius: 8,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
        },
        headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: "700", color: COLORS.text_primary },
        scrollContent: { flex: 1 },
        scrollContainer: { padding: SPACING.md, paddingTop: SPACING.lg },
        label: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.text_secondary, marginBottom: SPACING.sm },
        emptyText: { color: COLORS.text_secondary, fontSize: FONT_SIZE.sm, marginBottom: SPACING.md },
        typeRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
        typeCard: {
            flex: 1, backgroundColor: COLORS.surface, borderRadius: SPACING.md,
            padding: SPACING.lg, alignItems: "center", borderWidth: 2, borderColor: COLORS.light_error, ...SHADOWS.sm,
        },
        typeCardSelected: { borderColor: COLORS.error },
        typeIconContainer: {
            width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.light_error,
            justifyContent: "center", alignItems: "center", marginBottom: SPACING.sm,
        },
        typeIconContainerSelected: { backgroundColor: COLORS.light_error },
        typeLabel: { fontSize: FONT_SIZE.md, fontWeight: "700", color: COLORS.text_primary, marginBottom: 4 },
        typeLabelSelected: { color: COLORS.error },
        typeBalance: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.text_secondary },
        errorText: { color: COLORS.error, fontSize: FONT_SIZE.xs, fontWeight: "700", marginBottom: SPACING.md, marginTop: -SPACING.sm },
        errorBanner: { backgroundColor: COLORS.light_error, padding: SPACING.md, borderRadius: SPACING.sm, marginBottom: SPACING.md },
        errorBannerText: { color: COLORS.error, fontSize: FONT_SIZE.sm, fontWeight: "600", textAlign: "center" },
        submitButton: { marginTop: SPACING.sm, marginBottom: SPACING.xl },
        modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: SPACING.xl },
        modalContent: {
            backgroundColor: COLORS.surface, borderRadius: SPACING.lg, padding: SPACING.xl,
            alignItems: "center", width: "100%", maxWidth: 340, ...SHADOWS.md,
        },
        modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: "800", color: COLORS.text_primary, marginTop: SPACING.lg, marginBottom: SPACING.sm },
        modalMessage: { fontSize: FONT_SIZE.sm, color: COLORS.text_secondary, textAlign: "center", lineHeight: 22, marginBottom: SPACING.lg },
        modalButton: { width: "100%" },
    });

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text_primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Retirar</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Cuenta a retirar</Text>
                {cuentas.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes cuentas activas</Text>
                ) : (
                    <Controller
                        control={control}
                        rules={{ required: "Selecciona una cuenta" }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.typeRow}>
                                {cuentas.map((cuenta) => {
                                    const isSelected = value === cuenta.no_cuenta;
                                    return (
                                        <TouchableOpacity
                                            key={cuenta._id}
                                            style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                                            onPress={() => onChange(cuenta.no_cuenta)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={[styles.typeIconContainer, isSelected && styles.typeIconContainerSelected]}>
                                                <ArrowDownCircle size={28} color={isSelected ? COLORS.error : COLORS.surface} />
                                            </View>
                                            <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                                                {cuenta.tipo_cuenta === "AHORRO" ? "Ahorro" : "Monetaria"}
                                            </Text>
                                            <Text style={styles.typeBalance}>No. {cuenta.no_cuenta}</Text>
                                            <Text style={styles.typeLabel}>{formatBalance(cuenta.saldo)}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        name="no_cuenta"
                    />
                )}
                {errors.no_cuenta && <Text style={styles.errorText}>{errors.no_cuenta.message}</Text>}

                <Controller
                    control={control}
                    rules={{
                        required: "Ingresa el monto a retirar",
                        validate: (value) => {
                            const num = Number(value);
                            if (isNaN(num) || num <= 0) return "El monto debe ser mayor que 0";
                            if (num > 2000) return "El monto máximo por retiro es Q2,000.00";
                            if (selectedCuenta && num > Number(selectedCuenta.saldo)) return "Fondos insuficientes";
                            return true;
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Monto (máx. Q2,000.00)"
                            placeholder="Q0.00"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            error={errors.monto?.message}
                        />
                    )}
                    name="monto"
                />

                {serverError && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{serverError}</Text>
                    </View>
                )}

                <Button
                    title="Retirar"
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
                        <Text style={styles.modalTitle}>Retiro Exitoso</Text>
                        <Text style={styles.modalMessage}>
                            Retiraste {formatBalance(successData?.data?.monto)} de tu cuenta exitosamente.
                        </Text>
                        <Button title="Ir al Dashboard" onPress={handleGoBack} variant="primary" style={styles.modalButton} />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default WithdrawalScreen;