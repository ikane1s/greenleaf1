// backend/index.js
import express from 'express';
import cors from 'cors';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// Telegram
const BOT_TOKEN = '7925089103:AAEeggyoEXROQlV0X477UU3K8CQXteTdtSQ';
const CHAT_ID = '1575864216';

app.post('/api/callback', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone is required' });
  }

  const message = `📞 Новая заявка с сайта\nТелефон: ${phone}`;

  try {
    // В Node 18+ fetch встроен, node-fetch больше не нужен
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
      }),
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Telegram error' });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
