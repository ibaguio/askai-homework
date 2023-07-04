import express from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add transaction ID to the request for better tracing
 * @param req
 * @param res
 * @param next
 */
const transactionIdMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.txnId = req.headers['X-TxnId'] || uuidv4();

    res.header('X-TxnId', res.locals.txnId);

    next();
};

export default transactionIdMiddleware;
