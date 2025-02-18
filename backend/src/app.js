import express from 'express';
import cors from "cors";
import { config } from "dotenv";
import { router } from "./routes/router.js";
import { authenticateDatabase } from "./config/db.js"
import { syncDatabase } from "./config/sync.js";

config()

const run = () => {
    const RESERVE_PORT = 8081
    const app = express();
    const PORT = process.env.PORT || RESERVE_PORT;

    app.use(cors());
    app.use(express.json());
    app.use('/', router);

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
    .then(run)
    .catch(error => {
        console.error(error);
    })