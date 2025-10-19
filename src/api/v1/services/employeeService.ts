import { Employee } from "../../../data/employees";
import * as firestoreRepo from "../repositories/firestoreRepository";

const COLLECTION_NAME: string = "employees";

/**
 * Retrieves all employees from Firestore
 * @returns Array of all employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await firestoreRepo.getDocuments(COLLECTION_NAME);
        const employees: Employee[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot): Employee => ({
            id: parseInt(doc.id, 10),
            ...(doc.data() as Omit<Employee, "id">)
        }));
        return employees;
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve employees: ${errorMessage}`);
    }
};

/**
 * Retrieves a single employee by ID from Firestore
 * @param id - The ID of the employee to retrieve
 * @returns The employee with the given ID
 * @throws Error if employee with given ID is not found
 */
export const getEmployeeById = async (id: number): Promise<Employee> => {
    try {
        const doc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!doc || !doc.exists) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        return {
            id: parseInt(doc.id, 10),
            ...(doc.data() as Omit<Employee, "id">)
        };
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve employee ${id}: ${errorMessage}`);
    }
};

/**
 * Retrieves all employees for a specific branch from Firestore
 * @param branchId - The ID of the branch to get employees for
 * @returns Array of employees in the specified branch
 */
export const getEmployeesByBranch = async (branchId: number): Promise<Employee[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await firestoreRepo.getDocumentsByFieldValues(
            COLLECTION_NAME,
            [{ fieldName: "branchId", fieldValue: branchId }]
        );
        
        const branchEmployees: Employee[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot): Employee => ({
            id: parseInt(doc.id, 10),
            ...(doc.data() as Omit<Employee, "id">)
        }));
        
        return branchEmployees;
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve employees for branch ${branchId}: ${errorMessage}`);
    }
};

/** * Retrieves all employees in a specific department from Firestore
 * @param department - The department to get employees for
 * @returns Array of employees in the specified department
 */
export const getEmployeeByDepartment = async (department: string): Promise<Employee[]> => {
    try {
        const snapshot: FirebaseFirestore.QuerySnapshot = await firestoreRepo.getDocumentsByFieldValues(
            COLLECTION_NAME,
            [{ fieldName: "department", fieldValue: department }]
        );
        
        const departmentEmployees: Employee[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot): Employee => ({
            id: parseInt(doc.id, 10),
            ...(doc.data() as Omit<Employee, "id">)
        }));
        
        return departmentEmployees;
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to retrieve employees for department ${department}: ${errorMessage}`);
    }
};

/**
 * Creates a new employee in Firestore
 * @param employeeData - The data for the new employee
 * @returns The created employee with generated ID
 */
export const createEmployee = async (employeeData: {
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    branchId: number;
}): Promise<Employee> => {
    try {
        // Get all existing employees to calculate next ID
        const snapshot: FirebaseFirestore.QuerySnapshot = await firestoreRepo.getDocuments(COLLECTION_NAME);
        const existingIds: number[] = snapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot): number => 
            parseInt(doc.id, 10)
        );
        const newId: number = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

        // Create the employee data without the id
        const employeeToCreate: Omit<Employee, "id"> = {
            name: employeeData.name,
            position: employeeData.position,
            department: employeeData.department,
            email: employeeData.email,
            phone: employeeData.phone,
            branchId: employeeData.branchId,
        };

        // Create document with the calculated ID
        await firestoreRepo.createDocument<Omit<Employee, "id">>(
            COLLECTION_NAME,
            employeeToCreate,
            newId.toString()
        );

        return {
            id: newId,
            ...employeeToCreate
        };
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to create employee: ${errorMessage}`);
    }
};

/**
 * Updates an existing employee in Firestore
 * @param id - The ID of the employee to update
 * @param employeeData - The fields to update
 * @returns The updated employee
 * @throws Error if employee with given ID is not found
 */
export const updateEmployee = async (
    id: number,
    employeeData: Partial<Pick<Employee, "name" | "position" | "department" | "email" | "phone" | "branchId">>
): Promise<Employee> => {
    try {
        // Check if employee exists
        const existingDoc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!existingDoc || !existingDoc.exists) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        // Remove undefined fields to avoid Firestore update() errors
        const sanitizedData: Partial<Pick<Employee, "name" | "position" | "department" | "email" | "phone" | "branchId">> = Object.fromEntries(
            Object.entries(employeeData).filter(([, value]) => value !== undefined)
        ) as Partial<Pick<Employee, "name" | "position" | "department" | "email" | "phone" | "branchId">>;

        // Perform update only when we have at least one field to modify
        if (Object.keys(sanitizedData).length > 0) {
            await firestoreRepo.updateDocument<Partial<Pick<Employee, "name" | "position" | "department" | "email" | "phone" | "branchId">>>(
                COLLECTION_NAME,
                id.toString(),
                sanitizedData
            );
        }

        // Retrieve and return updated employee
        const updatedDoc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!updatedDoc || !updatedDoc.exists) {
            throw new Error(`Failed to retrieve updated employee ${id}`);
        }

        return {
            id: parseInt(updatedDoc.id, 10),
            ...(updatedDoc.data() as Omit<Employee, "id">)
        };
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to update employee ${id}: ${errorMessage}`);
    }
};

/**
 * Deletes an employee from Firestore
 * @param id - The ID of the employee to delete
 * @throws Error if employee with given ID is not found
 */
export const deleteEmployee = async (id: number): Promise<void> => {
    try {
        // Check if employee exists
        const existingDoc: FirebaseFirestore.DocumentSnapshot | null = await firestoreRepo.getDocumentById(
            COLLECTION_NAME,
            id.toString()
        );

        if (!existingDoc || !existingDoc.exists) {
            throw new Error(`Employee with ID ${id} not found`);
        }

        // Delete the document
        await firestoreRepo.deleteDocument(COLLECTION_NAME, id.toString());
    } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error";
        throw new Error(`Failed to delete employee ${id}: ${errorMessage}`);
    }
};