import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

export const uploadDocumentImage = async (
  uri: string,
  userId: string,
  documentId: string
): Promise<string> => {
  try {
    console.log('📤 [Storage] Starting upload...');
    
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storagePath = `documents/${userId}/${documentId}/original.jpg`;
    const storageRef = ref(storage, storagePath);
    
    await uploadBytes(storageRef, blob, {
      contentType: 'image/jpeg',
    });
    
    console.log('✅ [Storage] Upload complete!');
    
    // DON'T modify the URL - use it exactly as Firebase returns it
    const downloadUrl = await getDownloadURL(storageRef);
    
    console.log('✅ [Storage] Download URL:', downloadUrl);
    
    return downloadUrl;
  } catch (error) {
    console.error('❌ [Storage] Upload failed:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const generateDocumentId = (): string => {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};