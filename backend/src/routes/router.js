import { Router } from "express";
import { userRouter } from "./userRoutes.js";
import { eventRouter } from "./eventRoutes.js";
import { authRouter } from "./authRoutes.js";
import { handleAuthErrorMiddleware } from "../middleware/middleware.js";
import passport from "passport";

const router = new Router();

router.use('/auth', authRouter);

router.get('/', (req, res) => {
    res.send({ message: 'Ok' });
});

router.use(passport.authenticate('jwt', { session: false, failWithError: true }), handleAuthErrorMiddleware);

router.use('/users', userRouter);
router.use('/events', eventRouter);

export { router };
