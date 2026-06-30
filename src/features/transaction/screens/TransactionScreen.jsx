import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { Send, CheckCircle, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useTransactions } from "../hook/useTransaction";
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

const TransactionScreen = () => {
    const navigation = useNavigation();
    const user = useAuthStore((state) => state.user);
    const { fetchFavoritos, crearTransaccion, loading } = useTransactions();

    const [cuentas, setCuentas] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [showFavoritos, setShowFavoritos] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [serverError, setServerError] = useState(null);

    const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        defaultValues: { cuenta_origen: "", cuenta_destinatoria: "", monto: "" },
    });

    const selectedOrigin = watch("cuenta_origen");
    const selectedOriginData = cuentas.find(c => c.no_cuenta === selectedOrigin);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const res = await accountClient.get(`/cuentas/usuario/${user?.id}`);
                    const activas = (res.data.data || []).filter(c => c.isActive);
                    setCuentas(activas);
                    if (activas.length === 1) setValue("cuenta_origen", activas[0].no_cuenta);

                    const favs = await fetchFavoritos();
                    setFavoritos(favs);
                } catch (err) {
                    console.error("Error cargando datos:", err);
                }
            };
            loadData();
        }, [])
    );

    const onSubmit = async (data) => {
        setServerError(null);
        try {
            const result = await crearTransaccion({
                monto: Number(data.monto),
                tipo_transaccion: "TRANSFERENCIA",
                cuenta_origen: data.cuenta_origen,
                cuenta_destinatoria: data.cuenta_destinatoria,
            });
            setSuccessData(result);
            setShowSuccess(true);
        } catch (err) {
            setServerError(err.response?.data?.message || "Error al realizar la transferencia");
        }
    };

    const handleGoBack = () => {
        setShowSuccess(false);
        navigation.goBack();
    };

    const selectFavorito = (fav) => {
        setValue("cuenta_destinatoria", fav.alias_favorito);
        setShowFavoritos(false);
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: COLORS.background },
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
            alignItems: "center"
        },
        headerTitle: { fontSize: FONT_SIZE.lg, fontWeight: "700", color: COLORS.text_primary },
        scrollContent: { flex: 1 },
        scrollContainer: { padding: SPACING.md, paddingTop: SPACING.lg },
        label: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.text_secondary, marginBottom: SPACING.sm },
        emptyText: { color: COLORS.text_secondary, fontSize: FONT_SIZE.sm, marginBottom: SPACING.md },
        typeRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
        typeCard: {
            flex: 1, backgroundColor: COLORS.surface, borderRadius: SPACING.md,
            padding: SPACING.lg, alignItems: "center", borderWidth: 2, borderColor: COLORS.border, ...SHADOWS.sm,
        },
        typeCardSelected: { borderColor: COLORS.primary_blue },
        typeIconContainer: {
            width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.ligh_blue,
            justifyContent: "center", alignItems: "center", marginBottom: SPACING.sm,
        },
        typeIconContainerSelected: { backgroundColor: COLORS.ligh_blue },
        typeLabel: { fontSize: FONT_SIZE.md, fontWeight: "700", color: COLORS.text_primary, marginBottom: 4 },
        typeLabelSelected: { color: COLORS.primary_blue },
        typeBalance: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.text_secondary },
        errorText: { color: COLORS.error, fontSize: FONT_SIZE.xs, fontWeight: "700", marginBottom: SPACING.md, marginTop: -SPACING.sm },
        favoritosSection: { marginBottom: SPACING.md },
        favoritosToggle: {
            flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: SPACING.sm,
            borderWidth: 1, borderColor: COLORS.border, marginBottom: SPACING.xs,
        },
        favoritosToggleText: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.primary },
        favoritoItem: {
            flexDirection: "row", alignItems: "center", backgroundColor: COLORS.surface,
            padding: SPACING.sm, borderRadius: SPACING.sm, marginBottom: 4,
            borderWidth: 1, borderColor: COLORS.border,
        },
        favoritoInfo: { marginLeft: SPACING.sm, flex: 1 },
        favoritoAlias: { fontSize: FONT_SIZE.sm, fontWeight: "600", color: COLORS.text_primary },
        favoritoCuenta: { fontSize: FONT_SIZE.xs, color: COLORS.text_secondary },
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
                <Text style={styles.headerTitle}>Transferir</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Cuenta Origen</Text>
                {cuentas.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes cuentas activas</Text>
                ) : (
                    <Controller
                        control={control}
                        rules={{ required: "Selecciona una cuenta de origen" }}
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
                                                <Send size={28} color={isSelected ? COLORS.primary_blue : COLORS.surface} />
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
                        name="cuenta_origen"
                    />
                )}
                {errors.cuenta_origen && <Text style={styles.errorText}>{errors.cuenta_origen.message}</Text>}

                <Controller
                    control={control}
                    rules={{
                        required: "Ingresa el número de cuenta o alias del destinatario",
                        validate: (value) => {
                            if (!value) return true;
                            const esNumero = /^\d{10}$/.test(value);
                            if (esNumero && selectedOrigin === value) return "No puedes transferir a tu propia cuenta";
                            return true;
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Input
                            label="Cuenta Destino"
                            placeholder="Número de cuenta (10 dígitos) o alias"
                            value={value}
                            onChangeText={onChange}
                            error={errors.cuenta_destinatoria?.message}
                            icon={<Send size={18} color={COLORS.text_secondary} />}
                        />
                    )}
                    name="cuenta_destinatoria"
                />



                <Controller
                    control={control}
                    rules={{
                        required: "Ingresa el monto a transferir",
                        validate: (value) => {
                            const num = Number(value);
                            if (isNaN(num) || num <= 0) return "El monto debe ser mayor que 0";
                            if (num > 2000) return "El monto máximo por transacción es Q2,000.00";
                            if (selectedOriginData && num > Number(selectedOriginData.saldo)) return "Fondos insuficientes";
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
                    title="Transferir"
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
                        <Text style={styles.modalTitle}>Transferencia Exitosa</Text>
                        <Text style={styles.modalMessage}>
                            Se transfirieron {formatBalance(successData?.data?.monto)} exitosamente.
                        </Text>
                        <Button title="Ir al Dashboard" onPress={handleGoBack} variant="primary" style={styles.modalButton} />
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default TransactionScreen;