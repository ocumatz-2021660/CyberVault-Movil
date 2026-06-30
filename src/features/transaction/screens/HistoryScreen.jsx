import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { ArrowLeft, Trash2, Clock, CheckCircle, XCircle } from "lucide-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useAuthStore } from "../../../shared/store/authStore";
import { useCurrency } from "../../../shared/hooks/useCurrency";
import { useHistory } from "../hook/useHistory";
import accountClient from "../../../shared/api/accountClient";

const HistoryScreen = () => {
    const navigation = useNavigation();
    const user = useAuthStore((state) => state.user);
    const { formatConverted } = useCurrency();
    const { fetchHistory, deleteTransaction } = useHistory();

    const [cuentas, setCuentas] = useState([]);
    const [selectedCuenta, setSelectedCuenta] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loadingCuentas, setLoadingCuentas] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalTransaction, setModalTransaction] = useState(null);
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
        setLoadingHistory(true);
        try {
            const data = await fetchHistory(cuenta._id);
            setTransactions(data);
        } catch {
            setTransactions([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const canDelete = (transaction) => {
        if (!transaction.cuenta_origen) return false;
        if (transaction.cuenta_origen._id !== selectedCuenta._id) return false;
        const now = new Date();
        const createdAt = new Date(transaction.createdAt);
        return (now - createdAt) / 1000 <= 60;
    };

    const openDeleteModal = (transaction) => {
        setModalTransaction(transaction);
        setModalState("confirm");
        setModalMessage("");
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setModalState("loading");
        try {
            await deleteTransaction(modalTransaction._id);
            setTransactions(prev => prev.filter(t => t._id !== modalTransaction._id));
            setModalState("success");
        } catch (err) {
            setModalMessage(err?.response?.data?.message || "No se pudo cancelar la transacción");
            setModalState("error");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setModalTransaction(null);
        setModalMessage("");
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
            backgroundColor:
                COLORS.surface, borderRadius:
                SPACING.md,
            padding: SPACING.lg,
            alignItems: "center",
            borderWidth: 2,
            borderColor: COLORS.border,
            ...SHADOWS.containerCard,
        },
        typeCardSelected: { borderColor: COLORS.primary },
        typeIconContainer: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.sm,
        },
        typeIconContainerSelected: { backgroundColor: COLORS.primary },
        typeLabel: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: 4
        },
        typeLabelSelected: {
            color: COLORS.surface
        },
        typeBalance: {
            fontSize: FONT_SIZE.sm,
            fontWeight: "600",
            color: COLORS.text_secondary
        },
        sectionTitle: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700", color:
                COLORS.text_primary,
            marginBottom: SPACING.md,
            marginTop: SPACING.lg,
        },
        emptyText: {
            color: COLORS.text_secondary,
            fontSize: FONT_SIZE.sm,
            textAlign: "center",
            marginTop: SPACING.xl,
        },
        trxCard: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 1,
            borderColor: COLORS.border,
            flexDirection: "row",
            alignItems: "center",
        },
        trxInfo: { flex: 1 },
        trxId: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "700",
            color: COLORS.primary,
            marginBottom: 2
        },
        trxDetail: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_primary,
            marginBottom: 2
        },
        trxAmount: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "700",
            marginTop: 2
        },
        trxAmountOut: { color: COLORS.error },
        trxAmountIn: { color: COLORS.primary_green },
        trxMeta: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            marginTop: 2
        },
        deleteButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: COLORS.light_error,
            justifyContent: "center", alignItems: "center",
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
            backgroundColor:
                COLORS.surface,
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
            fontWeight: "800", color:
                COLORS.text_primary,
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
                        <Text style={styles.modalTitle}>Cancelar transacción</Text>
                        <Text style={styles.modalMessage}>
                            ¿Estás seguro de cancelar {modalTransaction?.id_transaccion}?
                            {"\n\n"}Monto: {formatConverted(modalTransaction?.monto)}
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
                                onPress={confirmDelete}
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
                        <Text style={styles.modalMessage}>Procesando la cancelación de la transacción</Text>
                    </>
                );

            case "success":
                return (
                    <>
                        <CheckCircle size={48} color={COLORS.primary_green} style={styles.modalIcon} />
                        <Text style={styles.modalTitle}>Transacción cancelada</Text>
                        <Text style={styles.modalMessage}>La transacción fue cancelada exitosamente.</Text>
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
                <Text style={styles.headerTitle}>Historial</Text>
                <View style={styles.backButton} />
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
                                        <Clock size={28} color={isSelected ? COLORS.surface : COLORS.primary} />
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
                        <Text style={styles.sectionTitle}>Transacciones</Text>
                        {loadingHistory ? (
                            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: SPACING.xl }} />
                        ) : transactions.length === 0 ? (
                            <Text style={styles.emptyText}>No hay transacciones recientes</Text>
                        ) : (
                            transactions.map((trx) => {
                                const isOutgoing = trx.cuenta_origen?._id === selectedCuenta._id;
                                const isDeletable = canDelete(trx);
                                return (
                                    <View key={trx._id} style={styles.trxCard}>
                                        <View style={styles.trxInfo}>
                                            <Text style={styles.trxId}>{trx.id_transaccion}</Text>
                                            <Text style={styles.trxDetail}>
                                                {isOutgoing
                                                    ? `Enviado a: ${trx.cuenta_destinatoria?.no_cuenta || "—"}`
                                                    : `Recibido de: ${trx.cuenta_origen?.no_cuenta || "Depósito"}`}
                                            </Text>
                                            <Text style={[
                                                styles.trxAmount,
                                                isOutgoing ? styles.trxAmountOut : styles.trxAmountIn,
                                            ]}>
                                                {isOutgoing ? "-" : "+"}{formatConverted(trx.monto)}
                                            </Text>
                                            <Text style={styles.trxMeta}>
                                                {new Date(trx.createdAt).toLocaleString("es-GT")}
                                            </Text>
                                        </View>
                                        {isDeletable && (
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => openDeleteModal(trx)}
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

export default HistoryScreen;