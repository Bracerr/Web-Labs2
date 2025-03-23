import axiosInstance from '../utils/axiosInstance';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
}

export const eventService = {
  async getUserEvents(): Promise<Event[]> {
    try {
      const response = await axiosInstance.get('/events');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Необходима авторизация');
      }
      throw new Error('Не удалось загрузить мероприятия');
    }
  },
};
