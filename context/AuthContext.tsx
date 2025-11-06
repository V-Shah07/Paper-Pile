/**
 * Authentication Context
 *
 * Manages user authentication state globally.
 * Provides login, signup, logout functions to the entire app.
 */

import { UserProfile } from "@/app/types/family";
import { auth, db } from "@/config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Temporarily disabled for Expo Go

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  showAllDocuments: boolean;
  setShowAllDocuments: (value: boolean) => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAllDocuments, setShowAllDocuments] = useState(true);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("🔵 [Auth] Loading user profile from Firestore...");

      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile: UserProfile = {
          userId: userId,
          email: data.email,
          name: data.name,
          familyId: data.familyId || null,
          familyRole: data.familyRole || undefined,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        setUserProfile(profile);
        console.log("✅ [Auth] User profile loaded:", {
          familyId: profile.familyId,
          familyRole: profile.familyRole,
        });
      } else {
        console.log("⚠️  [Auth] User profile not found in Firestore");
        setUserProfile(null);
      }
    } catch (error) {
      console.error("❌ [Auth] Error loading user profile:", error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    console.log("🔵 [Auth] Setting up auth listener...");

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ [Auth] User logged in:", user.email);
        await AsyncStorage.setItem("isLoggedIn", "true");
        await loadUserProfile(user.uid);
      } else {
        console.log("❌ [Auth] No user logged in");
        await AsyncStorage.removeItem("isLoggedIn");
        setUserProfile(null);
      }

      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    console.log("🔵 [1/4] Starting signup for:", email);

    try {
      // Create user in Firebase Auth
      console.log("🔵 [2/4] Calling createUserWithEmailAndPassword...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("✅ [2/4] SUCCESS! User created in Auth:", user.uid);
      console.log("✅ User email:", user.email);

      // Update display name
      console.log("🔵 [3/4] Updating display name...");
      await updateProfile(user, { displayName: name });
      console.log("✅ [3/4] Display name updated to:", name);

      // Create user document in Firestore
      console.log("🔵 [4/4] Creating Firestore document...");
      const userDocData = {
        name,
        email,
        createdAt: new Date().toISOString(),
        avatarUrl: null,
        familyId: null,
        familyRole: null,
        storageUsed: 0,
      };
      console.log("Document data:", userDocData);

      await setDoc(doc(db, "users", user.uid), userDocData);

      console.log("✅ [4/4] Firestore document created!");

      // Load the profile we just created
      console.log("🔵 [5/5] Loading user profile...");
      await loadUserProfile(user.uid);
      console.log("✅ [5/5] User profile loaded!");

      console.log("🎉 SIGNUP COMPLETE! User ID:", user.uid);
    } catch (error: any) {
      console.error("❌ SIGNUP ERROR");
      console.error("Error object:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    console.log("🔵 [AuthContext] Attempting login for:", email);
    await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ [AuthContext] Login successful");
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      // await AsyncStorage.removeItem('isLoggedIn'); // Temporarily disabled for Expo Go
      console.log("Logout successful");
    } catch (error: any) {
      console.error("Logout error:", error);
      throw new Error(error.message);
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent");
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw new Error(error.message);
    }
  };

  const refreshUserProfile = async () => {
    if (user) {
      console.log("🔵 [Auth] Manually refreshing user profile...");
      await loadUserProfile(user.uid);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    showAllDocuments,
    setShowAllDocuments,
    signup,
    login,
    logout,
    resetPassword,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
