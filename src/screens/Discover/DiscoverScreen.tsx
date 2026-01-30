import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DiscoverScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Screen</Text>
      <Text style={styles.subtitle}>Browse & Search Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#888888",
    fontSize: 16,
  },
});
