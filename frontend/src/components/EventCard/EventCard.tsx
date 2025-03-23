import { FC } from 'react';
import { Event } from '../../api/eventService';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.card}>
      {event.image_url && (
        <div className={styles.imageContainer}>
          <img src={event.image_url} alt={event.title} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>
        <p className={styles.date}>{formattedDate}</p>
      </div>
    </div>
  );
};
