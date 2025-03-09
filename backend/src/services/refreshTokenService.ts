import { refreshTokenRepository } from '../repositories/refreshTokenRepository.js';
import { NotFoundError, UnauthorizedError } from '../errors/customErrors.js';
import {
  decodeRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/jwt.js';
import { userService } from './userService.js';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

const refreshTokenService = {
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const decoded = await decodeRefreshToken(refreshToken);
    const storedToken =
      await refreshTokenRepository.findTokenByString(refreshToken);
    if (!storedToken) {
      throw new UnauthorizedError('RefreshToken не найден');
    }
    const user = await userService.findUserById(decoded.id);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    const newAccessTokenString = await generateAccessToken(user);
    const newRefreshTokenObject = await generateRefreshToken(user);

    await refreshTokenRepository.saveOrUpdateToken(
      user.id,
      newRefreshTokenObject,
    );

    return {
      accessToken: newAccessTokenString,
      refreshToken: newRefreshTokenObject.token,
    };
  },
};

export { refreshTokenService, TokenResponse };
