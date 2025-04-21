import { FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Loader } from '../../components/common/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from '../../features/auth/authSlice';
import styles from './Login.module.scss';
import { AuthForm } from '../../components/common/AuthForm/AuthForm';
import { useForm } from 'react-hook-form';

export const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/events');
    }
    document.title = 'Login';
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmitForm = async (data: { email: string; password: string }) => {
    try {
      await dispatch(login({ email: data.email, password: data.password })).unwrap();
      navigate('/events');
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Header showAuthButtons={false} />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Header showAuthButtons={false} />
      <div className={styles.container}>
        <AuthForm
          title="Вход в систему"
          onSubmit={handleSubmit(handleSubmitForm)}
          error={error}
          loading={loading}
          submitButtonText="Войти"
          onErrorClose={() => dispatch(clearError())}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Введите email"
              {...register('email', { 
                required: true 
              })}
              className={errors.email ? styles.errorInput : ''}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Введите пароль"
                {...register('password', { 
                  required: true 
                })}
                className={errors.password ? styles.errorInput : ''}
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

          <p className={styles.registerLink}>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </AuthForm>
      </div>
    </>
  );
};
