import { userService } from '../services/userService.js';

const userHandler = {
    /**
     * @swagger
     * tags:
     *   name: Users
     *   description: API для управления пользователями
     */

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Создать нового пользователя
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Имя пользователя
     *                 example: John Doe
     *               email:
     *                 type: string
     *                 description: Email пользователя
     *                 example: john.doe@example.com
     *     responses:
     *       201:
     *         description: Пользователь успешно создан
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                   description: ID созданного пользователя
     *                 name:
     *                   type: string
     *                   description: Имя пользователя
     *                 email:
     *                   type: string
     *                   description: Email пользователя
     *       400:
     *         description: Ошибка валидации или email уже существует
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Сообщение об ошибке
     *       500:
     *         description: Ошибка сервера
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Сообщение об ошибке

     */
    createUser: async (req, res) => {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({
                error: 'Обязательные поля: name, email'
            })
        }
        try {
            const newUser = await userService.createUser({ name, email });
            res.status(201).json(newUser);
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ error: 'Email уже существует' });
            } else if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => err.message);
                res.status(400).json({ errors: validationErrors });
            }
            else {
                console.error('Ошибка при создании пользователя:', error);
                res.status(500).json({ error: 'Ошибка при создании пользователя' });
            }
        }
    },
    /**
     * @swagger
     * /users:
     *   get:
     *     summary: Получить список всех пользователей
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: Успешный ответ с массивом пользователей
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                     description: ID пользователя
     *                   name:
     *                     type: string
     *                     description: Имя пользователя
     *                   email:
     *                     type: string
     *                     description: Email пользователя
     *       500:
     *         description: Ошибка сервера
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Сообщение об ошибке
     */
    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            res.status(500).json({ error: 'Ошибка при получении пользователей' });
        }
    },
};

export { userHandler };
