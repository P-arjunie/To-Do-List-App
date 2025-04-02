// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { LinearGradient } from "expo-linear-gradient"; // You'll need to install expo-linear-gradient

// // Define the RootStackParamList type
// type RootStackParamList = {
//   Auth: undefined;
//   MapScreen: undefined;
// };

// // Fix useNavigation typing
// type NavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

// const LandingScreen = () => {
//   const navigation = useNavigation<NavigationProp>();

//   return (
//     <View style={styles.container}>
//       <StatusBar backgroundColor="#FFFDE7" barStyle="dark-content" />
      
//       {/* Background decorations */}
//       <View style={styles.decorationCircle1} />
//       <View style={styles.decorationCircle2} />
//       <View style={styles.decorationCircle3} />
      
//       {/* Content container with shadow for highlighting */}
//       <View style={styles.contentContainer}>
//         <View style={styles.logoContainer}>
//           <Image 
//             source={require("../../assets/images/logo.png")} 
//             style={styles.logo} 
//             resizeMode="contain"
//           />
//         </View>
        
//         <View style={styles.textContainer}>
//           <Text style={styles.welcomeText}>Welcome to</Text>
//           <Text style={styles.appName}>Jotly</Text>
          
//           <View style={styles.highlightBox}>
//             <Text style={styles.subtitle}>
//             Jot it. Do it. Done! ✅
//             </Text>
//           </View>
          
//           {/* <View style={styles.featureContainer}>
//             <View style={styles.featureItem}>
//               <View style={styles.featureDot} />
//               <Text style={styles.featureText}>Easy organization</Text>
//             </View>
//             <View style={styles.featureItem}>
//               <View style={styles.featureDot} />
//               <Text style={styles.featureText}>Simple tracking</Text>
//             </View>
//             <View style={styles.featureItem}>
//               <View style={styles.featureDot} />
//               <Text style={styles.featureText}>Beautiful design</Text>
//             </View>
//           </View> */}
//         </View>
//       </View>
      
//       {/* Highlighted button with gradient */}
//       <LinearGradient
//         colors={['#FFD54F', '#F9A825']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.buttonGradient}
//       >
//         <TouchableOpacity 
//           style={styles.button}
//           onPress={() => navigation.navigate("Auth")}
//           activeOpacity={0.8}
//         >
//           <Text style={styles.buttonText}>Get Started Now!</Text>
//         </TouchableOpacity>
//       </LinearGradient>
      
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#FFFDE7", // Light yellow background
//     padding: 20,
//     position: "relative",
//     overflow: "hidden"
//   },
//   contentContainer: {
//     width: "90%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 25,
//     alignItems: "center",
//     shadowColor: "#F9A825",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 10,
//     marginBottom: 30,
//     borderWidth: 1,
//     borderColor: "rgba(249, 168, 37, 0.3)", // Light yellow border
//   },
//   logoContainer: {
//     marginBottom: 0,
//     borderRadius: 15,
//     padding: 15,
//     shadowColor: "#F9A825",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   logo: {
//     width: 280,
//     height: 200,
//   },
//   textContainer: {
//     alignItems: "center",
//     width: "100%",
//   },
//   welcomeText: {
//     fontSize: 22,
//     color: "#F9A825", // Golden yellow
//     marginBottom: 5,
//     fontFamily: "System",
//   },
//   appName: {
//     fontSize: 38,
//     fontWeight: "bold",
//     color: "#173E7C", // Dark blue
//     marginBottom: 20,
//     fontFamily: "System",
//     textShadowColor: 'rgba(249, 168, 37, 0.3)',
//     textShadowOffset: { width: 1, height: 1 },
//     textShadowRadius: 3,
//   },
//   highlightBox: {
//     backgroundColor: "#FFF9C4", // Very light yellow
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 20,
//     width: "100%",
//     alignItems: "center",
//     borderLeftWidth: 4,
//     borderLeftColor: "#FFD54F", // Yellow border
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#173E7C", // Dark blue
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   featureContainer: {
//     alignItems: "flex-start",
//     width: "100%",
//     marginBottom: 10,
//   },
//   featureItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   featureDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "#F9A825", // Golden yellow dot
//     marginRight: 8,
//   },
//   featureText: {
//     fontSize: 15,
//     color: "#333",
//   },
//   buttonGradient: {
//     borderRadius: 30,
//     marginTop: 10,
//     shadowColor: "#F9A825",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   button: {
//     paddingVertical: 16,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//   },
//   buttonText: {
//     color: "#173E7C", // Dark blue text
//     fontSize: 18,
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   decorationCircle1: {
//     position: "absolute",
//     width: 220,
//     height: 220,
//     borderRadius: 110,
//     backgroundColor: "rgba(255, 213, 79, 0.3)", // Yellow with opacity
//     top: -60,
//     right: -60,
//   },
//   decorationCircle2: {
//     position: "absolute",
//     width: 180,
//     height: 180,
//     borderRadius: 90,
//     backgroundColor: "rgba(23, 62, 124, 0.1)", // Dark blue with opacity
//     bottom: -40,
//     left: -40,
//   },
//   decorationCircle3: {
//     position: "absolute",
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "rgba(249, 168, 37, 0.15)", // Golden yellow with opacity
//     top: "40%",
//     left: -20,
//   },
// });

// export default LandingScreen;
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define the RootStackParamList type
type RootStackParamList = {
  Auth: undefined;
  Calendar: undefined;
  Home: undefined; 
};

// Fix useNavigation typing
type NavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

const LandingScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFDE7" barStyle="dark-content" />
      
      <View style={styles.contentContainer}>
        <Image 
          source={require("../../assets/images/login2.png")} 
          style={styles.logo} 
          resizeMode="contain"
        />
        
        <Text style={styles.appName}>Jotly</Text>
        
        <Text style={styles.subtitle}>
        Jot it. Do it. Done! 
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate("Auth")}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.decorationLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFDE7", // Light yellow background
    padding: 10,
    position: "relative",
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 480,
    height: 390,
    marginBottom: 0,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#173E7C", // Dark blue
    marginBottom: 16,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FF85A2", // Yellow
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#173E7C", // Dark blue
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  decorationLine: {
    position: "absolute",
    height: 4,
    width: "40%",
    backgroundColor: "#173E7C", // Yellow
    bottom: 30,
    borderRadius: 2,
  },
});

export default LandingScreen;