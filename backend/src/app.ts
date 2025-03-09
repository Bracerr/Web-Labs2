import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

import { passport } from './config/passport.js';
import { router } from './routes/router.js';
import { authenticateDatabase } from './config/db.js';
import { syncDatabase } from './config/dbSync.js';
import { setRelation } from './models/relaition.js';
import { swaggerDocs } from './config/swagger.js';
import {
  apiKeyMiddleware,
  loggerMiddleware,
  validateJsonMiddleware,
  checkOtherErrorMiddleware,
} from './middleware/middlewares.js';

config();

const run = (): void => {
  const __filename: string = fileURLToPath(import.meta.url);
  const __dirname: string = path.dirname(__filename);
  const RESERVE_PORT: number = 8081;
  const app: Application = express();
  const PORT: string | number = process.env.PORT || RESERVE_PORT;

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  app.use(cors());
  app.use(express.json());

  app.use(passport.initialize());

  app.use(apiKeyMiddleware);
  app.use(loggerMiddleware);
  app.use(validateJsonMiddleware);
  app.use(checkOtherErrorMiddleware);

  app.use('/', router);

  app.use((req: Request, res: Response, _next: NextFunction): void => {
    res.status(404).json({ error: 'Ресурс не найден' });
  });

  app.listen(PORT, (err?: Error): void => {
    if (err) {
      console.error('Ошибка при запуске сервера:', err);
      return;
    }
    console.log(`Сервер запущен на порту: ${PORT}`);
  });
};

authenticateDatabase()
  .then(syncDatabase)
  .then(setRelation)
  .then(run)
  .catch((error: Error) => {
    console.error(error);
  });
