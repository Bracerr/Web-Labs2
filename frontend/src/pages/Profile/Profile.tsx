import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getUserProfile } from '../../features/user/userSlice';
import { getUserEvents, setSelectedEvent, deleteEvent } from '../../features/events/eventsSlice';
import { jwtUtils } from '../../utils/jwtUtils';
import { TokenStorage } from '../../utils/tokenStorage';
import styles from './Profile.module.scss';
import { Event } from '../../api/eventService';
import { Modal } from '../../components/common/Modal/Modal';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { EventsList } from '../../components/EventsList/EventsList';

export const Profile: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading: userLoading, error: userError } = useAppSelector(state => state.user);
  const {
    items: events,
    loading: eventsLoading,
    error: eventsError,
    selectedEvent,
  } = useAppSelector(state => state.events);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadUserData = async () => {
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
        console.log('Получен ID пользователя:', userId);

        await dispatch(getUserProfile()).unwrap();
        await dispatch(getUserEvents({ userId }));
      } catch (error: any) {
        console.error('Ошибка при загрузке данных:', error.message);
        if (error.message.includes('токен')) {
          navigate('/login');
        }
      }
    };

    loadUserData();
  }, [dispatch, isAuthenticated, navigate]);

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

  if (userLoading) {
    return (
      <>
        <Header showAuthButtons={true} />
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showAuthButtons={true} />
      <div className={styles.container}>
        <h1>Профиль</h1>

        {userError ? (
          <div className={styles.error}>{userError}</div>
        ) : (
          <div className={styles.profileCard}>
            <div className={styles.profileInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Никнейм:</span>
                <span className={styles.value}>{user?.username}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user?.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Имя:</span>
                <span className={styles.value}>{user?.firstName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Фамилия:</span>
                <span className={styles.value}>{user?.lastName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Отчество:</span>
                <span className={styles.value}>{user?.middleName}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Пол:</span>
                <span className={styles.value}>
                  {user?.gender === 'male' ? 'Мужской' : 'Женский'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Дата рождения:</span>
                <span className={styles.value}>
                  {new Date(user?.birthDate).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        )}

        <section className={styles.eventsSection}>
          <EventsList
            events={events}
            loading={eventsLoading}
            error={eventsError}
            selectedEvent={selectedEvent}
            showCreateButton={false}
            isModalOpen={isModalOpen}
            onOpenModal={handleOpenModal}
            onCloseModal={handleCloseModal}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteClick}
          />
        </section>
      </div>

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
    </>
  );
};
