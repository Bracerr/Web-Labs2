import { User } from '../models/user.js';
import { Event } from '../models/event.js';
import { RefreshToken } from '../models/refreshToken.js';

const syncDatabase = async () => {
  try {
    await User.sync({ alter: true });
    await Event.sync({ alter: true });
    await RefreshToken.sync({ alter: true });
    console.log('База данных синхронизирована');
  } catch (error) {
    console.error('Ошибка при синхронизации базы данных:', error.message);
    throw error;
  }
};

export { syncDatabase };
