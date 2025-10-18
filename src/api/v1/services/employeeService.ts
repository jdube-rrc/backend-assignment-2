import { employees, Employee } from "../../../data/employees";

/**
 * Retrieves all employees from storage
 * @returns Array of all employees
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
    return structuredClone(employees);
};

/**
 * Retrieves a single employee by ID
 * @param id - The ID of the employee to retrieve
 * @returns The employee with the given ID
 * @throws Error if employee with given ID is not found
 */
export const getEmployeeById = async (id: number): Promise<Employee> => {
    const employee = employees.find((e: Employee) => e.id === id);

    if (!employee) {
        throw new Error(`Employee with ID ${id} not found`);
    }

    return structuredClone(employee);
};

/**
 * Retrieves all employees for a specific branch
 * @param branchId - The ID of the branch to get employees for
 * @returns Array of employees in the specified branch
 */
export const getEmployeesByBranch = async (branchId: number): Promise<Employee[]> => {
    const branchEmployees = employees.filter((e: Employee) => e.branchId === branchId);
    return structuredClone(branchEmployees);
};

/** * Retrieves all employees in a specific department
 * @param department - The department to get employees for
 * @returns Array of employees in the specified department
 */
export const getEmployeeByDepartment = async (department: string): Promise<Employee[]> => {
    const departmentEmployees = employees.filter((e: Employee) => 
        e.department && e.department.toLowerCase() === department.toLowerCase()
);
    return structuredClone(departmentEmployees);
};

/**
 * Creates a new employee
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

    const newId = Math.max(...employees.map(e => e.id)) + 1; // just here to ensure a unique ID is generated
    const newEmployee: Employee = {
        id: newId,
        name: employeeData.name,
        position: employeeData.position,
        department: employeeData.department,
        email: employeeData.email,
        phone: employeeData.phone,
        branchId: employeeData.branchId,
    };

    employees.push(newEmployee);

    return structuredClone(newEmployee);
};

/**
 * Updates (replaces) an existing employee
 * @param id - The ID of the employee to update
 * @param employeeData - The fields to update
 * @returns The updated employee
 * @throws Error if employee with given ID is not found
 */
export const updateEmployee = async (
    id: number,
    employeeData: Partial<Pick<Employee, "name" | "position" | "department" | "email" | "phone" | "branchId">> // was having a weird error with Pick<Employee, ...> alone
): Promise<Employee> => {
    const index: number = employees.findIndex((employee: Employee) => employee.id === id);

    if (index === -1) {
        throw new Error(`Employee with ID ${id} not found`);
    }

    // ensure partial updates still work
    employees[index] = {
        ...employees[index],
        ...employeeData,
    };

    return structuredClone(employees[index]);
};

/**
 * Deletes an employee from storage
 * @param id - The ID of the employee to delete
 * @throws Error if employee with given ID is not found
 */
export const deleteEmployee = async (id: number): Promise<void> => {
    const index: number = employees.findIndex((employee: Employee) => employee.id === id);

    if (index === -1) {
        throw new Error(`Employee with ID ${id} not found`);
    }

    employees.splice(index, 1);
};