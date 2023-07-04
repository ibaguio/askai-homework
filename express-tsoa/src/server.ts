import * as dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { handleRejections, handleExceptions, handleShutdown } from './serverProcessHandlers';
import logger, { expressWinstonLogger } from './logger';
import transactionIdMiddleware from './middlewares/transactionIdMiddleware';
import errorMiddleware from './middlewares/errorMiddleware';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './fixtures/express/routes';

import { createServer } from 'http';

const PORT = process.env.PORT || 3030;
const app = express();

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// add security headers
app.use(helmet());

// add transaction ID to the requests
app.use(transactionIdMiddleware);

// Adding express logger
app.use(expressWinstonLogger);

// Swagger
app.use(express.static('public'));

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json',
        },
    }),
);

// Adding routes
RegisterRoutes(app);

// System API routes:
app.get('/healthcheck', (req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

app.use(errorMiddleware);

const httpServer = createServer(app);
httpServer.listen(PORT, async () => {
    logger.info(`Starting server...`);

    logger.info(`Registering process handlers...`);
    handleRejections();
    handleExceptions();

    handleShutdown(httpServer);

    logger.info(`Server started on: ${PORT}`);
});

export default httpServer;
