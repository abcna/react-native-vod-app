import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, I18nManager, View } from "react-native";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

export default function App(): React.JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Enable RTL for Persian language
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
    console.log("[RTL] Persian RTL enabled");
  }, []);

  useEffect(() => {
    async function loadFonts() {
      try {
        // Load Persian fonts from src/assets/fonts
        await Font.loadAsync({
          "Vazir-Regular": require("./src/assets/fonts/Vazir-Regular.ttf"),
          "Vazir-Bold": require("./src/assets/fonts/Vazir-Bold.ttf"),
        });
        console.log("[FONTS] Persian fonts loaded successfully");
      } catch (e) {
        // If fonts fail to load (placeholder files), continue with system fonts
        console.warn(
          "[FONTS] Font loading failed, continuing with defaults:",
          e
        );
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
