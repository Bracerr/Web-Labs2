import { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomButton } from '../CustomButton/CustomButton';
import styles from './Header.module.scss';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';

interface HeaderProps {
  showAuthButtons?: boolean;
}

export const Header: FC<HeaderProps> = ({ showAuthButtons = false }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  const renderAuthContent = () => {
    if (!showAuthButtons) return null;

    if (!isAuthenticated) {
      return (
        <div className={`${styles.authButtons} ${isMenuOpen ? styles.open : ''}`}>
          <CustomButton variant="secondary" onClick={() => handleNavigation('/login')}>
            Войти
          </CustomButton>
          <CustomButton onClick={() => handleNavigation('/register')}>
            Регистрация
          </CustomButton>
        </div>
      );
    }

    return (
      <div className={`${styles.authButtons} ${isMenuOpen ? styles.open : ''}`}>
        <CustomButton variant="secondary" onClick={() => handleNavigation('/events')}>
          Мероприятия
        </CustomButton>
        <CustomButton variant="secondary" onClick={() => handleNavigation('/profile')}>
          Профиль
        </CustomButton>
        <CustomButton variant="secondary" onClick={handleLogout}>
          Выйти
        </CustomButton>
      </div>
    );
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/" className={styles.logoLink}>
          <h1>EventApp</h1>
        </Link>
      </div>
      <button 
        className={`${styles.burgerButton} ${isMenuOpen ? styles.open : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {renderAuthContent()}
    </header>
  );
};
