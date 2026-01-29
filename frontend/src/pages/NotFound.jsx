import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.scss';

// Хук для метатегов
const useMetaTags = (meta) => {
  useEffect(() => {
    if (!meta) return;

    if (meta.title) {
      document.title = meta.title;
    }

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

    if (meta.description) {
      updateOrCreateMeta('description', null, meta.description);
    }

    if (meta.keywords) {
      updateOrCreateMeta('keywords', null, meta.keywords);
    }

    if (meta.ogTitle) {
      updateOrCreateMeta(null, 'og:title', meta.ogTitle);
    }
    if (meta.ogDescription) {
      updateOrCreateMeta(null, 'og:description', meta.ogDescription);
    }
  }, [meta]);
};

const NotFound = () => {
  const seoData = {
    title: 'Страница не найдена - GreenLeaf Новосибирск',
    description:
      'Страница не найдена. Вернитесь на главную страницу GreenLeaf - натуральная косметика и экопродукты в Новосибирске.',
    keywords:
      'greenleaf, greenleaf новосибирск, гринлиф, гринлиф новосибирск, страница не найдена, 404',
  };

  useMetaTags(seoData);

  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>
        К сожалению, запрашиваемая страница не существует. 
        Возможно, она была перемещена или удалена.
      </p>
      <Link to="/" className={styles.link}>
        Вернуться на главную
      </Link>
    </div>
  );
};

export default NotFound;
