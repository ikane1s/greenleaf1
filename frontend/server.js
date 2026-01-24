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

// РАЗДАЕМ СТАТИЧЕСКИЕ ФАЙЛЫ БЕЗ ДОЛГОГО КЭШИРОВАНИЯ
app.use(express.static(buildPath, {
  setHeaders: (res, filePath) => {
    // HTML - не кэшируем вообще
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
    // Остальные файлы - кэшируем, но с возможностью инвалидации
    else {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    }
  }
}));

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Все остальные запросы отправляем на index.html (для React Router)
app.get('*', (req, res) => {
  console.log(`📄 Serving index.html for: ${req.path}`);
  
  // Явно указываем заголовки против кэширования для index.html
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Internal Server Error');
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