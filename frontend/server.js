import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

// Проверяем существование build папки
if (!existsSync(buildPath)) {
  console.error(`ERROR: Build directory not found at ${buildPath}`);
  console.error('Please run "npm run build" first');
  process.exit(1);
}

if (!existsSync(indexPath)) {
  console.error(`ERROR: index.html not found at ${indexPath}`);
  process.exit(1);
}

// Раздаем статические файлы из build
app.use(express.static(buildPath, {
  maxAge: '1y', // Кеширование статических файлов
  etag: true,
}));

// Все остальные запросы отправляем на index.html (для React Router)
app.get('*', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Serving static files from: ${buildPath}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

