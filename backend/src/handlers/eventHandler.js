import { eventService } from '../services/eventService.js';
import path from "path";

const eventHandler = {
    /**
     * @swagger
     * tags:
     *   name: Events
     *   description: API для управления мероприятиями
     */

    /**
     * @swagger
     * /events:
     *   get:
     *     summary: Получить список всех мероприятий
     *     tags: [Events]
     *     responses:
     *       200:
     *         description: Успешный ответ с массивом мероприятий
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: ID мероприятия
     *                   title:
     *                     type: string
     *                     description: Заголовок мероприятия
     *                   description:
     *                     type: string
     *                     description: Описание мероприятия
     *                   date:
     *                     type: string
     *                     format: date-time
     *                     description: Дата мероприятия
     *                   createdBy:
     *                     type: integer
     *                     description: ID создателя мероприятия
     *       500:
     *         description: Ошибка сервера
     */
    getAllEvents: async (req, res) => {
        try {
            const events = await eventService.getAllEvents();
            res.status(200).json(events);
        } catch (error) {
            console.error('Ошибка при получении мероприятий:', error);
            res.status(500).json({ error: 'Ошибка при получении мероприятий' });
        }
    },

    /**
     * @swagger
     * /events/{id}:
     *   get:
     *     summary: Получить мероприятие по ID
     *     tags: [Events]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID мероприятия
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Успешный ответ с мероприятием
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 title:
     *                   type: string
     *                 description:
     *                   type: string
     *                 date:
     *                   type: string
     *                   format: date-time
     *                 createdBy:
     *                   type: integer
     *       404:
     *         description: Мероприятие не найдено
     *       500:
     *         description: Ошибка сервера
     */
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

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок мероприятия
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Дата мероприятия
 *               createdBy:
 *                 type: integer
 *                 description: ID создателя мероприятия
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID созданного мероприятия
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 createdBy:
 *                   type: integer
 *       400:
 *         description: Ошибка валидации или пользователь не найден
 *       500:
 *         description: Ошибка сервера
 */
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


    /**
     * @swagger
     * /events/{id}:
     *   put:
     *     summary: Обновить мероприятие по ID
     *     tags: [Events]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID мероприятия
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *                 description: Заголовок мероприятия
     *               description:
     *                 type: string
     *                 description: Описание мероприятия
     *               date:
     *                 type: string
     *                 format: date-time
     *                 description: Дата мероприятия
     *               createdBy:
     *                 type: integer
     *                 description: ID создателя мероприятия
     *     responses:
     *       200:
     *         description: Мероприятие успешно обновлено
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 title:
     *                   type: string
     *                 description:
     *                   type: string
     *                 date:
     *                   type: string
     *                   format: date-time
     *                 createdBy:
     *                   type: integer
     *       400:
     *         description: Не переданы поля для обновления
     *       404:
     *         description: Мероприятие не найдено
     *       500:
     *         description: Ошибка сервера
     */
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

    /**
     * @swagger
     * /events/{id}:
     *   delete:
     *     summary: Удалить мероприятие по ID
     *     tags: [Events]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID мероприятия
     *         schema:
     *           type: integer
     *     responses:
     *       204:
     *         description: Мероприятие успешно удалено
     *       404:
     *         description: Мероприятие не найдено
     *       500:
     *         description: Ошибка сервера
     */
    deleteEvent: async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await eventService.deleteEvent(id);
            if (!deleted) {
                return res.status(404).json({ error: 'Мероприятие не найдено' });
            }
            res.status(204).send(); // Успешное удаление, без содержимого
        } catch (error) {
            console.error('Ошибка при удалении мероприятия:', error);
            res.status(500).json({ error: 'Ошибка при удалении мероприятия' });
        }
    },

    /**
     * @swagger
     * /events/{id}/image:
     *   post:
     *     summary: Загрузить изображение для мероприятия
     *     tags: [Events]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID мероприятия
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               image:
     *                 type: string
     *                 format: binary
     *                 description: Изображение для загрузки
     *     responses:
     *       200:
     *         description: Изображение успешно загружено и мероприятие обновлено
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 title:
     *                   type: string
     *                 description:
     *                   type: string
     *                 date:
     *                   type: string
     *                   format: date-time
     *                 createdBy:
     *                   type: integer
     *                 image_url:
     *                   type: string
     *                   description: URL загруженного изображения
     *       400:
     *         description: Файл не загружен
     *       404:
     *         description: Мероприятие не найдено
     *       500:
     *         description: Ошибка сервера
     */
    uploadEventImage: async (req, res) => {
        const { id } = req.params;
        const event = await eventService.getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Ошибка: файл не загружен' });
        }

        const imageUrl = path.join('uploads', req.file.filename);

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
