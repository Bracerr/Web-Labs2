import { userService } from '../services/userService.js';

const userHandler = {
    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Ошибка при получении пользователей:', error);
            res.status(500).json({error: 'Ошибка при получении пользователей'});
        }
    },
};

export {userHandler};
