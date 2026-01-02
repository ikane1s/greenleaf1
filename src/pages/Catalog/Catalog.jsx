import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import productsData from "../../data/products.json";
import styles from "./Catalog.module.scss";

// Словарь для красивых названий категорий
const categoryMap = {
  "facial-skin-care": "Уход за кожей лица",
  "decorative-cosmetics": "Декоративная косметика",
  "body-skin-care": "Уход за кожей тела",
  "hair-care": "Уход за волосами",
  "oral-hygiene": "Гигиена полости рта",
  "personal-hygiene": "Личная гигиена",
  "products-for-children": "Товары для детей",
  health: "Здоровье",
  "eco-friendly-laundry-products": "Эко-средства для стирки",
  "eco-friendly-home-remedies": "Эко-средства для дома",
};

const SORT_OPTIONS = {
  priceAsc: { label: "Цена: по возрастанию", value: "priceAsc" },
  priceDesc: { label: "Цена: по убыванию", value: "priceDesc" },
  nameAsc: { label: "Название: А-Я", value: "nameAsc" },
  nameDesc: { label: "Название: Я-А", value: "nameDesc" },
};

const PRODUCTS_PER_PAGE = 6;

const Catalog = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState("priceAsc");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Получаем нормальное название категории
  const categoryName = categoryMap[category] || "Каталог";

  // Фильтруем товары по категории
  const categoryProducts = useMemo(() => {
    return productsData.filter((product) => product.category === category);
  }, [category]);

  // Применяем фильтры и сортировку
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...categoryProducts];

    // Фильтр по цене
    if (priceFilter.min) {
      filtered = filtered.filter(
        (p) => p.pricePartner >= Number(priceFilter.min)
      );
    }
    if (priceFilter.max) {
      filtered = filtered.filter(
        (p) => p.pricePartner <= Number(priceFilter.max)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          return a.pricePartner - b.pricePartner;
        case "priceDesc":
          return b.pricePartner - a.pricePartner;
        case "nameAsc":
          return a.name.localeCompare(b.name, "ru");
        case "nameDesc":
          return b.name.localeCompare(a.name, "ru");
        default:
          return 0;
      }
    });

    return filtered;
  }, [categoryProducts, sortBy, priceFilter]);

  // Пагинация
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / PRODUCTS_PER_PAGE
  );
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );
  }, [filteredAndSortedProducts, currentPage]);

  const handlePriceFilterChange = (field, value) => {
    setPriceFilter((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setPriceFilter({ min: "", max: "" });
    setSortBy("priceAsc");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    priceFilter.min || priceFilter.max || sortBy !== "priceAsc";

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>{categoryName}</h1>

      {/* Панель фильтров и сортировки */}
      <div className={styles.controls}>
        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Фильтры"
        >
          <span>🔍</span>
          Фильтры
          {hasActiveFilters && <span className={styles.filterBadge}></span>}
        </button>

        <div className={styles.sortContainer}>
          <label htmlFor="sort">Сортировка:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className={styles.sortSelect}
          >
            {Object.values(SORT_OPTIONS).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Панель фильтров (раскрывающаяся) */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filterGroup}>
            <label>Цена (₽):</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder="От"
                value={priceFilter.min}
                onChange={(e) => handlePriceFilterChange("min", e.target.value)}
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="До"
                value={priceFilter.max}
                onChange={(e) => handlePriceFilterChange("max", e.target.value)}
                min="0"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button className={styles.resetButton} onClick={resetFilters}>
              Сбросить фильтры
            </button>
          )}
        </div>
      )}

      {/* Результаты */}
      {filteredAndSortedProducts.length > 0 ? (
        <>
          <div className={styles.products}>
            {paginatedProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>
                  {product.description}
                </p>
                <div className={styles.productPrices}>
                  <span className={styles.retailPrice}>
                    Розница: {product.priceRetail} ₽
                  </span>
                  <span className={styles.partnerPrice}>
                    Партнёр: {product.pricePartner} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.paginationButton}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Назад
              </button>

              <div className={styles.paginationPages}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`${styles.paginationPage} ${
                        currentPage === page ? styles.active : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className={styles.paginationButton}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Вперёд →
              </button>
            </div>
          )}

          <div className={styles.resultsInfo}>
            Показано {paginatedProducts.length} из{" "}
            {filteredAndSortedProducts.length} товаров
          </div>
        </>
      ) : (
        <p className={styles.noProducts}>
          Товары не найдены. Попробуйте изменить фильтры.
        </p>
      )}
    </div>
  );
};

export default Catalog;
