/**
 * EmptyState Component
 * 
 * A friendly message shown when there's no content to display.
 * Used for empty document lists, search results, etc.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap; // Icon name
  title: string; // Main message
  subtitle?: string; // Optional description
}

export default function EmptyState({ 
  icon = 'document-text-outline',
  title,
  subtitle 
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon}
          size={64}
          color={Colors.textLight}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Subtitle (optional) */}
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </View>
  );
}