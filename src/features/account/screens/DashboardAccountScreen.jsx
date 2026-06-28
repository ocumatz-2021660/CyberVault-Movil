import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS, FONT_SIZE, FONT_TYPE, SHADOWS, SPACING } from "../../../shared/constants/theme"
import { useAuthStore } from "../../../shared/store/authStore" //para ver la autenticacion XD
import { MaterialIcons } from "@expo/vector-icons";

const DashboardAccountScreen = () => {

    const user = useAuthStore((state) => state.user);

    const styles = StyleSheet.create({
        centerScreen: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS.background,
            gap: SPACING.md,
            padding: SPACING.lg,
        },
        welcomeTitle: {
            fontSize: FONT_SIZE.xl,
            fontWeight: "900",
            color: COLORS.text_primary,
            textAlign: "center",
        },
        welcomeSub: {
            fontSize: FONT_SIZE.md,
            color: COLORS.text_secondary,
        },
    })
    return (
        <View style={styles.centerScreen}>
            <MaterialIcons name="account-balance" size={60} color={COLORS.primary} />
            <Text style={styles.welcomeTitle}>Bienvenido, {user?.username}</Text>
            <Text style={styles.welcomeSub}>Banca Digital CyberVault</Text>
        </View>
    )

}
export default DashboardAccountScreen