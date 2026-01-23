import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import {
  FaDollarSign,
  FaLeaf,
  FaIndustry,
  FaHeart,
  FaUtensils,
  FaShoppingBag,
  FaCloud,
  FaGift,
  FaLink,
  FaLaptop,
  FaGlobe,
  FaChartLine,
  FaHandshake,
  FaStar,
} from 'react-icons/fa';

// Импорт изображений продуктов
import product1 from '../assets/productsImagesHome/photo_1_2026-01-11_22-08-38.jpg';
import product2 from '../assets/productsImagesHome/photo_2_2026-01-11_22-08-38.jpg';
import product3 from '../assets/productsImagesHome/photo_3_2026-01-11_22-08-38.jpg';
import product4 from '../assets/productsImagesHome/photo_4_2026-01-11_22-08-38.jpg';
import product5 from '../assets/productsImagesHome/photo_5_2026-01-11_22-08-38.jpg';
import product6 from '../assets/productsImagesHome/photo_6_2026-01-11_22-08-38.jpg';
import product7 from '../assets/productsImagesHome/photo_7_2026-01-11_22-08-38.jpg';
import product8 from '../assets/productsImagesHome/photo_8_2026-01-11_22-08-38.jpg';
import product9 from '../assets/productsImagesHome/product9.jpg';
import product10 from '../assets/productsImagesHome/product10.jpg';
import productsForKids from '../assets/productsForKids.png';
import productsForMan from '../assets/productsForMan.png';
import yxodovaya from '../assets/greenleaf_yxodovaya.jpg';

// Хук для метатегов
const useMetaTags = (meta) => {
  useEffect(() => {
    if (!meta) return;

    // Обновляем title
    if (meta.title) {
      document.title = meta.title;
    }

    // Функция обновления/создания метатега
    const updateOrCreateMeta = (name, property, content) => {
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Description
    if (meta.description) {
      updateOrCreateMeta('description', null, meta.description);
    }

    // Keywords
    if (meta.keywords) {
      updateOrCreateMeta('keywords', null, meta.keywords);
    }

    // Open Graph
    if (meta.ogTitle) {
      updateOrCreateMeta(null, 'og:title', meta.ogTitle);
    }
    if (meta.ogDescription) {
      updateOrCreateMeta(null, 'og:description', meta.ogDescription);
    }
    if (meta.ogImage) {
      updateOrCreateMeta(null, 'og:image', meta.ogImage);
    }
    if (meta.ogUrl) {
      updateOrCreateMeta(null, 'og:url', meta.ogUrl);
    }
    if (meta.ogType) {
      updateOrCreateMeta(null, 'og:type', meta.ogType);
    }

    // Twitter
    if (meta.twitterCard) {
      updateOrCreateMeta('twitter:card', null, meta.twitterCard);
    }
    if (meta.twitterTitle) {
      updateOrCreateMeta('twitter:title', null, meta.twitterTitle);
    }
    if (meta.twitterDescription) {
      updateOrCreateMeta('twitter:description', null, meta.twitterDescription);
    }

    // Каноническая ссылка
    if (meta.canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', meta.canonical);
    }
  }, [meta]);
};

// Компонент MetaTags
const MetaTags = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  canonical,
}) => {
  useMetaTags({
    title,
    description,
    keywords,
    ogTitle: ogTitle || title,
    ogDescription: ogDescription || description,
    ogImage,
    ogUrl,
    ogType,
    twitterCard,
    twitterTitle: twitterTitle || title,
    twitterDescription: twitterDescription || description,
    canonical,
  });

  return null;
};

const productsImages = [
  {
    src: product3,
    title: 'Эко-средства для стирки',
    description: 'Натуральные и безопасные средства для стирки без вредных химических добавок.',
    alt: 'Эко средства для стирки GreenLeaf',
    category: 'eco-friendly-laundry-products',
  },
  {
    src: product6,
    title: 'Средства для уборки дома',
    description:
      'Экологически чистые средства для уборки эффективно справляются с любыми загрязнениями.',
    alt: 'Средства для уборки дома GreenLeaf',
    category: 'eco-friendly-home-remedies',
  },
  {
    src: product2,
    title: 'Средства для личной гигиены',
    description: 'Мягкие и нежные средства для ежедневного ухода за кожей тела.',
    alt: 'Средства для ухода за телом GreenLeaf',
    category: 'body-skin-care',
  },
  {
    src: product7,
    title: 'Средства для ухода за волосами',
    description: 'Профессиональная линейка средств для всех типов волос.',
    alt: 'Средства для ухода за волосами GreenLeaf',
    category: 'hair-care',
  },
  {
    src: product8,
    title: 'Гигиена полости рта',
    description: 'Современные средства для комплексного ухода за зубами и деснами.',
    alt: 'Средства гигиены полости рта GreenLeaf',
    category: 'oral-hygiene',
  },
  {
    src: product1,
    title: 'Декоративная косметика',
    description: 'Высококачественная декоративная косметика с натуральными ингредиентами.',
    alt: 'Декоративная косметика GreenLeaf',
    category: 'decorative-cosmetics',
  },
  {
    src: product4,
    title: 'Товары для здоровья',
    description:
      'Натуральные продукты для поддержания здоровья и укрепления иммунитета всей семьи. ',
    alt: 'Продукты для здоровья GreenLeaf',
    category: 'health',
  },
  {
    src: product5,
    title: 'Товары для детей',
    description: 'Безопасная и гипоаллергенная продукция специально для самых маленьких.',
    alt: 'Товары для детей GreenLeaf',
    category: 'products-for-children',
  },
  {
    src: product9,
    title: 'Средства для ухода за полостью рта',
    description: 'Комплексные решения для здоровья зубов и десен.',
    alt: 'Средства для ухода за полостью рта GreenLeaf',
    category: 'oral-hygiene',
  },
  {
    src: product10,
    title: 'Уход за кожей лица',
    description: 'Профессиональная косметика для всех типов кожи.',
    alt: 'Средства для ухода за кожей лица GreenLeaf',
    category: 'facial-skin-care',
  },
];

const categories = [
  {
    name: 'Уход за домом',
    path: '/catalog/eco-friendly-home-remedies',
    image: 'https://i.pinimg.com/1200x/db/95/14/db951467fedc2689bf6ec066af79fc4a.jpg',
    alt: 'Эко средства для ухода за домом',
  },
  {
    name: 'Макияж',
    path: '/catalog/decorative-cosmetics',
    image: 'https://i.pinimg.com/736x/7d/83/fe/7d83febd81c5220667fc72e8a6104297.jpg',
    alt: 'Декоративная косметика GreenLeaf',
  },
  {
    name: 'Товары для здоровья',
    path: '/catalog/health',
    image: 'https://i.pinimg.com/736x/ff/9d/5e/ff9d5edb78312791619a258eb1d417ea.jpg',
    alt: 'Товары для здоровья и wellness',
  },
  {
    name: 'Одежда и текстиль',
    path: '/catalog/body-skin-care',
    image: 'https://i.pinimg.com/736x/7e/3e/cc/7e3eccab1cb4ab3e15a153a2f6f864aa.jpg',
    alt: 'Средства для ухода за кожей тела',
  },
  {
    name: 'Товары для детей',
    path: '/catalog/products-for-children',
    image: productsForKids,
    alt: 'Безопасные товары для детей',
  },
  {
    name: 'Товары для мужчин',
    path: '/catalog/personal-hygiene',
    image: productsForMan,
    alt: 'Товары для мужчин GreenLeaf',
  },
  {
    name: 'Уходовая косметика',
    path: '/catalog/decorative-cosmetics',
    image: yxodovaya,
    alt: 'Уходовая косметика',
  },
];

const brands = [
  {
    name: 'GreenLeaf',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/01/1.png',
    description:
      'Основной бренд компании, предлагающий широкий ассортимент натуральной и экологически чистой продукции для дома и красоты.',
    url: 'https://greenleaf.com',
  },
  {
    name: 'Carich',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/%D0%9A%D0%90%D0%A0%D0%98%D0%A7-1.png',
    description:
      'Линейка высококачественных средств личной гигиены и ухода за телом, разработанная с использованием передовых технологий.',
    url: 'https://greenleaf.com/brand/carich',
  },
  {
    name: 'Kardli',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/KARDLI.jpg',
    description:
      'Бренд, специализирующийся на декоративной косметике и парфюмерии, сочетающий элегантность и стойкость.',
    url: 'https://greenleaf.com/brand/kardli',
  },
  {
    name: 'Pink Point',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/PINK-POINT.png',
    description:
      'Молодежный бренд с яркой и инновационной продукцией для ухода за кожей и макияжа.',
    url: 'https://greenleaf.com/brand/pink-point',
  },
  {
    name: 'Nilrich',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/NILRICH.png',
    description:
      'Бренд, ориентированный на здоровье и благополучие, предлагающий пищевые добавки и продукты для поддержания жизненного тонуса.',
    url: 'https://greenleaf.com/brand/nilrich',
  },
  {
    name: 'iLife',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/ILIFE.jpg',
    description:
      'Продукция для здорового образа жизни, включая бытовую технику и товары для улучшения качества воздуха и воды.',
    url: 'https://greenleaf.com/brand/ilife',
  },
  {
    name: 'Blue Point',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/BLUEPOINT.jpg',
    description:
      'Бренд, предлагающий инновационные решения для ухода за полостью рта и поддержания свежего дыхания.',
    url: 'https://greenleaf.com/brand/blue-point',
  },
  {
    name: 'Sealuxe',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/SEALUXE.png',
    description:
      'Премиальная косметика на основе морских компонентов, обеспечивающая глубокое увлажнение и омоложение кожи.',
    url: 'https://greenleaf.com/brand/sealuxe',
  },
  {
    name: 'Zhonggui',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/ZHONGGUI.jpg',
    description:
      'Традиционные китайские средства для здоровья и красоты, основанные на древних рецептах и натуральных травах.',
    url: 'https://greenleaf.com/brand/zhonggui',
  },
  {
    name: 'Marvisa',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/MARVISIA.png',
    description:
      'Элитная парфюмерия и ароматы для дома, создающие неповторимую атмосферу роскоши и комфорта.',
    url: 'https://greenleaf.com/brand/marvisa',
  },
  {
    name: 'Yibeile',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/YIBEILE.jpg',
    description:
      'Продукция для детей, разработанная с учетом их чувствительной кожи и потребностей, безопасная и гипоаллергенная.',
    url: 'https://greenleaf.com/brand/yibeile',
  },
  {
    name: 'Maweis',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/MAWEIS.jpg',
    description:
      'Инновационные средства для ухода за волосами, обеспечивающие их силу, блеск и здоровый вид.',
    url: 'https://greenleaf.com/brand/maweis',
  },
  {
    name: 'Leadpodi',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/LEADPODI.png',
    description:
      'Специализированные продукты для ухода за ногами, обеспечивающие комфорт и здоровье.',
    url: 'https://greenleaf.com/brand/leadpodi',
  },
  {
    name: 'Jing Hu Xi',
    logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/JING-HU-XI.jpg',
    description:
      'Продукция для ухода за домом, обеспечивающая чистоту и свежесть без вредных химикатов.',
    url: 'https://greenleaf.com/brand/jing-hu-xi',
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // SEO данные для главной страницы
  const seoData = {
    title: 'GreenLeaf - Натуральная косметика и экопродукты | Интернет-магазин',
    description:
      'Интернет-магазин GreenLeaf - натуральная косметика, эко-средства для дома, товары для здоровья. Более 5000 товаров, скидки до 50%, партнерская программа. Доставка по всей России.',
    keywords:
      'GreenLeaf, натуральная косметика, экопродукты, средства для дома, товары для здоровья, купить косметику, эко средства, партнерская программа, сетевой маркетинг, MLM',
    ogImage: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
    canonical: 'https://greenleaf.com/',
  };

  // Текущий URL для OG
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : seoData.canonical;

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
    <div className={styles.home} itemScope itemType="https://schema.org/WebPage">
      {/* Метатеги для главной страницы */}
      <MetaTags
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogTitle={seoData.title}
        ogDescription={seoData.description}
        ogImage={seoData.ogImage}
        ogUrl={currentUrl}
        ogType="website"
        twitterCard="summary_large_image"
        twitterTitle={seoData.title}
        twitterDescription={seoData.description}
        canonical={seoData.canonical}
      />

      {/* Структурированные данные для сайта */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'GreenLeaf',
            url: 'https://greenleaf.com',
            description: seoData.description,
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://greenleaf.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
            publisher: {
              '@type': 'Organization',
              name: 'GreenLeaf',
              logo: {
                '@type': 'ImageObject',
                url: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
              },
            },
          }),
        }}
      />

      {/* Структурированные данные для организации */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GreenLeaf',
            alternateName: 'GREENLEAF',
            url: 'https://greenleaf.com',
            logo: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
            description:
              'Производитель натуральной косметики и экологически чистых продуктов для дома и здоровья',
            foundingDate: '1998',
            founders: [
              {
                '@type': 'Person',
                name: 'Основатель GreenLeaf',
              },
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              telephone: '+7-800-123-45-67',
              email: 'info@greenleaf.com',
              availableLanguage: ['Russian', 'English', 'Chinese'],
            },
            sameAs: [
              'https://www.facebook.com/greenleaf',
              'https://www.instagram.com/greenleaf',
              'https://www.youtube.com/greenleaf',
              'https://t.me/greenleaf_official',
            ],
            makesOffer: {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Product',
                name: 'Натуральная косметика и эко-продукты',
                description: 'Более 5000 наименований товаров для здоровья, красоты и дома',
              },
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: 'от 100',
                priceCurrency: 'RUB',
              },
            },
            founder: {
              '@type': 'Person',
              name: 'Основатель GreenLeaf',
            },
            foundingLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'Китай',
                addressLocality: 'Гуанчжоу',
              },
            },
            numberOfEmployees: {
              '@type': 'QuantitativeValue',
              value: '10000',
            },
          }),
        }}
      />

      {/* Структурированные данные для навигации */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SiteNavigationElement',
            name: 'Главная навигация',
            url: 'https://greenleaf.com',
            mainEntity: [
              {
                '@type': 'SiteNavigationElement',
                name: 'Каталог',
                url: 'https://greenleaf.com/catalog',
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'О компании',
                url: 'https://greenleaf.com/about-us',
              },
              {
                '@type': 'SiteNavigationElement',
                name: 'Стать партнером',
                url: 'https://greenleaf.com/become-a-partners',
              },
            ],
          }),
        }}
      />

      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroPattern}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <FaLeaf />
            <span>Born For Beauty</span>
          </div>
          <h1 itemProp="headline">Добро пожаловать в GreenLeaf</h1>
          <p itemProp="description">
            Ваш надежный партнер в мире натуральной косметики и экологически чистых продуктов. Мы
            предлагаем только лучшее для вашего здоровья и красоты.
          </p>
          <div className={styles.heroButtons}>
            <Link
              to="/catalog/facial-skin-care"
              className={styles.primaryButton}
              itemProp="potentialAction"
            >
              <FaShoppingBag />
              <span>Продукция</span>
            </Link>
            <Link
              to="/become-a-partners"
              className={styles.secondaryButton}
              itemProp="potentialAction"
            >
              <FaHandshake />
              <span>Стать партнером</span>
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5000+</div>
              <div className={styles.statLabel}>Товаров</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>25+</div>
              <div className={styles.statLabel}>Лет опыта</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>30+</div>
              <div className={styles.statLabel}>Стран</div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.productionInfo}>
        <h2>Greenleaf производит более 5000 товаров повседневного спроса</h2>
        <p>Производство сертифицировано и соответствует мировым стандартам качества</p>
      </section>

      {/* Галерея продуктов */}
      <section className={styles.productsGallery}>
        <h2 style={{ display: 'none' }}>Популярные категории продукции</h2>
        <div className={styles.galleryGrid}>
          {productsImages.map((product, index) => (
            <div
              key={index}
              className={styles.galleryItem}
              itemScope
              itemType="https://schema.org/Product"
            >
              <img src={product.src} alt={product.alt} loading="lazy" itemProp="image" />
              <div className={styles.galleryOverlay}>
                <h3 itemProp="name">{product.title}</h3>
                <p itemProp="description">{product.description}</p>
                <div style={{ display: 'none' }}>
                  <span itemProp="category">{product.category}</span>
                  <span itemProp="brand">GreenLeaf</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Блок преимуществ (4 секции) */}
      <section className={styles.advantagesBlock}>
        <div className={styles.advantageCard} itemScope itemType="https://schema.org/Service">
          <div className={styles.advantageIcon}>
            <FaDollarSign />
          </div>
          <h3 itemProp="name">ЦЕЛЬ КОМПАНИИ</h3>
          <div itemProp="description">
            <p>
              А именно: распространение качественной продукции по разумной цене на мировом рынке.
              Сделать людей счастливее, здоровее, красивее и богаче.
            </p>
          </div>
        </div>
        <div className={styles.advantageCard} itemScope itemType="https://schema.org/Service">
          <div className={styles.advantageIcon}>
            <FaLeaf />
          </div>
          <h3 itemProp="name">СОСТАВ</h3>
          <div itemProp="description">
            <p>
              Натуральная - экологически чистая продукция с отсутствием вредной химии в составе.
            </p>
            <p>
              Безопасная продукция не вызывает аллергии и раздражений, подходит даже для
              новорожденных.
            </p>
          </div>
        </div>
        <div className={styles.advantageCard} itemScope itemType="https://schema.org/Service">
          <div className={styles.advantageIcon}>
            <FaIndustry />
          </div>
          <h3 itemProp="name">ПРОИЗВОДСТВО</h3>
          <div itemProp="description">
            <p>Товары инновационных технологий лидера китайской биотехнической промышленности.</p>
            <p>
              Производственная линия использует современное производственное оборудование из
              Германии, Франции и Италии.
            </p>
          </div>
        </div>
        <div className={styles.advantageCard} itemScope itemType="https://schema.org/Service">
          <div className={styles.advantageIcon}>
            <FaHeart />
          </div>
          <h3 itemProp="name">ЗДОРОВЬЕ</h3>
          <div itemProp="description">
            <p>Средства с антибактериальным и противовоспалительным эффектом</p>
            <p>Продукция восстанавливает микрофлору и обеспечивает профилактику заболеваний</p>
            <p>В линейке товаров уникальная продукция китайской медицины</p>
          </div>
        </div>
      </section>

      {/* Категории с автопрокруткой */}
      <section className={styles.categoriesSection}>
        <h2 className={styles.sectionTitle}>КАТЕГОРИИ</h2>
        <div className={styles.categoriesSlider}>
          <button
            className={styles.sliderButton}
            onClick={prevCategory}
            aria-label="Предыдущая категория"
          >
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
                      alt={category.alt}
                      loading="lazy"
                    />
                  </div>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <button
            className={styles.sliderButton}
            onClick={nextCategory}
            aria-label="Следующая категория"
          >
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
              aria-label={`Категория ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Бренды компании */}
      <section className={styles.brandsSection}>
        <div className={styles.brandsHeader}>
          <h2 className={styles.sectionTitle}>Бренды компании</h2>
          <p className={styles.sectionSubtitle}>
            Мы представляем широкий спектр брендов, каждый из которых специализируется на
            определенных категориях продукции
          </p>
        </div>
        <div className={styles.brandsContainer}>
          <div className={styles.brandsGrid}>
            {brands.map((brand, index) => (
              <div
                key={index}
                className={`${styles.brandCard} ${selectedBrand === index ? styles.active : ''}`}
                onClick={() => setSelectedBrand(selectedBrand === index ? null : index)}
                itemScope
                itemType="https://schema.org/Brand"
              >
                <div className={styles.brandCardInner}>
                  <div className={styles.brandLogoWrapper}>
                    <img
                      src={brand.logo}
                      alt={`Логотип ${brand.name}`}
                      className={styles.brandLogoImg}
                      itemProp="logo"
                      loading="lazy"
                    />
                  </div>
                  <h3 itemProp="name">{brand.name}</h3>
                </div>
                <div style={{ display: 'none' }}>
                  <span itemProp="description">{brand.description}</span>
                  <a itemProp="url" href={brand.url}>
                    {brand.url}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {selectedBrand !== null && (
            <div className={styles.brandInfo}>
              <button
                className={styles.brandInfoClose}
                onClick={() => setSelectedBrand(null)}
                aria-label="Закрыть информацию о бренде"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <div className={styles.brandInfoContent}>
                <div className={styles.brandInfoLogoWrapper}>
                  <img
                    src={brands[selectedBrand].logo}
                    alt={`Логотип ${brands[selectedBrand].name}`}
                    className={styles.brandInfoLogo}
                    loading="lazy"
                  />
                </div>
                <div className={styles.brandInfoText}>
                  <h3>{brands[selectedBrand].name}</h3>
                  <p>{brands[selectedBrand].description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Скрытая SEO информация */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h2>Интернет-магазин GreenLeaf - натуральная косметика и эко продукты</h2>
        <p>
          Компания GreenLeaf основана в 1998 году и является мировым лидером в производстве
          натуральной косметики и экологически чистых продуктов для дома. Мы предлагаем более 5000
          наименований товаров для красоты, здоровья и ухода за домом.
        </p>
        <p>
          Наша продукция производится с использованием только натуральных компонентов, без вредных
          химических добавок. Все товары проходят строгий контроль качества и соответствуют
          международным стандартам.
        </p>
        <h3>Основные категории товаров:</h3>
        <ul>
          <li>Натуральная косметика для лица и тела</li>
          <li>Эко средства для дома и уборки</li>
          <li>Товары для здоровья и wellness</li>
          <li>Декоративная косметика и парфюмерия</li>
          <li>Продукция для детей и беременных</li>
          <li>Средства личной гигиены</li>
          <li>Бытовые товары и аксессуары</li>
        </ul>
        <p>
          GreenLeaf работает в более чем 30 странах мира и имеет более 300 000 партнеров.
          Присоединяйтесь к нашей партнерской программе и получайте скидки до 50% на продукцию, а
          также возможность построить собственный бизнес.
        </p>
        <p>
          Мы гарантируем качество всей нашей продукции, оперативную доставку по всей России и
          профессиональную поддержку клиентов. GreenLeaf - забота о вашем здоровье и красоте!
        </p>
      </div>
    </div>
  );
};

export default Home;
