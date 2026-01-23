import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readdirSync } from 'fs';

console.log('🚀 Starting server.js...');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📁 __dirname:', __dirname);

const app = express();
// Railway автоматически устанавливает PORT через переменную окружения
const PORT = process.env.PORT || 3000;

console.log('🔌 PORT:', PORT);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
console.log('📋 All environment variables:', Object.keys(process.env).filter(k => k.includes('PORT') || k.includes('RAILWAY')));

const buildPath = path.join(__dirname, 'build');
const indexPath = path.join(buildPath, 'index.html');

console.log('📦 buildPath:', buildPath);
console.log('📄 indexPath:', indexPath);

// Проверяем существование build папки
if (!existsSync(buildPath)) {
  console.error(`❌ ERROR: Build directory not found at ${buildPath}`);
  console.error('📂 Listing directory contents:');
  try {
    const files = readdirSync(__dirname);
    console.error('Files in __dirname:', files);
  } catch (e) {
    console.error('Could not list directory:', e);
  }
  process.exit(1);
}

if (!existsSync(indexPath)) {
  console.error(`❌ ERROR: index.html not found at ${indexPath}`);
  console.error('📂 Listing build directory contents:');
  try {
    const files = readdirSync(buildPath);
    console.error('Files in build:', files);
  } catch (e) {
    console.error('Could not list build directory:', e);
  }
  process.exit(1);
}

console.log('✅ Build directory found, serving files...');

// Раздаем статические файлы из build
app.use(express.static(buildPath, {
  maxAge: '1y',
  etag: true,
}));

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// Все остальные запросы отправляем на index.html (для React Router)
app.get('*', (req, res) => {
  console.log(`📄 Serving index.html for: ${req.path}`);
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
});

