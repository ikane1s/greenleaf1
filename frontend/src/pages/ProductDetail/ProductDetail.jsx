import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsData from '../../data/products.json';
import styles from './ProductDetail.module.scss';
import iconTG from '../../assets/iconTG.svg';
import iconMax from '../../assets/iconMax.svg';
import iconMail from '../../assets/iconMail.svg';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const videoRef = useRef(null);

  const product = productsData.find((p) => p.id === Number(id));

  // SEO данные для продукта
  const getSeoData = () => {
    if (!product) return null;

    const categoryMap = {
      'facial-skin-care': 'Уход за кожей лица',
      'decorative-cosmetics': 'Декоративная косметика',
      'body-skin-care': 'Уход за кожей тела',
      'hair-care': 'Уход за волосами',
      'oral-hygiene': 'Гигиена полости рта',
      'personal-hygiene': 'Личная гигиена',
      'products-for-children': 'Товары для детей',
      health: 'Здоровье',
      'eco-friendly-laundry-products': 'Эко-средства для стирки',
      'eco-friendly-home-remedies': 'Эко-средства для дома',
    };

    const categoryName = categoryMap[product.category] || product.category;
    const shortDescription =
      product.shortDescription || product.description?.substring(0, 150) || '';

    return {
      title: `${product.name} - Купить в GreenLeaf | ${product.priceRetail} ₽`,
      description: `${product.name}. ${shortDescription} Купить по цене ${product.priceRetail} ₽. Доставка по всей России.`,
      keywords: `${product.name}, купить, цена, отзывы, GreenLeaf, ${categoryName.toLowerCase()}`,
      ogImage: product.image,
      canonical: `https://greenleaf.com/product/${id}`,
      ogType: 'product',
      brand: product.brand || 'GreenLeaf',
      category: categoryName,
    };
  };

  const seoData = getSeoData();
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : seoData?.canonical || '';

  // Функция для форматирования описания
  const formatDescription = (text) => {
    if (!text) return [];

    let formatted = text;

    // Разделяем по специальным маркерам и заголовкам
    formatted = formatted.replace(/(ОБЪЕМ\s+\d+\s*мл)/gi, '\n\n**$1**\n');
    formatted = formatted.replace(/(SEALUXE|GREENLEAF|CARICH|KARDLI)/gi, '\n\n**$1**\n');
    formatted = formatted.replace(/([①-⑨])\s*слой:/g, '\n\n$1 слой:');
    formatted = formatted.replace(/(➤)/g, '\n\n$1');
    formatted = formatted.replace(
      /(Особенности продукта:|Способ применения:|Результат:|Активные ингредиенты:)/g,
      '\n\n**$1**\n',
    );

    // Разделяем длинные предложения
    formatted = formatted.replace(/\.([А-ЯЁ])/g, '.\n\n$1');

    // Убираем множественные переносы
    formatted = formatted.replace(/\n{3,}/g, '\n\n');

    // Разбиваем на строки и фильтруем пустые
    const lines = formatted
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    return lines;
  };

  const descriptionLines = product ? formatDescription(product.description) : [];
  const MAX_PREVIEW_LINES = 5;
  const shouldShowExpandButton = descriptionLines.length > MAX_PREVIEW_LINES;
  const displayedLines = isDescriptionExpanded
    ? descriptionLines
    : descriptionLines.slice(0, MAX_PREVIEW_LINES);

  useEffect(() => {
    // При открытии модального окна с видео
    if (showVideo && videoRef.current) {
      videoRef.current.play().catch((e) => console.log('Автовоспроизведение не разрешено:', e));
    }

    // При закрытии модального окна
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, [showVideo]);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Товар не найден</h2>
        <Link to="/" className={styles.backButton}>
          Вернуться на главную
        </Link>
      </div>
    );
  }

  // Проверяем наличие видео
  const hasVideo = product.videoUrl && product.videoUrl.trim() !== '';

  // Создаем слайды
  const slides = [
    { type: 'image', src: product.image, alt: product.name },
    ...(hasVideo ? [{ type: 'video', label: 'Видео о товаре' }] : []),
  ];

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowVideo(false);
  };

  // Функция для извлечения PV из цены партнёра
  const getPV = (pricePartner) => {
    if (typeof pricePartner === 'string') {
      const match = pricePartner.match(/(\d+(?:[.,]\d+)?)\s*pv/i);
      return match ? parseFloat(match[1].replace(',', '.')) : null;
    }
    return null;
  };

  const pvValue = getPV(product.pricePartner);

  return (
    <div className={styles.productDetail} itemScope itemType="https://schema.org/Product">
      {/* Метатеги для продукта */}
      {seoData && (
        <MetaTags
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          ogTitle={seoData.title}
          ogDescription={seoData.description}
          ogImage={seoData.ogImage}
          ogUrl={currentUrl}
          ogType={seoData.ogType}
          twitterCard="summary_large_image"
          twitterTitle={seoData.title}
          twitterDescription={seoData.description}
          canonical={seoData.canonical}
        />
      )}

      {/* Структурированные данные для продукта */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.shortDescription || product.description?.substring(0, 200),
            image: product.image,
            brand: {
              '@type': 'Brand',
              name: seoData?.brand || 'GreenLeaf',
            },
            category: seoData?.category || 'Косметика',
            sku: product.id.toString(),
            mpn: product.id.toString(),
            offers: {
              '@type': 'Offer',
              price: product.priceRetail,
              priceCurrency: 'RUB',
              priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                .toISOString()
                .split('T')[0],
              availability: 'https://schema.org/InStock',
              url: seoData?.canonical,
              seller: {
                '@type': 'Organization',
                name: 'GreenLeaf',
              },
            },
            review: {
              '@type': 'Review',
              reviewRating: {
                '@type': 'Rating',
                ratingValue: '5',
                bestRating: '5',
              },
              author: {
                '@type': 'Person',
                name: 'Клиент GreenLeaf',
              },
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              reviewCount: '125',
            },
          }),
        }}
      />

      {/* Breadcrumb микроразметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
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
                name: 'Каталог',
                item: 'https://greenleaf.com/catalog',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: seoData?.category || 'Категория',
                item: `https://greenleaf.com/catalog/${product.category}`,
              },
              {
                '@type': 'ListItem',
                position: 4,
                name: product.name,
                item: seoData?.canonical,
              },
            ],
          }),
        }}
      />

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Назад
      </button>

      <div className={styles.productContainer}>
        {/* Левая часть - слайдер */}
        <div className={styles.imageSection}>
          <div className={styles.sliderWrapper}>
            <div
              className={styles.slider}
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className={styles.slide}>
                  {slide.type === 'image' ? (
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className={styles.slideImage}
                      itemProp="image"
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.videoSlide}>
                      <div className={styles.videoThumbnail}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={styles.thumbnailImage}
                          loading="lazy"
                        />
                        <div className={styles.videoOverlay}>
                          <button
                            className={styles.videoButton}
                            onClick={handleVideoClick}
                            aria-label="Посмотреть видео"
                          >
                            <div className={styles.playIconWrapper}>
                              <svg
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                              </svg>
                            </div>
                            <span className={styles.videoButtonText}>Смотреть видео</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {slides.length > 1 && (
              <>
                <button
                  className={styles.sliderButton}
                  onClick={prevSlide}
                  aria-label="Предыдущий слайд"
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
                <button
                  className={`${styles.sliderButton} ${styles.next}`}
                  onClick={nextSlide}
                  aria-label="Следующий слайд"
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

                <div className={styles.sliderDots}>
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`${styles.dot} ${currentSlide === index ? styles.active : ''}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Слайд ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Правая часть - информация */}
        <div className={styles.infoSection}>
          <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
            <Link to="/" itemProp="item">
              <span itemProp="name">Главная</span>
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={`/catalog/${product.category}`} itemProp="item">
              <span itemProp="name">Каталог</span>
            </Link>
            <span aria-hidden="true">/</span>
            <span className={styles.currentPage} itemProp="name">
              {product.name}
            </span>
          </nav>

          <h1 className={styles.productTitle} itemProp="name">
            {product.name}
          </h1>

          <div className={styles.prices}>
            <div
              className={styles.priceItem}
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <span className={styles.priceLabel}>Розничная цена:</span>
              <span className={styles.retailPrice}>
                <meta itemProp="priceCurrency" content="RUB" />
                <meta itemProp="price" content={product.priceRetail} />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <span itemProp="price">{product.priceRetail}</span> ₽
              </span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Партнёрская цена:</span>
              <span className={styles.partnerPrice}>{product.pricePartner}</span>
            </div>
          </div>

          {/* Скрытая информация для микроразметки */}
          <div style={{ display: 'none' }}>
            <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
              <span itemProp="name">{seoData?.brand || 'GreenLeaf'}</span>
            </div>
            <div itemProp="category">{seoData?.category || 'Косметика'}</div>
            <span itemProp="sku">{product.id}</span>
            <span itemProp="mpn">{product.id}</span>
          </div>

          <div className={styles.description}>
            <h2>Описание</h2>
            <div className={styles.descriptionContent} itemProp="description">
              {displayedLines.map((line, index) => {
                // Проверяем, является ли строка заголовком
                const isBold =
                  line.includes('**') ||
                  /^(ОБЪЕМ|SEALUXE|GREENLEAF|CARICH|KARDLI|Особенности продукта|Способ применения|Результат|Активные ингредиенты)/i.test(
                    line,
                  );

                // Проверяем нумерованные пункты и извлекаем номер
                const numberedMatch = line.match(/^([①-⑨])\s*(.*)/);
                const isNumbered = !!numberedMatch;
                const numberSymbol = numberedMatch ? numberedMatch[1] : null;

                // Проверяем маркированные пункты
                const isBullet = /^➤/.test(line);

                // Убираем маркеры форматирования
                let cleanLine = line.replace(/\*\*/g, '').trim();

                // Если это нумерованный пункт, убираем символ из текста
                if (isNumbered && numberedMatch) {
                  cleanLine = numberedMatch[2].trim();
                }

                if (!cleanLine) return null;

                return (
                  <p
                    key={index}
                    className={`${styles.descriptionLine} ${isBold ? styles.bold : ''} ${
                      isNumbered ? styles.numbered : ''
                    } ${isBullet ? styles.bullet : ''}`}
                    data-number={numberSymbol || undefined}
                  >
                    {cleanLine}
                  </p>
                );
              })}
              {shouldShowExpandButton && (
                <button
                  className={styles.expandButton}
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                >
                  {isDescriptionExpanded ? (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                      Скрыть
                    </>
                  ) : (
                    <>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                      Подробнее
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Социальные сети */}
          <div className={styles.socialSection}>
            <h3>Свяжитесь с нами</h3>
            <div className={styles.socialLinks}>
              <a
                href="https://t.me/bogswet"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Telegram"
              >
                <img src={iconTG} alt="Telegram" loading="lazy" />
                <span>Telegram</span>
              </a>
              <a
                href="https://max.ru/u/f9LHodD0cOIdOGkS4p4ftvX_YNO5bFmqBrFXxf1rbuIimZb7BldA2oS2UQY"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Max"
              >
                <img src={iconMax} alt="Max" loading="lazy" />
                <span>Max</span>
              </a>
              <a href="mailto:swetbog72@gmail.com" className={styles.socialLink} aria-label="Email">
                <img src={iconMail} alt="Email" loading="lazy" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Скрытая SEO информация */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h2>Купить {product.name} в интернет-магазине GreenLeaf</h2>
        <p>
          {product.name} - качественный продукт от компании GreenLeaf по цене {product.priceRetail}{' '}
          ₽.
          {pvValue && ` Партнерская цена включает ${pvValue} PV.`}
        </p>
        <p>
          Доставка по всей России. Оригинальная продукция с гарантией качества.
          {product.category && ` Категория: ${seoData?.category}.`}
        </p>
        <p>
          Заказать {product.name} можно через Telegram, Max или по электронной почте. Консультация
          по подбору продукции и вопросам партнерства.
        </p>
      </div>

      {/* Модальное окно для видео */}
      {showVideo && hasVideo && (
        <div className={styles.videoModal} onClick={closeModal}>
          <div className={styles.videoContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal} aria-label="Закрыть">
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

            <div className={styles.videoContainer}>
              <video
                ref={videoRef}
                className={styles.videoPlayer}
                src={product.videoUrl}
                controls
                autoPlay
                onLoadedData={handleVideoLoaded}
                playsInline
                poster={product.image}
                itemProp="video"
                itemScope
                itemType="https://schema.org/VideoObject"
              >
                <meta itemProp="name" content={`Видеообзор ${product.name}`} />
                <meta itemProp="description" content={`Видеообзор продукта ${product.name}`} />
                <meta itemProp="thumbnailUrl" content={product.image} />
                <meta itemProp="uploadDate" content="2023-01-01" />
                Ваш браузер не поддерживает видео.
                <a href={product.videoUrl}>Скачайте видео</a>
              </video>

              {!isVideoLoaded && (
                <div className={styles.videoLoading}>
                  <div className={styles.spinner}></div>
                  <p>Загрузка видео...</p>
                </div>
              )}
            </div>

            <div className={styles.videoInfoModal}>
              <h4>{product.name}</h4>
              <p>Видеообзор продукта</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
