import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as branchService from "../services/branchService";

export const getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const branches = await branchService.getAllBranches();
        res.status(HTTP_STATUS.OK).json({
            status: "Branch list retrieved successfully",
            data: branches,
        });
    } catch (error) {
        next(error);
    }
};

export const getBranchById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const branch = await branchService.getBranchById(parseInt(id));
        res.status(HTTP_STATUS.OK).json({
            status: "Branch retrieved successfully",
            data: branch,
        });
    } catch (error) {
        next(error);
    }
};

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
            const { name, address, phone } = req.body;
            const newBranch = await branchService.createBranch({ name, address, phone });
            res.status(HTTP_STATUS.CREATED).json({
                status: "Branch created successfully",
                data: newBranch,
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, address, phone } = req.body;
        const updatedBranch = await branchService.updateBranch(parseInt(id), { name, address, phone });
        res.status(HTTP_STATUS.OK).json({
            status: "Branch updated successfully",
            data: updatedBranch,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBranch = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        await branchService.deleteBranch(parseInt(id));
        res.status(HTTP_STATUS.OK).json({
            status: "Branch deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};