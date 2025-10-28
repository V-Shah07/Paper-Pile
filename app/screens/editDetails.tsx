/**
 * Edit Details Screen - UPDATED VERSION
 *
 * Handles TWO modes:
 * 1. NEW document - from camera/file picker
 * 2. EDIT existing - from document detail screen
 */

import CategoryChip from "@/components/CategoryChip";
import { CATEGORIES, CategoryType } from "@/constants/categories";
import { BorderRadius, Colors, Spacing, Typography } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDocument, updateDocument } from "../services/documentService";
import { DocumentInput } from "../types/document";

export default function EditDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const imageUri = params.imageUri as string;
  const documentId = params.documentId as string;
  const isEditing = params.isEditing === "true"; // Check if editing existing doc

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>("receipt");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Load existing document data if editing
  useEffect(() => {
    if (isEditing && documentId) {
      loadDocument();
    } else {
      // For NEW documents, simulate OCR auto-fill after a brief delay
      setTimeout(() => {
        setTitle("Samsung Refrigerator Receipt");
        setSelectedCategory("receipt");
        setTags(["appliance", "kitchen", "best buy"]);
      }, 800);
    }
  }, [isEditing, documentId]);

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
        // setNotes(docData.notes || '');  // If you add notes field
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
    console.log("💾 [EditDetails] Starting save...");

    // VALIDATION
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a document title");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You must be logged in to save documents");
      return;
    }

    setIsProcessing(true);

    try {
      // prepare doc
      const documentData: DocumentInput = {
        userId: user.uid,
        title: title.trim(),
        category: selectedCategory,
        tags: tags,
        imageUrl: imageUri, // Already uploaded to Firebase Storage
        dateDocument: date || null,
        expiryDate: expiryDate || null,
        isSensitive: false,
      };

      console.log("💾 [EditDetails] Document data:", documentData);

      // save/update firestore doc
      if (isEditing) {
        // update existing doc
        console.log("💾 [EditDetails] Updating existing document:", documentId);
        await updateDocument(documentId, documentData);
      } else {
        // create new doc
        console.log("💾 [EditDetails] Creating new document...");
        const newDocId = await createDocument(documentData);
        console.log("✅ [EditDetails] Document created with ID:", newDocId);
      }

      // sucess
      Alert.alert(
        "Success!",
        isEditing
          ? "Document updated successfully"
          : "Document saved successfully",
        [
          {
            text: "OK",
            onPress: () => {
              console.log("💾 [EditDetails] Navigating back to home...");
              router.push("/(tabs)"); // Go back to home (will trigger reload!)
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("❌ [EditDetails] Save failed:", error);
      Alert.alert("Error", "Failed to save document. Please try again.");
    } finally {
      setIsProcessing(false);
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
          onPress: () => {
            if (isEditing) {
              router.back(); // Go back to document detail
            } else {
              router.push("/(tabs)"); // Go to home
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
            resizeMode="cover"
          />
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Title <Text style={styles.required}>*</Text>
          </Text>
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
  bottomPadding: {
    height: Spacing.xl,
  },
});
