/**
 * App Entry Point (Index)
 * 
 * This is the first screen that loads when the app starts.
 * It checks if the user is logged in and redirects accordingly:
 * - If logged in → Main app (tabs)
 * - If not logged in → Auth flow (welcome screen)
 * 
 * USAGE:
 * - Place as app/index.tsx
 * - This runs automatically on app launch
 */

import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // TODO: Check if user is authenticated
      // For example, check AsyncStorage for auth token
      // const token = await AsyncStorage.getItem('authToken');
      
      // For now, we'll simulate a quick check
      await new Promise(resolve => setTimeout(resolve, 500));

      // TODO: Replace this with actual auth check
      const isLoggedIn = true; // Change this based on your auth logic

      if (isLoggedIn) {
        // User is logged in → Go to main app
        router.replace('/(tabs)');
      } else {
        // User is not logged in → Go to welcome screen
        router.replace('/auth/welcome');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, default to auth flow
      router.replace('/auth/welcome');
    }
  };

  // Show loading screen while checking auth
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});