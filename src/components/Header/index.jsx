import React, { useState } from "react";
import styles from "./Header.module.scss";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import iconMax from "../../assets/iconMax.svg";
import iconTG from "../../assets/iconTG.svg";
import iconMail from "../../assets/iconMail.svg";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {mobileMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img src={logo} alt="logo" />
          </Link>
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Меню"
        >
          <span className={mobileMenuOpen ? styles.open : ""}></span>
          <span className={mobileMenuOpen ? styles.open : ""}></span>
          <span className={mobileMenuOpen ? styles.open : ""}></span>
        </button>

        <nav
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
        >
          <Link
            className={styles.nav_main}
            to="/"
            onClick={() => setMobileMenuOpen(false)}
          >
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
              <Link
                to="/catalog/facial-skin-care"
                onClick={() => setMobileMenuOpen(false)}
              >
                Уход за кожей лица
              </Link>
              <Link
                to="/catalog/decorative-cosmetics"
                onClick={() => setMobileMenuOpen(false)}
              >
                Декоративная косметика
              </Link>
              <Link
                to="/catalog/body-skin-care"
                onClick={() => setMobileMenuOpen(false)}
              >
                Уход за кожей тела
              </Link>
              <Link
                to="/catalog/hair-care"
                onClick={() => setMobileMenuOpen(false)}
              >
                Уход за волосами
              </Link>
              <Link
                to="/catalog/oral-hygiene"
                onClick={() => setMobileMenuOpen(false)}
              >
                Гигиена полости рта
              </Link>
              <Link
                to="/catalog/personal-hygiene"
                onClick={() => setMobileMenuOpen(false)}
              >
                Личная гигиена
              </Link>
              <Link
                to="/catalog/products-for-children"
                onClick={() => setMobileMenuOpen(false)}
              >
                Товары для детей
              </Link>
              <Link
                to="/catalog/health"
                onClick={() => setMobileMenuOpen(false)}
              >
                Здоровье
              </Link>
              <Link
                to="/catalog/eco-friendly-laundry-products"
                onClick={() => setMobileMenuOpen(false)}
              >
                Эко-средства для стирки
              </Link>
              <Link
                to="/catalog/eco-friendly-home-remedies"
                onClick={() => setMobileMenuOpen(false)}
              >
                Эко-средства для дома
              </Link>
            </div>
          </div>

          <Link
            className={styles.nav_aboutus}
            to="/about-us"
            onClick={() => setMobileMenuOpen(false)}
          >
            О нас
          </Link>
          <Link
            className={styles.nav_aboutus}
            to="/become-a-partners"
            onClick={() => setMobileMenuOpen(false)}
          >
            Стать партнером
          </Link>

          <a href="https://t.me/bogswet">
            <img className={styles.icons} src={iconTG} alt="tg" />
          </a>

          <a href="https://max.ru/u/f9LHodD0cOIdOGkS4p4ftvX_YNO5bFmqBrFXxf1rbuIimZb7BldA2oS2UQY">
            <img className={styles.icon_max} src={iconMax} alt="Max" />
          </a>

          <a href="mailto:swetbog72@gmail.com">
            <img className={styles.icons} src={iconMail} alt="mail" />
          </a>
        </nav>
      </header>
    </>
  );
};

export default Header;
