// // index.tsx

// import React from 'react';
// import { AppRegistry, View, Text } from 'react-native';
// // import { AuthProvider } from './context/authContext';
// // import AppNavigator from './navigation/AppNavigator';


// function App() {
//   return (
//     <View style={{ flex: 1 }}>
//       <Text>hiii</Text>
//     </View>

//     //<AuthProvider>
//     //<AppNavigator />
//     //</AuthProvider>
//   );
// }

// export default App;

// // Register the root component for React Native app
// AppRegistry.registerComponent('main', () => App);


// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { AuthProvider } from "./context/authContext";
// import { ThemeProvider } from "./context/Theme";
// import AppNavigator from "./navigator";

// export default function App() {
//   return (
//     <AuthProvider>
//       <ThemeProvider>
//           <AppNavigator />
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }


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
