import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Branch } from "../models/branchModel";
import { successResponse, errorResponse } from "../models/responseModel";
import * as branchService from "../services/branchService";

/**
 * Retrieves all branches
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branches: Branch[] = await branchService.getAllBranches();
        res.status(HTTP_STATUS.OK).json(
            successResponse(branches, "Branch list retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Retrieves a branch by its ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const getBranchById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const branch: Branch = await branchService.getBranchById(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json(
            successResponse(branch, "Branch retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Creates a new branch
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const createBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Validation middleware has already validated the data
        const { name, address, phone }: { name: string; address: string; phone: string } = req.body;
        const newBranch: Branch = await branchService.createBranch({ name, address, phone });
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newBranch, "Branch created successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Updates an existing branch
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, address, phone }: { name?: string; address?: string; phone?: string } = req.body;
        const updatedBranch: Branch = await branchService.updateBranch(parseInt(id as string), { name, address, phone });
        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedBranch, "Branch updated successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/** * Deletes a branch by its ID
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        await branchService.deleteBranch(parseInt(id as string));
        res.status(HTTP_STATUS.OK).json(
            successResponse(null, "Branch deleted successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};