import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  content: {
    flex: 1,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.screenPadding,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.background,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    marginTop: Spacing.sm,
  },
  editProfileButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },

  // Section Styles
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.screenPadding,
  },

  // Storage Card Styles
  storageCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.screenPadding,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  storageText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  storagePercentage: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.semibold,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  storageSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },

  // Settings Card Styles
  settingCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.screenPadding,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    color: Colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },

  // Menu Card Styles
  menuCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.screenPadding,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginLeft: Spacing.md,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginHorizontal: Spacing.lg,
  },

  // Version Text
  versionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },

  // Bottom Padding
  bottomPadding: {
    height: Spacing.xl,
  },
});
