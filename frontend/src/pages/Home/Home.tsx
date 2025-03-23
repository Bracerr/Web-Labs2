import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { TokenStorage } from '../../utils/tokenStorage';
import styles from './Home.module.scss';
import { Header } from '../../components/Header/Header';

export const Home: FC = () => {
  useEffect(() => {
    document.title = 'EventApp';
  }, []);

  const navigate = useNavigate();

  const handleEventsClick = () => {
    if (!TokenStorage.isAuthenticated()) {
      navigate('/login');
    } else {
      navigate('/events');
    }
  };

  return (
    <div className={styles.container}>
      <Header showAuthButtons={true} />
      <main className={styles.main}>
        <div className={styles.content}>
          <h2>Добро пожаловать в EventApp</h2>
          <p>
            Удобная платформа для просмотра и управления мероприятиями. Присоединяйтесь к нам и
            откройте мир интересных событий!
          </p>
          <CustomButton onClick={handleEventsClick} className={styles.eventsButton}>
            Смотреть мероприятия
          </CustomButton>
        </div>
      </main>
    </div>
  );
};
