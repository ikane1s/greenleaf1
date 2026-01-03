import React from 'react';
import styles from './AboutUs.module.scss';

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      <h1>О нас</h1>

      <section className={styles.intro}>
        <p className={styles.mainText}>
          Компания основана в <strong>1998 году</strong> в г. <strong>Сучжоу, Китай</strong>, слоган{' '}
          <strong>«Рождены для красоты»</strong>. Greenleaf производит более{' '}
          <strong>5000 товаров</strong> повседневного спроса.
        </p>
        <p className={styles.certification}>
          Производство сертифицировано и соответствует мировым стандартам качества
        </p>
      </section>

      <section className={styles.mission}>
        <h2>Миссия компании</h2>
        <p>Сделать людей счастливее, здоровее, красивее, богаче</p>
      </section>

      <section className={styles.program}>
        <h2>Программа компании</h2>
        <ul>
          <li>Стать лучшим работодателем на мировом уровне</li>
          <li>Стать крупнейшей платформой качественных продуктов по разумной цене</li>
          <li>Стать целевым участником благотворительности в Китае</li>
        </ul>
      </section>

      <section className={styles.values}>
        <h2>Ценности компании</h2>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🤝</div>
            <h3>Гармония</h3>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>💚</div>
            <h3>Альтруизм по отношению к себе</h3>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>✨</div>
            <h3>Честность и преданность делу</h3>
          </div>
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🚀</div>
            <h3>Полная отдача и инновации</h3>
          </div>
        </div>
      </section>

      <section className={styles.strategy}>
        <h2>Стратегия компании</h2>
        <p className={styles.strategyText}>
          Выпустить высококачественную продукцию по разумной цене на мировой рынок
        </p>
      </section>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>10 МЛРД</div>
          <div className={styles.statDescription}>
            Планы достижения ежегодных продаж в размере 10 миллиардов долларов
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>> 30</div>
          <div className={styles.statDescription}>
            Более чем 30 стран и регионов мира
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>68 МЛН</div>
          <div className={styles.statDescription}>
            Промышленный косметический парк с инвестицией в 68 миллионов долларов
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>> 300 000</div>
          <div className={styles.statDescription}>
            Более 300 000 партнеров по всему миру
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
