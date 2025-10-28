/**
 * Home Screen (Documents List) - WITH UPLOAD MODAL INTEGRATED
 */

import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // You'll need to install this
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getUserDocuments } from "../services/documentService";
import { Document } from "../types/document";

import {
  ActivityIndicator,
  Alert,
  FlatList,
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
import {
  generateDocumentId,
  uploadDocumentImage,
} from "../services/storageService";

// Import constants
import { CATEGORIES, CategoryType } from "@/constants/categories";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./index.styles";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    CategoryType | "all"
  >("all");
  const [showUploadModal, setShowUploadModal] = useState(false); // NEW STATE

  useEffect(() => {
    loadDocuments();
  }, [user]); //reload if user changes

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

      const docs = await getUserDocuments(user.uid);
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
      console.log('🔄 [Home] Screen focused, reloading documents...');
      loadDocuments();
    }, [user])
  );

  // pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDocuments();
    setRefreshing(false);
  };

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

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

    return filtered;
  }, [documents, searchQuery, selectedCategory]);

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
    if (!user) {
      Alert.alert("Error", "You must be logged in to upload documents");
      return;
    }

    //Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera permission is required to scan documents"
      );
      return;
    }

    // launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    if (result.canceled) {
      return; // User cancelled, do nothing
    }

    // upload to storage
    setShowUploadModal(false); // Close the modal

    try {
      // Show loading indicator (we'll add this to UI)
      console.log("📤 Starting upload...");

      // get unique document id
      const documentId = generateDocumentId();

      // Upload image to Firebase Storage
      const imageUrl = await uploadDocumentImage(
        result.assets[0].uri, // Local file path
        user.uid, // Current user's ID
        documentId // Unique document ID
      );

      console.log("✅ Upload complete! URL:", imageUrl);

      // Navigate to edit details with the Firebase URL
      router.push({
        pathname: "/screens/editDetails",
        params: {
          imageUri: imageUrl, // Permanent Firebase URL
          documentId: documentId, // Pass the ID so editDetails can save
        },
      });
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed", "Could not upload image. Please try again.");
    }
  };

  // Handle file selection
  const handleSelectFiles = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to upload documents");
      return;
    }

    // STEP 1: Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Photos permission is required to select documents"
      );
      return;
    }

    // STEP 2: Launch image picker (photo gallery/files)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    // STEP 3: Check if user selected a photo (didn't cancel)
    if (result.canceled) {
      return; // User cancelled, do nothing
    }

    // STEP 4: Upload to Firebase Storage
    setShowUploadModal(false); // Close the modal first

    try {
      // Show loading indicator
      console.log("📤 Starting upload...");

      // Generate unique ID for this document
      const documentId = generateDocumentId();

      // Upload image to Firebase Storage
      const imageUrl = await uploadDocumentImage(
        result.assets[0].uri, // Local file: "file:///path/to/image.jpg"
        user.uid, // Current user's ID
        documentId // Unique document ID
      );

      console.log("✅ Upload complete! URL:", imageUrl);

      // STEP 5: Navigate to edit details with the Firebase URL
      router.push({
        pathname: "/screens/editDetails",
        params: {
          imageUri: imageUrl, // Permanent Firebase URL
          documentId: documentId, // Pass the ID so editDetails can save
        },
      });
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed", "Could not upload image. Please try again.");
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
        <TouchableOpacity>
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
    </SafeAreaView>
  );
}
