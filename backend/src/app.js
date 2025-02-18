import express from 'express';
import cors from "cors";
import { config } from "dotenv";
import router from "./routes/router.js";

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

run()