import React from 'react';
import { useParams } from 'react-router-dom';
import productsData from '../../data/products.json';
import styles from './Catalog.module.scss';

// Словарь для красивых названий категорий
const categoryMap = {
  'facial-skin-care': 'Уход за кожей лица',
  'decorative-cosmetics': 'Декоративная косметика',
  'body-skin-care': 'Уход за кожей тела',
};

const Catalog = () => {
  const { category } = useParams();

  // Получаем нормальное название категории
  const categoryName = categoryMap[category] || 'Каталог';

  // Фильтруем товары по категории
  const filteredProducts = productsData.filter((product) => product.category === category);

  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>{categoryName}</h1>

      {filteredProducts.length > 0 ? (
        <div className={styles.products}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productDescription}>{product.description}</p>
              <div className={styles.productPrices}>
                <span className={styles.retailPrice}>Розница: {product.priceRetail} ₽</span>
                <span className={styles.partnerPrice}>Партнёр: {product.pricePartner} ₽</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noProducts}>Товары для этой категории отсутствуют.</p>
      )}
    </div>
  );
};

export default Catalog;
