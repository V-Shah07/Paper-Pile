import { CategoryType } from '@/constants/categories';

// This is what a complete document looks like in Firestore
export interface Document {
  // IDs 
  id: string;                    // auto0-generated id from firestore
  userId: string;                // which user uploaded it
  familyId?: string | null;      // family group 
  
  // Basic info
  title: string;                 
  category: CategoryType;        
  tags: string[];                
  
  // Dates
  dateAdded: string;             // date that user uploaded
  dateDocument?: string | null;  // date of the document
  expiryDate?: string | null;    // date when the document expires
  
  // Images
  imageUrl: string;              // image from firebase storage
  thumbnailUrl?: string | null;  
  
  // AI stuff (backend fills this in later TODO)
  extractedText?: string | null; // OCR text
  summary?: string | null;       // AI summary
  
  // Privacy & metadata
  isSensitive?: boolean;
  uploadedBy?: string;           // Name of who uploaded
  metadata?: Record<string, any>; // extra Info
  
  // Processing status (so we know if AI is done)
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
}

// send when CREATING a new document before AI processing
export interface DocumentInput {
  userId: string;
  title: string;
  category: CategoryType;
  tags: string[];
  imageUrl: string;
  dateDocument?: string | null;
  expiryDate?: string | null;
  isSensitive?: boolean;
}