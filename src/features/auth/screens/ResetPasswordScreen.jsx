import { View, Text, StyleSheet, KeyboardAvoidingView, Alert, Platform, ScrollView } from "react-native"
import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { ArrowRight, Mail, Subtitles, Wallet, Lock, LockKeyhole, Key } from "lucide-react-native"
import { COLORS, FONT_SIZE, FONT_TYPE, SHADOWS, SPACING } from "../../../shared/constants/theme"
import Input from "../../../shared/components/common/Input"
import Button from "../../../shared/components/common/Button"
import { useAuth } from "../hooks/useAuth"

const ResetPasswordScreen = ({ navigation }) => {
    //configurando el estado de los inputs, control es un intermediario para el input y el controller
    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            tokenInput: "",
            newPassword: "",
            confirmNewPassword: "",
        }
    });

    const { handleResetPassword, loading } = useAuth();

    const onSubmit = async (data) => {
        try {
            await handleResetPassword(data.tokenInput, data.newPassword);
            Alert.alert("Éxito", "Contraseña actualizada. Inicia sesión.");
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Error al restablecer");
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
            justifyContent: "center",
        },
        header: {
            alignItems: "center",
            marginBottom: SPACING.xl,
            gap: 10,
        },
        logo: {
            width: 70,
            height: 70,
            borderRadius: 20,
            backgroundColor: COLORS.light_primary,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: SPACING.sm,
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
            textAlign: "center"
        },
        form: {
            width: "100%",
            backgroundColor: COLORS.surface,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.lg,
            borderRadius: 15,
            borderTopWidth: 2,
            borderTopColor: COLORS.primary,
            ...SHADOWS.containerCard,
        },
        button: {
            marginTop: SPACING.lg,
        },
        footer: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: SPACING.xl,
        },
        footerText: {
            fontSize: FONT_SIZE.md,
            color: COLORS.text_secondary
        },
        link: {
            fontSize: FONT_SIZE.md,
            color: COLORS.primary_dark,
            fontWeight: "700"
        },
        forgotLink: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.primary_dark,
            fontWeight: "700",
            alignSelf: "flex-end",
            marginBottom: -SPACING.xl,
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <View style={styles.logo}>
                        <LockKeyhole size={40} color={COLORS.primary} />
                    </View>

                    <View>
                        <Text style={[styles.subtitle, { color: COLORS.text_primary }]}>NUEVA
                            <Text style={[styles.subtitle, { color: COLORS.primary_dark }]}>CONTRASEÑA</Text>
                        </Text>
                    </View>
                    <Text style={styles.label}>
                        Ingrese el token recibido y su nueva contraseña de seguridad.
                    </Text>
                </View>
                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: "EL TOKEN ES NECESARIO" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="TOKEN DE SEGURIDAD"
                                placeholder="Pegue el token aqui"
                                value={value}
                                onChangeText={onChange}
                                error={errors.tokenInput?.message}
                                icon={<Key size={15} color={COLORS.primary_dark} />}
                            />
                        )}
                        name="tokenInput"
                    />
                    <Controller
                        control={control}
                        rules={{ required: "REQUERIDO", }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                lable="NUEVA CONTRASEÑA"
                                placeholder="••••••••••"
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry
                                error={errors.newPassword?.message}
                                icon={<Lock size={15} color={COLORS.primary_dark} />}
                            />
                        )}
                        name="newPassword"
                    />
                    <Controller
                        control={control}
                        rules={{
                            required: "REQUERIDO",
                            validate: (value) =>
                                value === watch('newPassword') || 'NO COINCIDEN'
                        }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="CONFIRMAR CONTRASEÑA"
                                placeholder="••••••••••"
                                value={value}
                                secureTextEntry
                                onChangeText={onChange}
                                error={errors.confirmNewPassword?.message}
                                icon={<Lock size={15} color={COLORS.primary_dark} />}

                            />
                        )}
                        name="confirmNewPassword"
                    />
                    <Button
                        title="Actualizar Contraseña"
                        icon={<ArrowRight size={20} color={COLORS.surface} />}
                        onPress={handleSubmit(onSubmit)}
                        //onPress={()=> navigation.navigate("Login")}
                        style={styles.button}
                    />


                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
export default ResetPasswordScreen;