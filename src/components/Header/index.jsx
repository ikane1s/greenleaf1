import React from 'react';
import styles from './Header.module.scss';
import logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import iconMax from '../../assets/iconMax.svg';
import iconTG from '../../assets/iconTG.svg';
import iconMail from '../../assets/iconMail.svg';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>

      <nav className={styles.nav}>
        <Link className={styles.nav_main} to="/">
          Главная
        </Link>

        {/* Каталог */}
        <div className={styles.catalogWrapper}>
          <span className={styles.catalogTitle}>
            <div className={styles.catalogTitle_text}>Каталог</div>
            <svg
              className={styles.catalogTitle_svg}
              fill="#000000"
              width="18px"
              height="18px"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M759.2 419.8L697.4 358 512 543.4 326.6 358l-61.8 61.8L512 667z" />
            </svg>
          </span>
          <div className={styles.catalogMenu}>
            <Link to="/catalog/facial-skin-care">Уход за кожей лица</Link>
            <Link to="/catalog/decorative-cosmetics">Декоративная косметика</Link>
            <Link to="/catalog/body-skin-care">Уход за кожей тела</Link>
            <Link to="/catalog/hair-care">Уход за волосами</Link>
            <Link to="/catalog/oral-hygiene">Гигиена полости рта</Link>
            <Link to="/catalog/personal-hygiene">Личная гигиена</Link>
            <Link to="/catalog/products-for-children">Товары для детей</Link>
            <Link to="/catalog/health">Здоровье</Link>
            <Link to="/catalog/eco-friendly-laundry-products">Эко-средства для стирки</Link>
            <Link to="/catalog/eco-friendly-home-remedies">Эко-средства для дома</Link>
          </div>
        </div>

        <Link className={styles.nav_aboutus} to="/about-us">
          О нас
        </Link>
        <Link className={styles.nav_aboutus} to="/become-a-partners">
          Стать партнером
        </Link>

        <a href="">
          <img className={styles.icons} src={iconTG} alt="Max" />
        </a>

        <a href="">
          <img className={styles.icon_max} src={iconMax} alt="Max" />
        </a>

        <a href="">
          <img className={styles.icons} src={iconMail} alt="Max" />
        </a>
      </nav>
    </header>
  );
};

export default Header;
