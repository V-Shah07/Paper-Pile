import { StyleSheet, Platform } from 'react-native';
import { Shadows } from '@/constants/theme';

export const styles = StyleSheet.create({
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
