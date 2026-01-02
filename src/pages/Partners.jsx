import React, { useState } from 'react';
import styles from './Partners.module.scss';

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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^(\+7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Очищаем ошибку при изменении поля
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

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!validateEmail(formData.email)) {
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

    // Проверка: если не партнёр, кнопка должна быть заблокирована
    if (formData.isPartner === 'no') {
      return;
    }

    setIsSubmitting(true);

    try {
      // Здесь будет отправка на сервер
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
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
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setErrors({ submit: 'Произошла ошибка. Попробуйте позже.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled =
    formData.isPartner !== 'yes' || !formData.consent || isSubmitting;

  if (isSubmitted) {
    return (
      <div className={styles.partners}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2>Заявка отправлена!</h2>
          <p>
            Спасибо за ваш интерес к партнёрской программе. Мы свяжемся с вами в
            ближайшее время.
          </p>
          <button
            className={styles.backButton}
            onClick={() => setIsSubmitted(false)}
          >
            Отправить ещё одну заявку
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.partners}>
      <h1>Стать партнёром</h1>
      <div className={styles.content}>
        <p className={styles.intro}>
          Присоединяйтесь к нашей партнёрской программе и получите доступ к
          специальным ценам и условиям сотрудничества.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
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
              />
              {errors.lastName && (
                <span className={styles.errorMessage}>{errors.lastName}</span>
              )}
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
              />
              {errors.firstName && (
                <span className={styles.errorMessage}>{errors.firstName}</span>
              )}
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
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.error : ''}
                placeholder="example@mail.com"
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
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
              />
              {errors.phone && (
                <span className={styles.errorMessage}>{errors.phone}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              Вы уже партнёр компании?{' '}
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  name="isPartner"
                  value="yes"
                  checked={formData.isPartner === 'yes'}
                  onChange={handleChange}
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
                />
                <span>Нет</span>
              </label>
            </div>
            {errors.isPartner && (
              <span className={styles.errorMessage}>{errors.isPartner}</span>
            )}
          </div>

          {formData.isPartner === 'yes' && (
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
                  />
                  <span>Скидка на продукт</span>
                </label>
              </div>
              {errors.goal && (
                <span className={styles.errorMessage}>{errors.goal}</span>
              )}
            </div>
          )}

          {formData.isPartner === 'no' && (
            <div className={styles.infoMessage}>
              <p>
                Для подачи заявки необходимо быть партнёром компании. Если вы
                хотите стать партнёром, свяжитесь с нами по указанным контактам.
              </p>
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
              />
              <span>
                Я согласен(а) на обработку персональных данных{' '}
                <span className={styles.required}>*</span>
              </span>
            </label>
            {errors.consent && (
              <span className={styles.errorMessage}>{errors.consent}</span>
            )}
          </div>

          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitDisabled}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Partners;
