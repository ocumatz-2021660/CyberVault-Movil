import React, { useState } from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native"
import { ArrowRight, Mail, Subtitles, Wallet, Lock } from "lucide-react-native"
import { useForm, Controller } from 'react-hook-form'
import Button from "../../../shared/components/common/Button";
import Input from "../../../shared/components/common/Input";
import { COLORS, SPACING, FONT_SIZE, FONT_TYPE } from "../../../shared/constants/theme";
import { useAuth } from "../hooks/useAuth";

const LoginScreen = ({ navigation }) => {

    const { handleLogin, loading } = useAuth();

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            emailOrUsername: '',
            password: ''
        }
    });
    
    const onSubmit = async (data) => {
        try {
            await handleLogin(data);
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Credenciales inválidas");
        }
    }

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
            padding: 15,
            maginBotton: SPACING.sm,
            color: COLORS.surface,
            backgroundColor: COLORS.primary,
            borderRadius: 15,
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
        form: {
            width: "100%",
            backgroundColor: COLORS.surface,
            paddingHorizontal: SPACING.md,
            paddingVertical: SPACING.lg,
            borderRadius: 15,
            borderTopWidth: 2,
            borderTopColor: COLORS.primary,
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
            maginBotton: -SPACING.xl,
        },
        copyrightText: {
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            textAlign: "center",
            marginTop: SPACING.xl,
            paddingHorizontal: SPACING.md,
            width: "100%",
        },
    });
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Wallet style={styles.logo} size={40} />
                    <View>
                        <Text style={[styles.subtitle, { color: COLORS.text_primary }]}>CYBER
                            <Text style={[styles.subtitle, { color: COLORS.primary }]}>VAULT</Text>
                        </Text>
                    </View>
                    <Text style={styles.label}>BANCA DIGITAL INSTITUCIONAL</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: "Este campo es obligatorio" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="USUARIO O CORREO"
                                placeholder="Ej. usuario123"
                                value={value}
                                onChangeText={onChange}
                                error={errors.emailOrUsername?.message}
                                icon={<Mail size={15} color={COLORS.primary_dark} />}

                            />
                        )}
                        name="emailOrUsername"
                    />
                    <Text
                        style={styles.forgotLink}
                        onPress={() => navigation.navigate("ForgotPassword")}
                    >
                        ¿OLVIDÓ SU CLAVE?
                    </Text>
                    <Controller
                        control={control}
                        rules={{ required: "La contraseña es obligatoria" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                lable="CONTRASEÑA"
                                placeholder="••••••••••••••"
                                value={value}
                                onChangeText={onChange}
                                error={errors.password?.message}
                                secureTextEntry
                                icon={<Lock size={15} color={COLORS.primary_dark} />}
                            />
                        )}
                        name="password"
                    />
                    <Button
                        title="Ingresar a mi cuenta"
                        icon={<ArrowRight size={20} color={COLORS.surface} />}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                    />
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>¿No tienes cuenta?
                            <Text
                                style={styles.link}
                                onPress={() => navigation.navigate("Register")}
                            >Afilicie hoy mismo</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.copyrightText}>© 2026 CyberVault — Todos los derechos reservados</Text>
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}


export default LoginScreen;