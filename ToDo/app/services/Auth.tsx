import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    UserCredential,
    User
} from 'firebase/auth';
import { auth } from './FirebaseConfig';

export const register = async (email: string, password: string): Promise<UserCredential> => {
    try {
        return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Firebase Register Error:", error);
        throw error;
    }
};

export const login = async (email: string, password: string): Promise<UserCredential> => {
    try {
        return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Firebase Login Error:", error);
        throw error;
    }
};

export const signOut = async (): Promise<void> => {
    try {
        return await firebaseSignOut(auth);
    } catch (error) {
        console.error("Firebase Logout Error:", error);
        throw error;
    }
};

export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};
