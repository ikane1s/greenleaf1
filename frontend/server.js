import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';

console.log('🚀 Starting server.js...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 __dirname:', __dirname);

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔌 PORT:', PORT);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

console.log('📦 buildPath:', buildPath);
console.log('📄 indexPath:', indexPath);

// Проверяем существование build папки
if (!existsSync(buildPath)) {
  console.error(`❌ ERROR: Build directory not found at ${buildPath}`);
  process.exit(1);
}

if (!existsSync(indexPath)) {
  console.error(`❌ ERROR: index.html not found at ${indexPath}`);
  process.exit(1);
}

console.log('✅ Build directory found, serving files...');

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Раздаем статические файлы (CSS, JS, изображения и т.д.)
// Важно: express.static автоматически проверяет существование файла
// Если файл не существует, передает управление следующему middleware
app.use(express.static(buildPath, {
  index: false, // Отключаем автоматическую отдачу index.html для корня
  setHeaders: (res, filePath) => {
    // HTML - не кэшируем
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    // Статические ресурсы (JS, CSS, изображения) - кэшируем
    else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
  fallthrough: true // Продолжаем обработку, если файл не найден
}));

// Обработка корневого маршрута
app.get('/', (req, res) => {
  console.log(`📄 Serving index.html for root: ${req.path}`);
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.sendFile(indexPath);
});

// Все остальные маршруты (включая /product/60, /catalog/... и т.д.) отправляем на index.html
// Это позволяет React Router обработать маршрут на клиенте
// Важно: этот маршрут срабатывает ТОЛЬКО если статический файл не найден
app.get('*', (req, res) => {
  // Проверяем, не является ли запрос запросом к статическому файлу
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json'];
  const isStaticFile = staticExtensions.some(ext => req.path.toLowerCase().endsWith(ext));
  
  if (isStaticFile) {
    // Если это запрос к статическому файлу, но файл не найден - 404
    console.log(`❌ Static file not found: ${req.path}`);
    res.status(404).send('File not found');
    return;
  }
  
  console.log(`📄 Serving index.html for route: ${req.path}`);
  
  // Явно указываем заголовки против кэширования для index.html
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
    } else {
      console.log(`✅ Successfully served index.html for: ${req.path}`);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`📁 Serving static files from: ${buildPath}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Server is ready to accept connections`);
  console.log(`⚠️ Cache-Control: настроен для предотвращения кэширования HTML`);
});