/**
 * Profile/Settings Screen
 * 
 * User account management, preferences, and app settings.
 * Shows user info, notification settings, storage usage, and support options.
 * 
 * USAGE:
 * - Place in app/(tabs) folder as a tab screen
 * - For now uses dummy data, replace with API calls later
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// Dummy user data - replace with API/context later
const DUMMY_USER = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'JD',
  memberSince: '2024-01-15',
  documentsCount: 12,
  storageUsed: 2.4, // GB
  storageLimit: 5, // GB
  photoUrl: null as string | null, // Profile photo URL
};

export default function ProfileScreen() {
  const router = useRouter();

  // User photo state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(DUMMY_USER.photoUrl);

  // Notification settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [expiryReminders, setExpiryReminders] = useState(true);
  const [familyUpdates, setFamilyUpdates] = useState(true);

  // Calculate storage percentage
  const storagePercentage = (DUMMY_USER.storageUsed / DUMMY_USER.storageLimit) * 100;

  // Handle change profile photo
  const handleChangePhoto = async () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose a source',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            // Request camera permission
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Camera permission is required to take a photo');
              return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProfilePhoto(result.assets[0].uri);
              // TODO: Upload to server
              console.log('New photo selected:', result.assets[0].uri);
            }
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            // Request media library permission
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
              Alert.alert('Permission Denied', 'Photos permission is required to select a photo');
              return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setProfilePhoto(result.assets[0].uri);
              // TODO: Upload to server
              console.log('New photo selected:', result.assets[0].uri);
            }
          },
        },
        {
          text: 'Remove Photo',
          style: 'destructive',
          onPress: () => {
            setProfilePhoto(null);
            // TODO: Delete from server
            console.log('Photo removed');
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Handle edit profile
  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing coming soon!');
    // TODO: Navigate to edit profile screen
  };

  // Handle manage subscription
  const handleManageSubscription = () => {
    Alert.alert('Manage Subscription', 'Subscription management coming soon!');
    // TODO: Navigate to subscription screen or open payment portal
  };

  // Handle export data
  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This will create a ZIP file with all your documents and data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // TODO: Call export API
            Alert.alert('Success', 'Your data export has been started. You will receive an email when it\'s ready.');
          },
        },
      ]
    );
  };

  // Handle help & support
  const handleHelp = () => {
    // Open help center or email
    Linking.openURL('mailto:support@paperpile.app?subject=Help Request');
  };

  // Handle privacy policy
  const handlePrivacy = () => {
    Linking.openURL('https://paperpile.app/privacy');
  };

  // Handle terms of service
  const handleTerms = () => {
    Linking.openURL('https://paperpile.app/terms');
  };

  // Handle about
  const handleAbout = () => {
    Alert.alert(
      'Paper Pile',
      'Version 1.0.0\n\nYour family\'s important documents, organized and searchable.\n\n© 2024 Paper Pile',
      [{ text: 'OK' }]
    );
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // TODO: Clear user session, navigate to auth
            console.log('Logging out...');
            Alert.alert('Logged Out', 'You have been logged out successfully');
          },
        },
      ]
    );
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data. This action cannot be undone. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // Show confirmation again
            Alert.alert(
              'Final Confirmation',
              'Type DELETE to confirm account deletion',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: () => {
                    // TODO: Call delete account API
                    console.log('Deleting account...');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  // Format date helper
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {profilePhoto ? (
              <Image 
                source={{ uri: profilePhoto }} 
                style={styles.avatarImage}
              />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{DUMMY_USER.avatar}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={handleChangePhoto}
            >
              <Ionicons name="camera" size={16} color={Colors.background} />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{DUMMY_USER.name}</Text>
          <Text style={styles.userEmail}>{DUMMY_USER.email}</Text>
          <Text style={styles.memberSince}>
            Member since {formatDate(DUMMY_USER.memberSince)}
          </Text>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={18} color={Colors.primary} />
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage</Text>
          <View style={styles.storageCard}>
            <View style={styles.storageHeader}>
              <Text style={styles.storageText}>
                {DUMMY_USER.storageUsed} GB of {DUMMY_USER.storageLimit} GB used
              </Text>
              <Text style={styles.storagePercentage}>
                {Math.round(storagePercentage)}%
              </Text>
            </View>
            
            {/* Storage Progress Bar */}
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${storagePercentage}%`,
                    backgroundColor: storagePercentage > 80 
                      ? Colors.error 
                      : storagePercentage > 60 
                      ? Colors.warning 
                      : Colors.success 
                  }
                ]} 
              />
            </View>

            <Text style={styles.storageSubtext}>
              {DUMMY_USER.documentsCount} documents stored
            </Text>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive notifications for important updates
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={notificationsEnabled ? Colors.primary : Colors.disabled}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Expiry Reminders</Text>
                <Text style={styles.settingDescription}>
                  Get notified before documents expire
                </Text>
              </View>
              <Switch
                value={expiryReminders}
                onValueChange={setExpiryReminders}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={expiryReminders ? Colors.primary : Colors.disabled}
                disabled={!notificationsEnabled}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Family Updates</Text>
                <Text style={styles.settingDescription}>
                  Notify when family members add documents
                </Text>
              </View>
              <Switch
                value={familyUpdates}
                onValueChange={setFamilyUpdates}
                trackColor={{ false: Colors.border, true: Colors.primaryLight }}
                thumbColor={familyUpdates ? Colors.primary : Colors.disabled}
                disabled={!notificationsEnabled}
              />
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.menuCard}>
            {/* Manage Subscription */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleManageSubscription}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="card-outline" size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>Manage Subscription</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Export Data */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleExportData}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="download-outline" size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>Export Data</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.menuCard}>
            {/* Help & Support */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleHelp}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Privacy Policy */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handlePrivacy}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-checkmark-outline" size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>Privacy Policy</Text>
              </View>
              <Ionicons name="open-outline" size={18} color={Colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Terms of Service */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleTerms}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="document-text-outline" size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>Terms of Service</Text>
              </View>
              <Ionicons name="open-outline" size={18} color={Colors.textLight} />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* About */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleAbout}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="information-circle-outline" size={22} color={Colors.textSecondary} />
                <Text style={styles.menuItemText}>About</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <View style={styles.menuCard}>
            {/* Log Out */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="log-out-outline" size={22} color={Colors.error} />
                <Text style={[styles.menuItemText, { color: Colors.error }]}>
                  Log Out
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Delete Account */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDeleteAccount}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="trash-outline" size={22} color={Colors.error} />
                <Text style={[styles.menuItemText, { color: Colors.error }]}>
                  Delete Account
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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