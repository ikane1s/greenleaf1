/**
 * Форматирует номер телефона в формат +7 (XXX) XXX-XX-XX
 * Автоматически добавляет +7 если пользователь начинает вводить с 8 или 9
 */
export const formatPhoneNumber = (value) => {
  // Удаляем все символы кроме цифр
  let numbers = value.replace(/\D/g, '');

  // Если начинается с 8, заменяем на 7
  if (numbers.startsWith('8')) {
    numbers = '7' + numbers.slice(1);
  }

  // Если начинается с 9 и нет +7, добавляем 7 в начало
  if (numbers.startsWith('9') && !numbers.startsWith('79')) {
    numbers = '7' + numbers;
  }

  // Если начинается с 7, оставляем как есть
  // Если не начинается с 7, добавляем 7
  if (numbers.length > 0 && !numbers.startsWith('7')) {
    numbers = '7' + numbers;
  }

  // Ограничиваем до 11 цифр (7 + 10 цифр номера)
  if (numbers.length > 11) {
    numbers = numbers.slice(0, 11);
  }

  // Форматируем: +7 (XXX) XXX-XX-XX
  if (numbers.length === 0) {
    return '';
  }

  if (numbers.length <= 1) {
    return `+${numbers}`;
  }

  if (numbers.length <= 4) {
    return `+${numbers.slice(0, 1)} (${numbers.slice(1)}`;
  }

  if (numbers.length <= 7) {
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4)}`;
  }

  if (numbers.length <= 9) {
    return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(
      7,
    )}`;
  }

  return `+${numbers.slice(0, 1)} (${numbers.slice(1, 4)}) ${numbers.slice(4, 7)}-${numbers.slice(
    7,
    9,
  )}-${numbers.slice(9, 11)}`;
};

/**
 * Извлекает чистый номер телефона (только цифры) из отформатированной строки
 */
export const getCleanPhoneNumber = (formattedPhone) => {
  return formattedPhone.replace(/\D/g, '');
};
