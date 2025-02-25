import { authService } from '../services/authService.js';
import { handleError } from '../errors/customErrors.js';
import { refreshTokenService } from "../services/refreshTokenService.js";

const authHandler = {
    registerUser: async (req, res) => {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'username, email и password обязательны.' });
        }

        try {
            const newUser = await authService.registerUser(username, email, password);
            res.status(200).json(newUser);
        } catch (error) {
            handleError(res, error, 'Ошибка при регистрации пользователя:' + error.message);
        }
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Поля email и password обязательны' });
        }

        try {
            const token = await authService.loginUser(email, password);
            res.status(200).json(token);
        } catch (error) {
            handleError(res, error, 'Ошибка при авторизации пользователя: ' + error.message);
        }
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ error: 'Refresh Token отсутствует' });
        }
        try {
            const newTokens = await refreshTokenService.refreshToken(refreshToken);
            res.status(200).json(newTokens);
        }
        catch (error) {
            handleError(res, error, 'Ошибка при обновлении токена: ' + error.message);
        }
    }
};



export { authHandler };