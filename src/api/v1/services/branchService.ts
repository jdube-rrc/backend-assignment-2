import { Branch } from "../../../data/branches";
import * as firestoreRepo from "../repositories/firestoreRepository";

const COLLECTION_NAME: string = "branches";

/**
 * Retrieves all branches from Firestore
 * @returns Array of all branches
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await firestoreRepo.getDocuments(COLLECTION_NAME);
        const branches: Branch[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot): Branch => ({
            id: parseInt(doc.id, 10),
            ...(doc.data() as Omit<Branch, "id">)
        }));
        return branches;
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve branches: ${errorMessage}`);
    }
};

/**
 * Retrieves a single branch by ID from Firestore
 * @param id - The ID of the branch to retrieve
 * @returns The branch with the given ID
 * @throws Error if branch with given ID is not found
 */
export const getBranchById = async (id: number): Promise<Branch> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!doc || !doc.exists) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        return {
            id: parseInt(doc.id, 10),
            ...(doc.data() as Omit<Branch, "id">)
        };
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve branch ${id}: ${errorMessage}`);
    }
};

/**
 * Creates a new branch in Firestore
 * @param branchData - The data for the new branch (name, address, and phone)
 * @returns The created branch with generated ID
 */
export const createBranch = async (branchData: {
    name: string;
    address: string;
    phone: string;
}): Promise<Branch> => {
    try {
        // Get all existing branches to calculate next ID
        const snapshot: FirebaseFirestore.QuerySnapshot = await firestoreRepo.getDocuments(COLLECTION_NAME);
        const existingIds: number[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot): number => 
            parseInt(doc.id, 10)
        );
        const newId: number = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        // Create the branch data without the id
        const branchToCreate: Omit<Branch, "id"> = {
            name: branchData.name,
            address: branchData.address,
            phone: branchData.phone,
        };

        // Create document with the calculated ID
        await firestoreRepo.createDocument<Omit<Branch, "id">>(
            COLLECTION_NAME,
            branchToCreate,
            newId.toString()
        );

        return {
            id: newId,
            ...branchToCreate
        };
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create branch: ${errorMessage}`);
    }
};

/**
 * Updates an existing branch in Firestore
 * @param id - The ID of the branch to update
 * @param branchData - The fields to update (name, address, and/or phone)
 * @returns The updated branch
 * @throws Error if branch with given ID is not found
 */
export const updateBranch = async (
    id: number,
    branchData: Partial<Pick<Branch, "name" | "address" | "phone">>
): Promise<Branch> => {
    try {
        // Check if branch exists
        const existingDoc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!existingDoc || !existingDoc.exists) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        // Remove undefined fields to avoid Firestore update() errors
        const sanitizedData: Partial<Pick<Branch, "name" | "address" | "phone">> = Object.fromEntries(
            Object.entries(branchData).filter(([, value]) => value !== undefined)
        ) as Partial<Pick<Branch, "name" | "address" | "phone">>;

        // If no fields provided (empty body), return current document unchanged
        if (Object.keys(sanitizedData).length > 0) {
            // Update the document
            await firestoreRepo.updateDocument<Partial<Pick<Branch, "name" | "address" | "phone">>>(
                COLLECTION_NAME,
                id.toString(),
                sanitizedData
            );
        }

        // Retrieve and return updated branch
        const updatedDoc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!updatedDoc || !updatedDoc.exists) {
            throw new Error(`Failed to retrieve updated branch ${id}`);
        }

        return {
            id: parseInt(updatedDoc.id, 10),
            ...(updatedDoc.data() as Omit<Branch, "id">)
        };
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update branch ${id}: ${errorMessage}`);
    }
};

/**
 * Deletes a branch from Firestore
 * @param id - The ID of the branch to delete
 * @throws Error if branch with given ID is not found
 */
export const deleteBranch = async (id: number): Promise<void> => {
    try {
        // Check if branch exists
        const existingDoc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!existingDoc || !existingDoc.exists) {
            throw new Error(`Branch with ID ${id} not found`);
        }

        // Delete the document
        await firestoreRepo.deleteDocument(COLLECTION_NAME, id.toString());
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete branch ${id}: ${errorMessage}`);
    }
};

