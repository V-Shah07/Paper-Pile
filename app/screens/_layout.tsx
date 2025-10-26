/**
 * Screens Layout
 * 
 * Layout for additional screens that aren't tabs or auth.
 * These are screens you navigate to from within the app.
 */

import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="documentDetail" />
      <Stack.Screen name="editDetails" />
    </Stack>
  );
}