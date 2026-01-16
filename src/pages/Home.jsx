import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';

// Импорт изображений продуктов
import product1 from '../assets/productsImagesHome/photo_1_2026-01-11_22-08-38.jpg';
import product2 from '../assets/productsImagesHome/photo_2_2026-01-11_22-08-38.jpg';
import product3 from '../assets/productsImagesHome/photo_3_2026-01-11_22-08-38.jpg';
import product4 from '../assets/productsImagesHome/photo_4_2026-01-11_22-08-38.jpg';
import product5 from '../assets/productsImagesHome/photo_5_2026-01-11_22-08-38.jpg';
import product6 from '../assets/productsImagesHome/photo_6_2026-01-11_22-08-38.jpg';
import product7 from '../assets/productsImagesHome/photo_7_2026-01-11_22-08-38.jpg';
import product8 from '../assets/productsImagesHome/photo_8_2026-01-11_22-08-38.jpg';
import productsForKids from '../assets/productsForKids.png';
import productsForMan from '../assets/productsForMan.png';

const productsImages = [
  {
    src: product1,
    title: 'Натуральная косметика',
    description: 'Экологически чистые продукты для ухода за кожей',
  },
  {
    src: product2,
    title: 'Декоративная косметика',
    description: 'Качественная косметика для создания идеального образа',
  },
  {
    src: product3,
    title: 'Уход за телом',
    description: 'Средства для ежедневного ухода за кожей тела',
  },
  {
    src: product4,
    title: 'Уход за волосами',
    description: 'Профессиональные средства для здоровых волос',
  },
  {
    src: product5,
    title: 'Гигиена полости рта',
    description: 'Современные средства для ухода за зубами',
  },
  {
    src: product6,
    title: 'Товары для детей',
    description: 'Безопасная продукция для самых маленьких',
  },
  { src: product7, title: 'Здоровье', description: 'Продукты для поддержания здоровья всей семьи' },
  { src: product8, title: 'Эко-средства', description: 'Экологически чистые средства для дома' },
];

const categories = [
  {
    name: 'Уход за домом',
    path: '/catalog/eco-friendly-home-remedies',
    image: 'https://i.pinimg.com/1200x/db/95/14/db951467fedc2689bf6ec066af79fc4a.jpg',
  },
  {
    name: 'Макияж',
    path: '/catalog/decorative-cosmetics',
    image: 'https://i.pinimg.com/736x/7d/83/fe/7d83febd81c5220667fc72e8a6104297.jpg',
  },
  {
    name: 'Товары для здоровья',
    path: '/catalog/health',
    image: 'https://i.pinimg.com/1200x/c2/cd/e0/c2cde02087cfd74de974e004f141c712.jpg',
  },
  {
    name: 'Одежда и текстиль',
    path: '/catalog/body-skin-care',
    image: 'https://i.pinimg.com/736x/7e/3e/cc/7e3eccab1cb4ab3e15a153a2f6f864aa.jpg',
  },
  {
    name: 'Товары для детей',
    path: '/catalog/products-for-children',
    image: productsForKids,
  },
  { name: 'Товары для мужчин', path: '/catalog/personal-hygiene', image: productsForMan },
  { name: 'Продукты и напитки', path: '/catalog/health', icon: '🥗' },
];

const brands = [
  {
    name: 'GreenLeaf',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/01/1.png',
    description:
      'Основной бренд компании, предлагающий широкий ассортимент натуральной и экологически чистой продукции для дома и красоты.',
  },
  {
    name: 'Carich',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/%D0%9A%D0%90%D0%A0%D0%98%D0%A7-1.png',
    description:
      'Линейка высококачественных средств личной гигиены и ухода за телом, разработанная с использованием передовых технологий.',
  },
  {
    name: 'Kardli',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/KARDLI.jpg',
    description:
      'Бренд, специализирующийся на декоративной косметике и парфюмерии, сочетающий элегантность и стойкость.',
  },
  {
    name: 'Pink Point',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/PINK-POINT.png',
    description:
      'Молодежный бренд с яркой и инновационной продукцией для ухода за кожей и макияжа.',
  },
  {
    name: 'Nilrich',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/NILRICH.png',
    description:
      'Бренд, ориентированный на здоровье и благополучие, предлагающий пищевые добавки и продукты для поддержания жизненного тонуса.',
  },
  {
    name: 'iLife',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/ILIFE.jpg',
    description:
      'Продукция для здорового образа жизни, включая бытовую технику и товары для улучшения качества воздуха и воды.',
  },
  {
    name: 'Blue Point',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/BLUEPOINT.jpg',
    description:
      'Бренд, предлагающий инновационные решения для ухода за полостью рта и поддержания свежего дыхания.',
  },
  {
    name: 'Sealuxe',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/SEALUXE.png',
    description:
      'Премиальная косметика на основе морских компонентов, обеспечивающая глубокое увлажнение и омоложение кожи.',
  },
  {
    name: 'Zhonggui',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/ZHONGGUI.jpg',
    description:
      'Традиционные китайские средства для здоровья и красоты, основанные на древних рецептах и натуральных травах.',
  },
  {
    name: 'Marvisa',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/MARVISIA.png',
    description:
      'Элитная парфюмерия и ароматы для дома, создающие неповторимую атмосферу роскоши и комфорта.',
  },
  {
    name: 'Yibeile',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/YIBEILE.jpg',
    description:
      'Продукция для детей, разработанная с учетом их чувствительной кожи и потребностей, безопасная и гипоаллергенная.',
  },
  {
    name: 'Maweis',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/MAWEIS.jpg',
    description:
      'Инновационные средства для ухода за волосами, обеспечивающие их силу, блеск и здоровый вид.',
  },
  {
    name: 'Leadpodi',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/LEADPODI.png',
    description:
      'Специализированные продукты для ухода за ногами, обеспечивающие комфорт и здоровье.',
  },
  {
    name: 'Jing Hu Xi',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/JING-HU-XI.jpg',
    description:
      'Продукция для ухода за домом, обеспечивающая чистоту и свежесть без вредных химикатов.',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // Автоматическая прокрутка категорий
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 4000); // Меняется каждые 4 секунды

    return () => clearInterval(interval);
  }, []);

  // Функции для ручного управления каруселью
  const nextCategory = () => {
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const prevCategory = () => {
    setCurrentCategoryIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>Добро пожаловать в GreenLeaf</h1>
        <p>
          Ваш надежный партнер в мире натуральной косметики и экологически чистых продуктов. Мы
          предлагаем только лучшее для вашего здоровья и красоты.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/catalog/facial-skin-care" className={styles.primaryButton}>
            Продукция
          </Link>
          <Link to="/become-a-partners" className={styles.secondaryButton}>
            Стать партнером
          </Link>
        </div>
      </section>

      <section className={styles.productionInfo}>
        <h2>Greenleaf производит более 5000 товаров повседневного спроса</h2>
        <p>Производство сертифицировано и соответствует мировым стандартам качества</p>
      </section>

      {/* Галерея продуктов */}
      <section className={styles.productsGallery}>
        <div className={styles.galleryGrid}>
          {productsImages.map((product, index) => (
            <div key={index} className={styles.galleryItem}>
              <img src={product.src} alt={product.title} />
              <div className={styles.galleryOverlay}>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Блок преимуществ (4 секции) */}
      <section className={styles.advantagesBlock}>
        <div className={styles.advantageCard}>
          <div className={styles.advantageIcon}>💰</div>
          <h3>БЛАГАЯ ЦЕЛЬ КОМПАНИИ</h3>
          <p>
            А именно: распространение качественной продукции по разумной цене на мировом рынке.
            Сделать людей счастливее, здоровее, красивее и богаче.
          </p>
        </div>
        <div className={styles.advantageCard}>
          <div className={styles.advantageIcon}>🌿</div>
          <h3>СОСТАВ</h3>
          <p>Натуральная - экологически чистая продукция с отсутствием вредной химии в составе.</p>
          <p>
            Безопасная продукция не вызывает аллергии и раздражений, подходит даже для
            новорожденных.
          </p>
        </div>
        <div className={styles.advantageCard}>
          <div className={styles.advantageIcon}>🏭</div>
          <h3>ПРОИЗВОДСТВО</h3>
          <p>Товары инновационных технологий лидера китайской биотехнической промышленности.</p>
          <p>
            Производственная линия использует современное производственное оборудование из Германии,
            Франции и Италии.
          </p>
          <p>
            Международная ведущая система контроля качества, основывается на независимых
            исследованиях и разработках химических продуктов.
          </p>
        </div>
        <div className={styles.advantageCard}>
          <div className={styles.advantageIcon}>❤️</div>
          <h3>ЗДОРОВЬЕ</h3>
          <p>Продукция для защиты здоровья всей семьи</p>
          <p>Средства с антибактериальным и противовоспалительным эффектом</p>
          <p>Продукция восстанавливает микрофлору и обеспечивает профилактику заболеваний</p>
          <p>В линейке товаров уникальная продукция китайской медицины</p>
        </div>
      </section>

      {/* Категории с автопрокруткой */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>КАТЕГОРИИ</h2>
        <div className={styles.categoriesSlider}>
          <button className={styles.sliderButton} onClick={prevCategory} aria-label="Предыдущая">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className={styles.categoriesContainer}>
            <div
              className={styles.categoriesTrack}
              style={{
                transform: `translateX(-${currentCategoryIndex * (100 / 3)}%)`,
              }}
            >
              {categories.map((category, index) => (
                <Link key={index} to={category.path} className={styles.categoryCard}>
                  <div className={styles.categoryIcon}>
                    <img
                      className={styles.catrgoryImage}
                      src={category.image}
                      alt={category.name}
                    />
                  </div>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <button className={styles.sliderButton} onClick={nextCategory} aria-label="Следующая">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className={styles.categoryIndicators}>
          {categories.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${
                index === currentCategoryIndex ? styles.active : ''
              }`}
              onClick={() => setCurrentCategoryIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Бренды компании */}
      <section className={styles.brandsSection}>
        <h2 className={styles.sectionTitle}>Бренды компании</h2>
        <div className={styles.brandsGrid}>
          {brands.map((brand, index) => (
            <div
              key={index}
              className={`${styles.brandCard} ${selectedBrand === index ? styles.active : ''}`}
              onClick={() => setSelectedBrand(selectedBrand === index ? null : index)}
            >
              <img src={brand.logo} alt={brand.name} className={styles.brandLogoImg} />
              <h3>{brand.name}</h3>
            </div>
          ))}
        </div>

        {selectedBrand !== null && (
          <div className={styles.brandInfo}>
            <img
              src={brands[selectedBrand].logo}
              alt={brands[selectedBrand].name}
              className={styles.brandInfoLogo}
            />
            <h3>{brands[selectedBrand].name}</h3>
            <p>{brands[selectedBrand].description}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
