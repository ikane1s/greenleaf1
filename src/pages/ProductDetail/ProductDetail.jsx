import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import productsData from "../../data/products.json";
import styles from "./ProductDetail.module.scss";
import iconTG from "../../assets/iconTG.svg";
import iconMax from "../../assets/iconMax.svg";
import iconMail from "../../assets/iconMail.svg";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVideo, setShowVideo] = useState(false);

  const product = productsData.find((p) => p.id === Number(id));

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

  const handleVideoClick = () => {
    setShowVideo(true);
  };

  return (
    <div className={styles.productDetail}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg
          width="24"
          height="24"
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
        {/* Левая часть - изображение */}
        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.mainImage}
            />
            <div className={styles.imageOverlay}>
              <button
                className={styles.videoButton}
                onClick={handleVideoClick}
                aria-label="Посмотреть видео"
              >
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                <span>Посмотреть видео</span>
              </button>
            </div>
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
              <span className={styles.retailPrice}>
                {product.priceRetail} ₽
              </span>
            </div>
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Партнёрская цена:</span>
              <span className={styles.partnerPrice}>
                {product.pricePartner}
              </span>
            </div>
          </div>

          <div className={styles.description}>
            <h2>Описание</h2>
            <p>
              {product.description ||
                `${product.name} - это высококачественный продукт из нашей линейки натуральной косметики. Изготовлен из экологически чистых ингредиентов, прошедших строгий контроль качества. Продукт подходит для ежедневного использования и обеспечивает эффективный уход за кожей.`}
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🌿</span>
                <span>100% натуральные ингредиенты</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>✨</span>
                <span>Протестировано дерматологами</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>💚</span>
                <span>Эко-дружелюбная упаковка</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🇷🇺</span>
                <span>Производство в России</span>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className={styles.additionalInfo}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>✨</div>
              <div>
                <h3>Качество</h3>
                <p>Натуральные ингредиенты</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🚚</div>
              <div>
                <h3>Доставка</h3>
                <p>Быстрая доставка по всей России</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>💚</div>
              <div>
                <h3>Экологично</h3>
                <p>Эко-дружелюбная продукция</p>
              </div>
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
              <a
                href="mailto:swetbog72@gmail.com"
                className={styles.socialLink}
              >
                <img src={iconMail} alt="Email" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для видео */}
      {showVideo && (
        <div className={styles.videoModal} onClick={() => setShowVideo(false)}>
          <div
            className={styles.videoContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShowVideo(false)}
              aria-label="Закрыть"
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
            <div className={styles.videoPlaceholder}>
              <p>Видео о товаре</p>
              <p className={styles.videoNote}>
                Здесь будет размещено видео с демонстрацией товара
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
