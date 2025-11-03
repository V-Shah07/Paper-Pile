import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

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
  content: {
    flex: 1,
  },

  // Empty State Styles - UPDATED FOR BETTER LAYOUT
  emptyContainer: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.xl, // Reduced from 3xl to xl
    justifyContent: 'space-between', // NEW: Distribute space evenly
  },
  emptyIconContainer: {
    width: 100, // Reduced from 120
    height: 100, // Reduced from 120
    borderRadius: 50,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md, // Reduced from xl
    alignSelf: 'center',
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl, // Reduced from 2xl
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sizes.sm, // Reduced from base
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
    marginBottom: Spacing.md, // Reduced from xl
    paddingHorizontal: Spacing.md,
  },
  benefitsList: {
    width: '100%',
    marginBottom: Spacing.lg, // Reduced from xl
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm, // Reduced from md
  },
  benefitText: {
    fontSize: Typography.sizes.sm, // Reduced from base
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  // NEW: Container for action buttons
  emptyActions: {
    width: '100%',
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  // UPDATED: Wider buttons with flexDirection row
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2, // Slightly taller
    paddingHorizontal: Spacing.lg, // NEW: Added horizontal padding
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm, // NEW: Space between icon and text
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.background,
  },
  // UPDATED: Wider buttons with flexDirection row
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: Spacing.md + 2, // Slightly taller
    paddingHorizontal: Spacing.lg, // NEW: Added horizontal padding
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm, // NEW: Space between icon and text
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },

  // Family Card Styles - UPDATED (removed invite code section styles)
  familyCard: {
    backgroundColor: Colors.surface,
    margin: Spacing.screenPadding,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  familyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    // REMOVED: marginBottom since no invite code section below
  },
  familyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  familyMeta: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  // REMOVED: inviteCodeSection, inviteCodeHeader, inviteCodeLabel, shareLink, inviteCodeBox, inviteCode
  // These are no longer needed since we removed that section

  // Toggle Card Styles
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  toggleInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    ...Shadows.sm,
  },
  toggleThumbActive: {
    marginLeft: 'auto',
  },

  // Section Styles
  section: {
    paddingHorizontal: Spacing.screenPadding,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },

  // Member Card Styles
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.background,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginRight: Spacing.sm,
  },
  adminBadge: {
    backgroundColor: Colors.primaryLight + '40',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  adminBadgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  memberEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  memberMeta: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
  },
  memberAction: {
    padding: Spacing.sm,
  },

  // Leave Button Styles
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  leaveButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
    marginLeft: Spacing.sm,
  },

  // Modal Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.screenPadding,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.lg,
  },
  modalTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  helperText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  modalButtonSecondary: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  modalButtonTextSecondary: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  modalButtonTextPrimary: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.background,
  },
  inviteModalCode: {
    marginBottom: Spacing.md,
  },
  inviteModalLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  inviteModalCodeBox: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  inviteModalCodeText: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: 2,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});