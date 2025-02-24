import { Router } from "express";
import { userRouter } from "./userRoutes.js";
import { eventRouter } from "./eventRoutes.js";
import { authRouter } from "./authRoutes.js";

const router = new Router();

router.get('/', (req, res) => {
    res.send({ message: 'Ok' });
});

router.use('/users', userRouter);
router.use('/events', eventRouter);
router.use('/auth', authRouter);

export { router };
