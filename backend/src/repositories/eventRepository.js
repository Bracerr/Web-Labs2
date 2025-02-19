import { Event } from '../models/event.js';

const eventRepository = {
    getAllEvents: async () => {
        return await Event.findAll();
    },
    getEventById: async (id) => {
        return await Event.findByPk(id);
    },
    createEvent: async (eventData) => {
        return await Event.create(eventData);
    },
    updateEvent: async (id, eventData) => {
        const event = await Event.findByPk(id);
        if (event) {
            return await event.update(eventData);
        }
        return null;
    },
    deleteEvent: async (id) => {
        const event = await Event.findByPk(id);
        if (event) {
            await event.destroy();
            return true;
        }
        return false;
    },
};

export { eventRepository };
