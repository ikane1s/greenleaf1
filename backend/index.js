import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import 'dotenv/config';
import { Request, initDB } from './models.js';

const app = express();

// ================= CORS НАСТРОЙКА =================
app.use(
  cors({
    origin: [
      'https://sskzpsk6.up.railway.app', // твой Railway фронтенд
      'http://localhost:3000', // локальная разработка
      'https://greenleaf-nso.ru', // твой кастомный домен
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }),
);

app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN.trim();
const ADMIN_ID = Number(process.env.CHAT_ID);

await initDB();

const bot = new TelegramBot(BOT_TOKEN, {
  polling: true,
});

// Конфигурация
const MAX_COMPLETED_REQUESTS = 10; // Максимальное количество выполненных заявок в истории

/* ================= ТЕСТОВЫЕ МАРШРУТЫ API ================= */

// 1. Главный маршрут /api
app.get('/api', (req, res) => {
  res.json({
    name: 'GreenLeaf API',
    version: '1.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      test: 'GET /api/test',
      callback: 'POST /api/callback',
      partner: 'POST /api/partner',
      products: 'GET /api/products',
      partners: 'GET /api/partners',
    },
  });
});

// 2. Health check маршрут
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'greenleaf-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: 'enabled',
    database: 'connected',
  });
});

// 3. Тестовый маршрут
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend API is working correctly!',
    data: {
      server: 'Express/Node.js',
      bot: 'Telegram bot connected',
      database: 'PostgreSQL via Sequelize',
    },
  });
});

// 4. Products маршрут (пример)
app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Product A', price: 100 },
      { id: 2, name: 'Product B', price: 200 },
      { id: 3, name: 'Product C', price: 300 },
    ],
  });
});

// 5. Partners маршрут (пример)
app.get('/api/partners', (req, res) => {
  res.json({
    partners: [
      { id: 1, name: 'Partner A', category: 'Retail' },
      { id: 2, name: 'Partner B', category: 'Wholesale' },
      { id: 3, name: 'Partner C', category: 'Manufacturer' },
    ],
  });
});

/* ================= UTILITY FUNCTIONS ================= */

// Функция для очистки старых выполненных заявок
async function cleanupOldRequests() {
  try {
    // Получаем все выполненные заявки, отсортированные по дате выполнения (новые сверху)
    const allCompleted = await Request.findAll({
      where: { status: 'выполнена' },
      order: [['completed_at', 'DESC']],
    });

    // Если выполненных заявок больше максимума, удаляем старые
    if (allCompleted.length > MAX_COMPLETED_REQUESTS) {
      const toDelete = allCompleted.slice(MAX_COMPLETED_REQUESTS);
      const idsToDelete = toDelete.map((r) => r.id);

      await Request.destroy({
        where: {
          id: idsToDelete,
          status: 'выполнена',
        },
      });

      console.log(`🗑️ Удалено ${toDelete.length} старых выполненных заявок`);
    }
  } catch (error) {
    console.error('Error cleaning up old requests:', error);
  }
}

// Вызываем очистку при запуске
cleanupOldRequests();

/* ================= ПРОДУКШЕН МАРШРУТЫ API ================= */

// 📞 Форма "Перезвоните"
app.post('/api/callback', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    const request = await Request.create({
      type: 'callback',
      phone,
    });

    const message = `📞 Новая заявка на звонок\n\n📞 Телефон: ${phone}\nВремя: ${new Date().toLocaleString(
      'ru-RU',
    )}`;

    await bot.sendMessage(ADMIN_ID, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
          [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
        ],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in callback form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🤝 Форма "Стать партнёром"
app.post('/api/partner', async (req, res) => {
  try {
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

    const message = `🤝 Новая заявка партнёра\n\n👤 ФИО: ${lastName} ${firstName} ${
      middleName || ''
    }\n📞 Телефон: ${phone}\n📧 Email: ${email || 'Не указан'}\n🎯 Цель: ${
      goal === 'business'
        ? 'Бизнес'
        : goal === 'discount'
        ? 'Скидка на продукт'
        : goal || 'Не указана'
    }\n\nВремя: ${new Date().toLocaleString('ru-RU')}`;

    await bot.sendMessage(ADMIN_ID, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
          [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
        ],
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error in partner form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= BOT FUNCTIONS ================= */

async function getMainKeyboard() {
  try {
    const partnerRequests = await Request.findAll({ where: { type: 'partner' } });
    const callbackRequests = await Request.findAll({ where: { type: 'callback' } });

    const activePartners = partnerRequests.filter((r) => r.status !== 'выполнена').length;
    const activeCallbacks = callbackRequests.filter((r) => r.status !== 'выполнена').length;

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
          [{ text: '📜 История заявок (последние 10)', callback_data: 'history' }],
        ],
      },
    };
  } catch (error) {
    console.error('Error getting main keyboard:', error);
    return {
      reply_markup: {
        inline_keyboard: [[{ text: '📋 Обновить меню', callback_data: 'main_menu' }]],
      },
    };
  }
}

/* ================= BOT EVENT HANDLERS ================= */

// Главное меню
bot.onText(/\/start/, async (msg) => {
  try {
    const keyboard = await getMainKeyboard();
    await bot.sendMessage(msg.chat.id, '📋 Главное меню заявок:', keyboard);
  } catch (error) {
    console.error('Error handling /start:', error);
    await bot.sendMessage(msg.chat.id, 'Произошла ошибка. Попробуйте еще раз.');
  }
});

// Обработка текстовых сообщений
bot.on('message', async (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    try {
      const keyboard = await getMainKeyboard();
      await bot.sendMessage(msg.chat.id, '📋 Главное меню заявок:', keyboard);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }
});

// Обработка callback кнопок
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  try {
    // Сначала отвечаем на callback, чтобы Telegram знал, что запрос обработан
    await bot.answerCallbackQuery(query.id).catch(() => {});

    // Главное меню
    if (data === 'main_menu') {
      const keyboard = await getMainKeyboard();
      try {
        await bot.editMessageText('📋 Главное меню заявок:', {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: keyboard.reply_markup,
        });
      } catch (error) {
        // Если не удалось отредактировать, удаляем старое сообщение и отправляем новое
        await bot.deleteMessage(chatId, messageId).catch(() => {});
        await bot.sendMessage(chatId, '📋 Главное меню заявок:', keyboard);
      }
      return;
    }

    // Список заявок партнерства
    if (data === 'list_partner') {
      const requests = await Request.findAll({
        where: {
          type: 'partner',
          status: ['новая', 'просмотрена'],
        },
        order: [['created_at', 'DESC']],
      });

      if (requests.length === 0) {
        try {
          await bot.editMessageText('🤝 Нет активных заявок партнёрства', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [
                [{ text: '⬅ Назад', callback_data: 'main_menu' }],
                [{ text: '🔄 Обновить', callback_data: 'list_partner' }],
              ],
            },
          });
        } catch (error) {
          await bot.deleteMessage(chatId, messageId).catch(() => {});
          await bot.sendMessage(chatId, '🤝 Нет активных заявок партнёрства', {
            reply_markup: {
              inline_keyboard: [
                [{ text: '⬅ Назад', callback_data: 'main_menu' }],
                [{ text: '🔄 Обновить', callback_data: 'list_partner' }],
              ],
            },
          });
        }
        return;
      }

      const keyboard = [];
      requests.forEach((r) => {
        const label =
          `${r.lastName || ''} ${r.firstName || ''} ${r.phone || ''}`.trim() || `Заявка #${r.id}`;
        keyboard.push([{ text: `• ${label}`, callback_data: `view_${r.id}` }]);
      });

      keyboard.push([{ text: '⬅ Назад', callback_data: 'main_menu' }]);
      keyboard.push([{ text: '🔄 Обновить', callback_data: 'list_partner' }]);

      try {
        await bot.editMessageText('🤝 Заявки партнёрства:', {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: keyboard },
        });
      } catch (error) {
        await bot.deleteMessage(chatId, messageId).catch(() => {});
        await bot.sendMessage(chatId, '🤝 Заявки партнёрства:', {
          reply_markup: { inline_keyboard: keyboard },
        });
      }
      return;
    }

    // Список заявок на звонок
    if (data === 'list_callback') {
      const requests = await Request.findAll({
        where: {
          type: 'callback',
          status: ['новая', 'просмотрена'],
        },
        order: [['created_at', 'DESC']],
      });

      if (requests.length === 0) {
        try {
          await bot.editMessageText('📞 Нет активных заявок на звонок', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [
                [{ text: '⬅ Назад', callback_data: 'main_menu' }],
                [{ text: '🔄 Обновить', callback_data: 'list_callback' }],
              ],
            },
          });
        } catch (error) {
          await bot.deleteMessage(chatId, messageId).catch(() => {});
          await bot.sendMessage(chatId, '📞 Нет активных заявок на звонок', {
            reply_markup: {
              inline_keyboard: [
                [{ text: '⬅ Назад', callback_data: 'main_menu' }],
                [{ text: '🔄 Обновить', callback_data: 'list_callback' }],
              ],
            },
          });
        }
        return;
      }

      const keyboard = [];
      requests.forEach((r) => {
        keyboard.push([
          { text: `• ${r.phone || `Заявка #${r.id}`}`, callback_data: `view_${r.id}` },
        ]);
      });

      keyboard.push([{ text: '⬅ Назад', callback_data: 'main_menu' }]);
      keyboard.push([{ text: '🔄 Обновить', callback_data: 'list_callback' }]);

      try {
        await bot.editMessageText('📞 Заявки на звонок:', {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: keyboard },
        });
      } catch (error) {
        await bot.deleteMessage(chatId, messageId).catch(() => {});
        await bot.sendMessage(chatId, '📞 Заявки на звонок:', {
          reply_markup: { inline_keyboard: keyboard },
        });
      }
      return;
    }

    // История заявок
    if (data === 'history') {
      const doneRequests = await Request.findAll({
        where: { status: 'выполнена' },
        order: [['completed_at', 'DESC']],
        limit: MAX_COMPLETED_REQUESTS,
      });

      if (doneRequests.length === 0) {
        try {
          await bot.editMessageText('📜 История выполненных заявок пуста', {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: {
              inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
            },
          });
        } catch (error) {
          await bot.deleteMessage(chatId, messageId).catch(() => {});
          await bot.sendMessage(chatId, '📜 История выполненных заявок пуста', {
            reply_markup: {
              inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
            },
          });
        }
        return;
      }

      let historyText = `📜 История заявок (последние ${doneRequests.length}):\n\n`;

      doneRequests.forEach((r, index) => {
        const date = new Date(r.completed_at || r.created_at).toLocaleString('ru-RU');
        if (r.type === 'partner') {
          historyText += `${index + 1}. 🤝 ${r.lastName || ''} ${r.firstName || ''} - ${
            r.phone || r.email || 'Нет контакта'
          }\n   📅 ${date}\n\n`;
        } else {
          historyText += `${index + 1}. 📞 ${r.phone || 'Нет телефона'}\n   📅 ${date}\n\n`;
        }
      });

      historyText += `\nℹ️ В истории сохраняются только последние ${MAX_COMPLETED_REQUESTS} выполненных заявок.`;

      try {
        await bot.editMessageText(historyText, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
          },
        });
      } catch (error) {
        await bot.deleteMessage(chatId, messageId).catch(() => {});
        await bot.sendMessage(chatId, historyText, {
          reply_markup: {
            inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
          },
        });
      }
      return;
    }

    // Просмотр заявки
    if (data.startsWith('view_')) {
      const requestId = parseInt(data.replace('view_', ''));
      const request = await Request.findByPk(requestId);

      if (!request) {
        await bot.answerCallbackQuery(query.id, {
          text: '❌ Заявка не найдена',
          show_alert: true,
        });
        return;
      }

      // Обновляем статус на "просмотрена"
      if (request.status === 'новая') {
        request.status = 'просмотрена';
        await request.save();
      }

      let text = '';
      let keyboard = [];

      // Формируем текст заявки
      if (request.type === 'callback') {
        text = `📞 Заявка на звонок\n\n`;
        text += `📞 Телефон: <code>${request.phone || 'Не указан'}</code>\n`;
        text += `⏰ Время заявки: ${new Date(request.created_at).toLocaleString('ru-RU')}\n`;
        text += `📊 Статус: ${
          request.status === 'выполнена'
            ? '✅ Выполнена'
            : request.status === 'просмотрена'
            ? '👁 Просмотрена'
            : '🆕 Новая'
        }\n`;
        text += `🆔 ID: ${request.id}`;

        // Формируем простую клавиатуру БЕЗ URL
        keyboard = [
          [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
          [{ text: '⬅ Назад', callback_data: 'list_callback' }],
        ];
      } else {
        text = `🤝 Заявка партнёра\n\n`;
        text += `👤 ФИО: ${request.lastName || ''} ${request.firstName || ''} ${
          request.middleName || ''
        }\n`;
        text += `📞 Телефон: <code>${request.phone || 'Не указан'}</code>\n`;
        text += `📧 Email: <code>${request.email || 'Не указан'}</code>\n`;
        text += `🎯 Цель: ${
          request.goal === 'business'
            ? 'Бизнес'
            : request.goal === 'discount'
            ? 'Скидка на продукт'
            : request.goal || 'Не указана'
        }\n`;
        text += `⏰ Время заявки: ${new Date(request.created_at).toLocaleString('ru-RU')}\n`;
        text += `📊 Статус: ${
          request.status === 'выполнена'
            ? '✅ Выполнена'
            : request.status === 'просмотрена'
            ? '👁 Просмотрена'
            : '🆕 Новая'
        }\n`;
        text += `🆔 ID: ${request.id}`;

        // Формируем простую клавиатуру БЕЗ URL
        keyboard = [
          [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
          [{ text: '⬅ Назад', callback_data: 'list_partner' }],
        ];
      }

      try {
        await bot.editMessageText(text, {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: keyboard },
        });
      } catch (error) {
        // Если не удалось отредактировать сообщение, удаляем старое и отправляем новое
        await bot.deleteMessage(chatId, messageId).catch(() => {});
        await bot.sendMessage(chatId, text, {
          parse_mode: 'HTML',
          reply_markup: { inline_keyboard: keyboard },
        });
      }

      return;
    }

    // Копирование телефона
    if (data.startsWith('copy_phone_')) {
      const requestId = parseInt(data.replace('copy_phone_', ''));
      const request = await Request.findByPk(requestId);

      if (request && request.phone) {
        await bot.answerCallbackQuery(query.id, {
          text: `📞 Телефон скопирован: ${request.phone}`,
          show_alert: true,
        });
      } else {
        await bot.answerCallbackQuery(query.id, {
          text: '❌ Телефон не найден',
          show_alert: true,
        });
      }
      return;
    }

    // Копирование email
    if (data.startsWith('copy_email_')) {
      const requestId = parseInt(data.replace('copy_email_', ''));
      const request = await Request.findByPk(requestId);

      if (request && request.email) {
        await bot.answerCallbackQuery(query.id, {
          text: `📧 Email скопирован: ${request.email}`,
          show_alert: true,
        });
      } else {
        await bot.answerCallbackQuery(query.id, {
          text: '❌ Email не найден',
          show_alert: true,
        });
      }
      return;
    }

    // Отметить как выполненное
    // Отметить как выполненное
    if (data.startsWith('done_')) {
      const requestId = parseInt(data.replace('done_', ''));
      const request = await Request.findByPk(requestId);

      if (!request) {
        await bot.answerCallbackQuery(query.id, {
          text: '❌ Заявка не найдена',
          show_alert: true,
        });
        return;
      }

      request.status = 'выполнена';
      request.completed_at = new Date();
      await request.save();

      // Очищаем старые заявки после добавления новой выполненной
      await cleanupOldRequests();

      await bot.answerCallbackQuery(query.id, {
        text: '✅ Заявка отмечена как выполненная',
        show_alert: false,
      });

      // Показываем сообщение об успехе
      let successText = `✅ Заявка #${request.id} отмечена как выполненная\n\n`;

      if (request.type === 'callback') {
        successText += `📞 ${request.phone || 'Нет телефона'}`;
      } else {
        successText += `🤝 ${request.lastName || ''} ${request.firstName || ''} - ${
          request.phone || request.email || 'Нет контакта'
        }`;
      } // ← ЭТОЙ СКОБКИ НЕ ХВАТАЛО!

      try {
        await bot.editMessageText(successText, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: '⬅ Назад к списку', callback_data: `list_${request.type}` }],
              [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
            ],
          },
        });
      } catch (error) {
        await bot.deleteMessage(chatId, messageId).catch(() => {});
        await bot.sendMessage(chatId, successText, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '⬅ Назад к списку', callback_data: `list_${request.type}` }],
              [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
            ],
          },
        });
      }

      return;
    } // ← ЭТО закрывающая скобка для if (data.startsWith('done_'))

    // Пустые действия
    if (data === 'loading' || data === 'empty') {
      return;
    }
  } catch (error) {
    console.error('Error processing callback:', error);
    try {
      await bot.answerCallbackQuery(query.id, {
        text: '❌ Произошла ошибка',
        show_alert: true,
      });
    } catch (e) {
      // Игнорируем ошибки ответа на callback
    }
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🤖 Bot started for admin: ${ADMIN_ID}`);
  console.log(
    `📊 В истории будут сохраняться последние ${MAX_COMPLETED_REQUESTS} выполненных заявок`,
  );
  console.log(`🌐 API доступно по адресу: https://greenleaf1-production.up.railway.app/api`);
});
