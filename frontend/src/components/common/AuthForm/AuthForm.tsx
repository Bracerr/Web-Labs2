import { FC } from 'react';
import { CustomButton } from '../../CustomButton/CustomButton';
import { ErrorNotification } from '../ErrorNotification/ErrorNotification';
import styles from './AuthForm.module.scss';

interface AuthFormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  error?: string | null;
  loading?: boolean;
  children: React.ReactNode;
  submitButtonText: string;
  onErrorClose?: () => void;
}

export const AuthForm: FC<AuthFormProps> = ({
  title,
  onSubmit,
  error,
  loading,
  children,
  submitButtonText,
  onErrorClose,
}) => {
  return (
    <div className={styles.formWrapper}>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2>{title}</h2>

        {error && <ErrorNotification message={error} onClose={onErrorClose} />}

        {children}

        <div className={styles.buttonContainer}>
          <CustomButton type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : submitButtonText}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}; 