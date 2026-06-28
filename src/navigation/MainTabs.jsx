import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT_SIZE } from "../shared/constants/theme";
import { useAuthStore } from "../shared/store/authStore";
import DashboardAccountScreen from "../features/account/screens/DashboardAccountScreen";
import { useAuth } from "../features/auth/hooks/useAuth";

const Tab = createBottomTabNavigator();


const ProfileScreen = () => {
    const user = useAuthStore((state) => state.user);
    const { logout } = useAuth();
    return (
        <View style={styles.centerScreen}>
            <MaterialIcons name="account-circle" size={80} color={COLORS.primary} />
            <Text style={styles.profileName}>{user?.username}</Text>
            <Text style={styles.profileRole}>{user?.role}</Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    );
};

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.text_secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.surface,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 4,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === "Dashboard") iconName = "dashboard";
                    else if (route.name === "Profile") iconName = "person";
                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DashboardAccountScreen} options={{ title: "Inicio", headerShown: true }} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil", headerShown: true }} />
        </Tab.Navigator>
    );
};

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
    profileName: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: "900",
        color: COLORS.text_primary,
    },
    profileRole: {
        fontSize: FONT_SIZE.md,
        color: COLORS.text_secondary,
        backgroundColor: COLORS.light_primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: 20,
        overflow: "hidden",
    },
    logoutBtn: {
        marginTop: SPACING.xl,
        backgroundColor: COLORS.error,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: 8,
    },
    logoutText: {
        color: COLORS.surface,
        fontWeight: "700",
        fontSize: FONT_SIZE.md,
    },
});

export default MainTabs;