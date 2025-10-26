/**
 * FloatingActionButton (FAB) Component
 * 
 * A circular button that floats above the screen content.
 * Used for primary actions like "Add Document".
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap; // Icon name
  color?: string; // Background color
}

export default function FloatingActionButton({ 
  onPress,
  icon = 'add',
  color = Colors.primary,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.fab, { backgroundColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={icon}
        size={28}
        color={Colors.background} // White icon
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 30 : 10, // Account for tab bar
    width: 56,
    height: 56,
    borderRadius: 28, // Circular
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg, // Strong shadow for elevation
  },
});