import React from 'react';
import styles from './Partners.module.scss';

const Partners = () => {
  return (
    <div className={styles.partners}>
      <h1>Стать партнером</h1>
      <div className={styles.content}>
        <p>
          Присоединяйтесь к нашей партнерской программе и получите доступ к специальным 
          ценам и условиям сотрудничества. Мы предлагаем выгодные условия для всех наших партнеров.
        </p>
        <p>
          Свяжитесь с нами для получения более подробной информации о партнерской программе.
        </p>
      </div>
    </div>
  );
};

export default Partners;
