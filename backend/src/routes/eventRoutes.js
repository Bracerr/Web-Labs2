import { Router } from "express";
import { eventHandler } from "../handlers/eventHandler.js";
import { upload } from "../config/multer.js";

const eventRouter = new Router();

eventRouter.get('/', eventHandler.getAllEvents);
eventRouter.get('/:id', eventHandler.getEventById);
eventRouter.post('/', eventHandler.createEvent);
eventRouter.put('/:id', eventHandler.updateEvent);
eventRouter.delete('/:id', eventHandler.deleteEvent);
eventRouter.post('/:id/image', upload.single('image'), eventHandler.uploadEventImage);

export { eventRouter };
