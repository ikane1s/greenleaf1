import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productsData from '../../data/products.json';
import styles from './Catalog.module.scss';

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

const SORT_OPTIONS = {
  priceAsc: { label: 'Цена: по возрастанию', value: 'priceAsc' },
  priceDesc: { label: 'Цена: по убыванию', value: 'priceDesc' },
  nameAsc: { label: 'Название: А-Я', value: 'nameAsc' },
  nameDesc: { label: 'Название: Я-А', value: 'nameDesc' },
};

const PRODUCTS_PER_PAGE = 12;

// Функция для извлечения числового значения цены
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
  const [sortBy, setSortBy] = useState('priceAsc');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
  const [pvFilter, setPvFilter] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Получаем нормальное название категории
  const categoryName = categoryMap[category] || 'Каталог';

  // Фильтруем товары по категории
  const categoryProducts = useMemo(() => {
    return productsData.filter((product) => product.category === category);
  }, [category]);

  // Применяем фильтры и сортировку
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Фильтр по цене партнёра
    if (priceFilter.min) {
      filtered = filtered.filter((p) => getPriceValue(p.pricePartner) >= Number(priceFilter.min));
    }
    if (priceFilter.max) {
      filtered = filtered.filter((p) => getPriceValue(p.pricePartner) <= Number(priceFilter.max));
    }

    // Фильтр по PV
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

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return getPriceValue(a.pricePartner) - getPriceValue(b.pricePartner);
        case 'priceDesc':
          return getPriceValue(b.pricePartner) - getPriceValue(a.pricePartner);
        case 'nameAsc':
          return a.name.localeCompare(b.name, 'ru');
        case 'nameDesc':
          return b.name.localeCompare(a.name, 'ru');
        default:
          return 0;
      }
    });

    return filtered;
  }, [categoryProducts, sortBy, priceFilter, pvFilter]);

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
    const maxVisible = 5; // Максимум видимых страниц

    if (totalPages <= maxVisible) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1);

      if (currentPage <= 3) {
        // В начале списка
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // В конце списка
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // В середине списка
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

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>{categoryName}</h1>

      <div className={styles.catalogLayout}>
        {/* Боковая панель фильтров */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2>Фильтры</h2>
            {hasActiveFilters && (
              <button className={styles.resetButton} onClick={resetFilters}>
                Сбросить
              </button>
            )}
          </div>

          <div className={styles.filterSection}>
            <h3>Сортировка</h3>
            <select value={sortBy} onChange={handleSortChange} className={styles.sortSelect}>
              {Object.values(SORT_OPTIONS).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterSection}>
            <h3>Цена партнёра (₽)</h3>
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
        </aside>

        {/* Основной контент */}
        <main className={styles.mainContent}>
          {/* Результаты */}
          {filteredAndSortedProducts.length > 0 ? (
            <>
              <div className={styles.products}>
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={styles.productCard}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <img src={product.image} alt={product.name} className={styles.productImage} />
                    <h3 className={styles.productName}>{product.name}</h3>
                    {product.description && (
                      <p className={styles.productDescription}>{product.description}</p>
                    )}
                    <div className={styles.productPrices}>
                      <span className={styles.retailPrice}>Розница: {product.priceRetail} ₽</span>
                      <span className={styles.partnerPrice}>Партнёр: {product.pricePartner}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Пагинация */}
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
