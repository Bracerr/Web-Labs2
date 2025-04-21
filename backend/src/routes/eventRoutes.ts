import { Router } from 'express';
import { eventHandler } from '@handlers/eventHandler.js';
import { upload } from '@config/multer.js';
import { validateIdMiddleware } from '@middleware/middlewares.js';

const eventRouter: Router = Router();

eventRouter.get('/', eventHandler.getAllEvents);
eventRouter.get('/:id', validateIdMiddleware, eventHandler.getEventById);
eventRouter.get('/user/:userId', eventHandler.getEventsByUserId);
eventRouter.post('/', eventHandler.createEvent);
eventRouter.post('/deletePhoto/:id', eventHandler.deleteEventPhoto);
eventRouter.put('/:id', validateIdMiddleware, eventHandler.updateEvent);
eventRouter.delete('/:id', validateIdMiddleware, eventHandler.deleteEvent);
eventRouter.post(
  '/:id/image',
  validateIdMiddleware,
  upload.single('image'),
  eventHandler.uploadEventImage,
);

export { eventRouter };
