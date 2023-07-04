import { NextFunction, Request, Response } from 'express';
import { ValidateError } from 'tsoa';
import logger from '../logger';
import { ApiError } from '../types';

interface ApiErrorResponse {
    error: {
        name: string;
        message?: string;
        stack?: string;
    };
}

/**
 * Error middleware
 *
 * Will handle all the errors thrown in the routes. In case:
 * * Validation error - return the needed data
 * * API error - return the API error
 * @param err
 * @param req
 * @param res
 * @param _next
 * @returns
 */
const errorMiddleware = async (err: Error, req: Request, res: Response, _next: NextFunction) => {
    logger.error(`Failed on route: ${req.method} ${req.path}`, { txnId: res.locals.txnId, err });

    if (err instanceof ValidateError) {
        logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
        });
    }
    if (err instanceof ApiError) {
        logger.error(`Caught API Error for ${req.path}: ${err.name} - ${err.message}`, err);
        const content: ApiErrorResponse = { error: { name: err.name } };
        content.error.message = err.message;

        // Adding more info if we're not in prod
        if (process.env.NODE_ENV !== 'production') {
            content.error.stack = err.stack;
        }

        return res.status(err.statusCode).json(content);
    }

    if (res.headersSent) {
        logger.warn('An error was thrown but response was send already', { txnId: res.locals.txnId });
        return;
    }

    if (process.env.NODE_ENV === 'production') {
        return res.status(500).end();
    }

    return res.status(500).json({
        error: {
            name: err.name,
            message: err.message,
            stack: err.stack,
        },
    });
};

export default errorMiddleware;
