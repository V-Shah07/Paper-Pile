/**
 * Search Screen
 * 
 * Dedicated search experience with recent searches, suggestions, and results.
 * This replaces the default explore.tsx or creates a new tab.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import SearchBar from '@/components/SearchBar';
import DocumentCard from '@/components/DocumentCard';
import CategoryChip from '@/components/CategoryChip';
import EmptyState from '@/components/EmptyState';

// Import constants
import { Colors } from '@/constants/theme';
import { DUMMY_DOCUMENTS, Document } from '@/constants/dummyData';
import { CATEGORIES, CategoryType } from '@/constants/categories';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './search.styles';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Dummy recent searches (in real app, this would come from storage/database)
  const recentSearches = [
    'refrigerator warranty',
    'medical records',
    'tax documents 2023',
  ];

  // Search suggestions based on categories and common queries
  const searchSuggestions = [
    { text: 'Medical records', category: 'medical' as CategoryType },
    { text: 'Warranties expiring soon', category: 'warranty' as CategoryType },
    { text: 'Tax documents', category: 'tax' as CategoryType },
    { text: 'Insurance policies', category: 'insurance' as CategoryType },
  ];

  // Search documents
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return DUMMY_DOCUMENTS.filter(doc =>
      doc.title.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.toLowerCase().includes(query)) ||
      doc.summary.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query) ||
      (doc.extractedText && doc.extractedText.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Handle search focus
  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  // Handle search blur (when user taps outside)
  const handleSearchBlur = () => {
    // Only blur if there's no search query
    if (!searchQuery.trim()) {
      setIsSearching(false);
    }
  };

  // Handle recent search tap
  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    setIsSearching(true);
  };

  // Handle suggestion tap
  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsSearching(true);
  };

  // Handle document press
  const handleDocumentPress = (document: Document) => {
    console.log('Document pressed:', document.title);
    // TODO: Navigate to document detail
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
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
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          autoFocus={false}
        />
      </View>

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
                <TouchableOpacity>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleRecentSearchPress(search)}
                >
                  <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
                  <Text style={styles.recentText}>{search}</Text>
                  <Ionicons name="arrow-forward" size={16} color={Colors.textLight} />
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
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
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
              {CATEGORIES.map(category => (
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
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
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
    </SafeAreaView>
  );
}