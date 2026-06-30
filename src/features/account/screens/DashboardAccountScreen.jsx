import React, { useState, useCallback } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Wallet, ArrowRight, ArrowUpFromLine, History, Gift, Plus, Landmark, Send, HandCoins, PiggyBank } from "lucide-react-native";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme"
import { useAuthStore } from "../../../shared/store/authStore"
import { useSettingsStore } from "../../../shared/store/settingStore"
import { useDashboard } from "../hooks/useDashboard"
import Button from "../../../shared/components/common/Button"
const CURRENCY_SYMBOLS = {
    GTQ: "Q",
    USD: "$",
    EUR: "€",
    GBP: "£",
    MXN: "MX$",
    COP: "COL$",
};

const formatBalance = (amount, currency) => {
    const symbol = CURRENCY_SYMBOLS[currency] || "Q";
    const formatted = Number(amount).toLocaleString("es-GT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${symbol}${formatted}`;
};

const DashboardAccountScreen = () => {
    const user = useAuthStore((state) => state.user);
    const currency = useSettingsStore((state) => state.currency);
    const { fetchMisCuentas, fetchServiciosActivos, loading } = useDashboard();
    const navigation = useNavigation();

    const [cuentas, setCuentas] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [loadingServicios, setLoadingServicios] = useState(true);
    const [errorCuentas, setErrorCuentas] = useState(null);
    const [errorServicios, setErrorServicios] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoadingCuentas(true);
                setLoadingServicios(true);
                setErrorCuentas(null);
                setErrorServicios(null);

                try {
                    const data = await fetchMisCuentas();
                    setCuentas(data || []);
                } catch (err) {
                    setErrorCuentas(err.response?.data?.message || "Error al cargar cuentas");
                } finally {
                    setLoadingCuentas(false);
                }

                try {
                    const data = await fetchServiciosActivos();
                    setServicios(data || []);
                } catch (err) {
                    setErrorServicios(err.response?.data?.message || "Error al cargar servicios");
                } finally {
                    setLoadingServicios(false);
                }
            };

            loadData();
        }, [])
    );

    const totalSaldo = cuentas.reduce((sum, c) => sum + (c.saldo || 0), 0);

    const getAccountIcon = (tipo) => {
        if (tipo === "AHORRO") return <PiggyBank size={20} color={COLORS.primary} />;
        return <Wallet size={20} color={COLORS.primary} />;
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
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
            ...SHADOWS.containerCard,
        },
        sectionCardWelcome: {
            backgroundColor: COLORS.primary_dark,
            borderRadius: SPACING.md,
            padding: SPACING.lg,
            marginBottom: SPACING.md,
            marginTop: SPACING.sm,
            ...SHADOWS.containerCard,
        },
        sectionOption: {
            backgroundColor: "transparent",
            borderRadius: SPACING.md,
            padding: SPACING.lg,
            marginBottom: SPACING.md,
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
        totalBalanceContainer: {
            alignItems: "center",
            marginBottom: SPACING.lg,
            paddingBottom: SPACING.lg,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
        },
        totalBalanceLabel: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            marginBottom: SPACING.xs,
        },
        totalBalanceValue: {
            fontSize: FONT_SIZE.huge,
            fontWeight: "800",
            color: COLORS.primary,
        },
        accountCard: {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.primary_dark,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
        },
        accountIconContainer: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginRight: SPACING.md,
        },
        accountInfo: {
            flex: 1,
        },
        accountHeader: {
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 5,
            marginBottom: 5,
        },
        accountType: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.surface,
            flexWrap: "wrap",
        },
        accountAlias: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            marginLeft: SPACING.sm,
        },
        accountNumber: {
            fontSize: FONT_SIZE.md,
            color: COLORS.surface,
            marginBottom: 2,
        },
        accountBalance: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "700",
            color: COLORS.surface,
        },
        emptyState: {
            alignItems: "center",
            paddingVertical: SPACING.lg,
        },
        emptyTitle: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginTop: SPACING.md,
        },
        emptySubtitle: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            textAlign: "center",
            marginTop: SPACING.xs,
        },
        emptyButton: {
            marginTop: SPACING.lg,
            paddingHorizontal: SPACING.xl,
            width: "auto",
        },
        actionsRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: SPACING.sm,
        },
        actionButton: {
            flex: 1,
            alignItems: "center",
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.sm,
            paddingVertical: SPACING.md,
            borderWidth: 1,
            borderColor: COLORS.primary,
            ...SHADOWS.containerCard,
        },
        actionIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.sm,
        },
        actionLabel: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.text_primary,
        },
        serviceCard: {
            flexDirection: "row",
            alignItems: "flex-start",
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            ...SHADOWS.containerCard,
        },
        serviceIconContainer: {
            width: 40,
            height: 40,
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
        servicePointsBadge: {
            alignSelf: "flex-start",
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
        subtitle: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "900",
        },
        label: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "600",
            color: COLORS.text_secondary,
            marginBottom: SPACING.xs,
        },
        solicitarButton: {
            marginTop: SPACING.md,
        },

    });

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionCardWelcome}>
                    <Text style={[styles.subtitle, { color: COLORS.surface }]}>
                        Bienvenido, <Text style={[styles.subtitle, { color: COLORS.primary }]}>{user?.username}  </Text>
                        <HandCoins size={20} color={COLORS.primary} />
                    </Text>
                    <Text style={styles.label}>
                        Bienvenido a tu resumen financiero de hoy CyberVault.
                    </Text>
                </View>
                {/* SECCIÓN 1: CUENTAS Y SALDO */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>CUENTAS PERSONALES</Text>

                    {loadingCuentas ? (
                        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
                    ) : errorCuentas ? (
                        <Text style={styles.errorText}>{errorCuentas}</Text>
                    ) : cuentas.length > 0 ? (
                        <>
                            <View style={styles.totalBalanceContainer}>
                                <Text style={styles.totalBalanceLabel}>Saldo total disponible</Text>
                                <Text style={styles.totalBalanceValue}>
                                    {formatBalance(totalSaldo, currency)}
                                </Text>
                            </View>

                            {cuentas.map((cuenta, index) => (
                                <View key={cuenta._id} style={[
                                    styles.accountCard,
                                    index === cuentas.length - 1 && { marginBottom: 0 }
                                ]}>
                                    <View style={styles.accountIconContainer}>
                                        {getAccountIcon(cuenta.tipo_cuenta)}
                                    </View>
                                    <View style={styles.accountInfo}>
                                        <View style={styles.accountHeader}>
                                            <Text style={styles.accountType}>{cuenta.tipo_cuenta}</Text>
                                        </View>
                                        <Text style={styles.accountNumber}>
                                            {cuenta.no_cuenta}
                                        </Text>
                                        <Text style={styles.accountBalance}>
                                            {formatBalance(cuenta.saldo, currency)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Wallet size={48} color={COLORS.text_secondary} />
                            <Text style={styles.emptyTitle}>No tienes cuentas activas</Text>
                            <Text style={styles.emptySubtitle}>
                                Solicita una cuenta para comenzar a operar
                            </Text>
                            <Button
                                title="Solicitar Cuentas"
                                onPress={() => navigation.navigate("CreateAccount")}
                                variant="primary"
                                style={styles.emptyButton}
                            />

                        </View>
                    )}
                </View>

                {/* SECCIÓN 2: ACCIONES RÁPIDAS */}
                <View style={styles.sectionOption}>
                    <Text style={styles.sectionTitle}>Acciones</Text>
                    <View style={styles.actionsRow}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("Transaction")}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIconContainer,]}>
                                <Send size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.actionLabel}>Transferir</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate("Withdrawal")}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.actionIconContainer]}>
                                <HandCoins size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.actionLabel}>Retirar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={() => { }} activeOpacity={0.7}>
                            <View style={[styles.actionIconContainer,]}>
                                <History size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.actionLabel}>Historial</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Solicitar Nueva Cuenta"
                        onPress={() => navigation.navigate("CreateAccount")}
                        variant="primary"
                        icon={<Plus size={20} color={COLORS.surface} />}
                        style={styles.solicitarButton}
                    />

                </View>

                {/* SECCIÓN 3: SERVICIOS */}
                <View style={[styles.sectionOption, { marginBottom: SPACING.xl }]}>
                    <Text style={styles.sectionTitle}>Servicios disponibles</Text>

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
                                    <View style={styles.servicePointsBadge}>
                                        <Text style={styles.servicePointsText}>
                                            {servicio.puntos_requeridos} pts
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Gift size={40} color={COLORS.text_secondary} />
                            <Text style={styles.emptyTitle}>Próximos servicios</Text>
                            <Text style={styles.emptySubtitle}>
                                No hay servicios disponibles por el momento
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}


export default DashboardAccountScreen;