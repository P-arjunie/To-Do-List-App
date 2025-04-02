// FooterNav.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";

const Tab = createBottomTabNavigator();

const FooterNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#FF85A2", // Active tab color
        tabBarInactiveTintColor: "gray",  // Inactive tab color
        tabBarStyle: { backgroundColor: "#FF85A2", borderTopWidth: 0 }, // Footer styling
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: "Calendar",
        }}
      />
    </Tab.Navigator>
  );
};

export default FooterNav;
