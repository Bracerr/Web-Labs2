import { FC } from 'react';
import { Event } from '../../api/eventService';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: Event;
}

export const EventCard: FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{event.title}</h3>
      <p className={styles.description}>{event.description}</p>
      <p className={styles.date}>{formatDate(event.date)}</p>
    </div>
  );
};
