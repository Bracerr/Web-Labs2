import { FC, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event, eventService } from '../../api/eventService';
import { EventCard } from '../../components/EventCard/EventCard';
import { Header } from '../../components/Header/Header';
import styles from './Events.module.scss';
import { TokenStorage } from '../../utils/tokenStorage';

export const Events: FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSent = useRef(false);

  useEffect(() => {
    document.title = 'Events';
    if (!TokenStorage.getTokens()) {
      navigate('/login');
      return;
    }

    const fetchEvents = async () => {
      if (requestSent.current) return;
      requestSent.current = true;

      try {
        const data = await eventService.getUserEvents();
        setEvents(data);
      } catch (err) {
        if (err instanceof Error && err.message === 'Необходима авторизация') {
          navigate('/login');
        } else {
          setError('Не удалось загрузить мероприятия');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header showAuthButtons={true} />
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header showAuthButtons={true} />
      <main className={styles.main}>
        <h1 className={styles.title}>Мои мероприятия</h1>
        {error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.grid}>
            {events.length > 0 ? (
              events.map(event => <EventCard key={event.id} event={event} />)
            ) : (
              <div className={styles.empty}>У вас пока нет мероприятий</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
