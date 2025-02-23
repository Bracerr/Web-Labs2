import { Router } from "express";
import { userHandler } from "../handlers/userHandler.js";

const userRouter = new Router();

userRouter.post('/', userHandler.createUser);
userRouter.get('/', userHandler.getAllUsers);

export { userRouter };
