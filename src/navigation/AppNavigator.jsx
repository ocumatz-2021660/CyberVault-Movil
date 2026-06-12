import {NavigationContainer } from "@react-navigation/native";
import AuthStack from "./AuthStack.jsx";
import { View, ActivityIndicator, StyleSheet} from "react-native"
import { COLORS } from "../shared/constants/theme"

const AppNavigator = ({navigation})=>{
    return(
        <NavigationContainer>
            <AuthStack/>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.color_primary,
    },
});

export default AppNavigator;