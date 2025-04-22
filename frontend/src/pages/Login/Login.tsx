import { FC, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { Loader } from '../../components/common/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, clearError } from '../../features/auth/authSlice';
import styles from './Login.module.scss';
import { AuthForm } from '../../components/common/AuthForm/AuthForm';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().required('Email обязателен').email('Введите корректный email'),
  password: yup.string().required('Пароль обязателен'),
});

export const Login: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, error } = useAppSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    criteriaMode: 'all',
  });

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
      await dispatch(login(data)).unwrap();
      navigate(from, { replace: true });
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
              {...registerField('email')}
              className={errors.email ? styles.errorInput : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <div className={styles.passwordInput}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Введите пароль"
                {...registerField('password')}
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
            {errors.password && (
              <span className={styles.errorMessage}>{errors.password.message}</span>
            )}
          </div>

          <p className={styles.registerLink}>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </AuthForm>
      </div>
    </>
  );
};
