import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { ArrowLeft, Heart, Trash2, CheckCircle, XCircle, Star, Send, Wallet, User} from "lucide-react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { COLORS, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useFavorites } from "../hook/useFavorites";
import Button from "../../../shared/components/common/Button";
import Input from "../../../shared/components/common/Input";

const FavoritesScreen = () => {
    const navigation = useNavigation();
    const { fetchFavorites, addFavorite, deleteFavorite, loading } = useFavorites();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { no_cuenta: "", alias_favorito: "" }
    });

    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [modalState, setModalState] = useState("confirm");
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("");

    const [selectedId, setSelectedId] = useState(null);
    const [selectedAlias, setSelectedAlias] = useState("");

    useFocusEffect(
        useCallback(() => {
            const load = async () => {
                setLoadingFavorites(true);
                try {
                    const data = await fetchFavorites();
                    setFavorites(data);
                } catch {
                    setFavorites([]);
                } finally {
                    setLoadingFavorites(false);
                }
            };
            load();
        }, [])
    );

    const openDeleteModal = (id, alias) => {
        setSelectedId(id);
        setSelectedAlias(alias);
        setModalType("delete");
        setModalState("confirm");
        setModalMessage("");
        setShowModal(true);
    };

    const openAddModal = () => {
        reset();
        setModalType("add");
        setModalState("confirm");
        setModalMessage("");
        setShowModal(true);
    };

    const confirmDelete = async () => {
        setModalState("loading");
        try {
            await deleteFavorite(selectedId);
            setFavorites(prev => prev.filter(f => f._id !== selectedId));
            setModalState("success");
        } catch (err) {
            setModalMessage(err?.response?.data?.message || "No se pudo eliminar el favorito");
            setModalState("error");
        }
    };

    const confirmAdd = async (data) => {
        setModalState("loading");
        try {
            const res = await addFavorite(data.no_cuenta.trim(), data.alias_favorito.trim());
            const newFav = res.data;
            setFavorites(prev => [...prev, newFav]);
            setModalState("success");
        } catch (err) {
            setModalMessage(err?.response?.data?.message || "No se pudo agregar el favorito");
            setModalState("error");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedId(null);
        setSelectedAlias("");
        setModalMessage("");
        reset();
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
        scrollContainer: {
            padding: SPACING.md,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.xl
        },
        actionCard: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.lg,
            padding: SPACING.xl,
            alignItems: "center",
            marginBottom: SPACING.lg,
            borderTopWidth: 2,
            borderTopColor: COLORS.primary,
            ...SHADOWS.containerCard,
        },
        actionIcon: {
            marginBottom: SPACING.md,
        },
        actionTitle: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "600",
            color: COLORS.text_primary,
            marginBottom: SPACING.md,
            textAlign: "center",
        },
        
        actionText: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
            textAlign: "center",
            lineHeight: 22,
            marginBottom: SPACING.lg,
        },
        favCard: {
            backgroundColor: COLORS.surface,
            borderRadius: SPACING.sm,
            padding: SPACING.md,
            marginBottom: SPACING.sm,
            borderWidth: 1,
            borderColor: COLORS.border,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 2,
            borderTopColor: COLORS.primary,
            ...SHADOWS.containerCard
        },
        favIconContainer: {
            width: 44,
            height: 44,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
            marginRight: SPACING.md,
        },
        favInfo: { flex: 1 },
        favAlias: {
            fontSize: FONT_SIZE.md,
            fontWeight: "700",
            color: COLORS.text_primary,
            marginBottom: 2
        },
        favAccount: {
            fontSize: FONT_SIZE.sm,
            color: COLORS.text_secondary,
        },
        deleteButton: {
            width: 44,
            height: 44,
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
            fontWeight: "500",
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
        modalButton: { flex: 1 },
        modalButtonFull: { width: "100%" },
        formContainer: {
            width: "100%",
            marginBottom: SPACING.md,
        },
    });

    const renderModalContent = () => {
        if (modalType === "delete") {
            switch (modalState) {
                case "confirm":
                    return (
                        <>
                            <Trash2 size={48} color={COLORS.error} style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Eliminar favorito</Text>
                            <Text style={styles.modalMessage}>
                                ¿Eliminar "{selectedAlias}" de tus favoritos?
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
                                        Sí, eliminar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    );
                case "loading":
                    return (
                        <>
                            <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Eliminando...</Text>
                            <Text style={styles.modalMessage}>Eliminando favorito</Text>
                        </>
                    );
                case "success":
                    return (
                        <>
                            <CheckCircle size={48} color={COLORS.primary_green} style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Favorito eliminado</Text>
                            <Text style={styles.modalMessage}>El favorito fue eliminado exitosamente.</Text>
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
                            <Text style={styles.modalTitle}>No se pudo eliminar</Text>
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
        } else {
            switch (modalState) {
                case "confirm":
                    return (
                        <>
                            <Star size={48} color={COLORS.primary} style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Agregar favorito</Text>
                            <Text style={styles.modalMessage}>Ingresa los datos del favorito</Text>
                            <View style={styles.formContainer}>
                                <Controller
                                    control={control}
                                    name="no_cuenta"
                                    rules={{ required: "El número de cuenta es requerido" }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Número de cuenta"
                                            placeholder="Ej: 1234567890"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.no_cuenta?.message}
                                            keyboardType="number-pad"
                                            maxLength={10}
                                            icon={<Wallet size={15} color={COLORS.text_secondary}/>}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name="alias_favorito"
                                    rules={{
                                        required: "El alias es requerido",
                                        maxLength: { value: 50, message: "Máximo 50 caracteres" }
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Alias"
                                            placeholder="Nombre para identificar"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.alias_favorito?.message}
                                            maxLength={50}
                                            icon={<User size={15} color={COLORS.text_secondary}/>}
                                        />
                                    )}
                                />
                            </View>
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
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, {
                                        backgroundColor: COLORS.primary,
                                        borderRadius: SPACING.sm, padding: SPACING.md,
                                        alignItems: "center",
                                    }]}
                                    onPress={handleSubmit(confirmAdd)}
                                >
                                    <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: COLORS.surface }}>
                                        Agregar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    );
                case "loading":
                    return (
                        <>
                            <ActivityIndicator size="large" color={COLORS.primary} style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Agregando...</Text>
                            <Text style={styles.modalMessage}>Agregando favorito</Text>
                        </>
                    );
                case "success":
                    return (
                        <>
                            <CheckCircle size={48} color={COLORS.primary_green} style={styles.modalIcon} />
                            <Text style={styles.modalTitle}>Favorito agregado</Text>
                            <Text style={styles.modalMessage}>El favorito fue agregado exitosamente.</Text>
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
                            <Text style={styles.modalTitle}>No se pudo agregar</Text>
                            <Text style={styles.modalMessage}>{modalMessage}</Text>
                            <TouchableOpacity
                                style={[styles.modalButtonFull, {
                                    backgroundColor: COLORS.primary,
                                    borderRadius: SPACING.sm, padding: SPACING.md,
                                    alignItems: "center",
                                }]}
                                onPress={() => {
                                    setModalState("confirm");
                                    setModalMessage("");
                                }}
                            >
                                <Text style={{ fontSize: FONT_SIZE.sm, fontWeight: "700", color: COLORS.surface }}>
                                    Intentar de nuevo
                                </Text>
                            </TouchableOpacity>
                        </>
                    );
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={COLORS.text_primary} />
                </TouchableOpacity>
                <View />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {loadingFavorites ? (
                    <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: SPACING.xl }} />
                ) : favorites.length === 0 ? (
                    <View style={styles.actionCard}>
                        <Heart size={48} color={COLORS.text_secondary} style={styles.actionIcon} />
                        <Text style={styles.actionTitle}>Sin favoritos aún</Text>
                        <Text style={styles.actionText}>
                            Aún no has agregado cuentas favoritas.{"\n"}Agrega una para transferencias rápidas.
                        </Text>
                        <Button title="Agregar favorito" onPress={openAddModal} />
                    </View>
                ) : (
                    <>
                        <View style={styles.actionCard}>
                            <Star size={32} color={COLORS.primary} fill={COLORS.primary} style={styles.actionIcon} />
                            <Text style={styles.actionTitle}>Agregar más favoritos</Text>
                            <Text style={styles.actionText}>Guarda tus cuentas recurrentes para mayor eficiencia</Text>
                            <Button title="Agregar" onPress={openAddModal} />
                        </View>
                        {favorites.map((fav) => (
                            <View key={fav._id} style={styles.favCard}>
                                <View style={styles.favIconContainer}>
                                    <Star size={22} color="#ffc800" fill="#ffc800" />
                                </View>
                                <View style={styles.favInfo}>
                                    <Text style={styles.favAlias}>"{fav.alias_favorito}"</Text>
                                    <Text style={styles.favAccount}>
                                        No. {fav.no_cuenta}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => navigation.navigate("Home", { screen: "Transaction" })}
                                >
                                    <Send size={18} color={COLORS.primary_blue} />
                                </TouchableOpacity>
                                <Text>   |</Text>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => openDeleteModal(fav._id, fav.alias_favorito)}
                                >
                                    <Trash2 size={18} color={COLORS.error} />
                                </TouchableOpacity>
                            </View>
                        ))}
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

export default FavoritesScreen;