import { FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CustomButton } from '../../components/CustomButton/CustomButton';
import { authService } from '../../api/authService';
import styles from './Register.module.scss';
import { Header } from '../../components/Header/Header';

export const Register: FC = () => {
  useEffect(() => {
    document.title = 'Register';
  }, []);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при регистрации');
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
            <h2>Регистрация</h2>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Введите имя пользователя"
                onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  setError('Пожалуйста, введите имя пользователя');
                }}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
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

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Подтвердите пароль"
                  onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                    e.preventDefault();
                    setError('Пожалуйста, подтвердите пароль');
                  }}
                />
                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <CustomButton type="submit" disabled={isLoading}>
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </CustomButton>
            </div>

            <p className={styles.loginLink}>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};
