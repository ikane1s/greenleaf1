import React, { useEffect, useState } from "react";
import styles from "./Callback.module.scss";
import foto from "../../assets/svetlana.jpg";

const CallbackButton = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      setVisible(scrollY > 300);
    };

    // Проверяем сразу при монтировании
    handleScroll();

    // Используем passive для лучшей производительности
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <button 
      className={`${styles.callbackButton} ${visible ? styles.visible : ''}`} 
      onClick={onClick}
      aria-label="Заказать звонок"
    >
      <img src={foto} alt="Связаться с нами" />
    </button>
  );
};

export default CallbackButton;
