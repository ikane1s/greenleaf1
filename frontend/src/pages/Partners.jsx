import React, { useState, useEffect } from 'react';
import styles from './Partners.module.scss';
import { FaDollarSign, FaChartLine, FaGift, FaHandshake, FaGlobe, FaStar } from 'react-icons/fa';
import { formatPhoneNumber, getCleanPhoneNumber } from '../utils/phoneFormatter';
import API_URL from '../config.js';

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

const Partners = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    phone: '',
    isPartner: '',
    goal: '',
    consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // SEO данные для страницы
  const seoData = {
    title: 'Партнерская программа GreenLeaf | Стать партнером',
    description:
      'Присоединяйтесь к партнерской программе GreenLeaf. Скидки до 50%, пассивный доход, обучение и поддержка. Заполните заявку на партнерство.',
    keywords:
      'партнерская программа GreenLeaf, стать партнером, MLM бизнес, сетевик, партнерство, дополнительный доход, работа на себя, GreenLeaf партнер',
    ogImage: 'https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png',
    canonical: 'https://greenleaf.com/become-a-partners',
  };

  // Текущий URL для OG
  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : seoData.canonical;

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    // Получаем чистый номер (только цифры)
    const cleanPhone = getCleanPhoneNumber(phone);
    // Проверяем, что номер начинается с 7 и имеет 11 цифр
    return /^7\d{10}$/.test(cleanPhone);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Автоматическое форматирование для поля телефона
    let processedValue = value;
    if (name === 'phone' && type === 'tel') {
      processedValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }

    // Email необязателен, но если указан, должен быть корректным
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (!formData.isPartner) {
      newErrors.isPartner = 'Выберите вариант';
    }

    if (formData.isPartner === 'yes' && !formData.goal) {
      newErrors.goal = 'Выберите цель';
    }

    if (!formData.consent) {
      newErrors.consent = 'Необходимо согласие на обработку данных';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (formData.isPartner === 'yes') {
      return;
    }

    setIsSubmitting(true);

    try {
      // Отправляем чистый номер телефона (только цифры)
      const cleanPhone = getCleanPhoneNumber(formData.phone);

      const response = await fetch(`${API_URL}/partner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          phone: cleanPhone,
          email: formData.email,
          goal: formData.goal,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при отправке формы');
      }

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            lastName: '',
            firstName: '',
            middleName: '',
            email: '',
            phone: '',
            isPartner: '',
            goal: '',
            consent: false,
          });
        }, 3000);
      } else {
        throw new Error(data.error || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setErrors({ submit: 'Произошла ошибка. Попробуйте позже.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = formData.isPartner !== 'no' || !formData.consent || isSubmitting;

  return (
    <div className={styles.partners}>
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

      {/* Структурированные данные для страницы */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Партнерская программа GreenLeaf',
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
                  name: 'Стать партнером',
                  item: seoData.canonical,
                },
              ],
            },
            mainEntity: {
              '@type': 'ContactPage',
            },
          }),
        }}
      />

      {/* Структурированные данные для формы */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'GreenLeaf',
            url: 'https://greenleaf.com',
            email: 'info@greenleaf.com',
            telephone: '+7 (800) 123-45-67',
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'Customer service',
              telephone: '+7 (800) 123-45-67',
              email: 'info@greenleaf.com',
              availableLanguage: ['Russian'],
              contactOption: 'TollFree',
            },
          }),
        }}
      />

      {/* Структурированные данные для партнерской программы */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: 'Партнерская программа GreenLeaf',
            description: 'Предложения для партнеров компании GreenLeaf',
            numberOfItems: 6,
            itemListElement: [
              {
                '@type': 'Offer',
                name: 'Скидка до 50%',
                description: 'Приобретайте продукцию со скидкой до 50% от розничной цены',
              },
              {
                '@type': 'Offer',
                name: 'Пассивный доход',
                description: 'Стройте свой бизнес и получайте дополнительный доход',
              },
              {
                '@type': 'Offer',
                name: 'Бонусы и подарки',
                description: 'Участвуйте в акциях, получайте бонусы и ценные подарки',
              },
              {
                '@type': 'Offer',
                name: 'Поддержка команды',
                description: 'Обучающие материалы и поддержка на всех этапах',
              },
              {
                '@type': 'Offer',
                name: 'Гибкий график',
                description: 'Работайте в удобное для вас время из любой точки мира',
              },
              {
                '@type': 'Offer',
                name: 'Статус и признание',
                description: 'Достигайте новых уровней и получайте особые привилегии',
              },
            ],
          }),
        }}
      />

      {isSubmitted && (
        <div className={styles.successNotification}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <span>Заявка отправлена!</span>
          </div>
        </div>
      )}
      <h1>Стать партнёром</h1>
      <div className={styles.content}>
        <p className={styles.intro}>
          Присоединяйтесь к нашей партнёрской программе и получите доступ к специальным ценам и
          условиям сотрудничества.
        </p>

        {/* Видео секция */}
        <div className={styles.videoSection}>
          <div className={styles.videoContainer}>
            <video
              controls
              className={styles.video}
              poster="https://greenleaf-catalog.ru/wp-content/uploads/2025/02/logo.png"
              aria-label="Видео о партнерской программе GreenLeaf"
              preload="metadata"
            >
              <source src="https://green-leaf.shop/GREENLEAF.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        </div>

        {/* Преимущества партнёрства */}
        <div className={styles.benefits}>
          <h2>Преимущества партнёрства</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
              <div className={styles.benefitIcon}>
                <FaDollarSign />
              </div>
              <h3 itemProp="name">Скидка до 50%</h3>
              <p itemProp="description">
                Приобретайте продукцию со скидкой до 50% от розничной цены
              </p>
            </div>
            <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
              <div className={styles.benefitIcon}>
                <FaChartLine />
              </div>
              <h3 itemProp="name">Пассивный доход</h3>
              <p itemProp="description">Стройте свой бизнес и получайте дополнительный доход</p>
            </div>
            <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
              <div className={styles.benefitIcon}>
                <FaGift />
              </div>
              <h3 itemProp="name">Бонусы и подарки</h3>
              <p itemProp="description">Участвуйте в акциях, получайте бонусы и ценные подарки</p>
            </div>
            <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
              <div className={styles.benefitIcon}>
                <FaHandshake />
              </div>
              <h3 itemProp="name">Поддержка команды</h3>
              <p itemProp="description">Обучающие материалы и поддержка на всех этапах</p>
            </div>
            <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
              <div className={styles.benefitIcon}>
                <FaGlobe />
              </div>
              <h3 itemProp="name">Гибкий график</h3>
              <p itemProp="description">Работайте в удобное для вас время из любой точки мира</p>
            </div>
            <div className={styles.benefitCard} itemScope itemType="https://schema.org/Offer">
              <div className={styles.benefitIcon}>
                <FaStar />
              </div>
              <h3 itemProp="name">Статус и признание</h3>
              <p itemProp="description">Достигайте новых уровней и получайте особые привилегии</p>
            </div>
          </div>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          itemScope
          itemType="https://schema.org/ContactPage"
        >
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">
                Фамилия <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? styles.error : ''}
                placeholder="Введите фамилию"
                itemProp="familyName"
                required
              />
              {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="firstName">
                Имя <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? styles.error : ''}
                placeholder="Введите имя"
                itemProp="givenName"
                required
              />
              {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="middleName">Отчество</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Введите отчество (необязательно)"
              itemProp="additionalName"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.error : ''}
                placeholder="example@mail.com (необязательно)"
                itemProp="email"
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">
                Номер телефона <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? styles.error : ''}
                placeholder="+7 (___) ___-__-__"
                itemProp="telephone"
                required
              />
              {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              Вы уже партнёр компании? <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="isPartner"
                  value="yes"
                  checked={formData.isPartner === 'yes'}
                  onChange={handleChange}
                  required
                />
                <span>Да</span>
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="isPartner"
                  value="no"
                  checked={formData.isPartner === 'no'}
                  onChange={handleChange}
                  required
                />
                <span>Нет</span>
              </label>
            </div>
            {errors.isPartner && <span className={styles.errorMessage}>{errors.isPartner}</span>}
          </div>

          {formData.isPartner === 'yes' && (
            <div className={styles.infoMessage}>
              <p>Если вы уже являетесь партнёром компании, то заполнять форму не нужно</p>
            </div>
          )}

          {formData.isPartner === 'no' && (
            <div className={styles.formGroup}>
              <label>
                Цель <span className={styles.required}>*</span>
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goal"
                    value="business"
                    checked={formData.goal === 'business'}
                    onChange={handleChange}
                    required
                  />
                  <span>Бизнес</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goal"
                    value="discount"
                    checked={formData.goal === 'discount'}
                    onChange={handleChange}
                    required
                  />
                  <span>Скидка на продукт</span>
                </label>
              </div>
              {errors.goal && <span className={styles.errorMessage}>{errors.goal}</span>}
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                className={errors.consent ? styles.error : ''}
                required
              />
              <span>
                Я согласен(а) на обработку персональных данных{' '}
                <span className={styles.required}>*</span>
              </span>
            </label>
            {errors.consent && <span className={styles.errorMessage}>{errors.consent}</span>}
          </div>

          {errors.submit && <div className={styles.submitError}>{errors.submit}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitDisabled}
            itemProp="potentialAction"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>

      {/* Скрытая SEO информация */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h2>Партнерская программа GreenLeaf</h2>
        <p>
          Компания GreenLeaf предлагает выгодные условия сотрудничества в рамках партнерской
          программы. Станьте партнером компании и получайте скидки до 50% на продукцию, возможность
          построения собственного бизнеса и пассивного дохода.
        </p>
        <p>
          Наша партнерская программа подходит как для тех, кто хочет просто покупать продукцию со
          скидкой, так и для тех, кто планирует построить серьезный бизнес в сфере сетевого
          маркетинга.
        </p>
        <h3>Ключевые преимущества для партнеров:</h3>
        <ul>
          <li>Высокие скидки на продукцию GreenLeaf</li>
          <li>Обучение и поддержка от опытных наставников</li>
          <li>Гибкий график работы из любой точки мира</li>
          <li>Маркетинговые материалы и инструменты для продвижения</li>
          <li>Бонусная программа и мотивационные поездки</li>
          <li>Карьерный рост и лидерские позиции</li>
        </ul>
        <p>
          Для того чтобы стать партнером GreenLeaf, заполните форму на этой странице. Наш менеджер
          свяжется с вами в течение 24 часов для консультации и оформления документов.
        </p>
      </div>
    </div>
  );
};

export default Partners;
