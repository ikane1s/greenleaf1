import React, { useEffect } from 'react';
import styles from './AboutUs.module.scss';
import { FaLeaf, FaCloud, FaGift, FaLink, FaShoppingBag, FaLaptop, FaGlobe } from 'react-icons/fa';
import onlyLogo from '../assets/onlyLogo.png';

// Хук для метатегов (импортируйте из общего файла или оставьте здесь)
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

const AboutUs = () => {
  // SEO данные для страницы
  const seoData = {
    title: 'О компании GreenLeaf | История, преимущества, статистика',
    description:
      'Компания GreenLeaf - мировой лидер в биохимической промышленности с 1998 года. Узнайте о наших преимуществах для партнеров, продукции и глобальной миссии.',
    keywords:
      'GreenLeaf, о компании, история GreenLeaf, партнерская программа, MLM бизнес, биохимическая промышленность, косметика, экопродукция, сетевой маркетинг',
    ogImage: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
    canonical: 'https://greenleaf.com/about-us',
  };

  // Текущий URL для OG
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : seoData.canonical;

  return (
    <div className={styles.aboutUs}>
      {/* Метатеги для SEO */}
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

      {/* Структурированные данные Organization */}
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
              'Мировой лидер в биохимической промышленности, производитель экологичной косметики и средств для дома.',
            foundingDate: '1998',
            founder: {
              '@type': 'Person',
              name: 'Основатель GreenLeaf',
            },
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'Китай',
              addressRegion: 'Гуанчжоу',
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              availableLanguage: ['Russian', 'English', 'Chinese'],
            },
            sameAs: [
              'https://www.facebook.com/greenleaf',
              'https://www.instagram.com/greenleaf',
              'https://www.youtube.com/greenleaf',
            ],
            numberOfEmployees: {
              '@type': 'QuantitativeValue',
              value: '10000',
            },
            brand: {
              '@type': 'Brand',
              name: 'GreenLeaf',
              description: 'Экологичная косметика и средства для дома',
            },
          }),
        }}
      />

      {/* Структурированные данные для страницы */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'О компании GreenLeaf',
            description: seoData.description,
            url: seoData.canonical,
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Главная',
                  item: 'https://greenleaf.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'О компании',
                  item: seoData.canonical,
                },
              ],
            },
            mainEntity: {
              '@type': 'AboutPage',
              mainContentOfPage: {
                '@type': 'WebPageElement',
                cssSelector: '.aboutUs',
              },
            },
            publisher: {
              '@type': 'Organization',
              name: 'GreenLeaf',
              logo: {
                '@type': 'ImageObject',
                url: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
              },
            },
            datePublished: '2018-01-01',
            dateModified: new Date().toISOString().split('T')[0],
          }),
        }}
      />

      <h1>О КОМПАНИИ GREENLEAF</h1>

      {/* Видео и информация */}
      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <div className={styles.logoWrapper}>
            <img src={onlyLogo} alt="GreenLeaf Logo" className={styles.logo} />
          </div>
          <video
            controls
            className={styles.video}
            poster="https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png"
            aria-label="Видео о компании GreenLeaf"
            preload="metadata"
          >
            <source src="https://green-leaf.shop/GREENLEAF.mp4" type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
          {/* Структурированные данные для видео */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'VideoObject',
                name: 'О компании GreenLeaf',
                description:
                  'Презентационное видео о компании GreenLeaf - истории, миссии и продукции',
                thumbnailUrl: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
                uploadDate: '2023-01-01',
                duration: 'PT3M',
                contentUrl: 'https://green-leaf.shop/GREENLEAF.mp4',
                embedUrl: 'https://greenleaf.com/about-us',
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
        </div>
        <div className={styles.videoInfo}>
          <h2>О КОМПАНИИ GREENLEAF</h2>
          <ul className={styles.companyInfoList}>
            <li itemProp="description">
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              <div className={styles.infoContent}>
                <strong>Основание компании</strong>
                <p>GREENLEAF основан в 1998 году и до 2016 года работал только в Китае.</p>
              </div>
            </li>
            <li itemProp="description">
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              <div className={styles.infoContent}>
                <strong>Российское представительство</strong>
                <p>GREENLEAF с 2018 года официально зарегистрировалась в России как ООО "Зеленый лист".</p>
              </div>
            </li>
            <li itemProp="description">
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              <div className={styles.infoContent}>
                <strong>Сфера деятельности</strong>
                <p>GREENLEAF занимается исследованиями, разработкой технологий, производством, международным сотрудничеством и маркетингом.</p>
              </div>
            </li>
            <li itemProp="description">
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              <div className={styles.infoContent}>
                <strong>Технологическое лидерство</strong>
                <p>GREENLEAF - технологический лидер в биохимической промышленности Китая.</p>
              </div>
            </li>
            <li itemProp="description">
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              <div className={styles.infoContent}>
                <strong>Инфраструктура</strong>
                <p>GREENLEAF имеет пять научно-исследовательских центров и пять производственных баз.</p>
              </div>
            </li>
            <li itemProp="description">
              <span className={styles.leafIcon}>
                <FaLeaf />
              </span>
              <div className={styles.infoContent}>
                <strong>Бизнес-модель</strong>
                <p>GREENLEAF объединяет традиционный линейный бизнес, сетевой маркетинг и франчайзинг.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Блок преимуществ партнеров */}
      <section className={styles.partnersBenefits}>
        <h2>КАЖДЫЙ ПАРТНЕР КОМПАНИИ GREENLEAF ПОЛУЧАЕТ:</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard} itemScope itemType="https://schema.org/Service">
            <div className={styles.benefitIcon}>
              <FaCloud />
            </div>
            <h3 itemProp="name">БИЗНЕС КАБИНЕТ</h3>
            <div itemProp="description">
              <p>
                Бизнес место в партнерской системе, дающее возможность участвовать в распределении
                прибыли, согласно маркетинг плана.
              </p>
              <p>Онлайн кошелек.</p>
              <p>Маркетинговые инструменты для продвижения бизнеса.</p>
              <p>Обучение от компании.</p>
              <p>Круглосуточная онлайн поддержка</p>
            </div>
          </div>
          <div className={styles.benefitCard} itemScope itemType="https://schema.org/Service">
            <div className={styles.benefitIcon}>
              <FaGift />
            </div>
            <h3 itemProp="name">ПОДАРОЧНЫЙ НАБОР ПРОДУКЦИИ</h3>
            <div itemProp="description">
              <p>Выбираете набор исходя из выбранного бизнес пакета.</p>
              <p>Наборы продукции отправляются бесплатно, в любой город России.</p>
            </div>
          </div>
          <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
            <div className={styles.benefitIcon}>
              <FaLink />
            </div>
            <h3 itemProp="name">ПАРТНЕРСКИЕ ЦЕНЫ ОТ ПРОИЗВОДИТЕЛЯ</h3>
            <div itemProp="description">
              <p>Право на покупку продукции по партнерской цене со скидкой 50%.</p>
              <p>
                Купоны в подарок. При регистрации вам начисляются подарочные электронные купоны. С
                помощью них вы сможете приобретать купонные товары со скидкой до 50%.
              </p>
            </div>
          </div>
          <div className={styles.benefitCard} itemScope itemType="https://schema.org/Service">
            <div className={styles.benefitIcon}>
              <FaShoppingBag />
            </div>
            <h3 itemProp="name">ПРИБЫЛЬ ОТ РОЗНИЧНОЙ ТОРГОВЛИ И СЕРВИСНОГО ЦЕНТРА</h3>
            <div itemProp="description">
              <p>Наценка от ваших продаж может достигать 200-300%.</p>
              <p>
                Сопровождение профессиональной команды по открытию вашей торговой точи и
                интернет-магазина.
              </p>
              <p>Специальные условия и бонусная система для содержания сервисного центра.</p>
            </div>
          </div>
          <div className={styles.benefitCard} itemScope itemType="https://schema.org/Service">
            <div className={styles.benefitIcon}>
              <FaLaptop />
            </div>
            <h3 itemProp="name">ПРИБЫЛЬ В ВИДЕ 12 ВОЗНАГРАЖДЕНИЙ</h3>
            <div itemProp="description">
              <p>Инновационный маркетинг план.</p>
              <p>Без обязательной ежемесячной активности - покупки только при необходимости.</p>
              <p>Не требуется подтверждение квалификации.</p>
              <p>
                Товарооборот сохраняется, накапливается и дает право постепенного выхода на
                лидерские ранги.
              </p>
            </div>
          </div>
          <div className={styles.benefitCard} itemScope itemType="https://schema.org/Service">
            <div className={styles.benefitIcon}>
              <FaGlobe />
            </div>
            <h3 itemProp="name">НОВАЯ ЛОГИСТИКА</h3>
            <div itemProp="description">
              <p>
                Greenleaf полностью берёт на себя международную транспортную доставку и таможню
                через границу, обеспечив юридическую и финансовую гарантию для партнёров по всему
                миру.
              </p>
              <p>
                Продукция доставляется в Ваш город или населенный пункт за счёт компании
                производителя.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Структурированные данные для преимуществ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Преимущества для партнеров GreenLeaf',
            description: 'Список преимуществ, которые получают партнеры компании GreenLeaf',
            numberOfItems: 6,
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                item: {
                  '@type': 'Service',
                  name: 'Бизнес кабинет',
                  description:
                    'Бизнес место в партнерской системе с онлайн кошельком, маркетинговыми инструментами, обучением и круглосуточной поддержкой',
                },
              },
              {
                '@type': 'ListItem',
                position: 2,
                item: {
                  '@type': 'Service',
                  name: 'Подарочный набор продукции',
                  description:
                    'Бесплатный набор продукции в зависимости от выбранного бизнес пакета с доставкой в любой город России',
                },
              },
              {
                '@type': 'ListItem',
                position: 3,
                item: {
                  '@type': 'Offer',
                  name: 'Партнерские цены от производителя',
                  description:
                    'Скидка 50% на продукцию и подарочные электронные купоны для дополнительных скидок',
                },
              },
              {
                '@type': 'ListItem',
                position: 4,
                item: {
                  '@type': 'Service',
                  name: 'Прибыль от розничной торговли и сервисного центра',
                  description:
                    'Наценка до 300%, сопровождение по открытию торговой точки и интернет-магазина, специальные условия для сервисного центра',
                },
              },
              {
                '@type': 'ListItem',
                position: 5,
                item: {
                  '@type': 'Service',
                  name: 'Прибыль в виде 12 вознаграждений',
                  description:
                    'Инновационный маркетинг план без обязательной ежемесячной активности и подтверждения квалификации',
                },
              },
              {
                '@type': 'ListItem',
                position: 6,
                item: {
                  '@type': 'Service',
                  name: 'Новая логистика',
                  description:
                    'Международная доставка и таможенное оформление за счет компании с доставкой в любой город России',
                },
              },
            ],
          }),
        }}
      />

      {/* Статистика */}
      <section className={styles.stats}>
        <div className={styles.statCard} itemScope itemType="https://schema.org/QuantitativeValue">
          <div className={styles.statNumber} itemProp="value">
            10 МЛРД
          </div>
          <div className={styles.statDescription} itemProp="unitText">
            Планы достижения ежегодных продаж в размере 10 миллиардов долларов
          </div>
        </div>
        <div className={styles.statCard} itemScope itemType="https://schema.org/QuantitativeValue">
          <div className={styles.statNumber} itemProp="value">
            &gt; 30
          </div>
          <div className={styles.statDescription} itemProp="unitText">
            Более чем 30 стран и регионов мира
          </div>
        </div>
        <div className={styles.statCard} itemScope itemType="https://schema.org/QuantitativeValue">
          <div className={styles.statNumber} itemProp="value">
            68 МЛН
          </div>
          <div className={styles.statDescription} itemProp="unitText">
            Промышленный косметический парк с инвестицией в 68 миллионов долларов
          </div>
        </div>
        <div className={styles.statCard} itemScope itemType="https://schema.org/QuantitativeValue">
          <div className={styles.statNumber} itemProp="value">
            &gt; 300 000
          </div>
          <div className={styles.statDescription} itemProp="unitText">
            Более 300 000 партнеров по всему миру
          </div>
        </div>
      </section>

      {/* Структурированные данные для статистики */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'Статистика компании GreenLeaf',
            description: 'Ключевые показатели компании GreenLeaf',
            url: seoData.canonical,
            variableMeasured: [
              {
                '@type': 'PropertyValue',
                name: 'Планы ежегодных продаж',
                value: '10 млрд долларов',
              },
              {
                '@type': 'PropertyValue',
                name: 'Количество стран присутствия',
                value: 'Более 30',
              },
              {
                '@type': 'PropertyValue',
                name: 'Инвестиции в промышленный парк',
                value: '68 млн долларов',
              },
              {
                '@type': 'PropertyValue',
                name: 'Количество партнеров',
                value: 'Более 300 000',
              },
            ],
            publisher: {
              '@type': 'Organization',
              name: 'GreenLeaf',
            },
            datePublished: new Date().toISOString().split('T')[0],
          }),
        }}
      />

      {/* Скрытая SEO информация */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h2>GreenLeaf - мировой лидер в биохимической промышленности</h2>
        <p>
          Компания GreenLeaf основана в 1998 году и является технологическим лидером в биохимической
          промышленности Китая. С 2018 года официально работает в России как ООО "Зеленый лист".
          Компания специализируется на исследованиях, разработке технологий, производстве
          экологичной косметики и средств для дома.
        </p>
        <p>
          GreenLeaf имеет пять научно-исследовательских центров и пять производственных баз, что
          позволяет обеспечивать высочайшее качество продукции. Компания объединяет традиционный
          линейный бизнес, сетевой маркетинг и франчайзинг, предлагая уникальные возможности для
          партнеров по всему миру.
        </p>
        <p>
          Наша миссия - создание экологически чистых продуктов для здоровья и красоты, которые
          улучшают качество жизни людей по всему миру. GreenLeaf стремится к достижению ежегодных
          продаж в размере 10 миллиардов долларов и расширению присутствия в более чем 30 странах
          мира.
        </p>
        <h3>Ключевые преимущества GreenLeaf:</h3>
        <ul>
          <li>26 лет опыта в биохимической промышленности</li>
          <li>Собственные научно-исследовательские центры</li>
          <li>Экологичное производство</li>
          <li>Международное присутствие</li>
          <li>Инновационный маркетинг план</li>
          <li>Поддержка партнеров 24/7</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
