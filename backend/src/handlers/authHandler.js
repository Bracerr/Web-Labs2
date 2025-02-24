import { userService } from "../services/userService.js";

const authHandler = {
    registerUser: async (req, res) => {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "username или email или password обязательны."});
        }

        try {
            const existingUser = await userService.findUserByEmail(email)
            if (existingUser) {
                return res.status(400).json({message: 'Пользователь с таким email уже существует.'});
            }
            const newUser = await userService.createUser({username, email, password});
            res.status(200).json(newUser);
        } catch (error) {
            console.error("Ошибка регистрации пользователя:", error);
            res.status(500).json({message: "Внутреняя ошибка сервера при создании пользователя"});
        }
    }
}

export { authHandler }