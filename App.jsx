import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from "react-native-safe-area-context"
import AppNavigator from "./src/navigation/AppNavigator.jsx"
import NotificationBanner from "./src/shared/components/common/NotificationBanner.jsx"


export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigator/>
      <NotificationBanner />
      <StatusBar style='auto' />
    </SafeAreaProvider>
  );
}
