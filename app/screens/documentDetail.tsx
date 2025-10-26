/**
 * Document Detail Screen
 * 
 * Full-screen view of a document with all details, metadata, and actions.
 * Shows document image, AI summary, extracted text, and action buttons.
 * 
 * USAGE:
 * - Place this in your app/(tabs) or app/screens folder
 * - Navigate to it with: router.push({ pathname: '/document-detail', params: { documentId: doc.id } })
 * - For now using dummy data, replace with API call later
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import components
import CategoryChip from '@/components/CategoryChip';

// Import constants
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { DUMMY_DOCUMENTS, Document } from '@/constants/dummyData';

export default function DocumentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // State
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [imageHeight, setImageHeight] = useState(400);

  // Get document by ID from params
  // In real app, you'd fetch this from API
  const documentId = params.documentId as string;
  const document = DUMMY_DOCUMENTS.find(doc => doc.id === documentId);

  // If document not found, show error
  if (!document) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format date helper
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle actions
  const handleEdit = () => {
    console.log('Edit document:', document.id);
    //EDIT: router.push({ pathname: '/screens/editDetails', params: { imageUri, documentId, isEditing: 'true' } })
    router.push({
      pathname: '/screens/editDetails',
      params: {imageUri: document.thumbnailUrl, documentId: document.id, isEditing: 'true'}
    });
  };

  const handleShare = () => {
    console.log('Share document:', document.id);
    // TODO: Implement share
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete document:', document.id);
            // TODO: Call delete API
            router.back();
          },
        },
      ]
    );
  };

  const handleToggleSensitive = () => {
    console.log('Toggle sensitive:', document.id);
    // TODO: Update document sensitivity
    Alert.alert(
      document.isSensitive ? 'Remove Sensitive Mark' : 'Mark as Sensitive',
      document.isSensitive
        ? 'This document will be visible to all family members.'
        : 'This document will be hidden from other family members.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => console.log('Sensitivity toggled'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Back Button and Actions */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={handleShare}
            style={styles.headerButton}
          >
            <Ionicons name="share-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleEdit}
            style={styles.headerButton}
          >
            <Ionicons name="create-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: document.thumbnailUrl }}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="contain"
          />
          {document.isSensitive && (
            <View style={styles.sensitiveBadge}>
              <Ionicons name="lock-closed" size={16} color={Colors.background} />
              <Text style={styles.sensitiveBadgeText}>Sensitive</Text>
            </View>
          )}
        </View>

        {/* Document Info Section */}
        <View style={styles.contentSection}>
          {/* Category */}
          <View style={styles.categoryContainer}>
            <CategoryChip category={document.category} size="medium" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{document.title}</Text>

          {/* Date Added */}
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              Added {formatDate(document.dateAdded)}
            </Text>
          </View>

          {/* Expiry Date (if exists) */}
          {document.expiryDate && (
            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                Expires {formatDate(document.expiryDate)}
              </Text>
            </View>
          )}

          {/* Uploaded By (if exists) */}
          {document.uploadedBy && (
            <View style={styles.metaRow}>
              <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                Uploaded by {document.uploadedBy}
              </Text>
            </View>
          )}

          {/* Tags */}
          {document.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {document.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* AI Summary Section */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Summary</Text>
          </View>
          <Text style={styles.summaryText}>{document.summary}</Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Key Details Section (if metadata exists) */}
        {document.metadata && Object.keys(document.metadata).length > 0 && (
          <>
            <View style={styles.contentSection}>
              <Text style={styles.sectionTitle}>Key Details</Text>
              <View style={styles.detailsContainer}>
                {Object.entries(document.metadata).map(([key, value]) => (
                  <View key={key} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:
                    </Text>
                    <Text style={styles.detailValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Extracted Text Section (Expandable) */}
        {document.extractedText && (
          <View style={styles.contentSection}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => setIsTextExpanded(!isTextExpanded)}
            >
              <Ionicons name="document-text-outline" size={20} color={Colors.text} />
              <Text style={styles.sectionTitle}>Extracted Text</Text>
              <Ionicons
                name={isTextExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textSecondary}
                style={styles.expandIcon}
              />
            </TouchableOpacity>

            {isTextExpanded && (
              <View style={styles.extractedTextContainer}>
                <Text style={styles.extractedText}>
                  {document.extractedText}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bottom padding for action buttons */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={handleToggleSensitive}
        >
          <Ionicons
            name={document.isSensitive ? 'lock-open-outline' : 'lock-closed-outline'}
            size={20}
            color={Colors.text}
          />
          <Text style={styles.actionButtonSecondaryText}>
            {document.isSensitive ? 'Unmark' : 'Mark Sensitive'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonDanger]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
          <Text style={styles.actionButtonDangerText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: Colors.backgroundSecondary,
    position: 'relative',
  },
  image: {
    width: '100%',
  },
  sensitiveBadge: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  sensitiveBadgeText: {
    color: Colors.background,
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  contentSection: {
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
  },
  categoryContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeights.tight * Typography.sizes['2xl'],
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    flex: 1,
  },
  expandIcon: {
    marginLeft: 'auto',
  },
  summaryText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
  detailsContainer: {
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    width: 120,
  },
  detailValue: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  extractedTextContainer: {
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  extractedText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.sm,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bottomPadding: {
    height: 100, // Space for fixed action buttons
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
    ...Shadows.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonSecondaryText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  actionButtonDanger: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonDangerText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.error,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textSecondary,
  },
});