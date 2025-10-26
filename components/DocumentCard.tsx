/**
 * DocumentCard Component
 * 
 * A card that displays a document with thumbnail, title, category, and metadata.
 * Used in document lists throughout the app.
 */

import { Document } from '@/constants/dummyData';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CategoryChip from './CategoryChip';

interface DocumentCardProps {
  document: Document;
  onPress: () => void; // Function to call when card is tapped
}

export default function DocumentCard({ document, onPress }: DocumentCardProps) {
  // Format date for display
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (): boolean => {
    if (!document.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(document.expiryDate);
    const daysUntilExpiry = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7} // Slight fade when pressed
    >
      {/* Thumbnail Image */}
      <Image 
        source={{ uri: document.thumbnailUrl }}
        style={styles.thumbnail}
        resizeMode="cover"
      />

      {/* Content Section */}
      <View style={styles.content}>
        {/* Header: Title and Sensitive Icon */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {document.title}
          </Text>
          {document.isSensitive && (
            <Ionicons 
              name="lock-closed" 
              size={16} 
              color={Colors.textSecondary}
              style={styles.sensitiveIcon}
            />
          )}
        </View>

        {/* Category Chip */}
        <View style={styles.categoryContainer}>
          <CategoryChip category={document.category} size="small" />
        </View>

        {/* Tags (first 2 only) */}
        {document.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {document.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {document.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{document.tags.length - 2}</Text>
            )}
          </View>
        )}

        {/* Footer: Date and Metadata */}
        <View style={styles.footer}>
          {/* Date Added */}
          <Text style={styles.dateText}>
            {formatDate(document.dateAdded)}
          </Text>

          {/* Expiry Warning */}
          {isExpiringSoon() && (
            <View style={styles.expiryWarning}>
              <Ionicons 
                name="warning" 
                size={14} 
                color={Colors.warning}
              />
              <Text style={styles.expiryText}>Expiring soon</Text>
            </View>
          )}

          {/* Uploaded By (for family sharing) */}
          {document.uploadedBy && (
            <Text style={styles.uploadedByText}>• {document.uploadedBy}</Text>
          )}
        </View>
      </View>

      {/* Chevron Icon (indicates card is tappable) */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={Colors.textLight}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary, // Placeholder while loading
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    lineHeight: Typography.lineHeights.tight * Typography.sizes.base,
  },
  sensitiveIcon: {
    marginLeft: 4,
  },
  categoryContainer: {
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tag: {
    marginRight: 6,
  },
  tagText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  moreTagsText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  expiryWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  expiryText: {
    fontSize: Typography.sizes.xs,
    color: Colors.warning,
    marginLeft: 4,
    fontWeight: Typography.weights.medium,
  },
  uploadedByText: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  chevron: {
    alignSelf: 'center',
    marginLeft: 4,
  },
});