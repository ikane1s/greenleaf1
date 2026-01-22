import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productsData from '../../data/products.json';
import styles from './ProductDetail.module.scss';
import iconTG from '../../assets/iconTG.svg';
import iconMax from '../../assets/iconMax.svg';
import iconMail from '../../assets/iconMail.svg';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const videoRef = useRef(null);

  const product = productsData.find((p) => p.id === Number(id));

  // Функция для форматирования описания
  const formatDescription = (text) => {
    if (!text) return [];
    
    let formatted = text;
    
    // Разделяем по специальным маркерам и заголовкам
    formatted = formatted.replace(/(ОБЪЕМ\s+\d+\s*мл)/gi, '\n\n**$1**\n');
    formatted = formatted.replace(/(SEALUXE|GREENLEAF|CARICH|KARDLI)/gi, '\n\n**$1**\n');
    formatted = formatted.replace(/([①-⑨])\s*слой:/g, '\n\n$1 слой:');
    formatted = formatted.replace(/(➤)/g, '\n\n$1');
    formatted = formatted.replace(/(Особенности продукта:|Способ применения:|Результат:|Активные ингредиенты:)/g, '\n\n**$1**\n');
    
    // Разделяем длинные предложения
    formatted = formatted.replace(/\.([А-ЯЁ])/g, '.\n\n$1');
    
    // Убираем множественные переносы
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    // Разбиваем на строки и фильтруем пустые
    const lines = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    return lines;
  };

  const descriptionLines = formatDescription(product?.description);
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

  return (
    <div className={styles.productDetail}>
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
                    <img src={slide.src} alt={slide.alt} className={styles.slideImage} />
                  ) : (
                    <div className={styles.videoSlide}>
                      <div className={styles.videoThumbnail}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className={styles.thumbnailImage}
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
          <div className={styles.breadcrumbs}>
            <Link to="/">Главная</Link>
            <span>/</span>
            <Link to={`/catalog/${product.category}`}>Каталог</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>

          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.prices}>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Розничная цена:</span>
              <span className={styles.retailPrice}>{product.priceRetail} ₽</span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Партнёрская цена:</span>
              <span className={styles.partnerPrice}>{product.pricePartner}</span>
            </div>
          </div>

          <div className={styles.description}>
            <h2>Описание</h2>
            <div className={styles.descriptionContent}>
              {displayedLines.map((line, index) => {
                // Проверяем, является ли строка заголовком
                const isBold = line.includes('**') || 
                              /^(ОБЪЕМ|SEALUXE|GREENLEAF|CARICH|KARDLI|Особенности продукта|Способ применения|Результат|Активные ингредиенты)/i.test(line);
                
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
                    className={`${styles.descriptionLine} ${
                      isBold ? styles.bold : ''
                    } ${
                      isNumbered ? styles.numbered : ''
                    } ${
                      isBullet ? styles.bullet : ''
                    }`}
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                      Скрыть
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              >
                <img src={iconTG} alt="Telegram" />
                <span>Telegram</span>
              </a>
              <a
                href="https://max.ru/u/f9LHodD0cOIdOGkS4p4ftvX_YNO5bFmqBrFXxf1rbuIimZb7BldA2oS2UQY"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <img src={iconMax} alt="Max" />
                <span>Max</span>
              </a>
              <a href="mailto:swetbog72@gmail.com" className={styles.socialLink}>
                <img src={iconMail} alt="Email" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
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
              >
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
