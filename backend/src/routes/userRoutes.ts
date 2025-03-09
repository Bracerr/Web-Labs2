import { Router } from 'express';
import { userHandler } from '@handlers/userHandler.js';

const userRouter: Router = Router();

userRouter.get('/', userHandler.getAllUsers);

export { userRouter };
