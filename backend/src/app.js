import express from 'express';
import cors from "cors";
import { config } from "dotenv";
import { router } from "./routes/router.js";
import { authenticateDatabase } from "./config/db.js"
import { syncDatabase } from "./config/sync.js";
import { setRelation } from "./models/relaition.js";
import swaggerUi from "swagger-ui-express";
import {swaggerDocs} from "./config/swagger.js";
import morgan from "morgan";

config()

const run = () => {
    const RESERVE_PORT = 8081
    const app = express();
    const PORT = process.env.PORT || RESERVE_PORT;

    app.use(morgan("[HTTP] :method :url :status - :response-time ms"));

    app.use(cors());
    app.use(express.json());

    app.use('/', router);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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