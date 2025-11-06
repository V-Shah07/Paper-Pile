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
  orderBy,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Document, DocumentInput } from "../types/document";

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
    console.log("💾 [Firestore] Creating document...");
    console.log("💾 [Firestore] Data:", documentData);

    // prepare doc with additional fields
    const document: Partial<Document> = {
      ...documentData,
      dateAdded: new Date().toISOString(),
      processingStatus: "pending", //ai still gotta go
      extractedText: null, //filled later by backend
      summary: null, //filled later by backend

      // NEW: FAMILY-RELATED FIELDS
      familyId: userProfile?.familyId || null, // Set to user's family (or null if no family)
      uploadedBy: userProfile?.name || userProfile?.email || "Unknown", // User's name for display
      isSensitive: false, // Default to NOT sensitive (user can change later)
    };

    console.log("👥 [Firestore] Family info:", {
      familyId: document.familyId,
      uploadedBy: document.uploadedBy,
      isSensitive: document.isSensitive,
    });

    // STEP 2: add to documents collections
    const docRef = await addDoc(collection(db, "documents"), document);

    console.log("✅ [Firestore] Document created with ID:", docRef.id);

    return docRef.id;
  } catch (error) {
    console.error("❌ [Firestore] Create failed:", error);
    throw new Error("Failed to save document. Please try again.");
  }
};

/**
 * Get all documents for a specific user
 *
 * @param userId - Current user's ID
 * @returns Array of documents
 */
export const getUserDocuments = async (userId: string): Promise<Document[]> => {
  try {
    console.log("📖 [Firestore] Fetching documents for user:", userId);

    // query of all documents with this userId
    const q = query(
      collection(db, "documents"),
      where("userId", "==", userId),
      orderBy("dateAdded", "desc") // Newest first
    );

    // Execute query
    const querySnapshot = await getDocs(q);

    // STEP 3: Convert Firestore docs to our Document type
    const documents: Document[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id, // Firestore ID
        ...doc.data(), // All other fields
      } as Document);
    });

    console.log("✅ [Firestore] Found", documents.length, "documents");

    return documents;
  } catch (error) {
    console.error("❌ [Firestore] Fetch failed:", error);
    throw new Error("Failed to load documents. Please try again.");
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
    console.log("📝 [Firestore] Updating document:", documentId);

    const docRef = doc(db, "documents", documentId);
    await updateDoc(docRef, updates);

    console.log("✅ [Firestore] Update complete");
  } catch (error) {
    console.error("❌ [Firestore] Update failed:", error);
    throw new Error("Failed to update document.");
  }
};

/**
 * Delete a document
 *
 * @param documentId - Document to delete
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    console.log("🗑️ [Firestore] Deleting document:", documentId);

    await deleteDoc(doc(db, "documents", documentId));

    console.log("✅ [Firestore] Document deleted successfully");
  } catch (error) {
    console.error("❌ [Firestore] Delete failed:", error);
    throw error;
  }
};

/**
 * Get documents for user + their family (respecting sensitive flag)
 *
 * @param userId - Current user's ID
 * @param familyId - Current user's family ID (or null if no family)
 * @returns Array of documents (user's + family's non-sensitive docs)
 */
export const getUserAndFamilyDocuments = async (
  userId: string,
  familyId: string | null | undefined
): Promise<Document[]> => {
  try {
    console.log("📖 [Firestore] Fetching documents for user + family...");
    console.log("📖 [Firestore] UserId:", userId);
    console.log("📖 [Firestore] FamilyId:", familyId);

    const documents: Document[] = [];

    // Get user's own documents (always show, including sensitive)
    const userQuery = query(
      collection(db, "documents"),
      where("userId", "==", userId),
      orderBy("dateAdded", "desc")
    );

    const userSnapshot = await getDocs(userQuery);
    userSnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        ...doc.data(),
      } as Document);
    });

    console.log("✅ [Firestore] Found", userSnapshot.size, "user documents");

    // Get family documents (if user is in a family)
    if (familyId) {
      console.log(
        "👥 [Firestore] User is in a family, fetching family docs..."
      );

      // Get all documents in this family that:
      // 1. Are NOT uploaded by current user (already got those)
      // 2. Are NOT marked as sensitive
      const familyQuery = query(
        collection(db, "documents"),
        where("familyId", "==", familyId),
        where("userId", "!=", userId), // Exclude user's own docs (already added)
        orderBy("userId"), // Required for != query
        orderBy("dateAdded", "desc")
      );

      const familySnapshot = await getDocs(familyQuery);

      // Filter out sensitive documents
      familySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Document, "id">;

        // Only add if NOT sensitive
        if (!data.isSensitive) {
          documents.push({
            id: doc.id,
            ...data,
          } as Document);
        }
      });

      console.log(
        "✅ [Firestore] Found",
        familySnapshot.size,
        "family documents (filtered sensitive)"
      );
    } else {
      console.log("ℹ️  [Firestore] User not in a family, skipping family docs");
    }

    // sort all documents by date (newest first)
    documents.sort((a, b) => {
      const dateA = new Date(a.dateAdded).getTime();
      const dateB = new Date(b.dateAdded).getTime();
      return dateB - dateA; // Descending order
    });

    console.log("✅ [Firestore] Total documents:", documents.length);

    return documents;
  } catch (error) {
    console.error("❌ [Firestore] Fetch failed:", error);
    throw new Error("Failed to load documents. Please try again.");
  }
};

export const addUserDocumentsToFamily = async (
  userId: string,
  familyId: string
): Promise<void> => {
  try {
    const q = query(
      collection(db, "documents"),
      where("userId", "==", userId),
      where("familyId", "==", null)
    );

    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map((doc) =>
      updateDoc(doc.ref, { familyId })
    );

    await Promise.all(updatePromises);

    console.log("✅ Updated", snapshot.size, "documents with familyId");
  } catch (error) {
    console.error("❌ Error updating documents:", error);
    throw error;
  }
};

export const removeUserDocumentsFromFamily = async (
  userId: string,
  familyId: string
): Promise<void> => {
  try {
    const q = query(
      collection(db, 'documents'),
      where('userId', '==', userId),
      where('familyId', '==', familyId)
    );

    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map(doc =>
      updateDoc(doc.ref, { familyId: null })
    );

    await Promise.all(updatePromises);

    console.log('✅ Removed familyId from', snapshot.size, 'documents');
  } catch (error) {
    console.error('❌ Error removing documents from family:', error);
    throw error;
  }
};