import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Modal, Alert, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { ArrowLeft, User, Phone, Mail, Camera, ShieldCheck, Calendar, Pencil } from "lucide-react-native";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import { COLORS, FONT_TYPE, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { useAuthStore } from "../../../shared/store/authStore";
import { useProfile } from "../hooks/useProfile";

const ProfileScreen = ({ navigation }) => {
    const login = useAuthStore((state) => state.login);
    const token = useAuthStore((state) => state.token);
    const { getProfile, updateProfile } = useProfile();

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [saving, setSaving] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            username: "",
            phone: "",
            email: "",
        }
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoadingProfile(true);
            const data = await getProfile();
            setProfile(data);
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Error al cargar perfil");
        } finally {
            setLoadingProfile(false);
        }
    };

    const openEditModal = () => {
        if (!profile) return;
        reset({
            name: profile.name || "",
            surname: profile.surname || "",
            username: profile.username || "",
            phone: profile.phone || "",
            email: profile.email || "",
        });
        setImageUri(null);
        setModalVisible(true);
    };

    const handleSelectImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permiso requerido", "Se necesita acceso a la galería para cambiar la foto de perfil.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets?.length > 0) {
            const pickedUri = result.assets[0].uri;
            const ext = pickedUri.split(".").pop()?.toLowerCase() || "jpg";
            const cacheUri = `${FileSystem.cacheDirectory}profile_upload.${ext}`;
            try {
                await FileSystem.copyAsync({ from: pickedUri, to: cacheUri });
                setImageUri(cacheUri);
            } catch {
                setImageUri(pickedUri);
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            setSaving(true);

            const formData = new FormData();
            formData.append("name", data.name.trim());
            formData.append("surname", data.surname.trim());
            formData.append("username", data.username.trim());
            formData.append("phone", data.phone.trim());

            if (imageUri) {
                const filename = imageUri.split("/").pop() || "profile.jpg";
                const ext = imageUri.split(".").pop()?.toLowerCase() || "jpg";
                const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "avif" ? "image/avif" : "image/jpeg";
                formData.append("profilePicture", {
                    uri: imageUri,
                    type: mimeType,
                    name: filename,
                });
            }

            const result = await updateProfile(formData);

            await login(token, result.data);
            setProfile(result.data);
            setModalVisible(false);
            setImageUri(null);
            Alert.alert("Éxito", "Perfil actualizado correctamente");
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Error al actualizar perfil");
        } finally {
            setSaving(false);
        }
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.background,
        },
        scrollContent: {
            flexGrow: 1,
            padding: SPACING.lg,
            paddingBottom: Platform.OS === "web" ? SPACING.lg : 120,
        },
        centerContainer: {
            width: "100%",
            maxWidth: 600,
            alignSelf: "center",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: SPACING.xl,
            width: "100%",
        },
        backButton: {
            backgroundColor: COLORS.surface,
            padding: SPACING.sm,
            borderRadius: SPACING.xs,
            alignItems: "center",
            justifyContent: "center",
            ...SHADOWS.sm,
        },
        headerTitleContainer: {
            marginLeft: SPACING.md,
        },
        titleMain: {
            fontSize: FONT_SIZE.xl,
            color: COLORS.text_primary,
            fontWeight: "900",
        },
        titleHighlight: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "900",
            color: COLORS.primary_light,
        },
        formCard: {
            width: "100%",
            backgroundColor: COLORS.surface,
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.xl,
            borderRadius: 16,
            borderTopWidth: 2,
            borderTopColor: COLORS.primary,
            ...SHADOWS.containerCard,
        },
        profileSection: {
            alignItems: "center",
            marginBottom: SPACING.lg,
        },
        avatarContainer: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: COLORS.background,
            borderWidth: 3,
            borderColor: COLORS.primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.md,
            overflow: "hidden",
        },
        avatarImage: {
            width: "100%",
            height: "100%",
        },
        avatarPlaceholder: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.light_primary,
        },
        profileName: {
            fontSize: FONT_SIZE.xxl,
            fontWeight: "900",
            color: COLORS.text_primary,
            textAlign: "center",
        },
        profileUsername: {
            fontSize: FONT_SIZE.md,
            color: COLORS.text_secondary,
            marginBottom: SPACING.sm,
            textAlign: "center",
        },
        infoBox: {
            flexDirection: "row",
            backgroundColor: COLORS.light_primary,
            padding: SPACING.md,
            borderRadius: 12,
            alignItems: "center",
            marginBottom: SPACING.xl,
            gap: SPACING.sm,
        },
        infoText: {
            flex: 1,
            fontFamily: FONT_TYPE.inter,
            fontSize: FONT_SIZE.xs,
            color: COLORS.primary_dark,
            lineHeight: 16,
        },
        dataRow: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: SPACING.md,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
            gap: SPACING.md,
        },
        dataRowLast: {
            borderBottomWidth: 0,
        },
        dataIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
        },
        dataContent: {
            flex: 1,
        },
        dataLabel: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "600",
            color: COLORS.text_secondary,
            marginBottom: 2,
        },
        dataValue: {
            fontSize: FONT_SIZE.md,
            fontWeight: "600",
            color: COLORS.text_primary,
        },
        dataValueEmail: {
            fontSize: FONT_SIZE.md,
            fontWeight: "600",
            color: COLORS.text_secondary,
        },
        editButton: {
            marginTop: SPACING.xl,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
        },
        modalContainer: {
            width: "90%",
            maxWidth: 500,
            maxHeight: "85%",
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: SPACING.lg,
            ...SHADOWS.containerCard,
        },
        modalHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: SPACING.md,
        },
        modalTitle: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "900",
            color: COLORS.text_primary,
        },
        closeText: {
            color: COLORS.text_secondary,
            fontWeight: "600",
            fontSize: FONT_SIZE.md,
        },
        modalAvatarSection: {
            alignItems: "center",
            marginBottom: SPACING.md,
        },
        modalAvatarTouch: {
            alignItems: "center",
            justifyContent: "center",
        },
        modalAvatarContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: COLORS.background,
            borderWidth: 1,
            borderColor: COLORS.border,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginBottom: SPACING.xs,
            overflow: "hidden",
        },
        cameraBadge: {
            position: "absolute",
            bottom: 0,
            right: 2,
            backgroundColor: COLORS.primary,
            width: 30,
            height: 30,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: COLORS.surface,
        },
        modalAvatarLabel: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "900",
            color: COLORS.text_secondary,
            textAlign: "center",
        },
        modalAvatarOptional: {
            color: COLORS.text_secondary,
            fontFamily: FONT_TYPE.inter,
            fontWeight: "normal",
        },
        modalButtons: {
            gap: SPACING.sm,
            marginTop: SPACING.md,
        },
        disabledInput: {
            opacity: 0.6,
        },
        loader: {
            marginVertical: SPACING.xxl,
        },
    });

    if (loadingProfile) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.centerContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={20} color={COLORS.text_secondary} />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleMain}>
                                MI <Text style={styles.titleHighlight}>PERFIL</Text>
                            </Text>
                        </View>
                    </View>

                    <View style={styles.formCard}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatarContainer}>
                                {profile?.profilePicture ? (
                                    <Image source={{ uri: profile.profilePicture }} style={styles.avatarImage} />
                                ) : (
                                    <View style={styles.avatarPlaceholder}>
                                        <User size={50} color={COLORS.primary} />
                                    </View>
                                )}
                            </View>
                            <Text style={styles.profileName}>
                                {profile?.name} {profile?.surname}
                            </Text>
                            <Text style={styles.profileUsername}>@{profile?.username}</Text>
                        </View>

                        <View style={styles.infoBox}>
                            <ShieldCheck size={22} color={COLORS.primary} />
                            <Text style={styles.infoText}>
                                Sus datos están protegidos por encriptación de nivel bancario.
                            </Text>
                        </View>

                        <View style={styles.dataRow}>
                            <View style={styles.dataIcon}>
                                <Phone size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.dataContent}>
                                <Text style={styles.dataLabel}>TELÉFONO</Text>
                                <Text style={styles.dataValue}>{profile?.phone || "—"}</Text>
                            </View>
                        </View>

                        <View style={styles.dataRow}>
                            <View style={styles.dataIcon}>
                                <Mail size={20} color={COLORS.text_secondary} />
                            </View>
                            <View style={styles.dataContent}>
                                <Text style={styles.dataLabel}>CORREO ELECTRÓNICO</Text>
                                <Text style={styles.dataValueEmail}>{profile?.email || "—"}</Text>
                            </View>
                        </View>

                        <View style={[styles.dataRow, styles.dataRowLast]}>
                            <View style={styles.dataIcon}>
                                <Calendar size={20} color={COLORS.text_secondary} />
                            </View>
                            <View style={styles.dataContent}>
                                <Text style={styles.dataLabel}>MIEMBRO DESDE</Text>
                                <Text style={styles.dataValueEmail}>
                                    {profile?.createdAt
                                        ? new Date(profile.createdAt).toLocaleDateString("es-GT", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })
                                        : "—"}
                                </Text>
                            </View>
                        </View>

                        <Button
                            title="EDITAR PERFIL"
                            icon={<Pencil size={19} color={COLORS.surface} />}
                            onPress={openEditModal}
                            style={styles.editButton}
                        />
                    </View>
                </View>
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : undefined}
                        style={{ width: "100%", alignItems: "center" }}
                    >
                        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>EDITAR PERFIL</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeText}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalAvatarSection}>
                                    <TouchableOpacity
                                        style={styles.modalAvatarTouch}
                                        onPress={handleSelectImage}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.modalAvatarContainer}>
                                            {imageUri ? (
                                                <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                                            ) : profile?.profilePicture ? (
                                                <Image source={{ uri: profile.profilePicture }} style={styles.avatarImage} />
                                            ) : (
                                                <User size={40} color={COLORS.text_secondary} />
                                            )}
                                            <View style={styles.cameraBadge}>
                                                <Camera size={14} color={COLORS.surface} />
                                            </View>
                                        </View>
                                        <Text style={styles.modalAvatarLabel}>
                                            FOTO DE PERFIL{"\n"}
                                            <Text style={styles.modalAvatarOptional}>(OPCIONAL)</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <Controller
                                    control={control}
                                    rules={{ required: "Campo obligatorio" }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="NOMBRES"
                                            placeholder="Nombres"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.name?.message}
                                        />
                                    )}
                                    name="name"
                                />

                                <Controller
                                    control={control}
                                    rules={{ required: "Campo obligatorio" }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="APELLIDOS"
                                            placeholder="Apellidos"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.surname?.message}
                                        />
                                    )}
                                    name="surname"
                                />

                                <Controller
                                    control={control}
                                    rules={{ required: "Campo obligatorio" }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="NOMBRE DE USUARIO"
                                            placeholder="usuario"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.username?.message}
                                        />
                                    )}
                                    name="username"
                                />

                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Campo obligatorio",
                                        pattern: { value: /^\d{8}$/, message: "Debe tener exactamente 8 dígitos" },
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="TELÉFONO"
                                            placeholder="5589592"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="phone-pad"
                                            error={errors.phone?.message}
                                        />
                                    )}
                                    name="phone"
                                />

                                <View style={styles.disabledInput}>
                                    <Controller
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Input label="CORREO ELECTRÓNICO" value={value} editable={false} />
                                        )}
                                        name="email"
                                    />
                                </View>

                                <View style={styles.modalButtons}>
                                    <Button
                                        title="GUARDAR CAMBIOS"
                                        onPress={handleSubmit(onSubmit)}
                                        loading={saving}
                                    />
                                    <Button
                                        title="CANCELAR"
                                        onPress={() => setModalVisible(false)}
                                        variant="secondary"
                                    />
                                </View>
                            </ScrollView>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </TouchableOpacity>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default ProfileScreen;