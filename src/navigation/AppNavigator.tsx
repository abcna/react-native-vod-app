import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import SeriesDetailsScreen from "@/screens/SeriesDetails/SeriesDetailsScreen";
import TrailerPlayerScreen from "../screens/Feed/TrailerPlayerScreen";
import TrailerReelsScreen from "../screens/Feed/TrailerReelsScreen";
import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
  Tabs: undefined;
  SeriesDetails: { tvId: number };
  TrailerPlayer: { tvId: number; initialVideoKey?: string; title?: string };
  TrailerReels: {
    items: {
      id: number;
      name: string;
      poster_path?: string | null;
      backdrop_path?: string | null;
    }[];
    initialIndex: number;
    initialTrailerKeyByTvId?: Record<string, string>;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={BottomTabNavigator} />
        <Stack.Screen name="SeriesDetails" component={SeriesDetailsScreen} />
        <Stack.Screen name="TrailerPlayer" component={TrailerPlayerScreen} />
        <Stack.Screen name="TrailerReels" component={TrailerReelsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
