import { Event, EventModel } from '@models/event.js';
import { InferCreationAttributes } from 'sequelize';

type EventData = Omit<InferCreationAttributes<EventModel>, 'id'>;

const eventRepository = {
  getAllEvents: async (): Promise<Event[]> => {
    return await Event.findAll();
  },
  getEventById: async (id: number): Promise<Event | null> => {
    return await Event.findByPk(id);
  },
  createEvent: async (eventData: EventData): Promise<Event> => {
    return await Event.create(eventData);
  },
  updateEvent: async (
    id: number,
    eventData: Partial<EventData>,
  ): Promise<Event | null> => {
    const event = await Event.findByPk(id);
    if (event) {
      return await event.update(eventData);
    }
    return null;
  },
  deleteEvent: async (id: number): Promise<boolean> => {
    const event = await Event.findByPk(id);
    if (event) {
      await event.destroy();
      return true;
    }
    return false;
  },
  getEventsByUserId: async (userId: number): Promise<Event[]> => {
    return await Event.findAll({
      where: { createdBy: userId },
      order: [['id', 'DESC']]
    });
  },
};

export { eventRepository, EventData };
