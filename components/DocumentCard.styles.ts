import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary, // Placeholder while loading
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    lineHeight: Typography.lineHeights.tight * Typography.sizes.base,
  },
  sensitiveIcon: {
    marginLeft: 4,
  },
  categoryContainer: {
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tag: {
    marginRight: 6,
  },
  tagText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  moreTagsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  expiryWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  expiryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.warning,
    marginLeft: 4,
    fontWeight: Typography.weights.medium,
  },
  uploadedByText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 4,
  },
});
