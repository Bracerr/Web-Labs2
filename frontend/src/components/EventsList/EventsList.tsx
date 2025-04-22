import { FC } from 'react';
import { EventCard } from '../EventCard/EventCard';
import { Loader } from '../common/Loader/Loader';
import { ErrorNotification } from '../common/ErrorNotification/ErrorNotification';
import { EventModal } from '../EventModal/EventModal';
import { CustomButton } from '../CustomButton/CustomButton';
import styles from './EventsList.module.scss';
import Masonry from 'react-masonry-css';
import { Event } from '../../api/eventService';

interface EventsListProps {
  events: Event[];
  loading: boolean;
  error: string | null;
  selectedEvent: Event | null;
  showCreateButton?: boolean;
  isModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: number) => void;
}

export const EventsList: FC<EventsListProps> = ({
  events,
  loading,
  error,
  selectedEvent,
  showCreateButton = true,
  isModalOpen,
  onOpenModal,
  onCloseModal,
  onEditEvent,
  onDeleteEvent,
}) => {
  const breakpointColumns = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои мероприятия</h1>
        {showCreateButton && (
          <CustomButton onClick={onOpenModal}>
            Создать мероприятие
          </CustomButton>
        )}
      </div>

      {error ? (
        <ErrorNotification message={error} />
      ) : events.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumns}
          className={styles.masonryGrid}
          columnClassName={styles.masonryColumn}
        >
          {[...events]
            .sort((a, b) => b.id - a.id)
            .map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => onEditEvent(event)}
              onDelete={() => onDeleteEvent(event.id)}
            />
          ))}
        </Masonry>
      ) : (
        <div className={styles.emptyContainer}>
          <div className={styles.empty}>У вас пока нет мероприятий</div>
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={onCloseModal}
        event={selectedEvent || undefined}
      />
    </div>
  );
}; 