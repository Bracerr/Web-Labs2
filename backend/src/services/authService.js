import bcrypt from 'bcryptjs';
import { config } from 'dotenv';

import { userService } from './userService.js';
import { generateAccessToken, generateRefreshToken} from "../utils/jwt.js";
import {BadRequestError, InternalServerError, NotFoundError, UnauthorizedError} from "../errors/customErrors.js";
import { refreshTokenRepository } from "../repositories/refreshTokenRepository.js";

config();

const authService = {
    registerUser: async (username, email, password) => {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            throw new BadRequestError('Пользователь с таким email уже существует.');
        }

        try {
            return await userService.createUser({ username, email, password });
        } catch (error) {
            throw new InternalServerError('Ошибка при создании пользователя:' + error.message);
        }
    },

    loginUser: async (email, password) => {
        const existingUser = await userService.findUserByEmail(email);
        if (!existingUser) {
            throw new NotFoundError('Пользователь не найден.');
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedError('Неверный пароль.');
        }

        try {
            const accessTokenString = await generateAccessToken(existingUser);
            const refreshTokenObject = await generateRefreshToken(existingUser);
            const savedToken = await refreshTokenRepository.saveOrUpdateToken(existingUser.id, refreshTokenObject);
            return { accessToken: accessTokenString, refreshToken: savedToken.token};
        } catch (error) {
            throw new InternalServerError('Ошибка при авторизации пользователя: ' + error.message);
        }
    },
};


export { authService };