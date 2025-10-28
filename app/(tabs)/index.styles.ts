import { StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
  },
  filtersContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    marginBottom: Spacing['2xl'],
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: 20,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  filterChipTextSelected: {
    color: Colors.background,
  },
  countContainer: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.sm,
  },
  countText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
});
