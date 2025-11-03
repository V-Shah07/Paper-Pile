/**
 * Family Service
 * 
 * Handles all Firestore operations related to families.
 * This is the "brain" for family management - creating, joining, leaving, etc.
 */

import { 
    collection, 
    doc, 
    getDoc, 
    getDocs,
    setDoc, 
    updateDoc, 
    deleteDoc,
    query, 
    where,
    arrayUnion,
    arrayRemove,
  } from 'firebase/firestore';
  import { db } from '@/config/firebase';
  import {
    Family,
    FamilyMember,
    CreateFamilyInput,
    JoinFamilyInput,
    InviteCodeValidation,
    generateInviteCode,
    cleanInviteCode,
  } from '../types/family';
  
  // ============================================
  // CREATE FAMILY
  // ============================================
  
  /**
   * Create a new family
   * 
   * @param input - Family name and creator info
   * @returns The newly created Family object
   */
  export const createFamily = async (input: CreateFamilyInput): Promise<Family> => {
    try {
      console.log('🔵 [FamilyService] Creating family:', input.name);
      
      // Generate unique invite code
      let inviteCode = generateInviteCode();
      let isUnique = false;
      
      // Try up to 10 times to get a unique code
      for (let i = 0; i < 10; i++) {
        const existingFamily = await getFamilyByInviteCode(inviteCode);
        if (!existingFamily) {
          isUnique = true;
          console.log('✅ Generated unique invite code:', inviteCode);
          break;
        }
        console.log('⚠️  Code collision, generating new code...');
        inviteCode = generateInviteCode();
      }
      
      if (!isUnique) {
        throw new Error('Failed to generate unique invite code. Please try again.');
      }
  
      // Create family object
      const familyId = doc(collection(db, 'families')).id; // Auto-generate ID
      const now = new Date().toISOString();
      
      const family: Family = {
        id: familyId,
        name: input.name,
        createdBy: input.userId,
        members: [
          {
            userId: input.userId,
            name: input.userName,
            email: input.userEmail,
            role: 'admin', // Creator is always admin
            joinedAt: now,
          },
        ],
        inviteCode,
        createdAt: now,
        updatedAt: now,
      };
  
      // Save to Firestore
      console.log('🔵 Saving family to Firestore...');
      await setDoc(doc(db, 'families', familyId), family);
      console.log('✅ Family created in Firestore!');
  
      // Step 4: Update user's profile with familyId
      console.log('🔵 Updating user profile with familyId...');
      await updateUserFamily(input.userId, familyId, 'admin');
      console.log('✅ User profile updated!');
  
      console.log('🎉 Family creation complete!');
      return family;
    } catch (error) {
      console.error('❌ Error creating family:', error);
      throw error;
    }
  };
  
  // ============================================
  // JOIN FAMILY
  // ============================================
  
  /**
   * Join an existing family using invite code
   * 
   * @param input - Invite code and user info
   * @returns The updated Family object
   */
  export const joinFamily = async (input: JoinFamilyInput): Promise<Family> => {
    try {
      console.log('🔵 [FamilyService] Joining family with code:', input.inviteCode);
      
      //Validate invite code
      const validation = await validateInviteCode(input.inviteCode);
      
      if (!validation.isValid || !validation.family) {
        throw new Error(validation.error || 'Invalid invite code');
      }
      
      const family = validation.family;
      console.log('✅ Found family:', family.name);
      
      // Check if user is already a member
      const isMember = family.members.some(m => m.userId === input.userId);
      if (isMember) {
        throw new Error('You are already a member of this family');
      }
      
      // Create new member object
      const newMember: FamilyMember = {
        userId: input.userId,
        name: input.userName,
        email: input.userEmail,
        role: 'member', // New members are always regular members (not admin)
        joinedAt: new Date().toISOString(),
      };
      
      // Add member to family
      console.log('🔵 Adding member to family...');
      const familyRef = doc(db, 'families', family.id);
      await updateDoc(familyRef, {
        members: arrayUnion(newMember), // arrayUnion prevents duplicates
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Member added to family!');
      
      // Update user's profile with familyId
      console.log('🔵 Updating user profile...');
      await updateUserFamily(input.userId, family.id, 'member');
      console.log('✅ User profile updated!');
      
      // Get and return updated family
      const updatedFamily = await getFamily(family.id);
      if (!updatedFamily) {
        throw new Error('Failed to get updated family');
      }
      
      console.log('🎉 Successfully joined family!');
      return updatedFamily;
    } catch (error) {
      console.error('❌ Error joining family:', error);
      throw error;
    }
  };
  
  // ============================================
  // LEAVE FAMILY
  // ============================================
  
  /**
   * Leave your current family
   * 
   * @param userId - Current user's ID
   * @param familyId - Family to leave
   */
  export const leaveFamily = async (userId: string, familyId: string): Promise<void> => {
    try {
      console.log('🔵 [FamilyService] Leaving family...');
      
      const family = await getFamily(familyId);
      
      if (!family) {
        throw new Error('Family not found');
      }
      
      // Find the member to remove
      const member = family.members.find(m => m.userId === userId);
      
      if (!member) {
        throw new Error('You are not a member of this family');
      }
      
      // Check if user is the only admin
      const admins = family.members.filter(m => m.role === 'admin');
      if (member.role === 'admin' && admins.length === 1) {
        throw new Error('You cannot leave as you are the only admin. Please delete the family or assign another admin first.');
      }
      
      // Remove member from family
      console.log('🔵 Removing member from family...');
      const familyRef = doc(db, 'families', familyId);
      await updateDoc(familyRef, {
        members: arrayRemove(member), // Must pass the exact object
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Member removed!');
      
      // Clear user's family info
      console.log('🔵 Clearing user profile...');
      await updateUserFamily(userId, null, undefined);
      console.log('✅ User profile cleared!');
      
      console.log('🎉 Successfully left family!');
    } catch (error) {
      console.error('❌ Error leaving family:', error);
      throw error;
    }
  };
  
  // ============================================
  // REMOVE MEMBER (ADMIN ONLY)
  // ============================================
  
  /**
   * Remove a member from the family (admin only)
   * 
   * @param adminUserId - Admin performing the action
   * @param familyId - Family ID
   * @param memberUserId - Member to remove
   */
  export const removeMember = async (
    adminUserId: string, 
    familyId: string, 
    memberUserId: string
  ): Promise<void> => {
    try {
      console.log('🔵 [FamilyService] Removing member...');
      
      const family = await getFamily(familyId);
      
      if (!family) {
        throw new Error('Family not found');
      }
      
      // Check if requester is admin
      const admin = family.members.find(m => m.userId === adminUserId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Only admins can remove members');
      }
      
      // Find the member to remove
      const member = family.members.find(m => m.userId === memberUserId);
      
      if (!member) {
        throw new Error('Member not found in family');
      }
      
      // Cannot remove yourself (use leaveFamily instead)
      if (memberUserId === adminUserId) {
        throw new Error('Cannot remove yourself. Use leave family instead.');
      }
      
      // Remove member from family
      console.log('🔵 Removing member from family...');
      const familyRef = doc(db, 'families', familyId);
      await updateDoc(familyRef, {
        members: arrayRemove(member),
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Member removed!');
      
      // Clear removed member's family info
      console.log('🔵 Clearing removed member profile...');
      await updateUserFamily(memberUserId, null, undefined);
      console.log('✅ Member profile cleared!');
      
      console.log('🎉 Successfully removed member!');
    } catch (error) {
      console.error('❌ Error removing member:', error);
      throw error;
    }
  };
  
  // ============================================
  // DELETE FAMILY (ADMIN ONLY)
  // ============================================
  
  /**
   * Delete entire family (admin only)
   * 
   * @param userId - Admin performing the action
   * @param familyId - Family to delete
   */
  export const deleteFamily = async (userId: string, familyId: string): Promise<void> => {
    try {
      console.log('🔵 [FamilyService] Deleting family...');
      
      const family = await getFamily(familyId);
      
      if (!family) {
        throw new Error('Family not found');
      }
      
      // Check if requester is admin
      const admin = family.members.find(m => m.userId === userId);
      if (!admin || admin.role !== 'admin') {
        throw new Error('Only admins can delete families');
      }
      
      // Clear familyId from all members' profiles
      console.log('🔵 Clearing all member profiles...');
      for (const member of family.members) {
        await updateUserFamily(member.userId, null, undefined);
      }
      console.log('✅ All member profiles cleared!');
      
      // Delete the family document
      console.log('🔵 Deleting family document...');
      await deleteDoc(doc(db, 'families', familyId));
      console.log('✅ Family document deleted!');
      
      console.log('🎉 Family deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting family:', error);
      throw error;
    }
  };
  
  // ============================================
  // GET FAMILY BY ID
  // ============================================
  
  /**
   * Get family by ID
   * 
   * @param familyId - Family document ID
   * @returns Family object or null if not found
   */
  export const getFamily = async (familyId: string): Promise<Family | null> => {
    try {
      const familyDoc = await getDoc(doc(db, 'families', familyId));
      
      if (!familyDoc.exists()) {
        return null;
      }
      
      return familyDoc.data() as Family;
    } catch (error) {
      console.error('❌ Error getting family:', error);
      return null;
    }
  };
  
  // ============================================
  // GET FAMILY BY INVITE CODE
  // ============================================
  
  /**
   * Find family using invite code
   * Used when validating codes and joining families
   * 
   * @param inviteCode - 6-digit code (with or without hyphens)
   * @returns Family object or null if not found
   */
  export const getFamilyByInviteCode = async (inviteCode: string): Promise<Family | null> => {
    try {
      const cleaned = cleanInviteCode(inviteCode); // Remove hyphens/spaces
      
      // Query Firestore: WHERE inviteCode == cleaned
      const q = query(
        collection(db, 'families'), 
        where('inviteCode', '==', cleaned)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      // Return first match (should only be one due to uniqueness)
      return querySnapshot.docs[0].data() as Family;
    } catch (error) {
      console.error('❌ Error getting family by invite code:', error);
      return null;
    }
  };
  
  // ============================================
  // VALIDATE INVITE CODE
  // ============================================
  
  /**
   * Check if invite code is valid
   * 
   * @param inviteCode - Code to validate
   * @returns Validation result with family data if valid
   */
  export const validateInviteCode = async (inviteCode: string): Promise<InviteCodeValidation> => {
    try {
      const family = await getFamilyByInviteCode(inviteCode);
      
      if (!family) {
        return {
          isValid: false,
          error: 'Invalid invite code. Please check and try again.',
        };
      }
      
      return {
        isValid: true,
        family,
      };
    } catch (error) {
      console.error('❌ Error validating invite code:', error);
      return {
        isValid: false,
        error: 'An error occurred while validating the code.',
      };
    }
  };
  
  // ============================================
  // GET USER'S FAMILY
  // ============================================
  
  /**
   * Get the family that a user belongs to
   * 
   * 
   * @param userId - User's Firebase Auth UID
   * @returns Family object or null if user not in a family
   */
  export const getUserFamily = async (userId: string): Promise<Family | null> => {
    try {
      // Get user profile
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        console.log('⚠️  User profile not found');
        return null;
      }
      
      const userData = userDoc.data();
      
      if (!userData.familyId) {
        console.log('ℹ️  User not in a family');
        return null;
      }
      
      // Get family
      return await getFamily(userData.familyId);
      
    } catch (error) {
      console.error('❌ Error getting user family:', error);
      return null;
    }
  };
  
  // ============================================
  // HELPER: UPDATE USER'S FAMILY INFO
  // ============================================
  
  /**
   * Update user's familyId and familyRole in their Firestore profile
   * This is an internal helper function used by other functions
   * 
   * @param userId - User to update
   * @param familyId - Family ID (or null to clear)
   * @param familyRole - User's role (or undefined to clear)
   */
  const updateUserFamily = async (
    userId: string, 
    familyId: string | null,
    familyRole?: 'admin' | 'member'
  ): Promise<void> => {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Check if user document exists
      const userDoc = await getDoc(userRef);
      
      const updateData: any = {
        familyId: familyId,
        updatedAt: new Date().toISOString(),
      };
      
      // Set familyRole (or null if undefined)
      if (familyRole !== undefined) {
        updateData.familyRole = familyRole;
      } else {
        updateData.familyRole = null;
      }
      
      if (userDoc.exists()) {
        // Update existing document
        await updateDoc(userRef, updateData);
      } else {
        // Create new document (shouldn't happen, but just in case)
        await setDoc(userRef, {
          userId,
          ...updateData,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('❌ Error updating user family:', error);
      throw error;
    }
  };