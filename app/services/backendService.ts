/**
 * services/backendService.ts
 * 
 * Handles communication with FastAPI backend for AI processing
 */

const BACKEND_URL = 'http://192.168.68.138:8000';

/**
 * Response from backend /api/process-document endpoint
 */
export interface ProcessDocumentResponse {
  success: boolean;
  document_id: string;
  extracted_text: string | null;
  category: string;
  suggested_title: string;
  suggested_tags: string[];
  summary: string;
  metadata: Record<string, any>;
  error?: string;
  processing_time?: number;
}

/**
 * Send document image to backend for AI processing
 * 
 * @param documentId - Firestore document ID
 * @param imageBase64 - Base64 encoded image
 * @param userId - Current user ID
 * @returns AI suggestions for the document
 */
export const processDocumentWithAI = async (
  documentId: string,
  imageBase64: string,
  userId: string
): Promise<ProcessDocumentResponse> => {
  try {
    console.log('🤖 [Backend] Sending document for AI processing...');
    console.log('🤖 [Backend] Document ID:', documentId);
    console.log('🤖 [Backend] Image size:', imageBase64.length, 'characters');
    
    const response = await fetch(`${BACKEND_URL}/api/process-document`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_id: documentId,
        image_base64: imageBase64,
        user_id: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to process document');
    }

    const data: ProcessDocumentResponse = await response.json();
    
    console.log('✅ [Backend] Processing complete!');
    console.log('✅ [Backend] Category:', data.category);
    console.log('✅ [Backend] Suggested title:', data.suggested_title);
    console.log('✅ [Backend] Processing time:', data.processing_time, 'seconds');
    
    return data;
  } catch (error) {
    console.error('❌ [Backend] Processing failed:', error);
    throw error;
  }
};

/**
 * Health check - test if backend is reachable
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    console.error('❌ [Backend] Health check failed:', error);
    return false;
  }
};