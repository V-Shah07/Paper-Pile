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
import { Colors } from '@/constants/theme';
import { styles } from './family.styles';

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