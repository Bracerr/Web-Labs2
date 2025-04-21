import { FC } from 'react';
import { Modal } from '../common/Modal/Modal';
import { EventForm } from '../EventForm/EventForm';
import { Event, CreateEventData } from '../../api/eventService';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createEvent, updateEvent, clearError, uploadEventImage } from '../../features/events/eventsSlice';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
}

export const EventModal: FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.events);

  const handleSubmit = async (data: CreateEventData) => {
    if (event) {
      await dispatch(updateEvent({ ...data, id: event.id })).unwrap();
    } else {
      await dispatch(createEvent(data)).unwrap();
    }
    onClose();
  };

  const handleCancel = () => {
    dispatch(clearError());
    onClose();
  };

  const handleImageUpload = async (file: File) => {
    if (event?.id) {
      await dispatch(uploadEventImage({ eventId: event.id, file }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={event ? 'Редактирование мероприятия' : 'Создание мероприятия'}
    >
      <EventForm
        event={event}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        error={error}
        loading={loading}
        onImageUpload={handleImageUpload}
      />
    </Modal>
  );
}; 