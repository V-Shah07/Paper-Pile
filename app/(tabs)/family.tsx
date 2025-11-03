/**
 * Family Screen - UPDATED WITH REAL DATA & UI FIXES
 * 
 * Connected to Firebase and AuthContext.
 * UI improvements: Better button sizing, no scrolling needed, cleaner layout
 */

import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { styles } from './family.styles';

// ============================================
// IMPORTS
// ============================================
import { useAuth } from '@/context/AuthContext';
import {
  createFamily,
  joinFamily,
  leaveFamily,
  removeMember,
  getFamily,
} from '../services/familyService';
import { Family } from '../types/family';

// ============================================
// COMPONENT
// ============================================
export default function FamilyScreen() {
  // Get user info from AuthContext
  const { user, userProfile, refreshUserProfile } = useAuth();

  // State
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllDocuments, setShowAllDocuments] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // ============================================
  // LOAD FAMILY DATA ON MOUNT
  // ============================================
  useEffect(() => {
    loadFamilyData();
  }, [userProfile?.familyId]);

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      
      // Check if user has a family
      if (userProfile?.familyId) {
        console.log('🔵 Loading family data...');
        const familyData = await getFamily(userProfile.familyId);
        
        if (familyData) {
          setFamily(familyData);
          console.log('✅ Family loaded:', familyData.name);
        } else {
          console.log('⚠️  Family not found');
          setFamily(null);
        }
      } else {
        console.log('ℹ️  User not in a family');
        setFamily(null);
      }
    } catch (error) {
      console.error('❌ Error loading family:', error);
      Alert.alert('Error', 'Failed to load family data');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CREATE FAMILY (REAL API CALL)
  // ============================================
  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      Alert.alert('Error', 'Please enter a family name');
      return;
    }

    if (!user || !userProfile) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔵 Creating family:', familyName);
      
      // Call the real API
      const newFamily = await createFamily({
        name: familyName.trim(),
        userId: user.uid,
        userName: userProfile.name || user.email || 'Unknown',
        userEmail: user.email || '',
      });

      console.log('✅ Family created:', newFamily);

      // Refresh user profile to get updated familyId
      await refreshUserProfile();

      // Load the new family data
      await loadFamilyData();

      // Show success
      Alert.alert(
        'Family Created! 🎉',
        `"${familyName}" has been created.\n\nInvite Code: ${newFamily.inviteCode}\n\nShare this code with family members so they can join.`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowCreateModal(false);
              setFamilyName('');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Error creating family:', error);
      Alert.alert('Error', error.message || 'Failed to create family');
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================
  // JOIN FAMILY (REAL API CALL)
  // ============================================
  const handleJoinFamily = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter an invite code');
      return;
    }

    if (!user || !userProfile) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔵 Joining family with code:', joinCode);
      
      // Call the real API
      const joinedFamily = await joinFamily({
        inviteCode: joinCode.trim(),
        userId: user.uid,
        userName: userProfile.name || user.email || 'Unknown',
        userEmail: user.email || '',
      });

      console.log('✅ Joined family:', joinedFamily.name);

      // Refresh user profile to get updated familyId
      await refreshUserProfile();

      // Load the new family data
      await loadFamilyData();

      // Show success
      Alert.alert(
        'Joined Family! 🎉',
        `You are now part of "${joinedFamily.name}"`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowJoinModal(false);
              setJoinCode('');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Error joining family:', error);
      Alert.alert('Error', error.message || 'Failed to join family');
    } finally {
      setIsProcessing(false);
    }
  };

  // ============================================
  // INVITE MEMBER (SHARE CODE)
  // ============================================
  const handleInvite = async () => {
    if (!family) return;
    
    const inviteMessage = `Join our PaperPile family group!\n\nFamily: ${family.name}\nInvite Code: ${family.inviteCode}\n\nDownload PaperPile and use this code to join.`;

    try {
      if (Platform.OS === 'web') {
        Alert.alert(
          'Invite Code',
          `Share this code with family members:\n\n${family.inviteCode}`,
          [{ text: 'OK' }]
        );
      } else {
        await Share.share({
          message: inviteMessage,
        });
      }
      setShowInviteModal(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // ============================================
  // REMOVE MEMBER (REAL API CALL)
  // ============================================
  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!user || !family) return;

    Alert.alert(
      'Remove Member',
      `Are you sure you want to remove ${memberName} from the family?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔵 Removing member:', memberId);
              
              await removeMember(user.uid, family.id, memberId);
              
              console.log('✅ Member removed');
              
              // Reload family data
              await loadFamilyData();
              
              Alert.alert('Success', `${memberName} has been removed from the family`);
            } catch (error: any) {
              console.error('❌ Error removing member:', error);
              Alert.alert('Error', error.message || 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  // ============================================
  // LEAVE FAMILY (REAL API CALL)
  // ============================================
  const handleLeaveFamily = () => {
    if (!user || !family) return;

    Alert.alert(
      'Leave Family',
      'Are you sure you want to leave this family group? You will lose access to shared documents.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔵 Leaving family...');
              
              await leaveFamily(user.uid, family.id);
              
              console.log('✅ Left family');
              
              // Refresh user profile
              await refreshUserProfile();
              
              // Clear family data
              setFamily(null);
              
              Alert.alert('Left Family', 'You have left the family group');
            } catch (error: any) {
              console.error('❌ Error leaving family:', error);
              Alert.alert('Error', error.message || 'Failed to leave family');
            }
          },
        },
      ]
    );
  };

  // ============================================
  // RENDER AVATAR
  // ============================================
  const renderAvatar = (name: string) => {
    // Get initials from name
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  // ============================================
  // CHECK IF CURRENT USER IS ADMIN
  // ============================================
  const isCurrentUserAdmin = () => {
    if (!user || !family) return false;
    const currentMember = family.members.find(m => m.userId === user.uid);
    return currentMember?.role === 'admin';
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family</Text>
        </View>
        <View style={[styles.emptyContainer, { justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.emptySubtitle, { marginTop: 16 }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================
  // EMPTY STATE - No family yet
  // ============================================
  if (!family) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Family</Text>
        </View>

        {/* FIX: Changed ScrollView to View - no scrolling needed */}
        <View style={styles.emptyContainer}>
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
              <Text style={styles.benefitText}>Control what you share</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.benefitText}>Keep sensitive docs private</Text>
            </View>
          </View>

          {/* FIX: Action Buttons now wrapped in container for proper layout */}
          <View style={styles.emptyActions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add-circle" size={24} color={Colors.background} />
              <Text style={styles.primaryButtonText}>Create Family Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setShowJoinModal(true)}
            >
              <Ionicons name="enter" size={24} color={Colors.primary} />
              <Text style={styles.secondaryButtonText}>Join Existing Group</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Family Modal */}
        <Modal
          visible={showCreateModal}
          transparent
          animationType="fade"
          onRequestClose={() => !isProcessing && setShowCreateModal(false)}
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
                editable={!isProcessing}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setShowCreateModal(false);
                    setFamilyName('');
                  }}
                  disabled={isProcessing}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleCreateFamily}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={Colors.background} />
                  ) : (
                    <Text style={styles.modalButtonTextPrimary}>Create</Text>
                  )}
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
          onRequestClose={() => !isProcessing && setShowJoinModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Join Family Group</Text>
              
              <TextInput
                style={styles.input}
                value={joinCode}
                onChangeText={setJoinCode}
                placeholder="Enter 6-digit code (e.g., 123456)"
                placeholderTextColor={Colors.textLight}
                autoCapitalize="none"
                autoFocus
                editable={!isProcessing}
                maxLength={7} // 6 digits + optional hyphen
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
                  disabled={isProcessing}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleJoinFamily}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="small" color={Colors.background} />
                  ) : (
                    <Text style={styles.modalButtonTextPrimary}>Join</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ============================================
  // HAS FAMILY STATE - Show family management
  // ============================================
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
        {/* FIX: Family Info Card - Removed invite code section, kept only the header */}
        <View style={styles.familyCard}>
          <View style={styles.familyCardHeader}>
            <View style={styles.familyIconContainer}>
              <Ionicons name="people" size={32} color={Colors.primary} />
            </View>
            <View style={styles.familyInfo}>
              <Text style={styles.familyName}>{family.name}</Text>
              <Text style={styles.familyMeta}>
                {family.members.length} {family.members.length === 1 ? 'member' : 'members'}
              </Text>
            </View>
          </View>
          {/* REMOVED: Invite Code Section - redundant with add person button */}
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
          
          {family.members.map((member) => {
            const isCurrentUser = member.userId === user?.uid;
            const canRemove = isCurrentUserAdmin() && !isCurrentUser && member.role !== 'admin';

            return (
              <View key={member.userId} style={styles.memberCard}>
                {/* Avatar */}
                {renderAvatar(member.name)}

                {/* Member Info */}
                <View style={styles.memberInfo}>
                  <View style={styles.memberHeader}>
                    <Text style={styles.memberName}>
                      {member.name}{isCurrentUser && ' (You)'}
                    </Text>
                    {member.role === 'admin' && (
                      <View style={styles.adminBadge}>
                        <Text style={styles.adminBadgeText}>Admin</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <Text style={styles.memberMeta}>
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </Text>
                </View>

                {/* Actions (only show if current user is admin and it's not themselves) */}
                {canRemove && (
                  <TouchableOpacity
                    style={styles.memberAction}
                    onPress={() => handleRemoveMember(member.userId, member.name)}
                  >
                    <Ionicons name="close-circle" size={24} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
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
                <Text style={styles.inviteModalCodeText}>{family.inviteCode}</Text>
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
                <Text style={styles.modalButtonTextSecondary}>Close</Text>
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