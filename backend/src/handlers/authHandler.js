import { userService } from "../services/userService.js";
import bcrypt from "bcryptjs";
import { config } from 'dotenv'
import jwt from "jsonwebtoken";


config()
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
    },
    loginUser: async (req, res) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Поля username и password обязательны" })
        }
        try {
            const existingUser = await userService.findUserByEmail(email)
            if (!existingUser) {
                return res.status(404).json({ message: 'Пользователь не найден' })
            }
            const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordMatch) {
                return res.status(401).json({ message: 'Неверный пароль' });
            }
            const token = jwt.sign(
                { id: existingUser.id, email: existingUser.email },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_TIME + 'h' }
            );
            res.status(200).json({token: token});
        } catch (error) {
            console.error("Ошибка авторизации пользователя", error);
            res.status(500).json({message: "Внутреняя ошибка сервера при авторизации пользователя"});
        }
    }
}

export { authHandler }