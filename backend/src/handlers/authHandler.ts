import { Request, Response, RequestHandler } from 'express';
import { authService } from '@services/authService.js';
import { handleError } from '@errors/customErrors.js';
import { refreshTokenService } from '@services/refreshTokenService.js';
import { CustomError } from '@errors/customErrors.js';

const authHandler = {
  registerUser: (async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'username, email и password обязательны.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Некорректный формат email.' });
    }

    try {
      const newUser = await authService.registerUser(username, email, password);
      res.status(200).json(newUser);
    } catch (error) {
      handleError(
        res,
        error as CustomError,
        'Ошибка при регистрации пользователя:' + (error as Error).message,
      );
    }
  }) as RequestHandler,

  loginUser: (async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Поля email и password обязательны' });
    }

    try {
      const token = await authService.loginUser(email, password);
      res.status(200).json(token);
    } catch (error) {
      handleError(
        res,
        error as CustomError,
        'Ошибка при авторизации пользователя: ' + (error as Error).message,
      );
    }
  }) as RequestHandler,

  refreshToken: (async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh Token отсутствует' });
    }
    try {
      const newTokens = await refreshTokenService.refreshToken(refreshToken);
      res.status(200).json(newTokens);
    } catch (error) {
      handleError(
        res,
        error as CustomError,
        'Ошибка при обновлении токена: ' + (error as Error).message,
      );
    }
  }) as RequestHandler,

  deleteTestUsers: async () => {
    try {
      await authService.deleteTestUsers();
    } catch (error) {
      console.error('Ошибка при удалении тестовых пользователей:', error);
    }
  },
};

export { authHandler };
