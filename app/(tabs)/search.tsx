/**
 * Search Screen
 *
 * Dedicated search experience with recent searches, suggestions, and results.
 */

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
import CategoryChip from "../../components/CategoryChip";
import DocumentCard from "../../components/DocumentCard";
import EmptyState from "../../components/EmptyState";
import SearchBar from "../../components/SearchBar";

// Import constants & services
import { CATEGORIES, CategoryType } from "../../constants/categories";
import { Colors } from "../../constants/theme";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserDocuments } from "../services/documentService";
import { Document } from "../types/document";
import { styles } from "./search.styles";

const RECENT_SEARCHES_KEY = "@recent_searches";
const MAX_RECENT_SEARCHES = 5;

export default function SearchScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load documents when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadDocuments();
      loadRecentSearches();
    }, [user])
  );

  // Load documents from Firestore
  const loadDocuments = async () => {
    if (!user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      console.log("🔍 [Search] Loading documents for user:", user.uid);
      setLoading(true);
      const docs = await getUserDocuments(user.uid);
      console.log("✅ [Search] Loaded", docs.length, "documents");
      setDocuments(docs);
    } catch (error) {
      console.error("❌ [Search] Failed to load documents:", error);
      Alert.alert("Error", "Could not load documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load recent searches from AsyncStorage
  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  };

  // Save a search to recent searches
  const saveRecentSearch = async (query: string) => {
    try {
      const trimmedQuery = query.trim().toLowerCase();
      if (!trimmedQuery) return;

      // Remove duplicates and add to front
      const updated = [
        trimmedQuery,
        ...recentSearches.filter((s) => s !== trimmedQuery),
      ].slice(0, MAX_RECENT_SEARCHES);

      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save recent search:", error);
    }
  };

  // Clear recent searches
  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  };

  // Search suggestions based on categories
  const searchSuggestions = [
    { text: "Medical records", category: "medical" as CategoryType },
    { text: "Warranties expiring soon", category: "warranty" as CategoryType },
    { text: "Tax documents", category: "tax" as CategoryType },
    { text: "Insurance policies", category: "insurance" as CategoryType },
  ];

  // Search documents
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();

    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (doc.summary && doc.summary.toLowerCase().includes(query)) ||
        doc.category.toLowerCase().includes(query)
    );
  }, [searchQuery, documents]);

  // Handle recent search tap
  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
  };

  // Handle suggestion tap
  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  // Handle document press
  const handleDocumentPress = (document: Document) => {
    console.log("📄 [Search] Document pressed:", document.title);

    // Save the search query when user actually finds something
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }

    router.push({
      pathname: "/screens/documentDetail",
      params: { documentId: document.id },
    });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Find documents..."
          autoFocus={false}
        />
      </View>

      {/* Loading State */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      ) : (
        <>
          {/* Content - changes based on search state */}
          {!searchQuery.trim() ? (
            /* Before searching - show recent searches and suggestions */
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={clearRecentSearches}>
                      <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.recentItem}
                      onPress={() => handleRecentSearchPress(search)}
                    >
                      <Ionicons
                        name="time-outline"
                        size={20}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.recentText}>{search}</Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={Colors.textLight}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Quick Search Suggestions */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Search</Text>
                <View style={styles.suggestionsGrid}>
                  {searchSuggestions.map((suggestion, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.suggestionCard}
                      onPress={() => handleSuggestionPress(suggestion.text)}
                    >
                      <CategoryChip
                        category={suggestion.category}
                        size="small"
                        showIcon={true}
                      />
                      <Text style={styles.suggestionText}>
                        {suggestion.text}
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={Colors.textLight}
                        style={styles.suggestionIcon}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Browse by Category */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Browse by Category</Text>
                <View style={styles.categoriesGrid}>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryCard}
                      onPress={() => handleSuggestionPress(category.label)}
                    >
                      <View style={styles.categoryIconContainer}>
                        <Ionicons
                          name={category.icon as any}
                          size={24}
                          color={Colors.categories[category.color]}
                        />
                      </View>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          ) : (
            /* Search Results */
            <View style={styles.resultsContainer}>
              {/* Results Header */}
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {searchResults.length}{" "}
                  {searchResults.length === 1 ? "result" : "results"}
                </Text>
              </View>

              {/* Results List */}
              {searchResults.length > 0 ? (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.id} 
                  renderItem={({ item }) => (
                    <DocumentCard
                      document={item}
                      onPress={() => handleDocumentPress(item)}
                    />
                  )}
                  contentContainerStyle={styles.resultsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <EmptyState
                  icon="search-outline"
                  title="No results found"
                  subtitle={`No documents match "${searchQuery}"`}
                />
              )}
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
