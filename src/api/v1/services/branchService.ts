import { branches, Branch } from "../../../data/branches";

/**
 * Retrieves all branches from storage
 * @returns Array of all branches
 */
export const getAllBranches = async (): Promise<Branch[]> => {
    return structuredClone(branches);
};

/**
 * Retrieves a single branch by ID
 * @param id - The ID of the branch to retrieve
 * @returns The branch with the given ID
 * @throws Error if branch with given ID is not found
 */
export const getBranchById = async (id: number): Promise<Branch> => {
    const branch = branches.find((b: Branch) => b.id === id);

    if (!branch) {
        throw new Error(`Branch with ID ${id} not found`);
    }

    return structuredClone(branch);
};

/**
 * Creates a new branch
 * @param branchData - The data for the new branch (name, address, and phone)
 * @returns The created branch with generated ID
 */
export const createBranch = async (branchData: {
    name: string;
    address: string;
    phone: string;
}): Promise<Branch> => {
    // simple increment based on existing IDs
    const newId = Math.max(...branches.map(b => b.id)) + 1;

    // create a new branch with generated id
    const newBranch: Branch = {
        id: newId,
        name: branchData.name,
        address: branchData.address,
        phone: branchData.phone,
    };

    branches.push(newBranch);

    return structuredClone(newBranch);
};

/**
 * Updates (replaces) an existing branch
 * @param id - The ID of the branch to update
 * @param branchData - The fields to update (name, address, and/or phone)
 * @returns The updated branch
 * @throws Error if branch with given ID is not found
 */
export const updateBranch = async (
    id: number,
    branchData: Partial<Pick<Branch, "name" | "address" | "phone">>
): Promise<Branch> => {
    const index: number = branches.findIndex((branch: Branch) => branch.id === id);

    if (index === -1) {
        throw new Error(`Branch with ID ${id} not found`);
    }

    branches[index] = {
        ...branches[index],
        ...branchData,
    };

    return structuredClone(branches[index]);
};

/**
 * Deletes a branch from storage
 * @param id - The ID of the branch to delete
 * @throws Error if branch with given ID is not found
 */
export const deleteBranch = async (id: number): Promise<void> => {
    const index: number = branches.findIndex((branch: Branch) => branch.id === id);

    if (index === -1) {
        throw new Error(`Branch with ID ${id} not found`);
    }

    branches.splice(index, 1);
};

