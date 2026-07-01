import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardAccountScreen from "../features/account/screens/DashboardAccountScreen";
import CreateAccountScreen from "../features/account/screens/CreateAccountScreen";
import TransactionScreen from "../features/transaction/screens/TransactionScreen";
import WithdrawalScreen from "../features/withdrawal/screens/WithdrawalScreen";
import HistoryScreen from "../features/transaction/screens/HistoryScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import FavoritesScreen from "../features/favorites/screens/FavoritesScreen";
import ServiceScreen from "../features/services/screens/ServicesScreen";
import CanjesScreen from "../features/canje/screens/CanjeScreen";

const Stack = createNativeStackNavigator();

const AccountStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardAccount" component={DashboardAccountScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
            <Stack.Screen name="Services" component={ServiceScreen} />
            <Stack.Screen name="CanjesScreen" component={CanjesScreen} />
        </Stack.Navigator>
    );
};

export default AccountStack;