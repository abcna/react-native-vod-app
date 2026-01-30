import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Compass, Home, User, Wallet } from "lucide-react-native";
import React from "react";
import { StyleSheet } from "react-native";
import DiscoverScreen from "../screens/Discover/DiscoverScreen";
import FeedScreen from "../screens/Feed/FeedScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import WalletScreen from "../screens/Wallet/WalletScreen";

export type BottomTabParamList = {
  Home: undefined;
  Discover: undefined;
  Wallet: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#1F2937",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let icon;

          if (route.name === "Home") {
            icon = <Home size={28} color={focused ? "#FFFFFF" : "#888888"} />;
          } else if (route.name === "Discover") {
            icon = (
              <Compass size={28} color={focused ? "#FFFFFF" : "#888888"} />
            );
          } else if (route.name === "Wallet") {
            icon = <Wallet size={28} color={focused ? "#FFFFFF" : "#888888"} />;
          } else if (route.name === "Profile") {
            icon = <User size={28} color={focused ? "#FFFFFF" : "#888888"} />;
          }

          return icon;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={FeedScreen}
        options={{
          tabBarStyle: {
            ...styles.tabBar,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          },
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarStyle: styles.tabBar,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarStyle: styles.tabBar,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarStyle: styles.tabBar,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000000",
    borderTopColor: "#1F2937",
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
});
