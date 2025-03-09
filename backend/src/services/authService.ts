import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

import { userService } from './userService.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/customErrors.js';
import { refreshTokenRepository } from '../repositories/refreshTokenRepository.js';
import { User } from '../models/user.js';

config();

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface UserResponse {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

const authService = {
  registerUser: async (
    username: string,
    email: string,
    password: string,
  ): Promise<UserResponse> => {
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestError('Пользователь с таким email уже существует.');
    }

    try {
      const user = await userService.createUser({
        username,
        email,
        password,
        createdAt: new Date(),
      });
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return userWithoutPassword;
    } catch (error) {
      throw new InternalServerError(
        'Ошибка при создании пользователя:' + (error as Error).message,
      );
    }
  },

  loginUser: async (email: string, password: string): Promise<AuthResponse> => {
    const existingUser = await userService.findUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundError('Пользователь не найден.');
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedError('Неверный пароль.');
    }

    try {
      const accessTokenString = await generateAccessToken(existingUser);
      const refreshTokenObject = await generateRefreshToken(existingUser);
      const savedToken = await refreshTokenRepository.saveOrUpdateToken(
        existingUser.id,
        refreshTokenObject,
      );
      return { accessToken: accessTokenString, refreshToken: savedToken.token };
    } catch (error) {
      throw new InternalServerError(
        'Ошибка при авторизации пользователя: ' + (error as Error).message,
      );
    }
  },

  deleteTestUsers: async () => {
    await User.destroy({
      where: {
        username: 'testuser'
      }
    });
  }
};

export { authService, AuthResponse, UserResponse };
