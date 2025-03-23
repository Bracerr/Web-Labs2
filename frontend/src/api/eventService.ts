import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from '../utils/axiosInstance';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface CustomRequestConfig extends AxiosRequestConfig {
  skipHealthCheck?: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
  image_url?: string;
}

export const healthCheckService = {
  async checkServer(): Promise<boolean> {
    try {
      const config: CustomRequestConfig = {
        headers: {
          api_key: API_KEY,
        },
        skipHealthCheck: true,
      };

      const response = await axios.get(API_URL, config);
      return response.status === 200;
    } catch {
      return false;
    }
  },
};

export const eventService = {
  async getUserEvents(): Promise<Event[]> {
    try {
      const response = await axiosInstance.get('/events');
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        throw new Error('Необходима авторизация');
      }
      throw new Error('Не удалось загрузить мероприятия');
    }
  },
};
