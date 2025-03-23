import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { TokenStorage } from './tokenStorage';
import { authService } from '../api/authService';

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    api_key: API_KEY,
  },
});

let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  config => {
    const token = TokenStorage.getTokens()?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        try {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = TokenStorage.getTokens()?.refreshToken;
        if (!refreshToken) {
          throw new Error('Отсутствует refresh token');
        }

        const response = await authService.refreshTokens(refreshToken);
        TokenStorage.setTokens(response);

        processQueue(null, response.accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        TokenStorage.removeTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
