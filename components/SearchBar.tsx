/**
 * SearchBar Component
 * 
 * A search input with icon and optional clear button.
 * Used on Home screen and dedicated Search screen.
 */

import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { styles } from './SearchBar.styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search documents...',
  onFocus,
  onBlur,
  autoFocus = false,
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <Ionicons 
        name="search" 
        size={20} 
        color={Colors.textSecondary}
        style={styles.searchIcon}
      />

      {/* Text Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textLight}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
      />

      {/* Clear Button (only shown when there's text) */}
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Easier to tap
        >
          <Ionicons 
            name="close-circle" 
            size={20} 
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}