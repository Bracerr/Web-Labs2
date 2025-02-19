import { Router } from "express";
import { userHandler } from "../handlers/userHandler.js";
import { eventHandler } from "../handlers/eventHandler.js";

const router = new Router();

router.get('/', (req, res) => {
    res.send({message: 'Ok'});
})

router.post('/users', userHandler.createUser);
router.get('/users', userHandler.getAllUsers);

router.get('/events', eventHandler.getAllEvents);
router.get('/events/:id', eventHandler.getEventById);
router.post('/events', eventHandler.createEvent);
router.put('/events/:id', eventHandler.updateEvent);
router.delete('/events/:id', eventHandler.deleteEvent);

export { router };