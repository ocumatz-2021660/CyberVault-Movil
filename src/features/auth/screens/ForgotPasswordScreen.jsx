import React, { useState } from "react"
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native"
import { useForm, Controller } from 'react-hook-form'
import { COLORS, SPACING, FONT_SIZE, FONT_TYPE, SHADOWS } from '../../../shared/constants/theme';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { ArrowRight, ArrowLeft, Mail, ShieldAlert } from "lucide-react-native"
import { useAuth } from "../hooks/useAuth";

const ForgotPasswordScreen = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            forgotPassword: "",
        }
    });

    const { handleForgotPassword, loading } = useAuth();
    
    const onSubmit = async (data) => {
        try {
            await handleForgotPassword(data.forgotPassword);
            Alert.alert("Enviado", "Si el email existe, recibirás instrucciones.");
            navigation.navigate("ResetPassword");
        } catch (error) {
            Alert.alert("Error", error.response?.data?.message || "Error al enviar");
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
            padding: 15,
            maginBotton: SPACING.sm,
            color: COLORS.error,
            backgroundColor: COLORS.light_error,
            borderRadius: 20,
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
    });
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <ShieldAlert style={styles.logo} size={40} />
                    <View>
                        <Text style={[styles.subtitle, { color: COLORS.text_primary }]}>RECUPERAR
                            <Text style={[styles.subtitle, { color: COLORS.primary }]}> CLAVE</Text>
                        </Text>
                    </View>
                    <Text style={styles.label}>BANCA DIGITAL INSTITUCIONAL</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: "El correo es nesesario" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="CORREO ELECTRÓNICO"
                                placeholder="Ej. ejemplo@correo.com"
                                value={value}
                                onChangeText={onChange}
                                error={errors.forgotPassword?.message}
                                icon={<Mail size={15} color={COLORS.primary_dark} />}

                            />
                        )}
                        name="forgotPassword"
                    />
                    <Button
                        title="Enviar Instrucciones"
                        icon={<ArrowRight size={20} color={COLORS.surface} />}
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                    />
                    <View style={styles.footer}>
                        <ArrowLeft size={25} color={COLORS.primary_dark} />
                        <Text
                            style={styles.link}
                            onPress={() => navigation.navigate("Login")}
                        >Volver al inicio de sesión</Text>

                    </View>
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default ForgotPasswordScreen;