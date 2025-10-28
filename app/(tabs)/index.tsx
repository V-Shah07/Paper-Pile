/**
 * Home Screen (Documents List) - WITH UPLOAD MODAL INTEGRATED
 */

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import * as ImagePicker from 'expo-image-picker'; // You'll need to install this

// Import components
import DocumentCard from "@/components/DocumentCard";
import EmptyState from "@/components/EmptyState";
import FloatingActionButton from "@/components/FloatingActionButton";
import SearchBar from "@/components/SearchBar";
import UploadModal from "@/components/uploadModal"; // NEW IMPORT

// Import constants
import { CATEGORIES, CategoryType } from "@/constants/categories";
import { DUMMY_DOCUMENTS, Document } from "@/constants/dummyData";
import { Colors, Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./index.styles";

export default function HomeScreen() {
  const router = useRouter();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "all">("all");
  const [showUploadModal, setShowUploadModal] = useState(false); // NEW STATE

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = DUMMY_DOCUMENTS;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((doc) => doc.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          doc.summary.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Navigate to search tab
  const handleSearchBarPress = () => {
    router.push("/(tabs)/search");
  };

  // Navigate to document detail
  const handleDocumentPress = (document: Document) => {
    router.push({
      pathname: '/screens/documentDetail', 
      params: { documentId: document.id }
    });
  };

  // Show upload modal when FAB is pressed
  const handleAddDocument = () => {
    setShowUploadModal(true);
  };

  // Handle camera selection
  const handleSelectCamera = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to scan documents');
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      // Navigate to edit details screen with image URI
      router.push({
        pathname: '/screens/editDetails',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  // Handle file selection
  const handleSelectFiles = async () => {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Photos permission is required to select documents');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [3, 4],
    });

    if (!result.canceled && result.assets[0]) {
      // Navigate to edit details screen with image URI
      router.push({
        pathname: '/screens/editDetails',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  // Handle email forward
  const handleSelectEmail = () => {
    // For now, show the user's unique email address
    Alert.alert(
      'Forward Email',
      'Send documents to:\npaperpile.user123@paperpile.app\n\nComing soon!',
      [{ text: 'OK' }]
    );
  };

  // Render category chip
  const renderCategoryChip = (category: CategoryType | "all", label: string) => {
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
        contentContainerStyle={[styles.filtersContent, { marginTop: Spacing.lg }]}
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
      {filteredDocuments.length > 0 ? (
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