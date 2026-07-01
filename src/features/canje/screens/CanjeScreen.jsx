import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { ArrowLeft, Trash2, Clock, CheckCircle, XCircle, PiggyBank, Wallet, Star, Gift,Stars } from "lucide-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useAuthStore } from "../../../shared/store/authStore";
import { useCanjes } from "../hook/useCanjes";
import accountClient from "../../../shared/api/accountClient";

const CanjesScreen = () => {
    const navigation = useNavigation();
    const user = useAuthStore((state) => state.user);
    const { fetchCanjes, cancelCanje, loading } = useCanjes();

    const [cuentas, setCuentas] = useState([]);
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [canjes, setCanjes] = useState([]);
    const [puntosActuales, setPuntosActuales] = useState(0);
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [loadingCanjes, setLoadingCanjes] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalCanje, setModalCanje] = useState(null);
    const [modalState, setModalState] = useState("confirm");
    const [modalMessage, setModalMessage] = useState("");

    useFocusEffect(
        useCallback(() => {
            const loadCuentas = async () => {
                setLoadingCuentas(true);
                try {
                    const res = await accountClient.get(`/cuentas/usuario/${user?.id}`);
                    const activas = (res.data.data || []).filter(c => c.isActive);
                    setCuentas(activas);
                    if (activas.length === 1) {
                        handleSelectCuenta(activas[0]);
                    }
                } catch (err) {
                    console.error("Error cargando cuentas:", err);
                } finally {
                    setLoadingCuentas(false);
                }
            };
            loadCuentas();
        }, [])
    );

    const handleSelectCuenta = async (cuenta) => {
        setSelectedCuenta(cuenta);
        setLoadingCanjes(true);
        try {
            const data = await fetchCanjes(cuenta._id);
            setCanjes(data.data || []);
            setPuntosActuales(data.resumen?.puntos_actuales || 0);
        } catch {
            setCanjes([]);
            setPuntosActuales(0);
        } finally {
            setLoadingCanjes(false);
        }
    };

    const canCancel = (canje) => {
        if (canje.estado_canje !== "COMPLETADO") return false;
        const now = new Date();
        const createdAt = new Date(canje.createdAt);
        return (now - createdAt) / 1000 <= 60;
    };

    const openCancelModal = (canje) => {
        setModalCanje(canje);
        setModalState("confirm");
        setModalMessage("");
        setShowModal(true);
    };

    const confirmCancel = async () => {
        setModalState("loading");
        try {
            const result = await cancelCanje(modalCanje._id);
            setCanjes(prev => prev.map(c =>
                c._id === modalCanje._id
                    ? { ...c, estado_canje: "CANCELADO" }
                    : c
            ));
            if (result?.data?.puntos_actuales !== undefined) {
                setPuntosActuales(result.data.puntos_actuales);
            }
            setModalState("success");
        } catch (err) {
            setModalMessage(err?.response?.data?.message || "No se pudo cancelar el canje");
            setModalState("error");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalCanje(null);
        setModalMessage("");
    };

    const getAccountIcon = (tipo) => {
        if (tipo === "AHORRO") return <PiggyBank size={28} color={COLORS.surface} />;
        return <Wallet size={28} color={COLORS.surface} />;
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background
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
            borderRadius: 8,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
            justifyContent: "center",
            alignItems: "center",
        },
        headerTitle: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "700",
            color: COLORS.text_primary
        },
        scrollContent: {
            flex: 1
        },
        scrollContainer: {
            padding: SPACING.md,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.xl
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
            marginBottom: SPACING.md
        },
        typeCard: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.md,
            padding: SPACING.lg,
            alignItems: "center",
            borderWidth: 2,
            borderColor: COLORS.ligh_blue,
            ...SHADOWS.containerCard,
        },
        typeCardSelected: { borderColor: COLORS.primary_blue },
        typeIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: COLORS.ligh_blue,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.sm,
        },
        typeIconContainerSelected: { backgroundColor: COLORS.ligh_blue },
        typeLabel: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: 4
        },
        typeLabelSelected: {
            color: COLORS.primary_blue
        },
        typeBalance: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.text_secondary
        },
        pointsContainer: {
            backgroundColor: COLORS.primary_dark,
            borderRadius: SPACING.md,
            padding: SPACING.lg,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: SPACING.md,
            ...SHADOWS.md,
        },
        pointsIconContainer: {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginRight: SPACING.md,
        },
        pointsInfo: {
            flex: 1,
        },
        pointsLabel: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.surface,
            opacity: 0.8,
        },
        pointsValue: {
            fontSize: FONT_SIZE.xxl,
            fontWeight: "800",
            color: COLORS.surface,
        },
        pointsUnit: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.surface,
            opacity: 0.8,
        },
        sectionTitle: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: SPACING.md,
            marginTop: SPACING.lg,
        },
        emptyText: {
            color: COLORS.text_secondary,
            fontSize: FONT_SIZE.sm,
            textAlign: "center",
            marginTop: SPACING.xl,
        },
        canjeCard: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 1,
            borderColor: COLORS.border,
            flexDirection: "row",
            alignItems: "center",
        },
        canjeCancelled: {
            opacity: 0.6,
        },
        canjeIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginRight: SPACING.md,
        },
        canjeInfo: {
            flex: 1,
        },
        canjeServiceName: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: 2,
        },
        canjeServiceDesc: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            marginBottom: 2,
        },
        canjePoints: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "700",
            color: COLORS.error,
        },
        canjeRefunded: {
            color: COLORS.primary_green,
        },
        canjeMeta: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            marginTop: 2,
        },
        cancelledBadge: {
            backgroundColor: COLORS.light_error,
            paddingHorizontal: SPACING.xs,
            paddingVertical: 2,
            borderRadius: 4,
            alignSelf: "flex-start",
            marginTop: 4,
        },
        cancelledBadgeText: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "700",
            color: COLORS.error,
        },
        deleteButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: SPACING.sm,
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
        modalIcon: { marginBottom: SPACING.md },
        modalTitle: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "800",
            color: COLORS.text_primary,
            marginBottom: SPACING.sm,
            textAlign: "center",
        },
        modalMessage: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: SPACING.lg,
        },
        modalRow: {
            flexDirection: "row",
            gap: SPACING.sm,
            width: "100%"
        },
        modalButton: {
            flex: 1
        },
        modalButtonFull: {
            width: "100%"
        },
    });

    const renderModalContent = () => {
        switch (modalState) {
            case "confirm":
                return (
                    <>
                        <Trash2 size={48} color={COLORS.error} style={styles.modalIcon} />
                        <Text style={styles.modalTitle}>Cancelar canje</Text>
                        <Text style={styles.modalMessage}>
                            ¿Estás seguro de cancelar el canje de {modalCanje?.servicio_canje?.nombre_servicio}?
                            {"\n\n"}Puntos a devolver: {modalCanje?.servicio_canje?.puntos_requeridos} pts
                        </Text>
                        <View style={styles.modalRow}>
                            <TouchableOpacity
                                style={[styles.modalButton, {
                                    backgroundColor: COLORS.surface,
                                    borderWidth: 1, borderColor: COLORS.border,
                                    borderRadius: SPACING.sm, padding: SPACING.md,
                                    alignItems: "center",
                                }]}
                                onPress={closeModal}
                            >
                                <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: COLORS.text_primary }}>
                                    No
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, {
                                    backgroundColor: COLORS.error,
                                    borderRadius: SPACING.sm, padding: SPACING.md,
                                    alignItems: "center",
                                }]}
                                onPress={confirmCancel}
                            >
                                <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: COLORS.surface }}>
                                    Sí, cancelar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                );

            case "loading":
                return (
                    <>
                        <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalIcon} />
                        <Text style={styles.modalTitle}>Cancelando...</Text>
                        <Text style={styles.modalMessage}>Procesando la cancelación del canje</Text>
                    </>
                );

            case "success":
                return (
                    <>
                        <CheckCircle size={48} color={COLORS.primary_green} style={styles.modalIcon} />
                        <Text style={styles.modalTitle}>Canje cancelado</Text>
                        <Text style={styles.modalMessage}>El canje fue cancelado exitosamente. Los puntos han sido devueltos.</Text>
                        <TouchableOpacity
                            style={[styles.modalButtonFull, {
                                backgroundColor: COLORS.primary,
                                borderRadius: SPACING.sm, padding: SPACING.md,
                                alignItems: "center",
                            }]}
                            onPress={closeModal}
                        >
                            <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: COLORS.surface }}>
                                Aceptar
                            </Text>
                        </TouchableOpacity>
                    </>
                );

            case "error":
                return (
                    <>
                        <XCircle size={48} color={COLORS.error} style={styles.modalIcon} />
                        <Text style={styles.modalTitle}>No se pudo cancelar</Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.modalButtonFull, {
                                backgroundColor: COLORS.primary,
                                borderRadius: SPACING.sm, padding: SPACING.md,
                                alignItems: "center",
                            }]}
                            onPress={closeModal}
                        >
                            <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: COLORS.surface }}>
                                Aceptar
                            </Text>
                        </TouchableOpacity>
                    </>
                );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text_primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Canjes</Text>
                <View />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.label}>Selecciona una cuenta</Text>
                {loadingCuentas ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: SPACING.xl }} />
                ) : cuentas.length === 0 ? (
                    <Text style={styles.emptyText}>No tienes cuentas activas</Text>
                ) : (
                    <View style={styles.typeRow}>
                        {cuentas.map((cuenta) => {
                            const isSelected = selectedCuenta?._id === cuenta._id;
                            return (
                                <TouchableOpacity
                                    key={cuenta._id}
                                    style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                                    onPress={() => handleSelectCuenta(cuenta)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.typeIconContainer,
                                        isSelected && styles.typeIconContainerSelected,
                                    ]}>
                                        {getAccountIcon(cuenta.tipo_cuenta)}
                                    </View>
                                    <Text style={[
                                        styles.typeLabel,
                                        isSelected && styles.typeLabelSelected,
                                    ]}>
                                        {cuenta.tipo_cuenta === "AHORRO" ? "Ahorro" : "Monetaria"}
                                    </Text>
                                    <Text style={styles.typeBalance}>No. {cuenta.no_cuenta}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {selectedCuenta && (
                    <>
                        <View style={styles.pointsContainer}>
                            <View style={styles.pointsIconContainer}>
                                <Stars size={24} fill={COLORS.primary_yellow} />
                            </View>
                            <View style={styles.pointsInfo}>
                                <Text style={styles.pointsLabel}>Puntos disponibles</Text>
                                <Text style={styles.pointsValue}>
                                    {puntosActuales}
                                    <Text style={styles.pointsUnit}> pts</Text>
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.sectionTitle}>Historial de canjes</Text>
                        {loadingCanjes ? (
                            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
                        ) : canjes.length === 0 ? (
                            <Text style={styles.emptyText}>No hay canjes realizados</Text>
                        ) : (
                            canjes.map((canje) => {
                                const isCancelled = canje.estado_canje === "CANCELADO";
                                const isDeletable = canCancel(canje);
                                return (
                                    <View key={canje._id} style={[styles.canjeCard, isCancelled && styles.canjeCancelled]}>
                                        <View style={styles.canjeIconContainer}>
                                            <Gift size={20} color={COLORS.primary} />
                                        </View>
                                        <View style={styles.canjeInfo}>
                                            <Text style={styles.canjeServiceName}>
                                                {canje.servicio_canje?.nombre_servicio || "Servicio"}
                                            </Text>
                                            <Text style={styles.canjeServiceDesc} numberOfLines={1}>
                                                {canje.servicio_canje?.descripcion_servicio || ""}
                                            </Text>
                                            <Text style={[styles.canjePoints, isCancelled && styles.canjeRefunded]}>
                                                {isCancelled ? "+" : "-"}{canje.servicio_canje?.puntos_requeridos || 0} pts
                                            </Text>
                                            <Text style={styles.canjeMeta}>
                                                {new Date(canje.createdAt).toLocaleString("es-GT")}
                                            </Text>
                                            {isCancelled && (
                                                <View style={styles.cancelledBadge}>
                                                    <Text style={styles.cancelledBadgeText}>Cancelado</Text>
                                                </View>
                                            )}
                                        </View>
                                        {isDeletable && (
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => openCancelModal(canje)}
                                            >
                                                <Trash2 size={18} color={COLORS.error} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                );
                            })
                        )}
                    </>
                )}
            </ScrollView>

            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {renderModalContent()}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CanjesScreen;