/**
 * Home Screen (Documents List) - WITH UPLOAD MODAL INTEGRATED
 */

import { SORT_OPTIONS, SortOptionId } from "@/constants/categories"; // Add this line
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // You'll need to install this
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getUserAndFamilyDocuments, getUserDocuments } from "../services/documentService";
import { convertImageToBase64 } from "../services/storageService";
import { Document } from "../types/document";

import { createDocument } from "../services/documentService";
import { processDocumentWithAI } from "../services/backendService";

import { deleteDocument } from "../services/documentService";

import LoadingOverlay from "@/components/LoadingOverlay";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import components
import DocumentCard from "@/components/DocumentCard";
import EmptyState from "@/components/EmptyState";
import FloatingActionButton from "@/components/FloatingActionButton";
import SearchBar from "@/components/SearchBar";
import UploadModal from "@/components/uploadModal";
import { generateDocumentId } from "../services/storageService";

// Import constants
import { CATEGORIES, CategoryType } from "@/constants/categories";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./index.styles";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, userProfile, showAllDocuments, familyRefreshKey} = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | "all"
  >("all");
  const [showUploadModal, setShowUploadModal] = useState(false); // NEW STATE

  const [sortBy, setSortBy] = useState<SortOptionId>("add-date-desc"); // NEW
  const [showFilterModal, setShowFilterModal] = useState(false); // NEW
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [user, showAllDocuments, userProfile?.familyId, familyRefreshKey]); //reload if user changes

  // Function to load documents from Firestore
  const loadDocuments = async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    try {
      console.log("📖 [Home] Loading documents for user:", user.uid);
      setLoading(true);

      let docs;
      console.log("Show all documetns: ", showAllDocuments);
      if (!showAllDocuments) {
        docs = await getUserDocuments(user.uid);
      }
      else {
        docs = await getUserAndFamilyDocuments(user.uid, userProfile?.familyId);
      }
      console.log("✅ [Home] Loaded", docs.length, "documents");
      setDocuments(docs);
    } catch (error) {
      console.error("❌ [Home] Failed to load documents:", error);
      Alert.alert("Error", "Could not load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("🔄 [Home] Screen focused, reloading documents...");
      loadDocuments();
    }, [user, showAllDocuments, userProfile?.familyId, familyRefreshKey])
  );

  // pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  // Sort documents
  const sortDocuments = (docs: Document[]): Document[] => {
    const sorted = [...docs];

    switch (sortBy) {
      case "add-date-desc":
        return sorted.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      case "add-date-asc":
        return sorted.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      case "doc-date-desc":
        return sorted.sort((a, b) => {
          // Handle missing dates - put them at the end
          if (!a.dateDocument && !b.dateDocument) return 0;
          if (!a.dateDocument) return 1; // a goes to end
          if (!b.dateDocument) return -1; // b goes to end

          // Both have dates, compare them
          return (
            new Date(b.dateDocument).getTime() -
            new Date(a.dateDocument).getTime()
          );
        });
      case "doc-date-asc":
        return sorted.sort((a, b) => {
          // Handle missing dates - put them at the end
          if (!a.dateDocument && !b.dateDocument) return 0;
          if (!a.dateDocument) return 1; // a goes to end
          if (!b.dateDocument) return -1; // b goes to end

          // Both have dates, compare them
          return (
            new Date(a.dateDocument).getTime() -
            new Date(b.dateDocument).getTime()
          );
        });

      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "category":
        return sorted.sort((a, b) => a.category.localeCompare(b.category));
      default:
        return sorted;
    }
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

    filtered = filtered.filter((doc) => !doc.isDraft);

    if (selectedCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          (doc.summary && doc.summary.toLowerCase().includes(query))
      );
    }

    return sortDocuments(filtered);
  }, [documents, searchQuery, selectedCategory, sortBy]);

  // Navigate to search tab
  const handleSearchBarPress = () => {
    router.push("/(tabs)/search");
  };

  // Navigate to document detail
  const handleDocumentPress = (document: Document) => {
    router.push({
      pathname: "/screens/documentDetail",
      params: { documentId: document.id },
    });
  };

  // Show upload modal when FAB is pressed
  const handleAddDocument = () => {
    setShowUploadModal(true);
  };

  // Handle camera selection
  const handleSelectCamera = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Camera permission is required to scan documents"
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        aspect: [3, 4],
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Get base64
        let base64Image = asset.base64;
        if (!base64Image) {
          Alert.alert("Error", "Failed to process image");
          return;
        }

        // Ensure data URI format
        if (!base64Image.startsWith("data:image")) {
          base64Image = `data:image/jpeg;base64,${base64Image}`;
        }

        // Check auth
        if (!user?.uid) {
          Alert.alert("Error", "You must be logged in");
          return;
        }

        const userId = user.uid;

        // Create document
        const documentId = await createDocument({
          userId: userId,
          title: "",
          category: "other",
          tags: [],
          imageUrl: base64Image,
          isDraft: true,
        }, userProfile ?? undefined); 

        console.log("✅ Document created:", documentId);

        try {
          setIsProcessing(true);

          // Process with AI
          const aiResult = await processDocumentWithAI(
            documentId,
            base64Image,
            userId
          );

          setIsProcessing(false);

          console.log("✅ AI processing complete:", aiResult);

          // Check if failed
          if (!aiResult.success || aiResult.error) {
            Alert.alert(
              "AI Processing Failed",
              "Could not analyze document. Add details manually?",
              [
                {
                  text: "Add Manually",
                  onPress: () => {
                    router.push({
                      pathname: "/screens/editDetails",
                      params: { imageUri: asset.uri, documentId: documentId },
                    });
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: async () => {
                    await deleteDocument(documentId);
                  },
                },
              ]
            );
            return;
          }

          // Success! Navigate with AI suggestions
          router.push({
            pathname: "/screens/editDetails",
            params: {
              imageUri: asset.uri,
              documentId: documentId,
              suggestedTitle: aiResult.suggested_title,
              suggestedCategory: aiResult.category,
              suggestedTags: JSON.stringify(aiResult.suggested_tags),
            },
          });
        } catch (error) {
          setIsProcessing(false);
          console.error("❌ Error processing:", error);

          Alert.alert("Processing Error", "Add details manually or cancel?", [
            {
              text: "Add Manually",
              onPress: () => {
                router.push({
                  pathname: "/screens/editDetails",
                  params: { imageUri: asset.uri, documentId: documentId },
                });
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: async () => {
                await deleteDocument(documentId);
              },
            },
          ]);
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to take photo");
    }
  };

  // Handle file selection
  const handleSelectFiles = async () => {
    try {
      // Permission check
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission needed", "Photos permission is required");
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        aspect: [3, 4],
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Get base64
        let base64Image = asset.base64;
        if (!base64Image) {
          Alert.alert("Error", "Failed to process image");
          return;
        }

        if (!base64Image.startsWith("data:image")) {
          base64Image = `data:image/jpeg;base64,${base64Image}`;
        }

        // Check auth
        if (!user?.uid) {
          Alert.alert("Error", "You must be logged in");
          return;
        }

        const userId = user.uid;

        // ❌ NO ALERT HERE! Just create document silently

        // Create document
        const documentId = await createDocument(
          {
            userId: userId,
            title: "",
            category: "other",
            tags: [],
            imageUrl: base64Image,
            isDraft: true,
          },
          userProfile ?? undefined
        );

        // ❌ NO ALERT HERE! Just process silently

        try {
          setIsProcessing(true);

          // Process with AI
          const aiResult = await processDocumentWithAI(
            documentId,
            base64Image,
            userId
          );

          setIsProcessing(false);

          // Check if failed
          if (!aiResult.success || aiResult.error) {
            // ✅ ONLY ALERT ON ERROR
            Alert.alert(
              "AI Processing Failed",
              "Could not analyze document. Add details manually?",
              [
                {
                  text: "Add Manually",
                  onPress: () => {
                    router.push({
                      pathname: "/screens/editDetails",
                      params: { imageUri: asset.uri, documentId: documentId },
                    });
                  },
                },
                {
                  text: "Cancel",
                  style: "cancel",
                  onPress: async () => {
                    await deleteDocument(documentId);
                  },
                },
              ]
            );
            return;
          }

          // Success! Navigate silently
          router.push({
            pathname: "/screens/editDetails",
            params: {
              imageUri: asset.uri,
              documentId: documentId,
              suggestedTitle: aiResult.suggested_title,
              suggestedCategory: aiResult.category,
              suggestedTags: JSON.stringify(aiResult.suggested_tags),
            },
          });
        } catch (error) {
          // ✅ ONLY ALERT ON ERROR
          console.error("❌ Error processing:", error);
          setIsProcessing(false);

          Alert.alert("Processing Error", "Add details manually or cancel?", [
            {
              text: "Add Manually",
              onPress: () => {
                router.push({
                  pathname: "/screens/editDetails",
                  params: { imageUri: asset.uri, documentId: documentId },
                });
              },
            },
            {
              text: "Cancel",
              style: "cancel",
              onPress: async () => {
                await deleteDocument(documentId);
              },
            },
          ]);
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to select file");
    }
  };

  // Handle email forward
  const handleSelectEmail = () => {
    // For now, show the user's unique email address
    Alert.alert(
      "Forward Email",
      "Send documents to:\npaperpile.user123@paperpile.app\n\nComing soon!",
      [{ text: "OK" }]
    );
  };
  // Handle sort selection
  const handleSortSelect = (sortOption: SortOptionId) => {
    setSortBy(sortOption);
    setShowFilterModal(false);
  };

  // Render category chip
  const renderCategoryChip = (
    category: CategoryType | "all",
    label: string
  ) => {
    const isSelected = selectedCategory === category;

    return (
      <TouchableOpacity
        key={category}
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => setSelectedCategory(category)}
      >
        <Text
          style={[
            styles.filterChipText,
            isSelected && styles.filterChipTextSelected,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Ionicons name="filter" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={handleSearchBarPress} style={{ flex: 1 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search documents..."
          />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.filtersContent,
          { marginTop: Spacing.lg },
        ]}
      >
        {renderCategoryChip("all", "All")}
        {CATEGORIES.map((category) =>
          renderCategoryChip(category.id, category.label)
        )}
      </ScrollView>

      {/* Document Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredDocuments.length}{" "}
          {filteredDocuments.length === 1 ? "document" : "documents"}
        </Text>
      </View>

      {/* Documents List */}
      {loading ? (
        // Show loading spinner on first load
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      ) : filteredDocuments.length > 0 ? (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DocumentCard
              document={item}
              onPress={() => handleDocumentPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          // Add pull-to-refresh
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      ) : (
        <EmptyState
          icon={searchQuery ? "search-outline" : "document-text-outline"}
          title={searchQuery ? "No results found" : "No documents yet"}
          subtitle={
            searchQuery
              ? "Try a different search term or category"
              : "Tap the + button to scan your first document"
          }
        />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleAddDocument} />

      {/* Upload Modal - NEW */}
      <UploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onSelectCamera={handleSelectCamera}
        onSelectFiles={handleSelectFiles}
        onSelectEmail={handleSelectEmail}
      />

      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={modalStyles.backdrop}>
          <View style={modalStyles.content}>
            {/* Header */}
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Sort By</Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Sort Options */}
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  modalStyles.option,
                  sortBy === option.id && modalStyles.optionSelected,
                ]}
                onPress={() => handleSortSelect(option.id)}
              >
                <Text
                  style={[
                    modalStyles.optionText,
                    sortBy === option.id && modalStyles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.id && (
                  <Ionicons name="checkmark" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}

            {/* Cancel Button */}
            <TouchableOpacity
              style={modalStyles.cancelButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={modalStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <LoadingOverlay
        visible={isProcessing}
        message="🤖 PaperAI is analyzing your document..."
      />
    </SafeAreaView>
  );
}

const modalStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end" as const,
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius["2xl"],
    borderTopRightRadius: BorderRadius["2xl"],
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
    ...Shadows.lg,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold as any,
    color: Colors.text,
  },
  option: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  optionSelected: {
    backgroundColor: Colors.backgroundSecondary,
  },
  optionText: {
    fontSize: Typography.sizes.base,
    color: Colors.text,
  },
  optionTextSelected: {
    fontWeight: Typography.weights.semibold as any,
    color: Colors.primary,
  },
  cancelButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.lg,
    alignItems: "center" as const,
  },
  cancelText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold as any,
    color: Colors.text,
  },
};
