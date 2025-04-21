import { AxiosError } from 'axios';
import { getUserIdFromToken } from '../utils/jwtUtils';
import axiosInstance from '../utils/axiosInstance';


export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  userId: number;
  image_url?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: number;
}

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

  async createEvent(data: CreateEventData): Promise<Event> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Не авторизован');
      }

      const userId = getUserIdFromToken(token);
      if (!userId) {
        throw new Error('Не удалось получить ID пользователя');
      }

      const response = await axiosInstance.post('/events', {
        ...data,
        date: new Date(data.date).toISOString(),
        createdBy: userId
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new Error('Неверные данные для создания мероприятия');
        }
        if (error.response?.status === 401) {
          throw new Error('Необходима авторизация');
        }
      }
      throw new Error('Не удалось создать мероприятие');
    }
  },

  async updateEvent(data: UpdateEventData): Promise<Event> {
    try {
      const { id, ...updateData } = data;
      const response = await axiosInstance.put(`/events/${id}`, updateData);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new Error('Неверные данные для обновления мероприятия');
        }
        if (error.response?.status === 401) {
          throw new Error('Необходима авторизация');
        }
        if (error.response?.status === 404) {
          throw new Error('Мероприятие не найдено');
        }
      }
      throw new Error('Не удалось обновить мероприятие');
    }
  },

  async deleteEvent(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`/events/${id}`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Необходима авторизация');
        }
        if (error.response?.status === 404) {
          throw new Error('Мероприятие не найдено');
        }
      }
      throw new Error('Не удалось удалить мероприятие');
    }
  },

  async uploadEventImage(eventId: number, file: File): Promise<Event> {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axiosInstance.post(
        `/events/${eventId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new Error('Неверный формат файла');
        }
        if (error.response?.status === 401) {
          throw new Error('Необходима авторизация');
        }
      }
      throw new Error('Не удалось загрузить изображение');
    }
  },

  async deleteEventImage(eventId: number): Promise<Event> {
    try {
      const response = await axiosInstance.post(`/events/deletePhoto/${eventId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          throw new Error('Необходима авторизация');
        }
        if (error.response?.status === 404) {
          throw new Error('Изображение не найдено');
        }
      }
      throw new Error('Не удалось удалить изображение');
    }
  },
};
