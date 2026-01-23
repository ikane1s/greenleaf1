# Инструкция по синхронизации package-lock.json

## Проблема
`package-lock.json` содержит версии React 19, а `package.json` - React 18. Это вызывает ошибку при `npm ci`.

## Решение

### Вариант 1: Пересоздать package-lock.json (рекомендуется)

1. **Удалите старый package-lock.json:**
   ```bash
   cd frontend
   rm package-lock.json
   ```

2. **Переустановите зависимости:**
   ```bash
   npm install
   ```

3. **Закоммитьте новый package-lock.json:**
   ```bash
   git add package-lock.json
   git commit -m "Обновлен package-lock.json для React 18"
   git push
   ```

### Вариант 2: Использовать npm install вместо npm ci в Railway

В настройках Railway установите Build Command:
```
npm install && npm run build
```

Это обойдет проблему с синхронизацией, но лучше использовать Вариант 1.

## Проверка

После пересоздания `package-lock.json` убедитесь, что версии совпадают:
- `package.json`: `"react": "^18.2.0"`
- `package-lock.json` должен содержать `react@18.2.0` (или совместимую версию)

