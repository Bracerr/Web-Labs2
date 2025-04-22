import axios from 'axios';
import { TokenStorage } from '../utils/tokenStorage';
import axiosInstance from '../utils/axiosInstance';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
}

const API_URL = 'http://localhost:8081';

export const userService = {
  async login(data: LoginData) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, data);
      TokenStorage.setTokens(response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Неверный email или пароль');
      }
      throw new Error('Произошла ошибка при входе');
    }
  },

  async register(data: RegisterData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, data);
      TokenStorage.setTokens(response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Пользователь с таким email уже существует');
      }
      throw new Error('Произошла ошибка при регистрации');
    }
  },

  logout() {
    TokenStorage.removeTokens();
  },

  async getUserProfile(): Promise<User> {
    const tokens = TokenStorage.getTokens();
    if (!tokens) {
      throw new Error('Не авторизован');
    }

    try {
      const response = await axiosInstance.get(`/users/profile`, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        TokenStorage.removeTokens();
        throw new Error('Сессия истекла');
      }
      throw new Error('Не удалось получить данные профиля');
    }
  },

  async updateProfile(data: UpdateUserData) {
    try {
      const response = await axiosInstance.put('/users/profile', data);
      return response.data;
    } catch (error) {
      throw new Error('Не удалось обновить профиль');
    }
  }
};
