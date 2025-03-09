import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { config } from 'dotenv';
import {
  InternalServerError,
  UnauthorizedError,
} from '../errors/customErrors.js';
import { User } from '../models/user.js';

config();

interface RefreshTokenData {
  userId: number;
  token: string;
  expiresAt: Date;
}

interface JwtPayload {
  id: number;
  email?: string;
  exp?: number;
}

const generateAccessToken = async (user: User): Promise<string> => {
  try {
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as Secret,
      { expiresIn: process.env.JWT_ACCESS_TIME_MINUTE + 'm' } as SignOptions,
    );
  } catch (error) {
    throw new InternalServerError(
      'Ошибка генерации access токена: ' + (error as Error).message,
    );
  }
};

const generateRefreshToken = async (user: User): Promise<RefreshTokenData> => {
  try {
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as Secret,
      { expiresIn: process.env.JWT_REFRESH_TIME_DAY + 'd' } as SignOptions,
    );
    const decodedToken = jwt.decode(token) as JwtPayload;
    const expirationTime = decodedToken.exp as number;
    const expirationDate = new Date(expirationTime * 1000);
    return { userId: user.id, token: token, expiresAt: expirationDate };
  } catch (error) {
    throw new InternalServerError(
      'Ошибка генерации refresh токена: ' + (error as Error).message,
    );
  }
};

const decodeRefreshToken = async (token: string): Promise<JwtPayload> => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    throw new UnauthorizedError('Неверный или истекший RefreshToken');
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  decodeRefreshToken,
  RefreshTokenData,
  JwtPayload,
};
