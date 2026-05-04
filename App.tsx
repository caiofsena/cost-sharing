import "./global.css";

import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { Sora_700Bold, Sora_400Regular } from "@expo-google-fonts/sora";
import { Provider } from "react-redux";

import { store } from "./src/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Sora_700Bold,
    Sora_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-800">
        <ActivityIndicator size="large" color="#71D697" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StatusBar style="light" />
      <AppNavigator />
    </Provider>
  );
}
