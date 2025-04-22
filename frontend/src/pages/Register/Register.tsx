import { FC, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import { AuthForm } from '../../components/common/AuthForm/AuthForm';
import { Loader } from '../../components/common/Loader/Loader';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { register, clearError } from '../../features/auth/authSlice';
import styles from './Register.module.scss';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Никнейм обязателен')
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(50, 'Никнейм не должен превышать 50 символов')
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      'Никнейм может содержать только латинские буквы, цифры, тире и нижнее подчеркивание'
    ),
  email: yup.string().required('Email обязателен').email('Введите корректный email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .matches(/[^A-Za-z0-9]/, 'Пароль должен содержать хотя бы один специальный символ'),
  confirmPassword: yup
    .string()
    .required('Подтверждение пароля обязательно')
    .oneOf([yup.ref('password')], 'Пароли должны совпадать'),
  firstName: yup
    .string()
    .required('Имя обязательно')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов')
    .matches(/^[А-Яа-яЁё\s-]+$/i, 'Имя может содержать только русские буквы, пробелы и тире'),
  lastName: yup
    .string()
    .required('Фамилия обязательна')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(50, 'Фамилия не должна превышать 50 символов')
    .matches(/^[А-Яа-яЁё\s-]+$/i, 'Фамилия может содержать только русские буквы, пробелы и тире'),
  middleName: yup
    .string()
    .required('Отчество обязательно')
    .min(2, 'Отчество должно содержать минимум 2 символа')
    .max(50, 'Отчество не должно превышать 50 символов')
    .matches(/^[А-Яа-яЁё\s-]+$/i, 'Отчество может содержать только русские буквы, пробелы и тире'),
  gender: yup.string().required('Пол обязателен').oneOf(['male', 'female'], 'Выберите пол'),
  birthDate: yup
    .string()
    .required('Дата рождения обязательна')
    .test('age', 'Вам должно быть не менее 18 лет', function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }),
});

export const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      birthDate: '',
    },
  });

  const handleSubmitForm = async (data: any) => {
    const { ...registerData } = data;
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
            <label htmlFor="username">Никнейм</label>
            <input
              type="text"
              id="username"
              placeholder="Введите никнейм"
              {...registerField('username')}
              className={errors.username ? styles.errorInput : ''}
            />
            {errors.username && (
              <span className={styles.errorMessage}>{errors.username.message}</span>
            )}
          </div>

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
            <label htmlFor="firstName">Имя</label>
            <input
              type="text"
              id="firstName"
              placeholder="Введите имя"
              {...registerField('firstName')}
              className={errors.firstName ? styles.errorInput : ''}
            />
            {errors.firstName && (
              <span className={styles.errorMessage}>{errors.firstName.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="lastName">Фамилия</label>
            <input
              type="text"
              id="lastName"
              placeholder="Введите фамилию"
              {...registerField('lastName')}
              className={errors.lastName ? styles.errorInput : ''}
            />
            {errors.lastName && (
              <span className={styles.errorMessage}>{errors.lastName.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="middleName">Отчество</label>
            <input
              type="text"
              id="middleName"
              placeholder="Введите отчество"
              {...registerField('middleName')}
              className={errors.middleName ? styles.errorInput : ''}
            />
            {errors.middleName && (
              <span className={styles.errorMessage}>{errors.middleName.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="gender">Пол</label>
            <select
              id="gender"
              {...registerField('gender')}
              className={errors.gender ? styles.errorInput : ''}
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
            {errors.gender && <span className={styles.errorMessage}>{errors.gender.message}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="birthDate">Дата рождения</label>
            <input
              type="date"
              id="birthDate"
              {...registerField('birthDate')}
              className={errors.birthDate ? styles.errorInput : ''}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.birthDate && (
              <span className={styles.errorMessage}>{errors.birthDate.message}</span>
            )}
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

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <div className={styles.passwordInput}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder="Подтвердите пароль"
                {...registerField('confirmPassword')}
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
              <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>
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
