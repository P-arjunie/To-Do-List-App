// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./context/Theme";
import AppNavigator from "./navigator";

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
          <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}
