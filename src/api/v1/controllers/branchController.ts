import { Request, Response, NextFunction } from "express";
import { branches, Branch } from "../../../data/branches";
import { HTTP_STATUS } from "../../../constants/httpConstants";

export const getAllBranches = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
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
        const branch = branches.find((b) => b.id === parseInt(id));
        if (!branch) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                status: "Branch not found",
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            status: "Branch retrieved successfully",
            data: branch,
        });
    } catch (error) {
        next(error);
    }
};
