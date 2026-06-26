import { useState } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Alert, Platform, StyleSheet } from "react-native"
import { useForm, Controller } from "react-hook-form";
import { ArrowRight, MailCheck, Key } from "lucide-react-native"
import Button from "../../../shared/components/common/Button";
import Input from "../../../shared/components/common/Input";
import { COLORS, SHADOWS, FONT_SIZE, FONT_TYPE, SPACING } from "../../../shared/constants/theme"

const VerifyEmailScreen = ({ navigate }) => {

    const { control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            tockenVerify: ""
        }
    });

    const onSubmit = async (data) => {

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
            gap: 15,
        },
        logo: {
            padding: 15,
            maginBotton: SPACING.sm,
            color: COLORS.primary,
            backgroundColor: COLORS.light_primary,
            borderRadius: 15,
        },
        subtitle: {
            fontSize: FONT_SIZE.lg,
            fontWeight: "900",
        },
        label: {
            fontSize: FONT_SIZE.sm,
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
            fontSize: FONT_SIZE.xs,
            color: COLORS.text_secondary,
            fontWeight: "500",
            textAlign: "center"
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
                    <MailCheck style={styles.logo} size={40} />
                    <View>
                        <Text style={[styles.subtitle, { color: COLORS.text_primary }]}>VERIFIQUE SU
                            <Text style={[styles.subtitle, { color: COLORS.primary }]}> CUENTA</Text>
                        </Text>
                    </View>
                    <Text style={styles.label}>Hemos enviado un código de seguridad a su dirección de correo electrónico</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        rules={{ required: "EL CÓDIGO ES NECESARIO" }}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="CÓDIGO DE VERIFICACIÓN"
                                placeholder="Ingrese el código"
                                value={value}
                                onChangeText={onChange}
                                error={errors.tockenVerify?.error}
                                icon={<Key size={15} color={COLORS.primary_dark} />}

                            />
                        )}
                        name="tockenVerify"
                    />
                    <Button
                        title="Verificar correo"
                        icon={<ArrowRight size={20} color={COLORS.surface} />}
                        onPress={()=> navigation.navigate("Login")}
                        style={styles.button}
                    />
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>¿No recibió el correo? Revise su carpeta de spam o contacte a soporte técnico si el problema persiste
                        </Text>
                    </View>
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

export default VerifyEmailScreen;