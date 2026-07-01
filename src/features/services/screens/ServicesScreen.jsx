import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { Gift, CheckCircle, Award, ArrowLeft, PiggyBank, Wallet, Ticket, CircleCheck, CircleX } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useServices } from "../hooks/useServices";
import { useCurrency } from "../../../shared/hooks/useCurrency";
import Button from "../../../shared/components/common/Button";

const ServiceScreen = () => {
    const navigation = useNavigation();
    const { fetchServicios, fetchCuentas, canjearServicio, loading } = useServices();
    const { formatConverted } = useCurrency();

    const [servicios, setServicios] = useState([]);
    const [cuentas, setCuentas] = useState([]);
    const [loadingServicios, setLoadingServicios] = useState(true);
    const [errorServicios, setErrorServicios] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const [serverError, setServerError] = useState(null);

    const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        defaultValues: { cuenta_canje: "" },
    });

    const selectedCuentaId = watch("cuenta_canje");
    const selectedCuenta = cuentas.find(c => c._id === selectedCuentaId);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoadingServicios(true);
                setErrorServicios(null);

                try {
                    const data = await fetchServicios();
                    setServicios(data || []);
                } catch (err) {
                    setErrorServicios(err.response?.data?.message || "Error al cargar servicios");
                } finally {
                    setLoadingServicios(false);
                }

                try {
                    const data = await fetchCuentas();
                    setCuentas(data || []);
                } catch (err) {
                    console.error("Error cargando cuentas:", err);
                }
            };

            loadData();
        }, [])
    );

    const handleCanjear = (servicio) => {
        setSelectedServicio(servicio);
        reset({ cuenta_canje: "" });
        setServerError(null);
        if (cuentas.length === 1) setValue("cuenta_canje", cuentas[0]._id);
        setModalVisible(true);
    };

    const onSubmit = async () => {
        setServerError(null);
        try {
            const result = await canjearServicio({
                cuenta_canje: selectedCuentaId,
                servicio_canje: selectedServicio._id,
            });
            setSuccessData(result);
            setModalVisible(false);
            setShowSuccess(true);

            const updatedCuentas = await fetchCuentas();
            setCuentas(updatedCuentas || []);
        } catch (err) {
            setServerError(err.response?.data?.message || "Error al canjear el servicio");
        }
    };

    const handleGoBack = () => {
        setShowSuccess(false);
        navigation.goBack();
    };

    const getAccountIcon = (tipo) => {
        if (tipo === "AHORRO") return <PiggyBank size={22} color={COLORS.primary} />;
        return <Wallet size={22} color={COLORS.primary} />;
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
            backgroundColor: "transparent",
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.sm,
            height: 56,
        },
        backButton: {
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
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
            paddingTop: SPACING.sm,
        },
        sectionCard: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.md,
            padding: SPACING.lg,
            marginBottom: SPACING.md,
            borderRadius: 15,
            borderTopWidth: 2,
            borderTopColor: COLORS.primary,
            ...SHADOWS.containerCard,
        },
        sectionTitle: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: SPACING.md,
        },
        loader: {
            marginVertical: SPACING.xl,
        },
        errorText: {
            color: COLORS.error,
            fontSize: FONT_SIZE.sm,
            textAlign: "center",
            marginVertical: SPACING.md,
        },
        serviceCard: {
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: COLORS.background,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,            
            borderRightWidth: 2,
            borderTopColor: COLORS.primary,
            ...SHADOWS.containerCard
        },
        serviceIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginRight: SPACING.md,
        },
        serviceInfo: {
            flex: 1,
        },
        serviceName: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: 2,
        },
        serviceDesc: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            marginBottom: SPACING.sm,
            lineHeight: 20,
        },
        serviceFooter: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        servicePointsBadge: {
            backgroundColor: COLORS.primary,
            paddingHorizontal: SPACING.sm,
            paddingVertical: 2,
            borderRadius: 12,
        },
        servicePointsText: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "700",
            color: COLORS.surface,
        },
        redeemButton: {
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.xs,
            backgroundColor: COLORS.primary,
            borderRadius: SPACING.sm,
        },
        redeemButtonText: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "700",
            color: COLORS.surface,
        },
        emptyState: {
            alignItems: "center",
            paddingVertical: SPACING.xl,
        },
        emptyIcon: {
            marginBottom: SPACING.md,
        },
        emptyTitle: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: SPACING.xs,
        },
        emptySubtitle: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            textAlign: "center",
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
            width: "100%",
            maxWidth: 380,
            ...SHADOWS.md,
        },
        modalScroll: {
            maxHeight: 500,
        },
        modalHeader: {
            alignItems: "center",
            marginBottom: SPACING.lg,
        },
        modalServiceIcon: {
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.sm,
        },
        modalServiceName: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "800",
            color: COLORS.text_primary,
            textAlign: "center",
        },
        modalCostContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: SPACING.xs,
            marginTop: SPACING.xs,
        },
        modalCostLabel: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "700",
            color: COLORS.text_secondary,
        },
        modalCostValue: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "700",
            color: COLORS.primary,
        },
        modalSectionLabel: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.text_secondary,
            marginBottom: SPACING.sm,
            marginTop: SPACING.sm,
        },
        cuentaCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.background,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 2,
            borderColor: COLORS.border,
        },
        cuentaCardSelected: {
            borderColor: COLORS.primary,
            backgroundColor: COLORS.light_primary,
        },
        cuentaIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: COLORS.surface,
            justifyContent: "center",
            alignItems: "center",
            marginRight: SPACING.md,
        },
        cuentaInfo: {
            flex: 1,
        },
        cuentaType: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "700",
            color: COLORS.text_primary,
        },
        cuentaNumber: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
        },
        cuentaPoints: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.primary,
        },
        cuentaPointsLow: {
            color: COLORS.error,
        },
        warningContainer: {
            backgroundColor: COLORS.light_yellow,
            borderWidth: 2,
            borderColor: COLORS.primary_yellow,
            padding: SPACING.md,
            borderRadius: SPACING.sm,
            marginTop: SPACING.md,
            marginBottom: SPACING.md,
        },
        warningText: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_primary,
            textAlign: "center",
            lineHeight: 18,
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
        buttonRow: {
            flexDirection: "row",
            gap: SPACING.sm,
            width: "100%",
        },
        buttonHalf: {
            flex: 1,
        },

        successOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: SPACING.xl,
        },
        successContent: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.lg,
            padding: SPACING.xl,
            alignItems: "center",
            width: "100%",
            maxWidth: 340,
            ...SHADOWS.md,
        },
        successTitle: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "800",
            color: COLORS.text_primary,
            marginTop: SPACING.lg,
            marginBottom: SPACING.sm,
        },
        successMessage: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: SPACING.lg,
        },
        successPoints: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.primary,
            marginBottom: SPACING.lg,
        },
    });

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text_primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Servicios</Text>
                <View />
            </View>

            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Canjea tus puntos</Text>
                    <View style={{
                        backgroundColor: COLORS.light_primary,
                        padding: SPACING.md,
                        borderRadius: SPACING.sm,
                        marginBottom: SPACING.md,
                    }}>
                        <Text style={{
                            fontSize: FONT_SIZE.xs,
                            color: COLORS.primary_dark,
                            textAlign: "center",
                            lineHeight: 18,
                        }}>
                            Los servicios se canjean con los puntos acumulados en tus cuentas.
                            Seleccioná un servicio y elegí la cuenta desde la cual descontar los puntos.
                        </Text>
                    </View>
                    {loadingServicios ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                    ) : errorServicios ? (
                        <Text style={styles.errorText}>{errorServicios}</Text>
                    ) : servicios.length > 0 ? (
                        servicios.map((servicio) => (
                            <View key={servicio._id} style={styles.serviceCard}>
                                <View style={styles.serviceIconContainer}>
                                    <Gift size={22} color={COLORS.primary} />
                                </View>
                                <View style={styles.serviceInfo}>
                                    <Text style={styles.serviceName}>{servicio.nombre_servicio}</Text>
                                    <Text style={styles.serviceDesc} numberOfLines={2}>
                                        {servicio.descripcion_servicio}
                                    </Text>
                                    <View style={styles.serviceFooter}>
                                        <View style={styles.servicePointsBadge}>
                                            <Text style={styles.servicePointsText}>
                                                {servicio.puntos_requeridos} pts
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.redeemButton}
                                            onPress={() => handleCanjear(servicio)}
                                            activeOpacity={0.7}
                                        >
                                            <Text style={styles.redeemButtonText}>Canjear</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Gift size={48} color={COLORS.text_secondary} style={styles.emptyIcon} />
                            <Text style={styles.emptyTitle}>Próximos servicios</Text>
                            <Text style={styles.emptySubtitle}>
                                No hay servicios disponibles por el momento
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* MODAL CONFIRMACIÓN DE CANJE */}
            <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <ScrollView style={styles.modalScroll} contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
                                <View style={styles.modalContent}>
                                    <View style={styles.modalHeader}>
                                        <View style={styles.modalServiceIcon}>
                                            <Ticket size={28} color={COLORS.primary} />
                                        </View>
                                        <Text style={styles.modalServiceName}>
                                            {selectedServicio?.nombre_servicio}
                                        </Text>
                                        <View style={styles.modalCostContainer}>
                                            <Text style={styles.modalCostLabel}>Costo:</Text>
                                            <Text style={styles.modalCostValue}>
                                                {selectedServicio?.puntos_requeridos} pts
                                            </Text>
                                        </View>
                                    </View>

                                    <Text style={styles.modalSectionLabel}>Selecciona una cuenta</Text>

                                    {cuentas.length === 0 ? (
                                        <Text style={{ color: COLORS.text_secondary, fontSize: FONT_SIZE.sm, textAlign: "center", marginBottom: SPACING.md }}>
                                            No tienes cuentas activas
                                        </Text>
                                    ) : (
                                        <Controller
                                            control={control}
                                            rules={{ required: "Selecciona una cuenta" }}
                                            render={({ field: { onChange, value } }) => (
                                                <>
                                                    {cuentas.map((cuenta) => {
                                                        const isSelected = value === cuenta._id;
                                                        const hasPoints = cuenta.puntos_cuenta >= (selectedServicio?.puntos_requeridos || 0);
                                                        return (
                                                            <TouchableOpacity
                                                                key={cuenta._id}
                                                                style={[
                                                                    styles.cuentaCard,
                                                                    isSelected && styles.cuentaCardSelected,
                                                                ]}
                                                                onPress={() => onChange(cuenta._id)}
                                                                activeOpacity={0.7}
                                                            >
                                                                <View style={styles.cuentaIconContainer}>
                                                                    {getAccountIcon(cuenta.tipo_cuenta)}
                                                                </View>
                                                                <View style={styles.cuentaInfo}>
                                                                    <Text style={styles.cuentaType}>
                                                                        {cuenta.tipo_cuenta === "AHORRO" ? "Ahorro" : "Monetaria"}
                                                                    </Text>
                                                                    <Text style={styles.cuentaNumber}>
                                                                        No. {cuenta.no_cuenta}
                                                                    </Text>
                                                                    <Text style={[styles.cuentaPoints, !hasPoints && styles.cuentaPointsLow]}>
                                                                        {cuenta.puntos_cuenta} pts
                                                                    </Text>
                                                                </View>
                                                                <View style={{
                                                                    width: 22,
                                                                    height: 22,
                                                                    borderRadius: 11,
                                                                    borderWidth: 2,
                                                                    borderColor: isSelected ? COLORS.primary : COLORS.border,
                                                                    backgroundColor: isSelected ? COLORS.primary : "transparent",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}>
                                                                    {isSelected && (
                                                                        <View style={{
                                                                            width: 8,
                                                                            height: 8,
                                                                            borderRadius: 4,
                                                                            backgroundColor: COLORS.surface,
                                                                        }} />
                                                                    )}
                                                                </View>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </>
                                            )}
                                            name="cuenta_canje"
                                        />
                                    )}
                                    {errors.cuenta_canje && (
                                        <Text style={[styles.errorText, { marginTop: -SPACING.sm, marginBottom: SPACING.sm }]}>
                                            {errors.cuenta_canje.message}
                                        </Text>
                                    )}

                                    <View style={styles.warningContainer}>
                                        <Text style={styles.warningText}>
                                            Esta operación descontará el monto indicado de su saldo disponible. No hay reversiones automáticas.
                                        </Text>
                                    </View>

                                    {serverError && (
                                        <View style={styles.errorBanner}>
                                            <Text style={styles.errorBannerText}>{serverError}</Text>
                                        </View>
                                    )}

                                    <View style={styles.buttonRow}>
                                        <View style={styles.buttonHalf}>
                                            <Button
                                                title="Cancelar"
                                                onPress={() => setModalVisible(false)}
                                                variant="secondary"
                                                icon={<CircleX size={20} color={COLORS.primary}/>}

                                            />
                                        </View>
                                        <View style={styles.buttonHalf}>
                                            <Button
                                                title="Pagar"
                                                onPress={handleSubmit(onSubmit)}
                                                loading={loading}
                                                variant="primary"
                                                icon={<CheckCircle size={20} color={COLORS.surface}/>}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* MODAL ÉXITO */}
            <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={handleGoBack}>
                <TouchableWithoutFeedback onPress={handleGoBack}>
                    <View style={styles.successOverlay}>
                        <TouchableWithoutFeedback onPress={() => { }}>
                            <View style={styles.successContent}>
                                <CheckCircle size={64} color={COLORS.primary} />
                                <Text style={styles.successTitle}>Canje Exitoso</Text>
                                <Text style={styles.successMessage}>
                                    Canjeaste {selectedServicio?.nombre_servicio} exitosamente.
                                </Text>
                                {successData?.data?.puntos_restantes !== undefined && (
                                    <Text style={styles.successPoints}>
                                        Puntos restantes: {successData.data.puntos_restantes}
                                    </Text>
                                )}
                                <Button title="Ir a Dashboard" onPress={handleGoBack} variant="primary" style={{ width: "100%" }} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default ServiceScreen;