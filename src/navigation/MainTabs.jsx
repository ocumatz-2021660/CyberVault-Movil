import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, SPACING, FONT_SIZE } from "../shared/constants/theme";
import { useAuthStore } from "../shared/store/authStore";
import AccountStack from "./AccountStack";
import FavoritesScreen from "../features/favorites/screens/FavoritesScreen";
import { useAuth } from "../features/auth/hooks/useAuth";
import AppHeader from "../shared/components/common/AppHeader";
import { LayoutDashboard, User, UserCircle, GiftIcon, TicketCheckIcon, Heart, HomeIcon } from "lucide-react-native";

const Tab = createBottomTabNavigator();
const FavoriteStackNav = createNativeStackNavigator();

const FavoriteStack = () => (
    <FavoriteStackNav.Navigator screenOptions={{ headerShown: false }}>
        <FavoriteStackNav.Screen name="FavoritesMain" component={FavoritesScreen} />
    </FavoriteStackNav.Navigator>
);

const MainTabs = () => {
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

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                header: ({ navigation }) => <AppHeader navigation={navigation} />,
                headerShown: true,
                tabBarActiveTintColor: COLORS.primary_green,
                tabBarInactiveTintColor: COLORS.surface,
                tabBarLabelStyle: ({ focused }) => ({
                    fontSize: FONT_SIZE.xs,
                    fontWeight: focused ? "700" : "400",
                }),
                tabBarStyle: {
                    backgroundColor: COLORS.primary,
                    borderTopWidth: 1,
                    borderTopColor: COLORS.border,
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarIcon: ({ color, size }) => {
                    if (route.name === "Home") return <HomeIcon size={size} color={color} />;
                    else if (route.name === "Canjes") return <TicketCheckIcon size={size} color={color} />;
                    else if (route.name === "Service") return <GiftIcon size={size} color={color} />;
                    else if (route.name === "Favorite") return <Heart size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={AccountStack} options={{ tabBarLabel: "Inicio" }} />
            <Tab.Screen name="Canjes" component={AccountStack} options={{ tabBarLabel: "Canjes" }} />
            <Tab.Screen name="Service" component={AccountStack} options={{ tabBarLabel: "Servicios" }} />
            <Tab.Screen name="Favorite" component={FavoriteStack} options={{ tabBarLabel: "Favoritos" }} />
        </Tab.Navigator>
    );
};

export default MainTabs