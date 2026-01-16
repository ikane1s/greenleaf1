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
        [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
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
        [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
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

async function getRequests(status = null, type = null) {
  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;

  return Request.findAll({
    where,
    order: [['created_at', 'DESC']],
  });
}

async function getMainKeyboard() {
  const partnerRequests = await getRequests(null, 'partner');
  const callbackRequests = await getRequests(null, 'callback');
  
  const activePartners = partnerRequests.filter(r => r.status !== 'выполнена').length;
  const activeCallbacks = callbackRequests.filter(r => r.status !== 'выполнена').length;

  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: `🤝 Заявки партнёрства (${activePartners})`,
            callback_data: 'list_partner',
          },
        ],
        [
          {
            text: `📞 Заявки на звонок (${activeCallbacks})`,
            callback_data: 'list_callback',
          },
        ],
        [{ text: '📜 История всех заявок', callback_data: 'history' }],
      ],
    },
  };
}

async function getTypeKeyboard(type) {
  const requests = await getRequests(null, type);
  const keyboard = [];
  const activeRequests = requests.filter((r) => r.status !== 'выполнена');

  if (activeRequests.length === 0) {
    keyboard.push([
      {
        text: '✅ Нет активных заявок',
        callback_data: 'empty',
      },
    ]);
  } else {
    activeRequests.forEach((r) => {
      const label =
        r.type === 'partner'
          ? `${r.lastName || ''} ${r.firstName || ''} ${r.phone || ''}`.trim() || 'Заявка'
          : r.phone || 'Заявка';

      keyboard.push([
        {
          text: `• ${label}`,
          callback_data: `view_${r.id}`,
        },
      ]);
    });
  }

  keyboard.push([{ text: '⬅ Назад к спискам', callback_data: 'main_menu' }]);
  keyboard.push([{ text: '🔄 Обновить', callback_data: `list_${type}` }]);

  return { reply_markup: { inline_keyboard: keyboard } };
}

async function sendMainMenu() {
  await bot.sendMessage(ADMIN_ID, '📋 Главное меню заявок:', await getMainKeyboard());
}

async function sendTypeList(type) {
  const typeName = type === 'partner' ? '🤝 Заявки партнёрства' : '📞 Заявки на звонок';
  await bot.sendMessage(ADMIN_ID, `${typeName}:`, await getTypeKeyboard(type));
}

/* ================= CALLBACKS ================= */

bot.on('callback_query', async (q) => {
  const { data, message } = q;

  // Главное меню
  if (data === 'main_menu') {
    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    return sendMainMenu();
  }

  // Списки по типам
  if (data === 'list_partner' || data === 'list_callback') {
    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    const type = data.replace('list_', '');
    return sendTypeList(type);
  }

  // История
  if (data === 'history') {
    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    const done = await getRequests('выполнена');
    
    if (done.length === 0) {
      return bot.sendMessage(ADMIN_ID, '📜 История пуста', {
        reply_markup: {
          inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
        },
      });
    }

    const partners = done.filter((r) => r.type === 'partner');
    const callbacks = done.filter((r) => r.type === 'callback');

    let text = '📜 Выполненные заявки:\n\n';
    
    if (partners.length > 0) {
      text += '🤝 Партнёрство:\n';
      partners.forEach((r) => {
        text += `• ${r.lastName || ''} ${r.firstName || ''} - ${r.phone || r.email || 'Нет контакта'}\n`;
      });
      text += '\n';
    }

    if (callbacks.length > 0) {
      text += '📞 Звонки:\n';
      callbacks.forEach((r) => {
        text += `• ${r.phone || 'Нет телефона'}\n`;
      });
    }

    return bot.sendMessage(ADMIN_ID, text, {
      reply_markup: {
        inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
      },
    });
  }

  // Просмотр заявки
  if (data.startsWith('view_')) {
    const id = data.replace('view_', '');
    const request = await Request.findByPk(id);
    if (!request) {
      return bot.answerCallbackQuery(q.id, { text: 'Заявка не найдена' });
    }

    request.status = 'просмотрена';
    await request.save();

    let text = '';
    let keyboard = [];

    if (request.type === 'callback') {
      text = `📞 Заявка на звонок\n\n`;
      text += `📞 Телефон: <code>${request.phone}</code>\n`;
      text += `⏰ Время заявки: ${new Date(request.created_at).toLocaleString('ru-RU')}\n`;
      text += `📊 Статус: ${request.status === 'просмотрена' ? 'Просмотрена' : 'Новая'}`;
      
      keyboard = [
        [{ text: '📞 Позвонить', url: `tel:${request.phone}` }],
        [{ text: '✅ Выполнено', callback_data: `done_${id}` }],
        [{ text: '⬅ Назад', callback_data: `list_callback` }],
      ];
    } else {
      text = `🤝 Заявка партнёра\n\n`;
      text += `👤 ФИО: ${request.lastName || ''} ${request.firstName || ''} ${request.middleName || ''}\n`;
      text += `📞 Телефон: <code>${request.phone}</code>\n`;
      text += `📧 Email: ${request.email || 'Не указан'}\n`;
      text += `🎯 Цель: ${request.goal === 'business' ? 'Бизнес' : request.goal === 'discount' ? 'Скидка на продукт' : request.goal || 'Не указана'}\n`;
      text += `⏰ Время заявки: ${new Date(request.created_at).toLocaleString('ru-RU')}\n`;
      text += `📊 Статус: ${request.status === 'просмотрена' ? 'Просмотрена' : 'Новая'}`;
      
      keyboard = [
        [{ text: '📞 Позвонить', url: `tel:${request.phone}` }],
        request.email ? [{ text: '📧 Написать на email', url: `mailto:${request.email}` }] : [],
        [{ text: '✅ Выполнено', callback_data: `done_${id}` }],
        [{ text: '⬅ Назад', callback_data: `list_partner` }],
      ].filter(Boolean);
    }

    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    return bot.sendMessage(ADMIN_ID, text, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  // Отметить как выполненное
  if (data.startsWith('done_')) {
    const id = data.replace('done_', '');
    const request = await Request.findByPk(id);
    if (!request) {
      return bot.answerCallbackQuery(q.id, { text: 'Заявка не найдена' });
    }

    request.status = 'выполнена';
    request.completed_at = new Date();
    await request.save();

    await bot.deleteMessage(message.chat.id, message.message_id).catch(() => {});
    await bot.answerCallbackQuery(q.id, { text: '✅ Заявка отмечена как выполненная' });
    
    // Возвращаемся к списку соответствующего типа
    return sendTypeList(request.type);
  }

  // Пустое действие
  if (data === 'empty') {
    return bot.answerCallbackQuery(q.id, { text: 'Нет активных заявок' });
  }

  bot.answerCallbackQuery(q.id);
});

// Команда /start для главного меню
bot.onText(/\/start/, () => {
  sendMainMenu();
});

/* ================= START ================= */

app.listen(3001, () => console.log('🚀 Server running on http://localhost:3001'));
