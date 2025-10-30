/**
 * Categories Constants
 * 
 * This file defines all document categories used in the app.
 * Each category has an ID, label, icon name, and color reference.
 */

export type CategoryType = 
  | 'medical'
  | 'warranty'
  | 'receipt'
  | 'tax'
  | 'insurance'
  | 'legal'
  | 'education'
  | 'other';

export interface Category {
  id: CategoryType;
  label: string;
  icon: string; // Icon name from Ionicons
  color: CategoryType; // References Colors.categories
}

/**
 * All available document categories
 * Add new categories here as needed
 */
export const CATEGORIES: Category[] = [
  {
    id: 'medical',
    label: 'Medical',
    icon: 'medical',
    color: 'medical',
  },
  {
    id: 'warranty',
    label: 'Warranty',
    icon: 'shield-checkmark',
    color: 'warranty',
  },
  {
    id: 'receipt',
    label: 'Receipt',
    icon: 'receipt',
    color: 'receipt',
  },
  {
    id: 'tax',
    label: 'Tax',
    icon: 'calculator',
    color: 'tax',
  },
  {
    id: 'insurance',
    label: 'Insurance',
    icon: 'umbrella',
    color: 'insurance',
  },
  {
    id: 'legal',
    label: 'Legal',
    icon: 'document-text',
    color: 'legal',
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'school',
    color: 'education',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'folder',
    color: 'other',
  },
];

/**
 * Helper function to get category by ID
 */
export const getCategoryById = (id: CategoryType): Category => {
  return CATEGORIES.find(cat => cat.id === id) || CATEGORIES[CATEGORIES.length - 1];
};

/**
 * Helper function to get category label
 */
export const getCategoryLabel = (id: CategoryType): string => {
  return getCategoryById(id).label;
};

/**
 * Sort options for document lists
 */
export const SORT_OPTIONS = [
  { id: 'add-date-desc', label: 'Newest Added First' },
  { id: 'add-date-asc', label: 'Oldest Added First' },
  { id: 'doc-date-desc', label: 'Newest Document First' },
  { id: 'doc-date-asc', label: 'Oldest Document First' },
  { id: 'title-asc', label: 'Title A-Z' },
  { id: 'title-desc', label: 'Title Z-A' },
  { id: 'category', label: 'By Category' },
] as const;

export type SortOptionId = typeof SORT_OPTIONS[number]['id'];