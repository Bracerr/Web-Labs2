import { eventService } from '../services/eventService.js';
import { handleError } from '../errors/customErrors.js';

const eventHandler = {
    getAllEvents: async (req, res) => {
        try {
            const events = await eventService.getAllEvents();
            res.status(200).json(events);
        } catch (error) {
            handleError(res, error, 'Ошибка при получении мероприятий: ' + error.message);
        }
    },

    getEventById: async (req, res) => {
        const { id } = req.params;
        try {
            const event = await eventService.getEventById(id);
            res.status(200).json(event);
        } catch (error) {
            handleError(res, error, 'Ошибка при получении мероприятия: ' + error.message);
        }
    },


    createEvent: async (req, res) => {
        const { title, description, date, createdBy } = req.body;
        if (!title || !date || !createdBy) {
            return res.status(400).json({ error: 'Обязательные поля: title, date, createdBy' });
        }
        try {
            const newEvent = await eventService.createEvent({ title, description, date, createdBy });
            res.status(201).json(newEvent);
        } catch (error) {
            handleError(res, error, 'Ошибка при создании мероприятия: ' +  error.message);
        }
    },

    updateEvent: async (req, res) => {
        const { id } = req.params;
        const { title, description, date, createdBy } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (date) updateData.date = date;
        if (createdBy) updateData.createdBy = createdBy;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'Не переданы поля для обновления' });
        }
        try {
            const updatedEvent = await eventService.updateEvent(id, updateData);
            res.status(200).json(updatedEvent);
        } catch (error) {
            handleError(res, error, 'Ошибка при обновлении мероприятия: ' + error.message);
        }
    },

    deleteEvent: async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await eventService.deleteEvent(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }
            res.status(204).send();
        } catch (error) {
            handleError(res, error, 'Ошибка при удалении мероприятия: ' + error.message);
        }
    },

    uploadEventImage: async (req, res) => {
        const { id } = req.params;

        if (!req.file) {
            return res.status(400).json({ error: 'Ошибка: файл не загружен' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        try {
            const event = await eventService.getEventById(id);
            const updatedEvent = await eventService.updateEvent(id, { image_url: imageUrl });
            res.status(200).json(updatedEvent);
        } catch (error) {
            handleError(res, error, 'Ошибка при загрузке изображения мероприятия: ' + error.message);
        }
    },
};

export { eventHandler };
