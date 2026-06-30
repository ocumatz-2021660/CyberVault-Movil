import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashboardAccountScreen from "../features/account/screens/DashboardAccountScreen";
import CreateAccountScreen from "../features/account/screens/CreateAccountScreen";
import TransactionScreen from "../features/transaction/screens/TransactionScreen"
import WithdrawalScreen from "../features/withdrawal/screens/WithdrawalScreen";

const Stack = createNativeStackNavigator();

const AccountStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DashboardAccount" component={DashboardAccountScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="Transaction" component={TransactionScreen} />
            <Stack.Screen name="Withdrawal" component={WithdrawalScreen} />

        </Stack.Navigator>
    );
};

export default AccountStack;