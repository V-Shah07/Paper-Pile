import { storage } from "@/config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadDocumentImage = async (
  uri: string,
  userId: string,
  documentId: string
): Promise<string> => {
  try {
    console.log("📤 [Storage] Starting upload...");

    const response = await fetch(uri);
    const blob = await response.blob();

    const storagePath = `documents/${userId}/${documentId}/original.jpg`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, blob, {
      contentType: "image/jpeg",
    });

    console.log("✅ [Storage] Upload complete!");

    // DON'T modify the URL - use it exactly as Firebase returns it
    // Get permanent download URL
    const downloadUrl = await getDownloadURL(storageRef);

    console.log("✅ [Storage] Download URL:", downloadUrl);
    console.log("✅ [Storage] Storage Ref Path:", storageRef.fullPath);
    console.log("✅ [Storage] Storage Ref Bucket:", storageRef.bucket);

    // Test if URL is valid
    try {
      const testResponse = await fetch(downloadUrl, { method: "HEAD" });
      console.log("✅ [Storage] URL test response:", testResponse.status);
    } catch (testError) {
      console.error("❌ [Storage] URL test failed:", testError);
    }

    return downloadUrl;
  } catch (error) {
    console.error("❌ [Storage] Upload failed:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

export const generateDocumentId = (): string => {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Download image and convert to base64
 * This bypasses CORS/ATS issues by fetching through React Native's fetch
 */
export const getImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    console.log('📥 [Storage] Downloading image as base64...');
    
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log('✅ [Storage] Converted to base64, length:', base64.length);
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error('❌ [Storage] FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('❌ [Storage] Failed to convert to base64:', error);
    throw error;
  }
};

/**
 * Convert local image to base64 (bypass Firebase Storage for iOS)
 */
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    console.log('📸 [Storage] Converting local image to base64...');
    
    // Read the local file
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        console.log('✅ [Storage] Converted to base64, size:', Math.round(base64.length / 1024), 'KB');
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error('❌ [Storage] FileReader error:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('❌ [Storage] Base64 conversion failed:', error);
    throw error;
  }
};