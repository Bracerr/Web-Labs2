import { FC } from 'react';
import { Event } from '../../api/eventService';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
  showEditButton?: boolean;
}

export const EventCard: FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.actions}>
        <button
          className={styles.deleteButton}
          onClick={e => {
            e.stopPropagation();
            onDelete();
          }}
          title="Удалить мероприятие"
        >
          ✕
        </button>
      </div>
      {event.image_url && (
        <div className={styles.imageContainer}>
          <img src={event.image_url} alt={event.title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>
        <p className={styles.date}>{formatDate(event.date)}</p>
        {onEdit && (
          <button className={styles.editButton} onClick={onEdit}>
            Редактировать
          </button>
        )}
      </div>
    </div>
  );
};
