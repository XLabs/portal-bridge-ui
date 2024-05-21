import 'dotenv/config';
import express, { Request, Response } from 'express';
import apiRoutes from 'routes';

const EXIT_SIGNALS = ['SIGINT', 'SIGTERM'] as const;
const { APP_PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use('/health', (_: Request, res: Response) => {
    res.send('OK');
});

app.use('/api', apiRoutes);

const server = app.listen(APP_PORT, () => {
  console.log('API Middleware listening on port: ', APP_PORT);
});

EXIT_SIGNALS.forEach(signal => {
    process.on(signal, () => {
        server.close(() => {
            console.log('API Middleware closed');
        });
    });
});