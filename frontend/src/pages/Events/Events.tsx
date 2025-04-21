import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from '../../components/EventCard/EventCard';
import { Header } from '../../components/Header/Header';
import { Loader } from '../../components/common/Loader/Loader';
import { ErrorNotification } from '../../components/common/ErrorNotification/ErrorNotification';
import { EventModal } from '../../components/EventModal/EventModal';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import styles from './Events.module.scss';
import Masonry from 'react-masonry-css';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchEvents, setSelectedEvent, deleteEvent } from '../../features/events/eventsSlice';
import { Event } from '../../api/eventService';
import { Modal } from '../../components/common/Modal/Modal';

export const Events: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: events, loading, error, selectedEvent } = useAppSelector((state) => state.events);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const breakpointColumns = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1,
  };

  useEffect(() => {
    document.title = 'Events';
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    dispatch(fetchEvents());
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

  if (loading) {
    return (
      <div className={styles.container}>
        <Header showAuthButtons={true} />
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header showAuthButtons={true} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Мои мероприятия</h1>
          <CustomButton onClick={handleOpenModal}>
            Создать мероприятие
          </CustomButton>
        </div>
        
        {error ? (
          <ErrorNotification message={error} />
        ) : events.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumns}
            className={styles.masonryGrid}
            columnClassName={styles.masonryColumn}
          >
            {events.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onEdit={() => handleEditEvent(event)}
                onDelete={() => handleDeleteClick(event.id)}
              />
            ))}
          </Masonry>
        ) : (
          <div className={styles.emptyContainer}>
            <div className={styles.empty}>У вас пока нет мероприятий</div>
          </div>
        )}
      </main>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        event={selectedEvent || undefined} 
      />

      <Modal
        isOpen={showConfirmModal}
        onClose={handleCancelDelete}
      >
        <div className={styles.confirmModal}>
          <h3>Удаление мероприятия</h3>
          <p>Вы действительно хотите удалить это мероприятие?</p>
          <div className={styles.confirmButtons}>
            <CustomButton
              variant="secondary"
              onClick={handleCancelDelete}
            >
              Отмена
            </CustomButton>
            <CustomButton
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Удалить
            </CustomButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};
