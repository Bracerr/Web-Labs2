import { Router, Request, Response } from 'express';
import { userRouter } from './userRoutes.js';
import { eventRouter } from './eventRoutes.js';
import { authRouter } from './authRoutes.js';
import { handleAuthErrorMiddleware } from '../middleware/middlewares.js';
import passport from 'passport';

const router: Router = Router();

router.use('/auth', authRouter);

router.get('/', (req: Request, res: Response): void => {
  res.send({ message: 'Ok' });
});

router.use(
  '/users',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  handleAuthErrorMiddleware,
  userRouter,
);
router.use(
  '/events',
  passport.authenticate('jwt', { session: false, failWithError: true }),
  handleAuthErrorMiddleware,
  eventRouter,
);

export { router };
