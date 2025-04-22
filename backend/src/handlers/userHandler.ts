import { Request, Response } from 'express';
import { userService } from '@services/userService.js';
import { handleError } from '@errors/customErrors.js';
import { CustomError } from '@errors/customErrors.js';
import { RequestHandler } from 'express';

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

  getUserProfile: (async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Не авторизован' });
      }
      const profile = await userService.getUserProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      handleError(
        res,
        error as CustomError,
        'Ошибка при получении профиля пользователя',
      );
    }
  }) as RequestHandler,

  updateUserProfile: (async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Не авторизован' });
      }

      const { firstName, lastName, middleName, gender, birthDate } = req.body;
      const updatedUser = await userService.updateUser(userId, {
        firstName,
        lastName,
        middleName,
        gender,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      });

      const { password: _, ...userWithoutPassword } = updatedUser.toJSON();
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      handleError(
        res,
        error as CustomError,
        'Ошибка при обновлении профиля пользователя',
      );
    }
  }) as RequestHandler,
};

export { userHandler };
