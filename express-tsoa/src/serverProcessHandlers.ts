import { Server } from 'http';
import logger from './logger';

/**
 * Handle un-caught Promise rejections
 */
export const handleRejections = () => {
    process.on('unhandledRejection', (reason, p) => {
        const errMessage = `unhandledRejection - at: ${p}, reason: ${reason}`;
        const tags = reason instanceof Error ? { stack: reason.stack } : { reason };

        logger.error(errMessage, tags);
    });
};

/**
 * Handle un-caught exceptions
 */
export const handleExceptions = () => {
    process.on('uncaughtException', (reason, p) => {
        const errMessage = `uncaughtException - at: ${p}, reason: ${reason}`;
        const tags = reason instanceof Error ? { stack: reason.stack } : { reason };

        logger.error(errMessage, tags);
    });
};

/**
 * Handling shutdown of the server gracefully
 *
 * @param server
 */
export const handleShutdown = (server: Server) => {
    process.on('SIGINT', () => {
        logger.warn('Received SIGINT, shutting down the server');
        server.close(() => {
            logger.info('Server was shutdown gracefully');
            process.exit(0);
        });
    });
};
