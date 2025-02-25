import { eventRepository } from '../repositories/eventRepository.js';
import { userRepository } from '../repositories/userRepository.js';
import { NotFoundError } from "../errors/customErrors.js";

const eventService = {
    getAllEvents: async () => {
        return await eventRepository.getAllEvents();
    },
    getEventById: async (id) => {
        const existingEvent = await eventRepository.getEventById(id);
        if (!existingEvent) {
            throw new NotFoundError('Мероприятие не найдено')
        }
        return existingEvent;
    },
    createEvent: async (eventData) => {
        const { createdBy } = eventData;

        const user = await userRepository.findUserById(createdBy);
        if (!user) {
            throw new NotFoundError('Пользователь не найден');
        }
        return await eventRepository.createEvent(eventData);
    },
    updateEvent: async (id, eventData) => {
        const newEvent = await eventRepository.updateEvent(id, eventData);
        if (!newEvent) {
            throw new NotFoundError('Мероприятие не найдено')
        }
        return newEvent;
    },
    deleteEvent: async (id) => {
        const isDeleted = await eventRepository.deleteEvent(id);
        if (!isDeleted) {
            throw new NotFoundError('Мероприятие не найдено')
        }
        return isDeleted;
    },
};

export { eventService };
