/**
 * services/documentService.ts
 * 
 * WHY: This handles saving/reading document data from Firestore
 * Firestore = database for structured data (not files)
 * 
 * UPDATED: Now includes family-related fields for document sharing
 */

import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Document, DocumentInput } from '../types/document';

/**
 * actually create new document
 * 
 * @param documentData - Document info to save
 * @param userProfile - User's profile (for family info)
 * @returns The new document's ID
 */
export const createDocument = async (
  documentData: DocumentInput,
  userProfile?: { 
    familyId?: string | null; 
    name?: string;
    email?: string;
  }
): Promise<string> => {
  try {
    console.log('💾 [Firestore] Creating document...');
    console.log('💾 [Firestore] Data:', documentData);
    
    // prepare doc with additional fields
    const document: Partial<Document> = {
      ...documentData,
      dateAdded: new Date().toISOString(), 
      processingStatus: 'pending',    //ai still gotta go      
      extractedText: null,            //filled later by backend
      summary: null,                  //filled later by backend
      
      // ============================================
      // NEW: FAMILY-RELATED FIELDS
      // ============================================
      familyId: userProfile?.familyId || null,  // Set to user's family (or null if no family)
      uploadedBy: userProfile?.name || userProfile?.email || 'Unknown',  // User's name for display
      isSensitive: false,  // Default to NOT sensitive (user can change later)
    };
    
    console.log('👥 [Firestore] Family info:', {
      familyId: document.familyId,
      uploadedBy: document.uploadedBy,
      isSensitive: document.isSensitive
    });
    
    // STEP 2: add to documents collections
    const docRef = await addDoc(collection(db, 'documents'), document);
    
    console.log('✅ [Firestore] Document created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ [Firestore] Create failed:', error);
    throw new Error('Failed to save document. Please try again.');
  }
};

/**
 * Get all documents for a specific user
 * 
 * @param userId - Current user's ID
 * @returns Array of documents
 */
export const getUserDocuments = async (
  userId: string
): Promise<Document[]> => {
  try {
    console.log('📖 [Firestore] Fetching documents for user:', userId);
    
    // query of all documents with this userId
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      orderBy('dateAdded', 'desc') // Newest first
    );
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // STEP 3: Convert Firestore docs to our Document type
    const documents: Document[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,           // Firestore ID
        ...doc.data()         // All other fields
      } as Document);
    });
    
    console.log('✅ [Firestore] Found', documents.length, 'documents');
    
    return documents;
  } catch (error) {
    console.error('❌ [Firestore] Fetch failed:', error);
    throw new Error('Failed to load documents. Please try again.');
  }
};

/**
 * Update a document
 * 
 * @param documentId - Document to update
 * @param updates - Fields to update
 */
export const updateDocument = async (
  documentId: string,
  updates: Partial<Document>
): Promise<void> => {
  try {
    console.log('📝 [Firestore] Updating document:', documentId);
    
    const docRef = doc(db, 'documents', documentId);
    await updateDoc(docRef, updates);
    
    console.log('✅ [Firestore] Update complete');
  } catch (error) {
    console.error('❌ [Firestore] Update failed:', error);
    throw new Error('Failed to update document.');
  }
};

/**
 * Delete a document
 * 
 * @param documentId - Document to delete
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    console.log('🗑️ [Firestore] Deleting document:', documentId);
    
    await deleteDoc(doc(db, 'documents', documentId));
    
    console.log('✅ [Firestore] Document deleted successfully');
  } catch (error) {
    console.error('❌ [Firestore] Delete failed:', error);
    throw error;
  }
};