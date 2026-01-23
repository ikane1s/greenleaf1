import React, { useState } from 'react';
import styles from './Callback.module.scss';
import { formatPhoneNumber, getCleanPhoneNumber } from '../../utils/phoneFormatter';
import API_URL from '../../config';

const CallbackModal = ({ onClose }) => {
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Отправляем чистый номер (только цифры)
    const cleanPhone = getCleanPhoneNumber(phone);

    try {
      await fetch(`${API_URL}/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setPhone('');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      alert('Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {success ? (
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h3>Спасибо!</h3>
            <p>Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>Оставьте номер телефона</h3>
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={phone}
              onChange={handlePhoneChange}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Отправка...' : 'Отправить'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CallbackModal;
