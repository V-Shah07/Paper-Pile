/**
 * Family Screen
 * 
 * Handles family sharing and collaboration features.
 * Shows family members, allows inviting new members, and manages document visibility.
 * 
 * TWO STATES:
 * 1. NO FAMILY - Shows empty state with create/join options
 * 2. HAS FAMILY - Shows family members and management options
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
  Alert,
  TextInput,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

// Dummy data - replace with API calls later
interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  documentCount: number;
  avatar?: string; // URL or initials
  joinedDate: string;
}

const DUMMY_FAMILY = {
  id: 'fam-123',
  name: 'The Johnson Family',
  inviteCode: 'JOIN-ABC123',
  members: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin' as const,
      documentCount: 12,
      avatar: 'JD',
      joinedDate: '2024-01-15',
    },
    {
      id: '2',
      name: 'Sarah Doe',
      email: 'sarah@example.com',
      role: 'member' as const,
      documentCount: 8,
      avatar: 'SD',
      joinedDate: '2024-01-16',
    },
    {
      id: '3',
      name: 'Emma Doe',
      email: 'emma@example.com',
      role: 'member' as const,
      documentCount: 3,
      avatar: 'ED',
      joinedDate: '2024-02-01',
    },
  ],
};

export default function FamilyScreen() {
  // State
  const [hasFamily, setHasFamily] = useState(false); // Set to false to see empty state
  const [showAllDocuments, setShowAllDocuments] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  // Current family data (in real app, fetch from API)
  const family = hasFamily ? DUMMY_FAMILY : null;

  // Handle creating a family
  const handleCreateFamily = () => {
    if (!familyName.trim()) {
      Alert.alert('Error', 'Please enter a family name');
      return;
    }

    // TODO: API call to create family
    console.log('Creating family:', familyName);
    
    // Simulate success
    Alert.alert(
      'Family Created!',
      `"${familyName}" has been created. You can now invite members.`,
      [
        {
          text: 'OK',
          onPress: () => {
            setShowCreateModal(false);
            setHasFamily(true);
            setFamilyName('');
          },
        },
      ]
    );
  };

  // Handle joining a family
  const handleJoinFamily = () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    // TODO: API call to join family
    console.log('Joining with code:', joinCode);
    
    // Simulate success
    Alert.alert(
      'Joined Family!',
      'You are now part of the family group.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowJoinModal(false);
            setHasFamily(true);
            setJoinCode('');
          },
        },
      ]
    );
  };

  // Handle inviting a member
  const handleInvite = async () => {
    if (!family) return; // Guard clause
    
    const inviteMessage = `Join our Paper Pile family group!\n\nFamily: ${family.name}\nInvite Code: ${family.inviteCode}\n\nDownload Paper Pile and use this code to join.`;

    try {
      if (Platform.OS === 'web') {
        // For web, just copy to clipboard
        Alert.alert(
          'Invite Code',
          `Share this code with family members:\n\n${family.inviteCode}`,
          [{ text: 'OK' }]
        );
      } else {
        // For mobile, use native share
        await Share.share({
          message: inviteMessage,
        });
      }
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle removing a member (admin only)
  const handleRemoveMember = (member: FamilyMember) => {
    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${member.name} from the family?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // TODO: API call to remove member
            console.log('Removing member:', member.id);
            Alert.alert('Success', `${member.name} has been removed`);
          },
        },
      ]
    );
  };

  // Handle leaving family
  const handleLeaveFamily = () => {
    Alert.alert(
      'Leave Family',
      'Are you sure you want to leave this family group? You will lose access to shared documents.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => {
            // TODO: API call to leave family
            console.log('Leaving family');
            setHasFamily(false);
            Alert.alert('Left Family', 'You have left the family group');
          },
        },
      ]
    );
  };

  // Render avatar circle
  const renderAvatar = (member: FamilyMember) => {
    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{member.avatar}</Text>
      </View>
    );
  };

  // EMPTY STATE - No family yet
  if (!hasFamily) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family</Text>
        </View>

        <ScrollView 
          contentContainerStyle={styles.emptyContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Illustration */}
          <View style={styles.emptyIconContainer}>
            <Ionicons name="people" size={64} color={Colors.textLight} />
          </View>

          {/* Title */}
          <Text style={styles.emptyTitle}>No Family Group Yet</Text>

          {/* Description */}
          <Text style={styles.emptySubtitle}>
            Create or join a family group to share important documents with loved ones securely.
          </Text>

          {/* Benefits List */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.benefitText}>Share documents instantly</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.benefitText}>Control who sees what</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.benefitText}>Keep everyone organized</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.emptyActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.primaryButtonText}>Create Family Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowJoinModal(true)}
            >
              <Text style={styles.secondaryButtonText}>Join Existing Group</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Create Family Modal */}
        <Modal
          visible={showCreateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCreateModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create Family Group</Text>
              
              <TextInput
                style={styles.input}
                value={familyName}
                onChangeText={setFamilyName}
                placeholder="Enter family name (e.g., The Smiths)"
                placeholderTextColor={Colors.textLight}
                autoFocus
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setShowCreateModal(false);
                    setFamilyName('');
                  }}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleCreateFamily}
                >
                  <Text style={styles.modalButtonTextPrimary}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Join Family Modal */}
        <Modal
          visible={showJoinModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowJoinModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Join Family Group</Text>
              
              <TextInput
                style={styles.input}
                value={joinCode}
                onChangeText={setJoinCode}
                placeholder="Enter invite code (e.g., JOIN-ABC123)"
                placeholderTextColor={Colors.textLight}
                autoCapitalize="characters"
                autoFocus
              />

              <Text style={styles.helperText}>
                Ask a family member for their invite code
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setShowJoinModal(false);
                    setJoinCode('');
                  }}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleJoinFamily}
                >
                  <Text style={styles.modalButtonTextPrimary}>Join</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // HAS FAMILY STATE - Show family management
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Family</Text>
        <TouchableOpacity onPress={() => setShowInviteModal(true)}>
          <Ionicons name="person-add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Family Info Card */}
        <View style={styles.familyCard}>
          <View style={styles.familyCardHeader}>
            <View style={styles.familyIconContainer}>
              <Ionicons name="people" size={32} color={Colors.primary} />
            </View>
            <View style={styles.familyInfo}>
              <Text style={styles.familyName}>{family?.name || ''}</Text>
              <Text style={styles.familyMeta}>
                {family?.members.length || 0} {family?.members.length === 1 ? 'member' : 'members'}
              </Text>
            </View>
          </View>

          {/* Invite Code Section */}
          <View style={styles.inviteCodeSection}>
            <View style={styles.inviteCodeHeader}>
              <Text style={styles.inviteCodeLabel}>Invite Code</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(true)}>
                <Text style={styles.shareLink}>Share</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inviteCodeBox}>
              <Text style={styles.inviteCode}>{family?.inviteCode || ''}</Text>
            </View>
          </View>
        </View>

        {/* Document Visibility Toggle */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Show All Documents</Text>
            <Text style={styles.toggleSubtitle}>
              {showAllDocuments 
                ? 'Showing documents from all family members'
                : 'Showing only your documents'
              }
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggle,
              showAllDocuments && styles.toggleActive,
            ]}
            onPress={() => setShowAllDocuments(!showAllDocuments)}
          >
            <View
              style={[
                styles.toggleThumb,
                showAllDocuments && styles.toggleThumbActive,
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Members Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members</Text>
          
          {family?.members.map((member) => (
            <View key={member.id} style={styles.memberCard}>
              {/* Avatar */}
              {renderAvatar(member)}

              {/* Member Info */}
              <View style={styles.memberInfo}>
                <View style={styles.memberHeader}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  {member.role === 'admin' && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Admin</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberEmail}>{member.email}</Text>
                <Text style={styles.memberMeta}>
                  {member.documentCount} {member.documentCount === 1 ? 'document' : 'documents'}
                </Text>
              </View>

              {/* Actions (only show for non-admins and if current user is admin) */}
              {member.role !== 'admin' && (
                <TouchableOpacity
                  style={styles.memberAction}
                  onPress={() => handleRemoveMember(member)}
                >
                  <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Leave Family Button */}
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={handleLeaveFamily}
        >
          <Ionicons name="exit-outline" size={20} color={Colors.error} />
          <Text style={styles.leaveButtonText}>Leave Family</Text>
        </TouchableOpacity>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Family Member</Text>
            
            <View style={styles.inviteModalCode}>
              <Text style={styles.inviteModalLabel}>Share this code:</Text>
              <View style={styles.inviteModalCodeBox}>
                <Text style={styles.inviteModalCodeText}>{family?.inviteCode || ''}</Text>
              </View>
            </View>

            <Text style={styles.helperText}>
              Family members can use this code to join your group
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleInvite}
              >
                <Ionicons name="share-outline" size={20} color={Colors.background} />
                <Text style={[styles.modalButtonTextPrimary, { marginLeft: 8 }]}>
                  Share Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing['3xl'],
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    marginBottom: Spacing.xl,
  },
  benefitsList: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  benefitText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  emptyActions: {
    width: '100%',
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  primaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.background,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundSecondary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },

  // Family Card Styles
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
    marginBottom: Spacing.lg,
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
  inviteCodeSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingTop: Spacing.md,
  },
  inviteCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  inviteCodeLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.textSecondary,
  },
  shareLink: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
  },
  inviteCodeBox: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  inviteCode: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    letterSpacing: 2,
  },

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