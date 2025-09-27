import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as employeeService from "../services/employeeService";

export const getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.status(HTTP_STATUS.OK).json({
            status: "Employee list retrieved successfully",
            data: employees,
        });
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const employee = await employeeService.getEmployeeById(parseInt(id));
        res.status(HTTP_STATUS.OK).json({
            status: "Employee retrieved successfully",
            data: employee,
        });
    } catch (error) {
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
        const employees = await employeeService.getEmployeesByBranch(parseInt(id));
        res.status(HTTP_STATUS.OK).json({
            status: "Employees retrieved successfully",
            data: employees,
        });
    } catch (error) {
        next(error);
    }
};

export const createEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, position, department, email, phone, branchId } = req.body;
        const newEmployee = await employeeService.createEmployee({ name, position, department, email, phone, branchId });
        res.status(HTTP_STATUS.CREATED).json({
            status: "Employee created successfully",
            data: newEmployee,
        });
    } catch (error) {
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
        const { name, position, department, email, phone, branchId } = req.body;
        const updatedEmployee = await employeeService.updateEmployee(parseInt(id), { 
            name, 
            position, 
            department, 
            email, 
            phone, 
            branchId: branchId ? parseInt(branchId) : undefined
        });
        res.status(HTTP_STATUS.OK).json({
            status: "Employee updated successfully",
            data: updatedEmployee,
        });
    } catch (error) {
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
        await employeeService.deleteEmployee(parseInt(id));
        res.status(HTTP_STATUS.OK).json({
            status: "Employee deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

