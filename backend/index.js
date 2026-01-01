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

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ===== Инициализация базы =====
await initDB();

// ===== API добавления заявки =====
app.post('/api/callback', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });

  await Request.create({ phone });

  bot.sendMessage(ADMIN_ID, '📩 У вас новая заявка!', {
    reply_markup: {
      inline_keyboard: [[{ text: '📋 Показать список', callback_data: 'show_list' }]],
    },
  });

  res.json({ success: true });
});

// ===== Получение текущих заявок =====
async function getRequests() {
  return await Request.findAll({ order: [['created_at', 'ASC']] });
}

// ===== Генерация клавиатуры списка текущих заявок =====
async function getRequestKeyboard() {
  const requests = await getRequests();
  const keyboard = [];

  requests.forEach((r) => {
    if (r.status === 'выполнена') return; // показываем только текущие
    const emoji = r.status === 'новая' ? '🆕' : '';
    keyboard.push([{ text: `${emoji} ${r.phone}`, callback_data: `view_${r.id}` }]);
  });

  keyboard.push([{ text: '🔄 Обновить список', callback_data: 'refresh' }]);
  keyboard.push([{ text: '📜 История выполненных', callback_data: 'history' }]);

  return { reply_markup: { inline_keyboard: keyboard } };
}

// ===== Отправка списка текущих заявок =====
async function sendRequestList() {
  bot.sendMessage(ADMIN_ID, '📋 Текущий список заявок:', await getRequestKeyboard());
}

// ===== Обработка кнопок =====
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const data = callbackQuery.data;

  // Обновление списка
  if (data === 'refresh' || data === 'show_list') {
    bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => {});
    return sendRequestList();
  }

  // История выполненных заявок
  if (data === 'history') {
    const done = await Request.findAll({
      where: { status: 'выполнена' },
      order: [['completed_at', 'ASC']],
    });
    const text =
      done.length === 0
        ? '📜 История выполненных заявок пуста.'
        : '📜 История выполненных заявок:\n' + done.map((r) => `• ${r.phone}`).join('\n');

    return bot.sendMessage(ADMIN_ID, text, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🗑 Очистить историю', callback_data: 'clear_history' }],
          [{ text: '⬅️ Назад', callback_data: 'refresh' }],
        ],
      },
    });
  }

  // Очистка истории
  if (data === 'clear_history') {
    await Request.destroy({ where: { status: 'выполнена' } });
    bot.sendMessage(ADMIN_ID, '🗑 История выполненных заявок очищена!');
    return bot.answerCallbackQuery(callbackQuery.id);
  }

  // Работа с отдельной заявкой
  const [action, id] = data.split('_');
  const request = await Request.findByPk(id);
  if (!request) return bot.answerCallbackQuery(callbackQuery.id, { text: 'Заявка не найдена' });

  if (action === 'view') {
    if (request.status === 'новая') request.status = 'просмотрена';
    await request.save();

    bot.sendMessage(
      ADMIN_ID,
      `📞 Номер телефона: ${request.phone}\nВы можете скопировать его.\n\nОтметить как выполненную?`,
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
            [{ text: '⬅️ Назад', callback_data: 'refresh' }],
          ],
        },
      },
    );
  } else if (action === 'done') {
    request.status = 'выполнена';
    request.completed_at = new Date();
    await request.save();
    bot.sendMessage(ADMIN_ID, `✅ Заявка ${request.phone} выполнена`);
    bot.deleteMessage(msg.chat.id, msg.message_id).catch(() => {});
    sendRequestList();
  }

  bot.answerCallbackQuery(callbackQuery.id);
});

// ===== Любое сообщение от админа =====
bot.on('message', (msg) => {
  if (msg.chat.id !== ADMIN_ID) return;
  if (msg.text.startsWith('/')) return;

  bot.sendMessage(ADMIN_ID, '📋 Вы можете просмотреть список заявок:', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Показать список заявок', callback_data: 'show_list' }]],
    },
  });
});

// ===== Запуск сервера =====
app.listen(3001, () => console.log('Server running on http://localhost:3001'));
