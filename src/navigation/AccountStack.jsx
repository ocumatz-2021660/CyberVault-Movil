import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardAccountScreen from "../features/account/screens/DashboardAccountScreen";
import CreateAccountScreen from "../features/account/screens/CreateAccountScreen";

const Stack = createNativeStackNavigator();

const AccountStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardAccount" component={DashboardAccountScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        </Stack.Navigator>
    );
};

export default AccountStack;