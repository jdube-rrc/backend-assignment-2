import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/httpConstants';

export const errorHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const errorMessage: string = error instanceof Error ? error.message : 'Unknown error';
    
    if (process.env.NODE_ENV !== 'test') { // stops logging from spamming test output
        console.error('Error:', errorMessage);
    }
    
    if (errorMessage.includes('not found')) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            status: 'error',
            message: errorMessage
        });
        return;
    }
    
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'Internal server error'
    });
};