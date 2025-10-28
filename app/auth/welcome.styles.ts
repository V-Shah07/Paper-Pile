import { StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screenPadding,
  },

  // Logo Section
  logoContainer: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing.xl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontSize: Typography.sizes['4xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },

  // Features Section
  featuresContainer: {
    paddingTop: Spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },

  // Spacer
  spacer: {
    flex: 1,
    minHeight: Spacing.xl,
  },

  // Buttons Section
  buttonsContainer: {
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  signupButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.md,
  },
  signupButtonText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.background,
  },
  loginButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  loginButtonTextBold: {
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
});
