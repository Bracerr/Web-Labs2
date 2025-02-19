import { eventRepository } from '../repositories/eventRepository.js';
import { User } from '../models/user.js'

const eventService = {
    getAllEvents: async () => {
        return await eventRepository.getAllEvents();
    },
    getEventById: async (id) => {
        return await eventRepository.getEventById(id);
    },
    createEvent: async (eventData) => {
        const { createdBy } = eventData;

        const user = await User.findByPk(createdBy);
        if (!user) {
            throw new Error('Пользователь не найден');
        }

        return await eventRepository.createEvent(eventData);
    },
    updateEvent: async (id, eventData) => {
        return await eventRepository.updateEvent(id, eventData);
    },
    deleteEvent: async (id) => {
        return await eventRepository.deleteEvent(id);
    },
};

export { eventService };
