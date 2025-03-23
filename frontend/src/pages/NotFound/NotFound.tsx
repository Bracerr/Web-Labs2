import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import styles from './NotFound.module.scss';

export const NotFound: FC = () => {
  useEffect(() => {
    document.title = '404 - Страница не найдена';
  }, []);

  return (
    <>
      <Header showAuthButtons={true} />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1>404</h1>
          <p>Страница не найдена</p>
          <Link to="/" className={styles.link}>
            Вернуться на главную
          </Link>
        </div>
      </div>
    </>
  );
};
