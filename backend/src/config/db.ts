import { config } from 'dotenv';
import { Sequelize, Options } from 'sequelize';

config();

const dbConfig: Options = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as Options['dialect'],
  logging: false,
};

const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  dbConfig,
);

const authenticateDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Соединение с базой данных успешно установлено.');
  } catch (error) {
    console.error('Не удалось подключиться к базе данных');
    throw error;
  }
};

export { sequelize, authenticateDatabase };
