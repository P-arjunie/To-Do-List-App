import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../context/authContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define the RootStackParamList type
type RootStackParamList = {
  Auth: undefined;
  Landing: undefined;
  MainTabs: undefined; // Changed from Home to MainTabs to match your navigator
};

// Fix useNavigation typing
type NavigationProp = StackNavigationProp<RootStackParamList, "Auth">;

const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useAuth();
  
  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
  
    try {
      if (isLogin) {
        await login(email, password);
        // Let the navigator automatically redirect based on auth state
        // The AppNavigator will detect the user and show MainTabs
      } else {
        if (password.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters long.");
          return;
        }
        await register(email, password);
        Alert.alert("Success", "Account created! You can now log in.");
        setIsLogin(true); // Switch to login mode after registration
      }
    } catch (error: any) {
      let errorMessage = "Something went wrong. Please try again.";
  
      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/missing-password") {
        errorMessage = "Please enter a password.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No user found. Please register first.";
      }
  
      Alert.alert("Error", errorMessage);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image 
          source={require("../../assets/images/logo.png")} 
          style={styles.image} 
          resizeMode="contain"
        />
        
        <Text style={styles.title}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#999"
          />
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>
            {isLogin ? "Login" : "Register"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text style={styles.toggleText}>
            {isLogin ? "Need an account? Register" : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.decorationLine} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDE7", // Light yellow background matching landing page
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 180,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#173E7C", 
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FF85A2", // Pink button
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#173E7C", // Dark blue text matching landing page
    fontWeight: "600",
    fontSize: 16,
  },
  toggleText: {
    color: "#173E7C", // Dark blue text matching landing page
    marginTop: 10,
    fontSize: 14,
  },
  decorationLine: {
    height: 4,
    width: 100,
    backgroundColor: "#FFD54F", // Yellow matching landing page
    marginTop: 40,
    borderRadius: 2,
  },
});

export default AuthScreen;