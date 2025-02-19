import { eventRepository } from '../repositories/eventRepository.js';

const eventService = {
    getAllEvents: async () => {
        return await eventRepository.getAllEvents();
    },
    getEventById: async (id) => {
        return await eventRepository.getEventById(id);
    },
    createEvent: async (eventData) => {
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
