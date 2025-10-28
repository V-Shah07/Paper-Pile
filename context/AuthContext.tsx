/**
 * Authentication Context
 * 
 * Manages user authentication state globally.
 * Provides login, signup, logout functions to the entire app.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Temporarily disabled for Expo Go

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      // Store auth state (AsyncStorage temporarily disabled for Expo Go)
      // if (user) {
      //   await AsyncStorage.setItem('isLoggedIn', 'true');
      // } else {
      //   await AsyncStorage.removeItem('isLoggedIn');
      // }
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    console.log('🔵 [1/4] Starting signup for:', email);
    
    try {
      // Create user in Firebase Auth
      console.log('🔵 [2/4] Calling createUserWithEmailAndPassword...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ [2/4] SUCCESS! User created in Auth:', user.uid);
      console.log('✅ User email:', user.email);
  
      // Update display name
      console.log('🔵 [3/4] Updating display name...');
      await updateProfile(user, { displayName: name });
      console.log('✅ [3/4] Display name updated to:', name);
  
      // Create user document in Firestore
      console.log('🔵 [4/4] Creating Firestore document...');
      const userDocData = {
        name,
        email,
        createdAt: new Date().toISOString(),
        avatarUrl: null,
        familyId: null,
        storageUsed: 0,
      };
      console.log('Document data:', userDocData);
      
      await setDoc(doc(db, 'users', user.uid), userDocData);
      
      console.log('✅ [4/4] Firestore document created!');
      console.log('🎉 SIGNUP COMPLETE! User ID:', user.uid);
    } catch (error: any) {
      console.error('❌ SIGNUP ERROR');
      console.error('Error object:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error;
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    console.log('🔵 [AuthContext] Attempting login for:', email);
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ [AuthContext] Login successful');
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      // await AsyncStorage.removeItem('isLoggedIn'); // Temporarily disabled for Expo Go
      console.log('Logout successful');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message);
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}