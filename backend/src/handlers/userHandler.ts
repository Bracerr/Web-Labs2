import { Request, Response } from 'express';
import { userService } from '../services/userService.js';
import { handleError } from '../errors/customErrors.js';
import { CustomError } from '../errors/customErrors.js';

const userHandler = {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      handleError(
        res,
        error as CustomError,
        'Ошибка при получении пользователей: ' + (error as Error).message,
      );
    }
  },
};

export { userHandler };
