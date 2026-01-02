import React, { useEffect, useState } from "react";
import styles from "./Callback.module.scss";
import foto from "../../assets/svetlana.jpg";

const CallbackButton = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    // Проверяем сразу при монтировании
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button className={styles.callbackButton} onClick={onClick}>
      <img src={foto} alt="" />
    </button>
  );
};

export default CallbackButton;
