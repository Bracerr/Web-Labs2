import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface ApiError {
  message: string;
}

export const authService = {
  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, data, {
        headers: {
          api_key: API_KEY,
        },
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new Error(`Неверный email или пароль`);
        }
        if (error.response?.status === 403) {
          throw new Error(`Неверный email или пароль`);
        }
        if (error.response?.status === 500) {
          throw new Error(`Внутренняя ошибка сервера. Попробуйте позже.`);
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Ошибка сети: сервер недоступен');
        }
      }
      throw new Error(
        `Произошла ошибка при входе: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data, {
        headers: {
          api_key: API_KEY,
        },
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const apiError = error.response.data as ApiError;
          throw new Error(apiError.message || 'Ошибка валидации данных');
        }
        if (error.response?.status === 409) {
          const apiError = error.response.data as ApiError;
          throw new Error(apiError.message || 'Пользователь с таким email уже существует');
        }
        if (error.response?.status === 500) {
          throw new Error('Внутренняя ошибка сервера');
        }
        if (error.code === 'ERR_NETWORK') {
          throw new Error('Ошибка сети: сервер недоступен');
        }
      }
      throw new Error(
        `Ошибка при регистрации: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
      );
    }
  },

  async refreshTokens(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: {
            api_key: API_KEY,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
        }
      }
      throw new Error('Не удалось обновить сессию');
    }
  },
};
