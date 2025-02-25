import { User } from '../models/user.js';
import { Event } from "../models/event.js";
import { RefreshToken } from "../models/refreshToken.js";

const syncDatabase = async () => {
    try {
        await User.sync({ force: false });
        await Event.sync({ force: false })
        await RefreshToken.sync({ force: false });
        console.log('База данных синхронизирована');
    } catch (error) {
        console.error('Ошибка при синхронизации базы данных');
        throw error;
    }
};

export { syncDatabase };