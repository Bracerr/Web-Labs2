import express from 'express';
import cors from "cors";
import { config } from "dotenv";
import swaggerUi from "swagger-ui-express";

import { router } from "./routes/router.js";
import { authenticateDatabase } from "./config/db.js"
import { syncDatabase } from "./config/dbSync.js";
import { setRelation } from "./models/relaition.js";
import { swaggerDocs } from "./config/swagger.js";
import { apiKeyMiddleware, loggerMiddleware, validateJsonMiddleware, checkOtherErrorMiddleware } from './middleware/middleware.js';
import path from "path";
import {fileURLToPath} from "url";

config()

const run = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const RESERVE_PORT = 8081
    const app = express();
    const PORT = process.env.PORT || RESERVE_PORT;

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

    app.use(express.json());
    app.use(apiKeyMiddleware)
    app.use(loggerMiddleware);
    app.use(validateJsonMiddleware);
    app.use(checkOtherErrorMiddleware);
    app.use(cors());

    app.use('/', router);

    app.use((req, res, next) => {
        res.status(404).json({ error: 'Ресурс не найден' });
    });

    app.listen(PORT, (err) => {
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
    .catch(error => {
        console.error(error);
    })