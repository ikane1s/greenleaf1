import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { Request, initDB } from './models.js';

const app = express();
app.use(cors());
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN.trim();
const ADMIN_ID = Number(process.env.CHAT_ID);

await initDB();

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

/* ================= API ================= */

// 📞 Форма "Перезвоните"
app.post('/api/callback', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  const request = await Request.create({
    type: 'callback',
    phone,
  });

  // Отправляем детали заявки в Telegram
  const message = `📞 Новая заявка на звонок

📞 Телефон: ${phone}
Время: ${new Date().toLocaleString('ru-RU')}`;

  bot.sendMessage(ADMIN_ID, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
        [{ text: '📋 Показать все заявки', callback_data: 'list' }],
      ],
    },
  });

  res.json({ success: true });
});

// 🤝 Форма "Стать партнёром"
app.post('/api/partner', async (req, res) => {
  const { firstName, lastName, middleName, phone, email, goal } = req.body;

  const request = await Request.create({
    type: 'partner',
    firstName,
    lastName,
    middleName,
    phone,
    email,
    goal,
  });

  // Отправляем детали заявки в Telegram
  const message = `🤝 Новая заявка партнёра

👤 ФИО: ${lastName} ${firstName} ${middleName || ''}
📞 Телефон: ${phone}
📧 Email: ${email}
🎯 Цель: ${goal === 'business' ? 'Бизнес' : goal === 'discount' ? 'Скидка на продукт' : goal}

Время: ${new Date().toLocaleString('ru-RU')}`;

  bot.sendMessage(ADMIN_ID, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
        [{ text: '📋 Показать все заявки', callback_data: 'list' }],
      ],
    },
  });

  res.json({ success: true });
});

/* ================= BOT ================= */

function notifyAdmin(text) {
  bot.sendMessage(ADMIN_ID, text, {
    reply_markup: {
      inline_keyboard: [[{ text: '📋 Показать заявки', callback_data: 'list' }]],
    },
  });
}

async function getRequests(status = null) {
  return Request.findAll({
    where: status ? { status } : {},
    order: [['created_at', 'ASC']],
  });
}

async function getKeyboard() {
  const requests = await getRequests();
  const keyboard = [];

  requests.forEach((r) => {
    if (r.status === 'выполнена') return;

    const icon = r.type === 'partner' ? '🤝' : '📞';
    const label = r.phone || r.email || 'Заявка';

    keyboard.push([
      {
        text: `${icon} ${label}`,
        callback_data: `view_${r.id}`,
      },
    ]);
  });

  keyboard.push([{ text: '📜 История', callback_data: 'history' }]);
  keyboard.push([{ text: '🔄 Обновить', callback_data: 'list' }]);

  return { reply_markup: { inline_keyboard: keyboard } };
}

async function sendList() {
  bot.sendMessage(ADMIN_ID, '📋 Текущие заявки:', await getKeyboard());
}

/* ================= CALLBACKS ================= */

bot.on('callback_query', async (q) => {
  const { data, message } = q;

  if (data === 'list') {
    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    return sendList();
  }

  if (data === 'history') {
    const done = await getRequests('выполнена');
    const text =
      done.length === 0
        ? 'История пуста'
        : '📜 Выполненные заявки:\n' + done.map((r) => `• ${r.phone || r.email}`).join('\n');

    return bot.sendMessage(ADMIN_ID, text, {
      reply_markup: {
        inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'list' }]],
      },
    });
  }

  const [action, id] = data.split('_');
  const request = await Request.findByPk(id);
  if (!request) return;

  if (action === 'view') {
    request.status = 'просмотрена';
    await request.save();

    let text = '';

    if (request.type === 'callback') {
      text = `📞 Заявка на звонок\n\nТелефон: ${request.phone}`;
    } else {
      text = `
🤝 Заявка партнёра

ФИО: ${request.lastName} ${request.firstName} ${request.middleName}
📞 Телефон: ${request.phone}
📧 Email: ${request.email}
🎯 Цель: ${request.goal}
`;
    }

    return bot.sendMessage(ADMIN_ID, text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Выполнено', callback_data: `done_${id}` }],
          [{ text: '⬅ Назад', callback_data: 'list' }],
        ],
      },
    });
  }

  if (action === 'done') {
    request.status = 'выполнена';
    request.completed_at = new Date();
    await request.save();

    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    return sendList();
  }

  bot.answerCallbackQuery(q.id);
});

/* ================= START ================= */

app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'));
