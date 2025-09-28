import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Employee } from "../../../data/employees";
import * as employeeService from "../services/employeeService";

export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees: Employee[] = await employeeService.getAllEmployees();
        res.status(HTTP_STATUS.OK).json({
            status: "Employee list retrieved successfully",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getEmployeeById = async ( // originally did this for debugging but might as well keep it
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const employee: Employee = await employeeService.getEmployeeById(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json({
            status: "Employee retrieved successfully",
            data: employee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getEmployeesByBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const employees: Employee[] = await employeeService.getEmployeesByBranch(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json({
            status: "Employees retrieved successfully",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const getEmployeeByDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { department } = req.params;
        const employees: Employee[] = await employeeService.getEmployeeByDepartment(department as string);
        res.status(HTTP_STATUS.OK).json({
            status: "Employees retrieved successfully",
            data: employees,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, position, department, email, phone, branchId }: {
            name: string;
            position: string;
            department: string;
            email: string;
            phone: string;
            branchId: number;
        } = req.body;
        
        if (!name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Employee name is required"
            });
            return;
        }
        
        if (!position) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Employee position is required"
            });
            return;
        }
        
        if (!department) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Employee department is required"
            });
            return;
        }
        
        if (!email) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Employee email is required"
            });
            return;
        }
        
        if (!phone) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Employee phone is required"
            });
            return;
        }

        if (!branchId) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Employee branchId is required"
            });
            return;
        }
        
        const newEmployee: Employee = await employeeService.createEmployee({ 
            name, 
            position, 
            department, 
            email, 
            phone, 
            branchId: parseInt(branchId.toString())
        });
        
        res.status(HTTP_STATUS.CREATED).json({
            status: "Employee created successfully",
            data: newEmployee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

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
        res.status(HTTP_STATUS.OK).json({
            status: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error: unknown) {
        next(error);
    }
};

export const deleteEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        await employeeService.deleteEmployee(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json({
            status: "Employee deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};

