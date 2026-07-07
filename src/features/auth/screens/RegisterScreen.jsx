import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image, Alert, } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import { COLORS, FONT_TYPE, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { ArrowLeft, Camera, ShieldCheck, ChevronRight, User } from "lucide-react-native";
import { useAuth } from "../../../features/auth/hooks/useAuth";

const RegisterScreen = ({ navigation }) => {

    const { handleRegister, loading } = useAuth();
    const [imageUri, setImageUri] = useState(null);

    const { control, handleSubmit, watch, setError, formState: { errors } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            userName: '',
            userEmail: '',
            userCel: '',
            userPassword: '',
            confirmPassword: '',
        }
    });

    const handleSelectImage = async () => {
        if (Platform.OS !== "web") {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert("Permiso requerido", "Se necesita acceso a la galería para elegir tu foto.");
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets?.length > 0) {
            const pickedUri = result.assets[0].uri;

            if (Platform.OS === "web") {
                setImageUri(pickedUri);
                return;
            }

            const ext = pickedUri.split(".").pop()?.toLowerCase() || "jpg";
            const cacheUri = `${FileSystem.cacheDirectory}register_avatar.${ext}`;
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
            const formData = new FormData();
            formData.append("name", data.firstName);
            formData.append("surname", data.lastName);
            formData.append("username", data.userName);
            formData.append("email", data.userEmail);
            formData.append("password", data.userPassword);
            formData.append("confirmPassword", data.confirmPassword);
            formData.append("phone", data.userCel);

            if (imageUri) {
                if (Platform.OS === "web") {
                    const fetched = await fetch(imageUri);
                    const blob = await fetched.blob();
                    const ext = blob.type.split("/")[1] || "jpg";
                    formData.append("profilePicture", blob, `profile.${ext}`);
                } else {
                    const filename = imageUri.split("/").pop() || "profile.jpg";
                    const ext = imageUri.split(".").pop()?.toLowerCase() || "jpg";
                    const mimeType =
                        ext === "png" ? "image/png" :
                            ext === "webp" ? "image/webp" :
                                ext === "avif" ? "image/avif" : "image/jpeg";
                    formData.append("profilePicture", {
                        uri: imageUri,
                        type: mimeType,
                        name: filename,
                    });
                }
            }

            await handleRegister(formData);
            Alert.alert("Éxito", "Registro exitoso. Revisa tu correo para verificar tu cuenta.");
            navigation.navigate("VerifyEmail");
        } catch (error) {
            const res = error.response;
            if (res?.status === 400 && res.data?.errors) {
                const fieldMap = {
                    name: "firstName",
                    surname: "lastName",
                    username: "userName",
                    email: "userEmail",
                    phone: "userCel",
                    password: "userPassword",
                    confirmPassword: "confirmPassword",
                };
                res.data.errors.forEach((err) => {
                    const field = fieldMap[err.field];
                    if (field) setError(field, { message: err.message });
                });
            } else if (res?.status === 409) {
                setError("userEmail", { message: "Este correo o usuario ya está registrado" });
                setError("userName", { message: "Este correo o usuario ya está registrado" });
            } else {
                Alert.alert("Error", res?.data?.message || "Error al registrarse");
            }
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
            justifyContent: "center",
            alignItems: "center",
        },
        centerContainer: {
            width: "100%",
            maxWidth: 600,
            alignItems: "center",
        },
        header: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
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
            alignItems: "flex-start",
            flex: 1,
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
        subtitle: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "600",
            color: COLORS.text_secondary,
            marginBottom: SPACING.xs,
            flexWrap: "wrap"
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
        avatarTouch: {
            alignItems: "center",
            justifyContent: "center",
        },
        avatarContainer: {
            width: 110,
            height: 110,
            borderRadius: 55,
            backgroundColor: COLORS.background,
            borderWidth: 1,
            borderColor: COLORS.border,
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            marginBottom: SPACING.sm,
        },
        avatarImage: {
            width: "100%",
            height: "100%",
            borderRadius: 55,
        },
        cameraBadge: {
            position: "absolute",
            bottom: 0,
            right: 4,
            backgroundColor: COLORS.primary,
            width: 32,
            height: 32,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 2,
            borderColor: COLORS.surface,
        },
        profileLabel: {
            fontSize: FONT_SIZE.xs,
            fontWeight: "900",
            color: COLORS.text_secondary,
            marginBottom: SPACING.xs,
            flexWrap: "wrap",
            textAlign: "center"
        },
        profileOptional: {
            color: COLORS.text_secondary,
            fontFamily: FONT_TYPE.inter,
            fontWeight: "normal",
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
        formRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
        },
        inputHalf: {
            width: "48%",
        },
        inputFull: {
            width: "100%",
        },
        buttonSubmit: {
            marginTop: SPACING.lg,
            backgroundColor: COLORS.primary,
        }
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
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
                            onPress={() => navigation.navigate("Login")}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={20} color={COLORS.text_secondary} />
                        </TouchableOpacity>

                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.titleMain}>
                                AFILIACIÓN <Text style={styles.titleHighlight}>DIGITAL</Text>
                            </Text>
                            <Text style={styles.subtitle}>COMPLETE EL FORMULARIO PARA UNIRSE A CYBERVAULT</Text>
                        </View>
                    </View>

                    <View style={styles.formCard}>
                        <View style={styles.profileSection}>
                            <TouchableOpacity
                                style={styles.avatarTouch}
                                onPress={handleSelectImage}
                                activeOpacity={0.8}
                            >
                                <View style={styles.avatarContainer}>
                                    {imageUri ? (
                                        <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                                    ) : (
                                        <User size={45} color={COLORS.text_secondary} />
                                    )}
                                    <View style={styles.cameraBadge}>
                                        <Camera size={14} color={COLORS.surface} />
                                    </View>
                                </View>
                                <Text style={styles.profileLabel}>
                                    FOTO DE PERFIL{"\n"}
                                    <Text style={styles.profileOptional}>(OPCIONAL)</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.infoBox}>
                            <ShieldCheck size={22} color={COLORS.primary} />
                            <Text style={styles.infoText}>
                                Sus datos están protegidos por encriptación de nivel bancario. Al registrarse, acepta nuestros términos y condiciones.
                            </Text>
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.inputHalf}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Campo obligatorio",
                                        validate: (value) => {
                                            if (value.length > 25) return "Máximo 25 caracteres";
                                            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo letras y espacios";
                                            return true;
                                        },
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="NOMBRES"
                                            placeholder="Oscar"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.firstName?.message}
                                        />
                                    )}
                                    name="firstName"
                                />
                            </View>
                            <View style={styles.inputHalf}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Campo obligatorio",
                                        validate: (value) => {
                                            if (value.length > 25) return "Máximo 25 caracteres";
                                            if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return "Solo letras y espacios";
                                            return true;
                                        },
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="APELLIDOS"
                                            placeholder="Cumatz"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.lastName?.message}
                                        />
                                    )}
                                    name="lastName"
                                />
                            </View>
                        </View>

                        <View style={styles.inputFull}>
                                <Controller
                                control={control}
                                rules={{
                                    required: "Campo obligatorio",
                                    validate: (value) => {
                                        if (value.length < 3) return "Mínimo 3 caracteres";
                                        if (value.length > 50) return "Máximo 50 caracteres";
                                        if (!/^[a-zA-Z0-9_.-]+$/.test(value)) return "Solo letras, números, puntos, guiones y guión bajo";
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input
                                        label="NOMBRE DE USUARIO"
                                        placeholder="ocumatz-2021660"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={errors.userName?.message}
                                    />
                                )}
                                name="userName"
                            />
                        </View>

                        <View style={styles.inputFull}>
                                <Controller
                                control={control}
                                rules={{
                                    required: "Campo obligatorio",
                                    validate: (value) => {
                                        if (value.length > 150) return "Máximo 150 caracteres";
                                        if (!/^\S+@\S+\.\S+$/.test(value)) return "Correo inválido";
                                        return true;
                                    },
                                }}
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input
                                        label="CORREO ELECTRÓNICO"
                                        placeholder="ocumatz-2021660@gmail.com"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        error={errors.userEmail?.message}
                                    />
                                )}
                                name="userEmail"
                            />
                        </View>

                        <View style={styles.inputFull}>
                                <Controller
                                control={control}
                                rules={{
                                    required: "Campo obligatorio",
                                    validate: (value) => /^\d{8}$/.test(value) || "Debe tener exactamente 8 dígitos",
                                }}
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input
                                        label="TELÉFONO"
                                        placeholder="5589592"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="phone-pad"
                                        maxLength={8}
                                        error={errors.userCel?.message}
                                    />
                                )}
                                name="userCel"
                            />
                        </View>

                        <View style={styles.formRow}>
                            <View style={styles.inputHalf}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Campo obligatorio",
                                        validate: (value) => value.length >= 8 || "Mínimo 8 caracteres",
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="CONTRASEÑA"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.userPassword?.message}
                                        />
                                    )}
                                    name="userPassword"
                                />
                            </View>
                            <View style={styles.inputHalf}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Campo obligatorio",
                                        validate: (value) =>
                                            value === watch('userPassword') || 'NO COINCIDEN'
                                    }}
                                    render={({ field: { onChange, value, onBlur } }) => (
                                        <Input
                                            label="CONFIRMAR"
                                            placeholder="••••••••"
                                            secureTextEntry
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            error={errors.confirmPassword?.message}
                                        />
                                    )}
                                    name="confirmPassword"
                                />
                            </View>
                        </View>

                        <Button
                            title="Finalizar Afiliación"
                            icon={<ChevronRight size={18} color={COLORS.surface} />}
                            onPress={handleSubmit(onSubmit)}
                            style={styles.buttonSubmit}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;