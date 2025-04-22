import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { CustomButton } from '../CustomButton/CustomButton';
import styles from './ProfileEditForm.module.scss';

interface ProfileEditFormProps {
  user: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ProfileEditForm: FC<ProfileEditFormProps> = ({ user, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      gender: user.gender,
      birthDate: user.birthDate.split('T')[0], 
    }
  });

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label>Имя:</label>
        <input
          {...register('firstName', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[А-Яа-яЁё\s-]+$/,
              message: 'Только русские буквы, пробел и дефис'
            }
          })}
        />
        {errors.firstName && <span className={styles.error}>{errors.firstName.message as string}</span>}
      </div>

      <div className={styles.field}>
        <label>Фамилия:</label>
        <input
          {...register('lastName', {
            required: 'Обязательное поле',
            pattern: {
              value: /^[А-Яа-яЁё\s-]+$/,
              message: 'Только русские буквы, пробел и дефис'
            }
          })}
        />
        {errors.lastName && <span className={styles.error}>{errors.lastName.message as string}</span>}
      </div>

      <div className={styles.field}>
        <label>Отчество:</label>
        <input
          {...register('middleName', {
            pattern: {
              value: /^[А-Яа-яЁё\s-]+$/,
              message: 'Только русские буквы, пробел и дефис'
            }
          })}
        />
        {errors.middleName && <span className={styles.error}>{errors.middleName.message as string}</span>}
      </div>

      <div className={styles.field}>
        <label>Пол:</label>
        <select {...register('gender', { required: 'Обязательное поле' })}>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
        </select>
        {errors.gender && <span className={styles.error}>{errors.gender.message as string}</span>}
      </div>

      <div className={styles.field}>
        <label>Дата рождения:</label>
        <input
          type="date"
          {...register('birthDate', { required: 'Обязательное поле' })}
        />
        {errors.birthDate && <span className={styles.error}>{errors.birthDate.message as string}</span>}
      </div>

      <div className={styles.buttons}>
        <CustomButton type="submit" variant="primary">
          Сохранить
        </CustomButton>
        <CustomButton type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </CustomButton>
      </div>
    </form>
  );
}; 