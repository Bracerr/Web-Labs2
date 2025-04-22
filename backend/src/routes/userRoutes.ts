import { Router } from 'express';
import { userHandler } from '@handlers/userHandler.js';

const userRouter: Router = Router();

userRouter.get('/', userHandler.getAllUsers);
userRouter.get('/profile', userHandler.getUserProfile);
userRouter.put('/profile', userHandler.updateUserProfile);

export { userRouter };
