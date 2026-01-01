import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>
        К сожалению, запрашиваемая страница не существует. 
        Возможно, она была перемещена или удалена.
      </p>
      <Link to="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
