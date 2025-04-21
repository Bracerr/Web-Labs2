import { Event } from '@models/event.js';
import { eventRepository } from '@repositories/eventRepository.js';
import { userRepository } from '@repositories/userRepository.js';
import { NotFoundError } from '@errors/customErrors.js';

interface EventData {
  title: string;
  description: string;
  date: Date;
  image_url?: string | undefined;
  createdBy: number;
}

const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    return await eventRepository.getAllEvents();
  },
  getEventById: async (id: number): Promise<Event> => {
    const existingEvent = await eventRepository.getEventById(id);
    if (!existingEvent) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    return existingEvent;
  },
  createEvent: async (eventData: EventData): Promise<Event> => {
    const { createdBy } = eventData;

    const user = await userRepository.findUserById(createdBy);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return await eventRepository.createEvent(eventData);
  },
  updateEvent: async (
    id: number,
    eventData: Partial<EventData>,
  ): Promise<Event> => {
    const newEvent = await eventRepository.updateEvent(id, eventData);
    if (!newEvent) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    return newEvent;
  },
  deleteEventPhoto: async (
    id: number,
    eventData: Partial<EventData>,
  ): Promise<Event> => {
    const newEvent = await eventRepository.updateEvent(id, eventData);
    if (!newEvent) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    return newEvent;
  },
  deleteEvent: async (id: number): Promise<boolean> => {
    const isDeleted = await eventRepository.deleteEvent(id);
    if (!isDeleted) {
      throw new NotFoundError('Мероприятие не найдено');
    }
    return isDeleted;
  },
  getEventsByUserId: async (userId: number): Promise<Event[]> => {
    return await eventRepository.getEventsByUserId(userId);
  },
};

export { eventService, EventData };
