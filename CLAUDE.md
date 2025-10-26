# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PaperPile is a React Native mobile application built with Expo for managing and organizing personal documents (receipts, warranties, medical records, tax documents, insurance policies, etc.). The app uses Expo Router for file-based navigation and includes features like:
- Document scanning via camera or file picker
- Document categorization with 8 predefined categories
- Full-text search across titles, tags, summaries, and OCR text
- Expiry tracking for time-sensitive documents (warranties, insurance)
- Tag-based organization
- Family sharing indicators (uploaded by)
- Sensitive document marking

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npm start` or `npx expo start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator (requires Xcode)
- `npm run android` - Run on Android emulator (requires Android Studio)
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint to check code quality

### Platform-Specific Development
- For iOS: Requires macOS with Xcode installed
- For Android: Requires Android Studio with emulator configured
- For web: Works on any platform with modern browser

## Code Architecture

### Routing Structure
- Uses **Expo Router** with file-based routing
- `app/_layout.tsx` - Root layout with Stack navigator, theme provider, and StatusBar
- `app/(tabs)/` - Tab-based navigation group with two tabs:
  - `index.tsx` - Home screen with document list, search bar, category filters
  - `search.tsx` - Dedicated search screen with recent searches, suggestions, and full results
- `app/screens/` - Stack screens for detail views:
  - `documentDetail.tsx` - Full document view with image, metadata, actions
  - `editDetails.tsx` - Document editing/creation form (dual mode)
- `app/modal.tsx` - Currently commented out (template file)
- `app/(tabs)/explore.tsx` - Currently commented out (template file)

### Navigation Patterns
- Tab navigation defined in `app/(tabs)/_layout.tsx` with two tabs: "Home" and "Explore" (showing search)
- Navigate to document detail: `router.push({ pathname: '/screens/documentDetail', params: { documentId: doc.id } })`
- Navigate to edit (new document): `router.push({ pathname: '/screens/editDetails', params: { imageUri: uri } })`
- Navigate to edit (existing): `router.push({ pathname: '/screens/editDetails', params: { imageUri, documentId, isEditing: 'true' } })`
- Navigate to tabs: `router.push('/(tabs)')` - useful after saving/creating
- Navigate to search tab: `router.push('/(tabs)/search')`
- Use `router.back()` to return to previous screen
- Query params accessed via `useLocalSearchParams()` from `expo-router`
- Use `unstable_settings = { anchor: '(tabs)' }` in root layout for proper tab anchoring

### Data Layer (Currently Mock)
- All document data currently lives in `constants/dummyData.ts`
- `Document` interface defines the complete document schema
- Helper functions: `getRecentDocuments()`, `getExpiringDocuments()`, `getDocumentsByCategory()`
- **Future**: Replace with API calls to backend service

### Component Organization
- `components/` - Reusable UI components:
  - `DocumentCard.tsx` - Card displaying document with thumbnail, title, category, tags, date, expiry warning
  - `SearchBar.tsx` - Search input with icon and clear button
  - `CategoryChip.tsx` - Colored badge for categories with icon (3 sizes: small/medium/large)
  - `EmptyState.tsx` - Empty state placeholder with icon, title, subtitle
  - `FloatingActionButton.tsx` - FAB for adding documents
  - `uploadModal.tsx` - Bottom sheet modal with 3 upload options (camera/files/email)
- Components are designed to be stateless and receive data via props
- All components use the centralized theme from `constants/theme.ts`
- Component props documented in TypeScript interfaces at top of each file

### Theme System
- **Centralized design tokens** in `constants/theme.ts`
- `Colors` - All color values including category-specific colors
- `Typography` - Font sizes, weights, line heights
- `Spacing` - Consistent spacing scale based on 4px grid
- `BorderRadius` - Standard border radius values
- `Shadows` - Pre-defined shadow styles for elevation
- `Layout` - Common layout dimensions (heights, icon sizes, max widths)
- Helper: `getCategoryColor(category, light?)` for dynamic category colors

### Category System
- Categories defined in `constants/categories.ts`
- `CategoryType` - Union type of all available categories (medical, warranty, receipt, tax, insurance, legal, education, other)
- Each category has: id, label, icon (Ionicons name), color
- Helper functions: `getCategoryById()`, `getCategoryLabel()`

### TypeScript Configuration
- Path alias `@/*` maps to project root for clean imports
- Strict mode enabled
- Use `@/components/`, `@/constants/`, `@/hooks/` for imports

### State Management
- Currently using local component state with `useState`
- Filtering logic uses `useMemo` for performance (see `app/(tabs)/index.tsx`)
- **Future**: Consider React Context or state management library for global state

## Key Features Implementation

### Document Upload Flow
1. User taps FAB (Floating Action Button) on home screen
2. `UploadModal` (bottom sheet) appears with three options:
   - **Camera**: Request camera permission → Launch camera → Get image URI
   - **Files**: Request media library permission → Launch image picker → Get image URI
   - **Email**: Show alert with unique email address (coming soon)
3. On camera/files selection: Navigate to `screens/editDetails` with `{ imageUri: result.assets[0].uri }`
4. EditDetails screen:
   - Simulates OCR auto-fill after 800ms (sets title, category, tags automatically)
   - User can edit title, select category from grid, add/remove tags
   - User enters date, optional expiry date, optional notes
   - User taps "Save" → Shows loading spinner → Simulates API call (1.5s) → Success alert → Navigate to home
   - User taps "Cancel" → Confirmation alert → Discard or continue editing
5. Future: Replace dummy data with actual API calls and real OCR processing

### Document Editing Flow
1. From document detail screen, tap edit icon (pencil)
2. Navigate to `screens/editDetails` with `{ imageUri, documentId, isEditing: 'true' }`
3. EditDetails screen detects editing mode via `params.isEditing === 'true'`
4. Loads existing document data from `DUMMY_DOCUMENTS` using `documentId`
5. Pre-fills all form fields with existing data
6. User edits fields → Tap "Save" → Shows "Document updated successfully" → Navigate back
7. User taps "Cancel" → Different confirmation message for editing mode → Go back to detail

### Document Detail View
- Navigate with `router.push({ pathname: '/screens/documentDetail', params: { documentId } })`
- Header with back button, share icon, edit icon
- Document image with "Sensitive" badge (if marked)
- Category chip with colored background
- Title and metadata rows: date added, expiry date (if exists), uploaded by (if exists)
- Tags displayed as pills with # prefix
- AI Summary section with sparkles icon
- Key Details section showing metadata fields (vendor, amount, warranty, etc.)
- Extracted Text section (collapsible) with monospace font
- Fixed bottom action bar with two buttons:
  - Mark/Unmark Sensitive - toggles sensitive flag with confirmation
  - Delete - shows confirmation dialog, navigates back on confirm
- If document not found, shows error state

### Search & Filtering

#### Home Screen Search
- Home screen (`app/(tabs)/index.tsx`) has search bar (tap navigates to dedicated search tab)
- Local filtering by category chips (all, medical, warranty, receipt, tax, insurance, legal, education, other)
- Shows document count: "X documents"
- Filter logic in `useMemo` for automatic updates when search/category changes
- Empty state when no results: different messages for "no search results" vs "no documents"

#### Dedicated Search Screen
- Dedicated search screen (`app/(tabs)/search.tsx`) with two states:
  - **Before searching**: Shows recent searches, quick search suggestions, browse by category
  - **After searching**: Shows results count and filtered document list
- Search filters by: title, tags, summary, category name, extracted OCR text (all case-insensitive)
- Recent searches: Clickable list with time icon (dummy data for now, should use AsyncStorage)
- Quick search suggestions: Category-based search shortcuts with category chips
- Browse by category: Grid of all 8 categories with icons
- Clear button in search bar to reset
- Results displayed using same `DocumentCard` component as home screen

### Permissions
- Camera permission: `ImagePicker.requestCameraPermissionsAsync()` before launching camera
- Media library: `ImagePicker.requestMediaLibraryPermissionsAsync()` before launching picker
- Handle permission denials gracefully with `Alert.alert()` explaining why permission is needed
- Permission requests happen in `app/(tabs)/index.tsx` handlers: `handleSelectCamera()` and `handleSelectFiles()`

## UI/UX Patterns

### Modal Patterns
- `UploadModal` uses React Native `Modal` component with transparent backdrop
- Modal appears from bottom with fade animation (`animationType="fade"`)
- Rounded top corners using `BorderRadius['2xl']`
- Tap backdrop to dismiss
- Three options displayed as list items with icon, title, subtitle, chevron
- Platform-specific bottom padding for iOS safe area (34px) vs Android (24px)
- Cancel button at bottom

### Spacing & Layout
- Use `Spacing.screenPadding` (16px) for consistent screen edges
- Use `Spacing.cardPadding` for interior card spacing
- Follow the spacing scale: xs(4), sm(8), md(16), lg(24), xl(32), 2xl(40), 3xl(48)
- SafeAreaView from `react-native-safe-area-context` for all screens
- Common pattern: `SafeAreaView` → header → content → optional bottom actions

### Colors & Theming
- Primary brand color: `Colors.primary` (Indigo #6366F1)
- Text hierarchy: `Colors.text` (dark), `Colors.textSecondary` (medium gray), `Colors.textLight` (light gray)
- Category colors: Access via `Colors.categories[categoryType]` or `getCategoryColor(category, light?)`
- Use `Colors.backgroundSecondary` for subtle backgrounds

### Icons
- Use `Ionicons` from `@expo/vector-icons`
- Standard sizes in `Layout.iconSizes`
- Icons should use semantic names (e.g., 'document-text-outline', 'trash-outline')

### Empty States
- Use `EmptyState` component with appropriate icon, title, subtitle
- Provide actionable guidance (e.g., "Tap + to add first document")
- Different empty states for different contexts:
  - Home screen with no documents: "No documents yet" with document icon
  - Home screen with search, no results: "No results found" with search icon
  - Search screen, no results: "No documents match [query]" with search icon

### Document Cards
- DocumentCard shows: 80x80 thumbnail, title (2 lines max), category chip, up to 2 tags (+ count for more)
- Footer shows: date added, expiry warning (if expiring within 30 days), uploaded by (if exists)
- Lock icon next to title if `isSensitive: true`
- Chevron on right indicates card is tappable
- Cards use `...Shadows.sm` for subtle elevation
- Tap area includes entire card (`activeOpacity={0.7}`)

### Category Chips
- Three sizes: small (xs font, 12px icon), medium (sm font, 16px icon), large (base font, 20px icon)
- Light background color with dark text color (from category color palette)
- Pill shape with `BorderRadius.full`
- Optional icon display via `showIcon` prop (defaults to true)
- Used in: document cards, document detail, edit form, search suggestions, category browser

### Form Patterns (EditDetails)
- Header with "Cancel" (left), title (center), "Save" (right) buttons
- Cancel shows confirmation alert before discarding
- Save button shows loading spinner during API call
- Required fields marked with red asterisk: "Title *"
- Collapsible category picker with grid of all categories
- Tags displayed as removable chips with close button
- Tag input with add button (appears when text entered)
- Helper text below inputs to explain purpose
- TextArea for multi-line notes input
- Input styling: gray background, rounded corners, border
- Form validation: checks title is not empty before saving

## Code Style

### Component Structure
1. Imports (React, React Native, Expo, local components, constants)
2. Interface/type definitions (if needed)
3. Component function
4. Helper functions
5. StyleSheet definition at bottom

### Naming Conventions
- Components: PascalCase (e.g., `DocumentCard`)
- Functions/variables: camelCase (e.g., `handleDocumentPress`)
- Constants: UPPER_SNAKE_CASE (e.g., `DUMMY_DOCUMENTS`)
- Files: camelCase for utilities, PascalCase for components

### Import Organization
```typescript
// React/React Native
import React from 'react';
import { View, Text } from 'react-native';

// Expo packages
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Local components
import DocumentCard from '@/components/DocumentCard';

// Constants
import { Colors, Spacing } from '@/constants/theme';
```

## Platform Considerations

### iOS Specific
- Bundle identifier: `com.vshah0777.PaperPile`
- Supports tablets
- New architecture enabled (`newArchEnabled: true`)

### Android Specific
- Package: `com.vshah0777.PaperPile`
- Adaptive icon with background, foreground, and monochrome variants
- Edge-to-edge display enabled

### Cross-Platform
- Use `Platform.OS` checks when needed (e.g., font family for extracted text)
- Test on both iOS and Android for permission flows
- SafeAreaView from `react-native-safe-area-context` for proper insets

## Future Backend Integration

When connecting to a backend:
1. Replace `DUMMY_DOCUMENTS` with API calls in components
2. Implement document CRUD operations (create, read, update, delete)
3. Add authentication/authorization (currently no auth system)
4. Store images in cloud storage (S3, Firebase Storage, etc.)
5. Implement real OCR processing (Google Vision, AWS Textract, etc.) - currently simulated in `editDetails.tsx:67-71`
6. Add family sharing with user permissions - UI ready with `uploadedBy` field
7. Implement document expiry notifications - detection logic exists in `DocumentCard.tsx:38-44`
8. Store recent searches in AsyncStorage - currently using dummy data in `search.tsx:36-40`
9. Implement actual share functionality - currently shows "coming soon" alert
10. Connect email forwarding feature - currently shows placeholder email address

## Important Implementation Details

### Simulated OCR Auto-Fill
- In `editDetails.tsx`, when creating new document (not editing), simulated OCR runs after 800ms
- Sets dummy values: title="Samsung Refrigerator Receipt", category="receipt", tags=["appliance", "kitchen", "best buy"]
- Replace with actual OCR API call that processes the image URI

### Expiry Warning System
- Documents with `expiryDate` field are checked for expiry in next 30 days
- Logic in `DocumentCard.tsx:38-44` calculates days until expiry
- Shows yellow warning badge with "Expiring soon" text
- Currently no push notifications, only visual indicator

### Dual-Mode Edit Screen
- `editDetails.tsx` handles both NEW and EDIT modes in single component
- Detection: `const isEditing = params.isEditing === 'true'`
- NEW mode: Empty form + simulated OCR auto-fill + "Save" creates document
- EDIT mode: Pre-filled form from `DUMMY_DOCUMENTS` + "Save" updates document
- Different header titles: "Document Details" vs "Edit Document"
- Different confirmation messages and navigation on cancel

### Document Data Model
All documents follow this interface (from `constants/dummyData.ts:14-32`):
```typescript
interface Document {
  id: string;
  title: string;
  category: CategoryType;
  tags: string[];
  dateAdded: string; // ISO date string
  thumbnailUrl: string;
  summary: string; // AI-generated summary
  expiryDate?: string; // Optional ISO date
  isSensitive?: boolean;
  uploadedBy?: string; // For family sharing
  metadata?: { [key: string]: any }; // Dynamic fields
  extractedText?: string; // Full OCR text
}
```

## Testing Approach

- Currently no test suite configured
- When adding tests, consider Jest + React Native Testing Library
- Test critical user flows: upload, search/filter, document detail navigation
- Mock `expo-router` navigation for component tests