import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

// Define the RootStackParamList type
type RootStackParamList = {
  Auth: undefined;
  Calendar: undefined;
  Home: undefined; 
};

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
    backgroundColor: "#FFFDE7", 
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
    color: "#173E7C", 
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
    backgroundColor: "#FF85A2", 
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
    color: "#173E7C", 
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  decorationLine: {
    position: "absolute",
    height: 4,
    width: "40%",
    backgroundColor: "#173E7C", 
    bottom: 30,
    borderRadius: 2,
  },
});

export default LandingScreen;