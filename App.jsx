import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, safeAreaProvider } from "react-native-safe-area-context"
import AppNavigator from "./src/navigation/AppNavigator.jsx"


export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator/>
      <StatusBar style='auto' />
    </SafeAreaProvider>
  );
}
