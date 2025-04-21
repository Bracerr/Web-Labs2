import { FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { AuthForm } from '../../components/common/AuthForm/AuthForm';
import { Loader } from '../../components/common/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, clearError } from '../../features/auth/authSlice';
import styles from './Register.module.scss';
import { useForm } from 'react-hook-form';

export const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const password = watch('password');

  const handleSubmitForm = async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const { confirmPassword, ...registerData } = data;
    try {
      await dispatch(register(registerData)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  useEffect(() => {
    document.title = 'Register';
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

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
          title="Регистрация"
          onSubmit={handleSubmit(handleSubmitForm)}
          error={error}
          loading={loading}
          submitButtonText="Зарегистрироваться"
          onErrorClose={() => dispatch(clearError())}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              placeholder="Введите имя пользователя"
              {...registerField('username', { 
                required: true
              })}
              className={errors.username ? styles.errorInput : ''}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Введите email"
              {...registerField('email', { 
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
                {...registerField('password', { 
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
            {errors.password && (
              <span className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Подтвердите пароль"
                {...registerField('confirmPassword', { 
                  required: true,
                  validate: value => value === password
                })}
                className={errors.confirmPassword ? styles.errorInput : ''}
              />
              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <p className={styles.loginLink}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </AuthForm>
      </div>
    </>
  );
};
