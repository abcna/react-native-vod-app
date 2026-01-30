import React from "react";
import { I18nManager, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#16a34a",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
  },
});

export default function NativeWindExample(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {I18nManager.isRTL ? "خوش آمدید" : "Welcome"}
        </Text>
        <Text style={styles.subtitle}>✓ RTL + Styling Works!</Text>
        <Text style={styles.description}>
          {I18nManager.isRTL ? "RTL فارسی فعال است" : "RTL Persian enabled"}
        </Text>
      </View>
    </View>
  );
}
