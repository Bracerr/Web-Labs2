import { eventService } from '../services/eventService.js';
import path from "path";

const eventHandler = {
    getAllEvents: async (req, res) => {
        try {
            const events = await eventService.getAllEvents();
            res.status(200).json(events);
        } catch (error) {
            console.error('Ошибка при получении мероприятий:', error);
            res.status(500).json({ error: 'Ошибка при получении мероприятий' });
        }
    },

    getEventById: async (req, res) => {
        const { id } = req.params;
        try {
            const event = await eventService.getEventById(id);
            if (!event) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }
            res.status(200).json(event);
        } catch (error) {
            console.error('Ошибка при получении мероприятия:', error);
            res.status(500).json({ error: 'Ошибка при получении мероприятия' });
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
            if (error.message === 'Пользователь не найден') {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }
            console.error('Ошибка при создании мероприятия:', error);
            res.status(500).json({ error: 'Ошибка при создании мероприятия' });
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
            if (!updatedEvent) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }
            res.status(200).json(updatedEvent);
        } catch (error) {
            console.error('Ошибка при обновлении мероприятия:', error);
            res.status(500).json({ error: 'Ошибка при обновлении мероприятия' });
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
            console.error('Ошибка при удалении мероприятия:', error);
            res.status(500).json({ error: 'Ошибка при удалении мероприятия' });
        }
    },

    uploadEventImage: async (req, res) => {
        const { id } = req.params;
        const event = await eventService.getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Ошибка: файл не загружен' });
        }

        // const imageUrl = path.join('uploads', req.file.filename);
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        try {
            const updatedEvent = await eventService.updateEvent(id, { image_url: imageUrl });
            res.status(200).json(updatedEvent);
        } catch (error) {
            console.error('Ошибка при обновлении мероприятия с изображением:', error);
            res.status(500).json({ error: 'Ошибка при обновлении мероприятия с изображением' });
        }
    },
};

export { eventHandler };
