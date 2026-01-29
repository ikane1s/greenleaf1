import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../../data/products.json';
import styles from './Catalog.module.scss';

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

// Словарь для красивых названий категорий
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

// Словарь для описаний категорий
const categoryDescriptions = {
  'facial-skin-care':
    'Купить средства для ухода за кожей лица: кремы, сыворотки, тоники, маски. Натуральная косметика для всех типов кожи. Доставка по всей России.',
  'decorative-cosmetics':
    'Декоративная косметика: помады, тени, тональные средства, тушь. Качественная косметика для создания идеального образа. Широкий выбор.',
  'body-skin-care':
    'Средства для ухода за телом: лосьоны, скрабы, масла, кремы. Уход за кожей тела с натуральными компонентами. Увлажнение и питание.',
  'hair-care':
    'Шампуни, бальзамы, маски и сыворотки для волос. Профессиональный уход за всеми типами волос. Восстановление и укрепление.',
  'oral-hygiene':
    'Зубные пасты, щетки, ополаскиватели для полости рта. Комплексный уход за здоровьем зубов и десен. Профилактика кариеса.',
  'personal-hygiene':
    'Средства личной гигиены: дезодоранты, мыло, гели для душа. Натуральные и безопасные продукты для ежедневного ухода.',
  'products-for-children':
    'Товары для детей: косметика, средства гигиены, уход. Безопасные продукты для самых маленьких. Гипоаллергенные составы.',
  health:
    'Витамины, БАДы, средства для поддержания здоровья. Натуральные добавки для укрепления иммунитета и общего тонуса организма.',
  'eco-friendly-laundry-products':
    'Экологичные средства для стирки: порошки, кондиционеры, пятновыводители. Безопасно для вас, вашей семьи и природы.',
  'eco-friendly-home-remedies':
    'Эко-средства для уборки дома: моющие средства, спреи, концентраты. Эффективно и экологично. Без вредной химии.',
};

// Словарь для ключевых слов
const categoryKeywords = {
  'facial-skin-care':
    'уход за кожей лица, крем для лица, сыворотка, тоник, маска, натуральная косметика, купить косметику, skincare',
  'decorative-cosmetics':
    'декоративная косметика, помада, тени, тональный крем, тушь, макияж, купить косметику, бьюти, makeup',
  'body-skin-care':
    'уход за телом, лосьон для тела, скраб, масло для тела, крем для тела, увлажнение кожи, купить',
  'hair-care':
    'уход за волосами, шампунь, бальзам, маска для волос, сыворотка, восстановление волос, купить',
  'oral-hygiene':
    'гигиена полости рта, зубная паста, зубная щетка, ополаскиватель, уход за зубами, стоматология',
  'personal-hygiene':
    'личная гигиена, дезодорант, мыло, гель для душа, средства гигиены, ежедневный уход',
  'products-for-children':
    'товары для детей, детская косметика, гигиена для детей, безопасные средства, уход за ребенком',
  health: 'здоровье, витамины, БАДы, добавки, иммунитет, укрепление здоровья, wellness',
  'eco-friendly-laundry-products':
    'эко средства для стирки, экологичный порошок, кондиционер для белья, пятновыводитель, экологичная стирка',
  'eco-friendly-home-remedies':
    'эко средства для дома, моющие средства, экологичная уборка, безопасная химия, уборка дома',
};

const SORT_OPTIONS_CUSTOMER = {
  priceAsc: { label: 'Цена: по возрастанию', value: 'priceAsc' },
  priceDesc: { label: 'Цена: по убыванию', value: 'priceDesc' },
  nameAsc: { label: 'Название: А-Я', value: 'nameAsc' },
  nameDesc: { label: 'Название: Я-А', value: 'nameDesc' },
};

const SORT_OPTIONS_PARTNER = {
  priceAsc: { label: 'Цена партнёра: по возрастанию', value: 'priceAsc' },
  priceDesc: { label: 'Цена партнёра: по убыванию', value: 'priceDesc' },
  nameAsc: { label: 'Название: А-Я', value: 'nameAsc' },
  nameDesc: { label: 'Название: Я-А', value: 'nameDesc' },
};

const PRODUCTS_PER_PAGE = 12;

// Функция для извлечения числового значения цены партнёра
const getPriceValue = (pricePartner) => {
  if (typeof pricePartner === 'number') return pricePartner;
  if (typeof pricePartner === 'string') {
    const match = pricePartner.match(/^(\d+)/);
    return match ? Number(match[1]) : 0;
  }
  return 0;
};

// Функция для получения PV из цены
const getPV = (pricePartner) => {
  if (typeof pricePartner === 'string') {
    const match = pricePartner.match(/(\d+(?:[.,]\d+)?)\s*pv/i);
    return match ? parseFloat(match[1].replace(',', '.')) : null;
  }
  return null;
};

const Catalog = ({ currentPage, setCurrentPage }) => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('customer');
  const [sortBy, setSortBy] = useState('priceAsc');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [pvFilter, setPvFilter] = useState({ min: '', max: '' });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Получаем нормальное название категории
  const categoryName = categoryMap[category] || 'Каталог';
  const categoryDescription =
    categoryDescriptions[category] ||
    `Купить товары категории ${categoryName}. Большой выбор, выгодные цены, доставка по всей России.`;
  const categoryKeywordsText =
    `${categoryKeywords[category] || categoryName}, greenleaf, greenleaf новосибирск, гринлиф, гринлиф новосибирск, купить, цена, интернет-магазин, доставка, косметика новосибирск`;

  // Получаем URL для канонической ссылки
  const baseUrl = 'https://greenleaf.com';
  const canonicalUrl = `${baseUrl}/catalog/${category}`;
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : `/catalog/${category}`;

  // Получаем изображение для OG
  const getCategoryImage = () => {
    const firstProduct = categoryProducts[0];
    return firstProduct?.image || `${baseUrl}/og-default.jpg`;
  };

  // Фильтруем товары по категории
  const categoryProducts = useMemo(() => {
    return productsData.filter((product) => product.category === category);
  }, [category]);

  // Применяем фильтры и сортировку
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Фильтр по цене (розничной для покупателей, партнёрской для партнёров)
    if (priceFilter.min) {
      if (userType === 'customer') {
        filtered = filtered.filter((p) => p.priceRetail >= Number(priceFilter.min));
      } else {
        filtered = filtered.filter((p) => getPriceValue(p.pricePartner) >= Number(priceFilter.min));
      }
    }
    if (priceFilter.max) {
      if (userType === 'customer') {
        filtered = filtered.filter((p) => p.priceRetail <= Number(priceFilter.max));
      } else {
        filtered = filtered.filter((p) => getPriceValue(p.pricePartner) <= Number(priceFilter.max));
      }
    }

    // Фильтр по PV (только для партнёров)
    if (userType === 'partner') {
      if (pvFilter.min) {
        filtered = filtered.filter((p) => {
          const pv = getPV(p.pricePartner);
          return pv !== null && pv >= Number(pvFilter.min);
        });
      }
      if (pvFilter.max) {
        filtered = filtered.filter((p) => {
          const pv = getPV(p.pricePartner);
          return pv !== null && pv <= Number(pvFilter.max);
        });
      }
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          if (userType === 'customer') {
            return a.priceRetail - b.priceRetail;
          } else {
            return getPriceValue(a.pricePartner) - getPriceValue(b.pricePartner);
          }
        case 'priceDesc':
          if (userType === 'customer') {
            return b.priceRetail - a.priceRetail;
          } else {
            return getPriceValue(b.pricePartner) - getPriceValue(a.pricePartner);
          }
        case 'nameAsc':
          return a.name.localeCompare(b.name, 'ru');
        case 'nameDesc':
          return b.name.localeCompare(a.name, 'ru');
        default:
          return 0;
      }
    });

    return filtered;
  }, [categoryProducts, sortBy, priceFilter, pvFilter, userType]);

  // Пагинация
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePriceFilterChange = (field, value) => {
    setPriceFilter((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handlePvFilterChange = (field, value) => {
    setPvFilter((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setPriceFilter({ min: '', max: '' });
    setPvFilter({ min: '', max: '' });
    setSortBy('priceAsc');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    priceFilter.min || priceFilter.max || pvFilter.min || pvFilter.max || sortBy !== 'priceAsc';

  // Функция для генерации страниц пагинации
  const getPaginationPages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const sortOptions = userType === 'customer' ? SORT_OPTIONS_CUSTOMER : SORT_OPTIONS_PARTNER;

  // Формируем заголовок с учетом пагинации
  const getPageTitle = () => {
    if (currentPage === 1) {
      return `${categoryName} - GreenLeaf`;
    } else {
      return `${categoryName} - Страница ${currentPage} | GreenLeaf`;
    }
  };

  // Формируем описание с учетом пагинации
  const getPageDescription = () => {
    if (currentPage === 1) {
      return categoryDescription;
    } else {
      return `Страница ${currentPage} категории "${categoryName}". ${categoryDescription}`;
    }
  };

  // Формируем каноническую ссылку с учетом пагинации
  const getCanonicalUrl = () => {
    if (currentPage === 1) {
      return canonicalUrl;
    } else {
      return `${canonicalUrl}?page=${currentPage}`;
    }
  };

  return (
    <div className={styles.catalog}>
      {/* Метатеги - не визуальный компонент */}
      <MetaTags
        title={getPageTitle()}
        description={getPageDescription()}
        keywords={categoryKeywordsText}
        ogTitle={getPageTitle()}
        ogDescription={getPageDescription()}
        ogImage={getCategoryImage()}
        ogUrl={`${baseUrl}${currentPath}`}
        ogType="website"
        twitterCard="summary_large_image"
        twitterTitle={getPageTitle()}
        twitterDescription={getPageDescription()}
        canonical={getCanonicalUrl()}
      />

      {/* Структурированные данные для категории - скрытые */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: categoryName,
            description: categoryDescription,
            url: canonicalUrl,
            numberOfItems: filteredAndSortedProducts.length,
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: paginatedProducts.length,
              itemListElement: paginatedProducts.map((product, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                  '@type': 'Product',
                  name: product.name,
                  description: product.shortDescription || product.description,
                  image: product.image,
                  url: `${baseUrl}/product/${product.id}`,
                  offers: {
                    '@type': 'Offer',
                    price: product.priceRetail,
                    priceCurrency: 'RUB',
                    availability: 'https://schema.org/InStock',
                  },
                },
              })),
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Главная',
                  item: baseUrl,
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Каталог',
                  item: `${baseUrl}/catalog`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: categoryName,
                  item: canonicalUrl,
                },
              ],
            },
          }),
        }}
      />

      <h1 className={styles.title}>{categoryName}</h1>

      {/* Кнопка для открытия фильтров на мобильных устройствах */}
      <button
        className={styles.mobileFiltersButton}
        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        aria-label="Открыть фильтры"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 6h18M7 12h10M11 18h2" />
        </svg>
        <span>Фильтры и сортировка</span>
        {isFiltersOpen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        )}
      </button>

      {/* Overlay для закрытия фильтров на мобильных */}
      {isFiltersOpen && (
        <div
          className={styles.filtersOverlay}
          onClick={() => setIsFiltersOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={styles.catalogLayout}>
        {/* Боковая панель фильтров */}
        <aside className={`${styles.sidebar} ${isFiltersOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>Фильтры</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {hasActiveFilters && (
                <button className={styles.resetButton} onClick={resetFilters}>
                  Сбросить
                </button>
              )}
              {/* Кнопка закрытия на мобильных */}
              <button
                className={styles.closeFiltersButton}
                onClick={() => setIsFiltersOpen(false)}
                aria-label="Закрыть фильтры"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Переключатель типа пользователя */}
          <div className={styles.filterSection}>
            <h3>Для кого фильтрация</h3>
            <div className={styles.userTypeToggle}>
              <button
                className={`${styles.toggleButton} ${userType === 'customer' ? styles.active : ''}`}
                onClick={() => {
                  setUserType('customer');
                  resetFilters();
                }}
              >
                Покупатель
              </button>
              <button
                className={`${styles.toggleButton} ${userType === 'partner' ? styles.active : ''}`}
                onClick={() => {
                  setUserType('partner');
                  resetFilters();
                }}
              >
                Партнёр
              </button>
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Сортировка</h3>
            <select value={sortBy} onChange={handleSortChange} className={styles.sortSelect}>
              {Object.values(sortOptions).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <h3>{userType === 'customer' ? 'Розничная цена (₽)' : 'Цена партнёра (₽)'}</h3>
            <div className={styles.rangeInputs}>
              <input
                type="number"
                placeholder="От"
                value={priceFilter.min}
                onChange={(e) => handlePriceFilterChange('min', e.target.value)}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="До"
                value={priceFilter.max}
                onChange={(e) => handlePriceFilterChange('max', e.target.value)}
                min="0"
              />
            </div>
          </div>

          {userType === 'partner' && (
            <div className={styles.filterSection}>
              <h3>PV (баллы)</h3>
              <div className={styles.rangeInputs}>
                <input
                  type="number"
                  placeholder="От"
                  value={pvFilter.min}
                  onChange={(e) => handlePvFilterChange('min', e.target.value)}
                  min="0"
                  step="0.1"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="До"
                  value={pvFilter.max}
                  onChange={(e) => handlePvFilterChange('max', e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          )}

          {userType === 'customer' && (
            <div className={styles.filterSection}>
              <h3>Быстрые фильтры по цене</h3>
              <div className={styles.quickFilters}>
                <button
                  className={styles.quickFilterBtn}
                  onClick={() => {
                    setPriceFilter({ min: '', max: '500' });
                    setCurrentPage(1);
                  }}
                >
                  До 500 ₽
                </button>
                <button
                  className={styles.quickFilterBtn}
                  onClick={() => {
                    setPriceFilter({ min: '500', max: '1000' });
                    setCurrentPage(1);
                  }}
                >
                  500-1000 ₽
                </button>
                <button
                  className={styles.quickFilterBtn}
                  onClick={() => {
                    setPriceFilter({ min: '1000', max: '' });
                    setCurrentPage(1);
                  }}
                >
                  От 1000 ₽
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Основной контент */}
        <main className={styles.mainContent}>
          {/* Скрытая SEO информация */}
          <div style={{ display: 'none' }}>
            <p>
              В категории "{categoryName}" представлено {filteredAndSortedProducts.length} товаров.
              {userType === 'customer'
                ? ' Все товары доступны по розничным ценам с доставкой по всей России.'
                : ' Для партнеров доступны специальные цены с PV (партнерскими баллами).'}
            </p>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <>
              <div className={styles.products}>
                {paginatedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    onClick={() => navigate(`/product/${product.id}`)}
                    itemScope
                    itemType="https://schema.org/Product"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.productImage}
                      itemProp="image"
                      loading="lazy"
                    />
                    <h3 className={styles.productName} itemProp="name">
                      {product.name}
                    </h3>
                    <div className={styles.productPrices}>
                      <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>Розница:</span>
                        <span
                          className={styles.retailPriceMain}
                          itemProp="offers"
                          itemScope
                          itemType="https://schema.org/Offer"
                        >
                          <meta itemProp="priceCurrency" content="RUB" />
                          <meta itemProp="price" content={product.priceRetail} />
                          <meta itemProp="availability" content="https://schema.org/InStock" />
                          {product.priceRetail} ₽
                        </span>
                      </div>
                      {product.pricePartner && (
                        <div className={styles.priceRow}>
                          <span className={styles.priceLabel}>Партнёр:</span>
                          <span className={styles.partnerPriceMain}>{product.pricePartner}</span>
                        </div>
                      )}
                    </div>
                    {/* Скрытое описание для микроразметки */}
                    <div style={{ display: 'none' }}>
                      <span itemProp="description">
                        {product.shortDescription || product.description}
                      </span>
                      <span itemProp="category">{categoryName}</span>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                    disabled={currentPage === 1}
                    aria-label="Предыдущая страница"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <div className={styles.paginationPages}>
                    {getPaginationPages().map((page, index) =>
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          className={`${styles.paginationPage} ${
                            currentPage === page ? styles.active : ''
                          }`}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({
                              top: 0,
                              behavior: 'smooth',
                            });
                          }}
                          aria-label={`Страница ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    className={styles.paginationButton}
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      });
                    }}
                    disabled={currentPage === totalPages}
                    aria-label="Следующая страница"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}

              <div className={styles.resultsInfo}>
                Показано {paginatedProducts.length} из {filteredAndSortedProducts.length} товаров
              </div>
            </>
          ) : (
            <p className={styles.noProducts}>Товары не найдены. Попробуйте изменить фильтры.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
