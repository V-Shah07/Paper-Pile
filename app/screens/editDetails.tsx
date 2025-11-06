/**
 * Edit Details Screen - WITH SENSITIVE TOGGLE
 *
 * Handles TWO modes:
 * 1. NEW document - from camera/file picker
 * 2. EDIT existing - from document detail screen
 *
 * ✅ NEW: Can mark document as sensitive while editing
 */

import CategoryChip from "@/components/CategoryChip";
import { db } from "@/config/firebase";
import { CATEGORIES, CategoryType } from "@/constants/categories";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import { Image } from "expo-image";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDocument, updateDocument } from "../services/documentService";
import { deleteDocument } from "../services/documentService";
import { DocumentInput } from "../types/document";

export default function EditDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, userProfile } = useAuth();

  const imageUri = params.imageUri as string;
  const documentId = params.documentId as string;
  const isEditing = params.isEditing === "true";
  const owner = params.owner as string | undefined;

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAISuggested, setIsAISuggested] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("receipt");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false); // ✅ NEW: Track sensitive state
  const didSaveRef = useRef(false);

  // Load existing document data if editing
  useEffect(() => {
    if (isEditing && documentId) {
      // EDITING EXISTING DOC - Load from Firestore
      loadDocument();
    } else {
      // NEW DOC - Load AI suggestions from route params
      const suggestedTitle = params.suggestedTitle as string;
      const suggestedCategory = params.suggestedCategory as string;
      const suggestedTagsStr = params.suggestedTags as string;

      if (suggestedTitle) {
        console.log("✨ Pre-filling with AI suggestions...");
        setTitle(suggestedTitle);
        setIsAISuggested(true);
        console.log("  Title:", suggestedTitle);
      }

      if (suggestedCategory) {
        setSelectedCategory(suggestedCategory as CategoryType);
        console.log("  Category:", suggestedCategory);
      }

      if (suggestedTagsStr) {
        try {
          const parsedTags = JSON.parse(suggestedTagsStr);
          setTags(parsedTags);
          console.log("  Tags:", parsedTags);
        } catch (e) {
          console.error("Failed to parse suggested tags:", e);
        }
      }
    }
  }, [isEditing, documentId]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset on mount
      didSaveRef.current = false;

      // Cleanup runs when screen loses focus
      return async () => {
        // Only clean up if:
        // 1. It's a NEW document (not editing)
        // 2. User didn't save
        // 3. We have a documentId
        if (!isEditing && !didSaveRef.current && documentId) {
          console.log(
            "🗑️ User left without saving - deleting draft:",
            documentId
          );
          try {
            await deleteDocument(documentId);
            console.log("✅ Draft deleted");
          } catch (error) {
            console.error("Failed to delete draft:", error);
          }
        }
      };
    }, [isEditing, documentId])
  );

  const loadDocument = async () => {
    if (!documentId) return;

    try {
      console.log("📖 [EditDetails] Loading document:", documentId);

      const docRef = doc(db, "documents", documentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        console.log("✅ [EditDetails] Document loaded:", docData);

        setTitle(docData.title || "");
        setSelectedCategory(docData.category || "receipt");
        setTags(docData.tags || []);
        setDate(
          docData.dateDocument
            ? new Date(docData.dateDocument).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0]
        );
        setExpiryDate(
          docData.expiryDate
            ? new Date(docData.expiryDate).toISOString().split("T")[0]
            : ""
        );
        setIsSensitive(docData.isSensitive || false); // ✅ NEW: Load sensitive state
      } else {
        console.error("❌ [EditDetails] Document not found");
        Alert.alert("Error", "Document not found");
        router.back();
      }
    } catch (error) {
      console.error("❌ [EditDetails] Failed to load document:", error);
      Alert.alert("Error", "Failed to load document");
    }
  };

  // Handle adding a tag
  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async () => {
    // Validate
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a document title");
      return;
    }
    didSaveRef.current = true;
    setIsProcessing(true);

    try {
      // Prepare the update data
      const documentData = {
        title: title.trim(),
        category: selectedCategory,
        tags: tags,
        dateDocument: date || null,
        expiryDate: expiryDate || null,
        isSensitive: isSensitive,
        isDraft: false,
        // Don't include imageUrl, extractedText, summary - they're already there!
      };

      if (documentId) {
        // UPDATE existing document (whether editing OR new with AI suggestions)
        await updateDocument(documentId, documentData);
      } else {
        // This should rarely happen now, but keep as fallback
        // If somehow no documentId, create new
        const newDocId = await createDocument(
          {
            userId: user?.uid || "default-user",
            imageUrl: imageUri,
            ...documentData,
          },
          userProfile ?? undefined
        );
      }

      setIsProcessing(false);

      Alert.alert(
        "Success!",
        documentId
          ? "Document updated successfully"
          : "Document saved successfully",
        [
          {
            text: "OK",
            onPress: () => {
              router.push("/(tabs)");
            },
          },
        ]
      );
    } catch (error) {
      didSaveRef.current = false;
      setIsProcessing(false);
      console.error("Error saving document:", error);
      Alert.alert("Error", "Failed to save document. Please try again.");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    Alert.alert(
      "Discard Changes?",
      isEditing
        ? "Are you sure you want to cancel? Your changes will not be saved."
        : "Are you sure you want to cancel? Your document will not be saved.",
      [
        { text: "Continue Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: async () => {
            didSaveRef.current = true;
            // If it's a new document (draft), DELETE it!
            if (!isEditing && documentId) {
              console.log("🗑️ Attempting to delete draft:", documentId);
              console.log("🗑️ isEditing:", isEditing);
              console.log("🗑️ documentId:", documentId);
              try {
                await deleteDocument(documentId);
                console.log("🗑️ Draft document deleted:", documentId);
              } catch (error) {
                console.error("Failed to delete draft:", error);
              }
            }

            // Navigate back
            if (isEditing) {
              router.back();
            } else {
              router.push("/(tabs)");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Document" : "Document Details"}
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.headerButton}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Thumbnail Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preview</Text>
          <Image
            source={{ uri: imageUri }}
            style={styles.thumbnail}
            contentFit="cover"
          />
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.sectionLabel}>
              Title <Text style={styles.required}>*</Text>
            </Text>
            {isAISuggested && (
              <View
                style={{
                  backgroundColor: Colors.primary,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  marginLeft: 8,
                }}
              >
                <Text style={{ color: "white", fontSize: 10 }}>
                  ✨ AI Suggested
                </Text>
              </View>
            )}
          </View>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter document title"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Category Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <CategoryChip category={selectedCategory} size="medium" />
            <Ionicons
              name={showCategoryPicker ? "chevron-up" : "chevron-down"}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Category Grid */}
          {showCategoryPicker && (
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryOption,
                    selectedCategory === category.id &&
                      styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={
                      selectedCategory === category.id
                        ? Colors.primary
                        : Colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selectedCategory === category.id &&
                        styles.categoryOptionTextSelected,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tags Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tags</Text>

          {/* Existing Tags */}
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(tag)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Add Tag Input */}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add a tag..."
              placeholderTextColor={Colors.textLight}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            {newTag.trim() && (
              <TouchableOpacity onPress={handleAddTag}>
                <Ionicons name="add-circle" size={24} color={Colors.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Date Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.helperText}>
            Date document was created or received
          </Text>
        </View>

        {/* Expiry Date Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Expiry Date (Optional)</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.textLight}
          />
          <Text style={styles.helperText}>
            For warranties, insurance, or time-sensitive documents
          </Text>
        </View>

        {/* ✅ NEW: Mark as Sensitive Toggle */}
        {owner === "true" && (
          <View style={styles.section}>
            <View style={styles.sensitiveRow}>
              <View style={styles.sensitiveInfo}>
                <View style={styles.sensitiveLabelRow}>
                  <Ionicons
                    name={isSensitive ? "lock-closed" : "lock-open-outline"}
                    size={20}
                    color={isSensitive ? Colors.error : Colors.textSecondary}
                  />
                  <Text style={styles.sectionLabel}>Mark as Sensitive</Text>
                </View>
                <Text style={styles.helperText}>
                  {isSensitive
                    ? "Hidden from other family members"
                    : "Visible to all family members"}
                </Text>
              </View>
              <Switch
                value={isSensitive}
                onValueChange={setIsSensitive}
                trackColor={{ false: Colors.border, true: Colors.error }}
                thumbColor={Colors.background}
                ios_backgroundColor={Colors.border}
              />
            </View>
          </View>
        )}

        {/* Notes Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerButton: {
    minWidth: 60,
    height: 40,
    justifyContent: "center",
  },
  cancelText: {
    fontSize: Typography.sizes.base,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
  },
  saveText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.primary,
    textAlign: "right",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  sectionLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.error,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
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
  },
  textArea: {
    height: 100,
    paddingTop: Spacing.md,
  },
  helperText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  categoryOption: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryOptionSelected: {
    backgroundColor: Colors.primaryLight + "20",
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text,
    fontWeight: Typography.weights.medium,
  },
  categoryOptionTextSelected: {
    color: Colors.primary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  tagText: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.weights.medium,
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === "ios" ? Spacing.sm : 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    color: Colors.text,
    paddingVertical: Spacing.sm,
  },
  // ✅ NEW: Sensitive toggle styles
  sensitiveRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sensitiveInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  sensitiveLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});
