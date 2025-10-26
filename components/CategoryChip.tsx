/**
 * CategoryChip Component
 * 
 * A small colored badge that displays a document category.
 * Used in document cards, filters, and detail screens.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryType, getCategoryById } from '@/constants/categories';
import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { getCategoryColor } from '@/constants/theme';

interface CategoryChipProps {
  category: CategoryType;
  showIcon?: boolean; // Whether to show the icon
  size?: 'small' | 'medium' | 'large'; // Size variant
}

export default function CategoryChip({ 
  category, 
  showIcon = true,
  size = 'medium' 
}: CategoryChipProps) {
  const categoryData = getCategoryById(category);
  const backgroundColor = getCategoryColor(category, true); // Light version
  const textColor = getCategoryColor(category, false); // Dark version

  // Size-based styling
  const sizeStyles = {
    small: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      fontSize: Typography.sizes.xs,
      iconSize: 12,
    },
    medium: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      fontSize: Typography.sizes.sm,
      iconSize: 16,
    },
    large: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: Typography.sizes.base,
      iconSize: 20,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View 
      style={[
        styles.container,
        {
          backgroundColor,
          paddingVertical: currentSize.paddingVertical,
          paddingHorizontal: currentSize.paddingHorizontal,
        }
      ]}
    >
      {showIcon && (
        <Ionicons 
          name={categoryData.icon as any} 
          size={currentSize.iconSize} 
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text 
        style={[
          styles.label,
          { 
            color: textColor,
            fontSize: currentSize.fontSize,
          }
        ]}
      >
        {categoryData.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Don't stretch to fill width
    borderRadius: BorderRadius.full, // Fully rounded pill shape
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: Typography.weights.medium,
  },
});