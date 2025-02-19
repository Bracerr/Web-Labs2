import { userService } from '../services/userService.js';

const userHandler = {
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
