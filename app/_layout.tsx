/**
 * Root Layout
 * 
 * Top-level layout for the entire app.
 * Wraps all routes and can be used for:
 * - Global providers (Auth, Theme, etc.)
 * - Font loading
 * - Splash screen handling
 */

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load fonts if needed
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if you want
    // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      {/* Entry point - handles auth check and redirect */}
      <Stack.Screen name="index" />
      
      {/* Auth stack */}
      <Stack.Screen name="auth" />
      
      {/* Main app tabs */}
      <Stack.Screen name="(tabs)" />
      
      {/* Other screens */}
      <Stack.Screen name="screens" />
    </Stack>
  );
}