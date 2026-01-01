import React, { useEffect, useState } from 'react';
import styles from './Callback.module.scss';

const CallbackButton = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button className={styles.callbackButton} onClick={onClick}>
      Заказать звонок
    </button>
  );
};

export default CallbackButton;
