import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

/** 
 * @param uri - Local file path (e.g., "file:///photo.jpg")
 * @param userId - Current user's ID (to organize files by user)
 * @param documentId - Unique ID for this document
 * @returns Permanent URL to access the uploaded image
 */
export const uploadDocumentImage = async (
  uri: string,
  userId: string,
  documentId: string
): Promise<string> => {
  try {
    console.log('📤 [Storage] Starting upload...');
    console.log('📤 [Storage] Local URI:', uri);
    
    // convert local file to blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    console.log('📤 [Storage] File size:', blob.size, 'bytes');
    
    //Create a path in Firebase Storage
    // Format: documents/{userId}/{documentId}/original.jpg
    const storagePath = `documents/${userId}/${documentId}/original.jpg`;
    const storageRef = ref(storage, storagePath);
    
    console.log('📤 [Storage] Uploading to:', storagePath);
    
    // STEP 3: Upload the file to firebase
    await uploadBytes(storageRef, blob);
    
    console.log('✅ [Storage] Upload complete!');
    
    // permananet download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    console.log('✅ [Storage] Download URL:', downloadUrl);
    
    return downloadUrl;
  } catch (error) {
    console.error('❌ [Storage] Upload failed:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

/**
 * Generate a unique ID for documents
 * 
 * WHY: We need unique IDs before uploading
 * (Firestore can auto-generate, but we need it NOW for the file path)
 */
export const generateDocumentId = (): string => {
  // Create random ID using timestamp + random string
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};