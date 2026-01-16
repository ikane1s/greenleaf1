import React from "react";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";
import {
  FaPhone,
  FaEnvelope,
  FaTelegram,
  FaMapMarkerAlt,
  FaLeaf,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <div className={styles.footerLogo}>
            <FaLeaf />
            <h3>GreenLeaf</h3>
          </div>
          <p className={styles.footerDescription}>
            Ваш надежный партнер в мире натуральной косметики и экологически
            чистых продуктов.
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4>Навигация</h4>
          <ul className={styles.footerLinks}>
            <li>
              <Link to="/">Главная</Link>
            </li>
            <li>
              <Link to="/catalog/facial-skin-care">Каталог</Link>
            </li>
            <li>
              <Link to="/about-us">О нас</Link>
            </li>
            <li>
              <Link to="/become-a-partners">Стать партнером</Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Контакты</h4>
          <ul className={styles.footerContacts}>
            <li>
              <FaPhone />
              <a href="tel:+79133731366">+7 (913) 373-13-66</a>
            </li>
            <li>
              <FaEnvelope />
              <a href="mailto:swetbog72@gmail.com">swetbog72@gmail.com</a>
            </li>
            <li>
              <FaMapMarkerAlt />
              <span>Россия, Новосибирск</span>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4>Социальные сети</h4>
          <div className={styles.socialLinks}>
            <a
              href="https://t.me/bogswet"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Telegram"
            >
              <FaTelegram />
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOIdOGkS4p4ftvX_YNO5bFmqBrFXxf1rbuIimZb7BldA2oS2UQY"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Max"
            >
              <span>Max</span>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} GreenLeaf. Все права защищены.</p>
        <p className={styles.footerNote}>
          ООО "Зеленый лист" - официальный представитель GreenLeaf в России
        </p>
      </div>
    </footer>
  );
};

export default Footer;
