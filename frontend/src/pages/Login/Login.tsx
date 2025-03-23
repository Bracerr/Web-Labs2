import { FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { authService } from '../../api/authService';
import { TokenStorage } from '../../utils/tokenStorage';
import styles from './Login.module.scss';
import { Header } from '../../components/Header/Header';

export const Login: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (TokenStorage.isAuthenticated()) {
      navigate('/events');
    }
    document.title = 'Login';
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      TokenStorage.setTokens(response);
      navigate('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header showAuthButtons={false} />
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Вход в систему</h2>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Введите email"
                onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  setError('Пожалуйста, введите корректный email');
                }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">Пароль</label>
              <div className={styles.passwordInput}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Введите пароль"
                  onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setError('Пожалуйста, введите пароль');
                  }}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <CustomButton type="submit" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </CustomButton>
            </div>
            <p className={styles.registerLink}>
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
