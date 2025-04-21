import { FC } from 'react';
import styles from './ErrorNotification.module.scss';

interface ErrorNotificationProps {
  message: string;
  onClose?: () => void;
}

export const ErrorNotification: FC<ErrorNotificationProps> = ({ message, onClose }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        {message}
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
}; 