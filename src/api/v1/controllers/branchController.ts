import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { Branch } from "../../../data/branches";
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
        res.status(HTTP_STATUS.OK).json({
            status: "Branch list retrieved successfully",
            data: branches,
        });
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
        res.status(HTTP_STATUS.OK).json({
            status: "Branch retrieved successfully",
            data: branch,
        });
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
        if (!req.body.name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Branch name is required",
            });
        } else if (!req.body.address) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Branch address is required",
            });
        } else if (!req.body.phone) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                status: "Branch phone is required",
            });
        } else {
            const { name, address, phone }: { name: string; address: string; phone: string } = req.body;
            const newBranch: Branch = await branchService.createBranch({ name, address, phone });
            res.status(HTTP_STATUS.CREATED).json({
                status: "Branch created successfully",
                data: newBranch,
            });
        }
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
        res.status(HTTP_STATUS.OK).json({
            status: "Branch updated successfully",
            data: updatedBranch,
        });
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
        res.status(HTTP_STATUS.OK).json({
            status: "Branch deleted successfully",
        });
    } catch (error: unknown) {
        next(error);
    }
};