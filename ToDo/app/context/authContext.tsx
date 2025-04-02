import { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/FirebaseConfig";
import { register, login, signOut } from "../services/Auth";
import { Alert } from "react-native";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    //login option handle
    const handleLogin = async (email: string, password: string) => {
        try {
            await login(email, password);
        } catch (error: any) {
            let errorMessage = "Login failed. Please try again.";
            if (error.code === "auth/invalid-credential") {
                errorMessage = "Invalid email or password.";
            } else if (error.code === "auth/user-not-found") {
                errorMessage = "No user found. Please register first.";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "Incorrect password.";
            }
            Alert.alert("Error", errorMessage);
        }
    };
    
    //register user handle
    const handleRegister = async (email: string, password: string) => {
        try {
            const userCredential = await register(email, password);
            setUser(userCredential.user);
        } catch (error) {
            console.error("Registration Error:", error);
        }
    };
    //handle logout
    const handleLogout = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login: handleLogin, register: handleRegister, logout: handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
