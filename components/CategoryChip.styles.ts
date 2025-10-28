import { StyleSheet } from 'react-native';
import { BorderRadius, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
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
