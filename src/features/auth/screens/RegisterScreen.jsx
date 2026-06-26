import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Input from "../../../shared/components/common/Input";
import Button from "../../../shared/components/common/Button";
import { COLORS, FONT_TYPE, FONT_SIZE, SHADOWS, SPACING } from "../../../shared/constants/theme";
import { ArrowLeft, Camera, ShieldCheck, ChevronRight, User } from "lucide-react-native";

const RegisterScreen = ({ navigation }) => {

    const [imageUri, setImageUri] = useState(null);

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
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

    const handleSelectImage = () => {
        alert("Aquí puedes integrar expo-image-picker o react-native-image-picker para seleccionar tu foto.");
    };

    const onSubmit = async (data) => {
        console.log("Datos de afiliación: ", { ...data, userPicture: imageUri });
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
                                    rules={{ required: "Campo obligatorio" }}
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
                                    rules={{ required: "Campo obligatorio" }}
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
                                rules={{ required: "Campo obligatorio" }}
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
                                    pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" }
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
                                rules={{ required: "Campo obligatorio" }}
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <Input
                                        label="TELÉFONO"
                                        placeholder="5589592"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="phone-pad"
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
                                    rules={{ required: "Campo obligatorio" }}
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
                            onPress={()=> navigation.navigate("VerifyEmail")}
                            style={styles.buttonSubmit}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;