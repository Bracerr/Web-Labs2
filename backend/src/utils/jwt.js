import jwt from "jsonwebtoken";
import { config } from "dotenv";
import {InternalServerError, UnauthorizedError} from "../errors/customErrors.js";

config()

const generateAccessToken = async (user) => {
    try {
        return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_TIME_MINUTE + 'm' });
    } catch (error) {
        throw new InternalServerError('Ошибка генерации access токена: ' + error.message);
    }

};

const generateRefreshToken = async (user) => {
    try {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_TIME_DAY + 'd' });
        const decodedToken = jwt.decode(token)
        const expirationTime = decodedToken.exp;
        const expirationDate = new Date(expirationTime * 1000);
        return {userId: user.id, token: token, expiresAt: expirationDate};
    } catch (error) {
        throw new InternalServerError('Ошибка генерации refresh токена: ' + error.message);
    }

};

const decodeRefreshToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new UnauthorizedError('Неверный или истекший RefreshToken');
    }
}

export { generateAccessToken, generateRefreshToken, decodeRefreshToken };
