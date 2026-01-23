import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // ← Добавить эту строку

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Проверка существует ли папка build
const buildPath = path.join(__dirname, 'build');
console.log('Build path:', buildPath);
console.log('Build exists:', fs.existsSync(buildPath));

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.send('Build folder not found. Please run npm run build first.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
});
