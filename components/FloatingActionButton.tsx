/**
 * FloatingActionButton (FAB) Component
 * 
 * A circular button that floats above the screen content.
 * Used for primary actions like "Add Document".
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { styles } from './FloatingActionButton.styles';

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