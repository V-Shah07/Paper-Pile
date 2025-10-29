import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Document } from "../app/types/document";
import CategoryChip from "./CategoryChip";
import { styles } from "./DocumentCard.styles";

interface DocumentCardProps {
  document: Document;
  onPress: () => void;
}

export default function DocumentCard({ document, onPress }: DocumentCardProps) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Format date for display
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if document is expiring soon (within 30 days)
  const isExpiringSoon = (): boolean => {
    if (!document.expiryDate) return false;
    const now = new Date();
    const expiry = new Date(document.expiryDate);
    const daysUntilExpiry = Math.floor(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* Thumbnail Image */}
      {document.imageUrl ? (
        <Image
          source={{ uri: document.imageUrl }} // ← Already base64!
          style={styles.thumbnail}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.thumbnail,
            {
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.backgroundSecondary,
            },
          ]}
        >
          <Ionicons name="image-outline" size={32} color={Colors.textLight} />
        </View>
      )}

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
              <Text style={styles.moreTagsText}>
                +{document.tags.length - 2}
              </Text>
            )}
          </View>
        )}

        {/* Footer: Date and Metadata */}
        <View style={styles.footer}>
          {/* Date Added */}
          <Text style={styles.dateText}>{formatDate(document.dateAdded)}</Text>

          {/* Expiry Warning */}
          {isExpiringSoon() && (
            <View style={styles.expiryWarning}>
              <Ionicons name="warning" size={14} color={Colors.warning} />
              <Text style={styles.expiryText}>Expiring soon</Text>
            </View>
          )}

          {/* Uploaded By (for family sharing) */}
          {document.uploadedBy && (
            <Text style={styles.uploadedByText}>• {document.uploadedBy}</Text>
          )}
        </View>
      </View>

      {/* Chevron Icon */}
      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.textLight}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}
