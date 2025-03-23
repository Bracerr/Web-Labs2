import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomButton } from '../CustomButton/CustomButton';
import { TokenStorage } from '../../utils/tokenStorage';
import styles from './Header.module.scss';

interface HeaderProps {
  showAuthButtons?: boolean;
}

export const Header: FC<HeaderProps> = ({ showAuthButtons = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    TokenStorage.removeTokens();
    navigate('/');
  };

  const renderAuthContent = () => {
    if (!showAuthButtons) return null;

    if (!TokenStorage.isAuthenticated()) {
      return (
        <div className={styles.authButtons}>
          <CustomButton variant="secondary" onClick={() => navigate('/login')}>
            Войти
          </CustomButton>
          <CustomButton onClick={() => navigate('/register')}>Регистрация</CustomButton>
        </div>
      );
    }

    return (
      <div className={styles.authButtons}>
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
      {renderAuthContent()}
    </header>
  );
};
