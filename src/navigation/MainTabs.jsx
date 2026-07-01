import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS, SPACING, FONT_SIZE } from "../shared/constants/theme";
import { useAuthStore } from "../shared/store/authStore";
import AccountStack from "./AccountStack";
import FavoritesScreen from "../features/favorites/screens/FavoritesScreen";
import ServiceScreen from "../features/services/screens/ServicesScreen";
import { useAuth } from "../features/auth/hooks/useAuth";
import AppHeader from "../shared/components/common/AppHeader";
import { LayoutDashboard, User, UserCircle, GiftIcon, TicketCheckIcon, Heart, HomeIcon } from "lucide-react-native";
import CanjesScreen from "../features/canje/screens/CanjeScreen"

const Tab = createBottomTabNavigator();
const FavoriteStackNav = createNativeStackNavigator();
const ServiceStackNav = createNativeStackNavigator();
const CanjeStackNav = createNativeStackNavigator();

const FavoriteStack = () => (
    <FavoriteStackNav.Navigator screenOptions={{ headerShown: false }}>
        <FavoriteStackNav.Screen name="FavoritesMain" component={FavoritesScreen} />
    </FavoriteStackNav.Navigator>
);

const ServiceStack = () => (
    <ServiceStackNav.Navigator screenOptions={{ headerShown: false }}>
        <ServiceStackNav.Screen name="ServiceMain" component={ServiceScreen} />
    </ServiceStackNav.Navigator>
);

const CanjeStack = () => (
    <CanjeStackNav.Navigator screenOptions={{ headerShown: false }}>
        <CanjeStackNav.Screen name="CanjesMain" component={CanjesScreen} />
    </CanjeStackNav.Navigator>
);

const MainTabs = () => {
    // ... styles ...

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
            <Tab.Screen name="Canjes" component={CanjeStack} options={{ tabBarLabel: "Canjes" }} />
            <Tab.Screen name="Service" component={ServiceStack} options={{ tabBarLabel: "Servicios" }} />
            <Tab.Screen name="Favorite" component={FavoriteStack} options={{ tabBarLabel: "Favoritos" }} />
        </Tab.Navigator>
    );
};

export default MainTabs;