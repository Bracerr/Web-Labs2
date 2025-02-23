import { Router } from "express";
import { userRouter } from "./userRoutes.js";
import { eventRouter } from "./eventRoutes.js";

const router = new Router();

router.get('/', (req, res) => {
    res.send({ message: 'Ok' });
});

router.use('/users', userRouter);
router.use('/events', eventRouter);

export { router };
