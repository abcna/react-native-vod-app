import * as Font from "expo-font";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, I18nManager, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App(): React.JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // LTR baseline (we'll re-enable RTL later when the UI is finalized)
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    console.log("[RTL] LTR baseline enabled");
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
          e,
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

  return <AppNavigator />;
}
