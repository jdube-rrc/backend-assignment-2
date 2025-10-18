import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Employee } from "../models/employeeModel";
import { successResponse, errorResponse } from "../models/responseModel";
import * as employeeService from "../services/employeeService";

/** * Retrieves all employees
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees: Employee[] = await employeeService.getAllEmployees();
        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employee list retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Retrieves an employee by their ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const getEmployeeById = async ( // originally did this for debugging but might as well keep it
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const employee: Employee = await employeeService.getEmployeeById(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json(
            successResponse(employee, "Employee retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Retrieves all employees for a specific branch
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const getEmployeesByBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const employees: Employee[] = await employeeService.getEmployeesByBranch(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employees retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Retrieves all employees in a specific department
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const getEmployeeByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { department } = req.params;
        const employees: Employee[] = await employeeService.getEmployeeByDepartment(department as string);
        res.status(HTTP_STATUS.OK).json(
            successResponse(employees, "Employees retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Creates a new employee
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validation middleware has already validated the data
        const { name, position, department, email, phone, branchId }: {
            name: string;
            position: string;
            department: string;
            email: string;
            phone: string;
            branchId: number;
        } = req.body;
        
        const newEmployee: Employee = await employeeService.createEmployee({ 
            name, 
            position, 
            department, 
            email, 
            phone, 
            branchId: parseInt(branchId.toString())
        });
        
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newEmployee, "Employee created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Updates an existing employee
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const updateEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, position, department, email, phone, branchId }: {
            name?: string;
            position?: string;
            department?: string;
            email?: string;
            phone?: string;
            branchId?: number;
        } = req.body;
        const updatedEmployee: Employee = await employeeService.updateEmployee(parseInt(id as string), { 
            name, 
            position, 
            department, 
            email, 
            phone, 
            branchId: branchId ? parseInt(branchId.toString()) : undefined
        });
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedEmployee, "Employee updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Deletes an existing employee
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        await employeeService.deleteEmployee(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json(
            successResponse(null, "Employee deleted successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

