import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import FeedScreen from "../screens/Feed/FeedScreen";

export type RootStackParamList = {
  Feed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Feed"
          component={FeedScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
