import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { EventsList } from '../../components/EventsList/EventsList';
import styles from './Events.module.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSelectedEvent, deleteEvent } from '../../features/events/eventsSlice';
import { Event } from '../../api/eventService';
import { Modal } from '../../components/common/Modal/Modal';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { getUserEvents } from '../../features/events/eventsSlice';
import { TokenStorage } from '../../utils/tokenStorage';
import { jwtUtils } from '../../utils/jwtUtils';

export const Events: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: events, loading, error, selectedEvent } = useAppSelector(state => state.events);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'Events';

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadEvents = async () => {
      try {
        const tokens = TokenStorage.getTokens();
        if (!tokens) {
          throw new Error('Токен не найден');
        }

        const decodedToken = jwtUtils.decodeToken(tokens.accessToken);
        if (!decodedToken || typeof decodedToken.id !== 'number') {
          throw new Error('Некорректный токен');
        }

        const userId = decodedToken.id;
        await dispatch(getUserEvents({ userId }));
      } catch (error) {
        if (error instanceof Error && error.message.includes('токен')) {
          navigate('/login');
        }
      }
    };

    loadEvents();
  }, [dispatch, navigate, isAuthenticated]);

  const handleOpenModal = () => {
    dispatch(setSelectedEvent(null));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    dispatch(setSelectedEvent(event));
    setIsModalOpen(true);
  };

  const handleDeleteClick = (eventId: number) => {
    setEventToDelete(eventId);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await dispatch(deleteEvent(eventToDelete));
      setShowConfirmModal(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setEventToDelete(null);
  };

  return (
    <div className={styles.container}>
      <Header showAuthButtons={true} />
      <main className={styles.main}>
        <EventsList
          events={events}
          loading={loading}
          error={error}
          selectedEvent={selectedEvent}
          isModalOpen={isModalOpen}
          onOpenModal={handleOpenModal}
          onCloseModal={handleCloseModal}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteClick}
        />
      </main>

      <Modal 
        isOpen={showConfirmModal} 
        onClose={handleCancelDelete}
        title="Подтверждение удаления"
      >
        <div className={styles.confirmModal}>
          <h3>Удаление мероприятия</h3>
          <p>Вы действительно хотите удалить это мероприятие?</p>
          <div className={styles.confirmButtons}>
            <CustomButton variant="secondary" onClick={handleCancelDelete}>
              Отмена
            </CustomButton>
            <CustomButton variant="primary" onClick={handleConfirmDelete}>
              Удалить
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
