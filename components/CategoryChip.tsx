/**
 * CategoryChip Component
 * 
 * A small colored badge that displays a document category.
 * Used in document cards, filters, and detail screens.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CategoryType, getCategoryById } from '@/constants/categories';
import { Typography } from '@/constants/theme';
import { getCategoryColor } from '@/constants/theme';
import { styles } from './CategoryChip.styles';

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