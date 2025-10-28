/**
 * Document Detail Screen - FIXED VERSION
 *
 * Now loads documents from Firestore instead of dummy data
 */

import { db, storage } from "@/config/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import components
import CategoryChip from "@/components/CategoryChip";

// Import constants
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Document } from "../types/document";

export default function DocumentDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  // State
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [imageHeight, setImageHeight] = useState(400);

  const documentId = params.documentId as string;

  // Load document from Firestore
  useEffect(() => {
    loadDocument();
  }, [documentId]);

  const loadDocument = async () => {
    if (!documentId) {
      Alert.alert("Error", "No document ID provided");
      router.back();
      return;
    }

    try {
      console.log("📖 [DocumentDetail] Loading document:", documentId);
      setLoading(true);

      const docRef = doc(db, "documents", documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = { id: docSnap.id, ...docSnap.data() } as Document;
        console.log("✅ [DocumentDetail] Document loaded:", docData);
        setDocument(docData);
      } else {
        console.error("❌ [DocumentDetail] Document not found");
        Alert.alert("Error", "Document not found", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error("❌ [DocumentDetail] Failed to load document:", error);
      Alert.alert("Error", "Failed to load document", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateInput: string | Date | null): string => {
    if (!dateInput) return "N/A";

    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle actions
  const handleEdit = () => {
    if (!document) return;

    console.log("Edit document:", document.id);
    router.push({
      pathname: "/screens/editDetails",
      params: {
        imageUri: document.imageUrl,
        documentId: document.id,
        isEditing: "true",
      },
    });
  };

  const handleShare = () => {
    if (!document) return;

    console.log("Share document:", document.id);
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleDelete = () => {
    if (!document) return;

    Alert.alert(
      "Delete Document",
      "Are you sure you want to delete this document? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log(
                "🗑️ [DocumentDetail] Deleting document:",
                document.id
              );

              // Delete from Firestore
              await deleteDoc(doc(db, "documents", document.id));
              console.log(
                "✅ [DocumentDetail] Document deleted from Firestore"
              );

              // Optionally delete image from Storage
              if (document.imageUrl && user) {
                try {
                  const imageRef = ref(
                    storage,
                    `documents/${user.uid}/${document.id}/original.jpg`
                  );
                  await deleteObject(imageRef);
                  console.log("✅ [DocumentDetail] Image deleted from Storage");
                } catch (storageError) {
                  console.warn(
                    "⚠️ [DocumentDetail] Failed to delete image from Storage:",
                    storageError
                  );
                  // Continue anyway - document is deleted from Firestore
                }
              }

              Alert.alert("Success", "Document deleted successfully", [
                { text: "OK", onPress: () => router.push("/(tabs)") },
              ]);
            } catch (error) {
              console.error("❌ [DocumentDetail] Delete failed:", error);
              Alert.alert(
                "Error",
                "Failed to delete document. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleToggleSensitive = () => {
    if (!document) return;

    console.log("Toggle sensitive:", document.id);
    Alert.alert(
      document.isSensitive ? "Remove Sensitive Mark" : "Mark as Sensitive",
      document.isSensitive
        ? "This document will be visible to all family members."
        : "This document will be hidden from other family members.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            // TODO: Update document sensitivity in Firestore
            console.log("Sensitivity toggled");
          },
        },
      ]
    );
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading document...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error if document not found
  if (!document) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons
            name="document-outline"
            size={64}
            color={Colors.textLight}
          />
          <Text style={styles.errorText}>Document not found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header with Back Button and Actions */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
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
            source={{ uri: document.imageUrl }}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="contain"
            onError={(error) => {
              console.error(
                "❌ [DocumentDetail] Image failed to load:",
                error.nativeEvent
              );
            }}
          />
          {document.isSensitive && (
            <View style={styles.sensitiveBadge}>
              <Ionicons
                name="lock-closed"
                size={16}
                color={Colors.background}
              />
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
            <Ionicons
              name="calendar-outline"
              size={16}
              color={Colors.textSecondary}
            />
            <Text style={styles.metaText}>
              Added {formatDate(document.dateAdded)}
            </Text>
          </View>

          {/* Document Date */}
          {document.dateDocument && (
            <View style={styles.metaRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}>
                Document Date: {formatDate(document.dateDocument)}
              </Text>
            </View>
          )}

          {/* Expiry Date (if exists) */}
          {document.expiryDate && (
            <View style={styles.metaRow}>
              <Ionicons
                name="time-outline"
                size={16}
                color={Colors.textSecondary}
              />
              <Text style={styles.metaText}>
                Expires {formatDate(document.expiryDate)}
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
        {document.summary && (
          <>
            <View style={styles.contentSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={20} color={Colors.primary} />
                <Text style={styles.sectionTitle}>Summary</Text>
              </View>
              <Text style={styles.summaryText}>{document.summary}</Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

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
              <Ionicons
                name="document-text-outline"
                size={20}
                color={Colors.text}
              />
              <Text style={styles.sectionTitle}>Extracted Text</Text>
              <Ionicons
                name={isTextExpanded ? "chevron-up" : "chevron-down"}
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
            name={
              document.isSensitive ? "lock-open-outline" : "lock-closed-outline"
            }
            size={20}
            color={Colors.text}
          />
          <Text style={styles.actionButtonSecondaryText}>
            {document.isSensitive ? "Unmark" : "Mark Sensitive"}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: Colors.backgroundSecondary,
    position: "relative",
  },
  image: {
    width: "100%",
  },
  sensitiveBadge: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: Typography.sizes["2xl"],
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeights.tight * Typography.sizes["2xl"],
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
    flexDirection: "row",
    alignItems: "center",
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
    marginLeft: "auto",
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
    flexDirection: "row",
    alignItems: "flex-start",
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
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  bottomPadding: {
    height: 100,
  },
  actionsContainer: {
    flexDirection: "row",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  errorText: {
    fontSize: Typography.sizes.lg,
    color: Colors.textSecondary,
  },
  errorButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  errorButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.background,
  },
});
