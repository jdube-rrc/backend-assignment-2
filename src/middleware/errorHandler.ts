import e, { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpConstants';

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (process.env.NODE_ENV !== 'test') { // stops logging from spamming test output
        console.error('Error:', error.message);
    }
    
    if (error.message && error.message.includes('not found')) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            status: 'error',
            message: error.message
        });
        return;
    }
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal server error'
    });
};