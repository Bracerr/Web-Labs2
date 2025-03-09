import { Router } from 'express';
import { authHandler } from '../handlers/authHandler.js';

const authRouter: Router = Router();

authRouter.post('/signup', authHandler.registerUser);
authRouter.post('/signin', authHandler.loginUser);
authRouter.post('/refresh', authHandler.refreshToken);

export { authRouter };
