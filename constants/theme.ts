/**
 * Theme Constants
 * 
 * This file contains all design tokens for the app.
 * Change colors, spacing, or fonts here and they update everywhere.
 */

export const Colors = {
    // Primary brand colors
    primary: '#6366F1', // Indigo - main brand color
    primaryLight: '#A5B4FC',
    primaryDark: '#4338CA',
  
    // Background colors
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB',
    surface: '#FFFFFF',
    
    // Text colors
    text: '#111827', // Dark gray - primary text
    textSecondary: '#6B7280', // Medium gray - secondary text
    textLight: '#9CA3AF', // Light gray - hints/placeholders
    
    // Category colors (for document types)
    categories: {
      medical: '#3B82F6', // Blue
      warranty: '#10B981', // Green
      receipt: '#F59E0B', // Orange
      tax: '#8B5CF6', // Purple
      insurance: '#EF4444', // Red
      legal: '#EC4899', // Pink
      education: '#14B8A6', // Teal
      other: '#6B7280', // Gray
    },
  
    // Category colors with opacity (for backgrounds)
    categoriesLight: {
      medical: '#DBEAFE',
      warranty: '#D1FAE5',
      receipt: '#FEF3C7',
      tax: '#EDE9FE',
      insurance: '#FEE2E2',
      legal: '#FCE7F3',
      education: '#CCFBF1',
      other: '#F3F4F6',
    },
  
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  
    // UI colors
    border: '#E5E7EB',
    divider: '#F3F4F6',
    disabled: '#D1D5DB',
    
    // Overlay colors
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  };
  
  export const Typography = {
    // Font sizes
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
  
    // Font weights
    weights: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  
    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  };
  
  export const Spacing = {
    // Base spacing unit: 4px
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
  
    // Common spacing patterns
    screenPadding: 16, // Standard padding for screens
    cardPadding: 16, // Padding inside cards
    sectionGap: 24, // Gap between sections
  };
  
  export const BorderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999, // For circular elements
  };
  
  export const Shadows = {
    // Subtle shadow for cards
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
  
    // Medium shadow for elevated elements
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  
    // Strong shadow for modals/floating elements
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  };
  
  export const Layout = {
    // Screen dimensions
    maxContentWidth: 600, // Max width for content on tablets
  
    // Common heights
    tabBarHeight: 60,
    headerHeight: 56,
    buttonHeight: 48,
    inputHeight: 48,
  
    // Icon sizes
    iconSizes: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 32,
      xl: 48,
    },
  };
  
  /**
   * Helper function to get category color
   * @param category - The document category
   * @param light - Whether to return the light version
   */
  export const getCategoryColor = (
    category: keyof typeof Colors.categories,
    light: boolean = false
  ): string => {
    if (light) {
      return Colors.categoriesLight[category] || Colors.categoriesLight.other;
    }
    return Colors.categories[category] || Colors.categories.other;
  };