
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useAuth } from './context/authContext';
// import HomeScreen from './screens/HomeScreen';
// import AuthScreen from './screens/AuthScreen';

// const Stack = createNativeStackNavigator();

// const AppNavigator = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return null; // You might want to show a loading screen here
//   }

//   return (
//     <Stack.Navigator>
//     {user ? (
//         <>
//             <Stack.Screen 
//                 name="Homepage" 
//                 component={HomeScreen} 
//                 options={{ headerShown: false }} 
//             />
//         </>
//     ) : (
//         <Stack.Screen 
//             name="Auth" 
//             component={AuthScreen} 
//             options={{ headerShown: false }} 
//         />
//     )}
// </Stack.Navigator>
//   );
// };

// export default AppNavigator;












// import React from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { useAuth } from "./context/authContext";
// import LandingScreen from "./screens/LandingScreen";
// import HomeScreen from "./screens/HomeScreen";
// import AuthScreen from "./screens/AuthScreen";
// import CalendarScreen from "./screens/CalendarScreen";
// import FooterNav from "./FooterNav";  
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // This component creates our tab navigation
// const TabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: "#FF5252", // Active tab color
//         tabBarInactiveTintColor: "gray",  // Inactive tab color
//         tabBarStyle: { backgroundColor: "#FFD54F", borderTopWidth: 0 }, // Footer styling
//       }}
//     >
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           tabBarLabel: "Home",
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Calendar"
//         component={CalendarScreen}
//         options={{
//           tabBarLabel: "Calendar",
//           headerShown: false,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const AppNavigator = () => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return null; // Display loading screen if needed
//   }

//   return (
//     <Stack.Navigator initialRouteName={user ? "Main" : "Landing"}>
//       <Stack.Screen
//         name="Landing"
//         component={LandingScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Auth"
//         component={AuthScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Calendar"
//         component={CalendarScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Main"
//         component={TabNavigator}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;
// // Removed the conflicting local function declaration











// navigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "./context/authContext";
import LandingScreen from "./screens/LandingScreen";
import HomeScreen from "./screens/HomeScreen";
import AuthScreen from "./screens/AuthScreen";
import CalendarScreen from "./screens/CalendarScreen";
import { Text, View } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab navigator component
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#173E7C",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { 
          backgroundColor: "#FF85A2", 
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CalendarTab"
        component={CalendarScreen}
        options={{
          tabBarLabel: "Calendar",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>📅</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main stack navigator
const AppNavigator = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Loading...</Text></View>;
  }
  
  return (
    <Stack.Navigator initialRouteName={user ? "MainTabs" : "Landing"}>
      {user ? (
        // Authenticated user flow
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      ) : (
        // Non-authenticated user flow
        <>
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;