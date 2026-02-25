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
      'https://global.greenleaf-nso.ru',
      'https://greenleaf-nso.ru',
      'https://www.greenleaf-nso.ru',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
);

app.use(express.json());

// Middleware для отладки (временно)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Content-Type:', req.headers['content-type']);
  next();
});

const BOT_TOKEN = process.env.BOT_TOKEN?.trim();
const ADMIN_ID = Number(process.env.CHAT_ID);
const WEBHOOK_BASE_URL =
  process.env.WEBHOOK_BASE_URL?.trim().replace(/\/$/, '') || 'https://greenleaf-nso.ru';

if (!BOT_TOKEN || !ADMIN_ID) {
  console.error('❌ Missing BOT_TOKEN or CHAT_ID in environment variables');
  process.exit(1);
}

console.log('🔧 Конфигурация:');
console.log('  - BOT_TOKEN установлен:', !!BOT_TOKEN);
console.log('  - ADMIN_ID:', ADMIN_ID);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - WEBHOOK_BASE_URL:', WEBHOOK_BASE_URL);

await initDB();
console.log('✅ База данных инициализирована');

const bot = new TelegramBot(BOT_TOKEN);

// ================= ПРОВЕРКА БОТА =================
async function verifyBot() {
  try {
    console.log('🤔 Проверка бота...');
    const me = await bot.getMe();
    console.log('✅ Бот найден:', {
      username: me.username,
      id: me.id,
      first_name: me.first_name,
    });

    // Проверяем вебхук
    const webhookInfo = await bot.getWebHookInfo();
    console.log('🌐 Информация о вебхуке:', {
      url: webhookInfo.url || 'не установлен',
      pending_updates: webhookInfo.pending_update_count,
      max_connections: webhookInfo.max_connections,
    });

    // Пробуем отправить тестовое сообщение
    console.log('📤 Отправка тестового сообщения админу...');
    const testMsg = await bot.sendMessage(
      ADMIN_ID,
      `✅ Бот успешно запущен!\n🕐 ${new Date().toLocaleString('ru-RU')}\n📊 Режим: ${process.env.NODE_ENV}`,
    );
    console.log('✅ Тестовое сообщение отправлено, ID:', testMsg.message_id);
  } catch (error) {
    console.error('❌ Ошибка проверки бота:', {
      message: error.message,
      code: error.code,
      response: error.response?.body,
    });

    if (error.code === 'ETELEGRAM' && error.message.includes('403')) {
      console.error('⚠️ Бот заблокирован пользователем. Разблокируйте бота в Telegram');
    }
    if (error.code === 'ETELEGRAM' && error.message.includes('400')) {
      console.error('⚠️ Неправильный CHAT_ID. Убедитесь что ADMIN_ID правильный');
    }
  }
}

// ================= НАСТРОЙКА ВЕБХУКА =================
if (process.env.NODE_ENV === 'production') {
  const fullWebhookUrl = `${WEBHOOK_BASE_URL}/webhook/bot${BOT_TOKEN}`;

  console.log('🔧 Установка вебхука на:', fullWebhookUrl);

  bot
    .setWebHook(fullWebhookUrl)
    .then(() => {
      console.log('🌐 Webhook успешно установлен');
      return verifyBot();
    })
    .catch((err) => {
      console.error('❌ Ошибка установки вебхука:', {
        message: err.message,
        code: err.code,
        response: err.response?.body,
      });
    });
} else {
  console.log('🔄 Запуск в режиме polling...');
  bot
    .startPolling()
    .then(() => {
      console.log('✅ Polling запущен');
      return verifyBot();
    })
    .catch((err) => {
      console.error('❌ Ошибка запуска polling:', err);
    });
}

// ================= ОБРАБОТЧИК ВЕБХУКА =================
app.use('/webhook', (req, res, next) => {
  // Пропускаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(200).send('Webhook endpoint is active. Please use POST.');
  }

  console.log('\n📨 ===== WEBHOOK ПОЛУЧЕН =====');
  console.log('  - Full path:', req.originalUrl);
  console.log('  - Method:', req.method);
  console.log('  - Body keys:', Object.keys(req.body || {}));
  console.log('  - Body preview:', JSON.stringify(req.body).substring(0, 200));

  try {
    // Передаём обновление в бота
    if (req.body && bot) {
      bot.processUpdate(req.body);
      console.log('✅ Update передан боту');
    } else {
      console.log('⚠️ Нет body или бот не готов');
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Ошибка обработки webhook:', error);
    res.sendStatus(500);
  }
});

// Конфигурация
const MAX_COMPLETED_REQUESTS = 10;

/* ================= ТЕСТОВЫЕ МАРШРУТЫ API ================= */

app.get('/api', (req, res) => {
  res.json({
    name: 'GreenLeaf API',
    version: '1.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: 'GET /api/health',
      test: 'GET /api/test',
      testBot: 'GET /api/test-bot',
      callback: 'POST /api/callback',
      partner: 'POST /api/partner',
      products: 'GET /api/products',
      partners: 'GET /api/partners',
    },
  });
});

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

// ================= ТЕСТОВЫЙ МАРШРУТ ДЛЯ ПРОВЕРКИ БОТА =================
app.get('/api/test-bot', async (req, res) => {
  console.log('\n🧪 ===== ТЕСТ БОТА =====');

  try {
    // Проверяем бота
    const me = await bot.getMe();
    console.log('✅ Информация о боте:', me.username);

    // Проверяем вебхук
    const webhookInfo = await bot.getWebHookInfo();
    console.log('📊 Информация о вебхуке:', webhookInfo.url);

    // Пробуем отправить сообщение
    console.log('📤 Отправка тестового сообщения...');
    const testMessage = await bot.sendMessage(
      ADMIN_ID,
      `🧪 Тестовое сообщение от API\n🕐 ${new Date().toLocaleString('ru-RU')}`,
    );
    console.log('✅ Сообщение отправлено, ID:', testMessage.message_id);

    res.json({
      success: true,
      bot: {
        username: me.username,
        id: me.id,
        isBot: me.is_bot,
      },
      webhook: {
        url: webhookInfo.url,
        pending_updates: webhookInfo.pending_update_count,
      },
      admin: {
        id: ADMIN_ID,
        message_sent: true,
        message_id: testMessage.message_id,
      },
    });
  } catch (error) {
    console.error('❌ Ошибка теста бота:', {
      message: error.message,
      code: error.code,
      response: error.response?.body,
    });

    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.response?.body,
    });
  }
});

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

app.get('/api/products', (req, res) => {
  res.json({
    products: [
      { id: 1, name: 'Product A', price: 100 },
      { id: 2, name: 'Product B', price: 200 },
      { id: 3, name: 'Product C', price: 300 },
    ],
  });
});

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

async function cleanupOldRequests() {
  try {
    const allCompleted = await Request.findAll({
      where: { status: 'выполнена' },
      order: [['completed_at', 'DESC']],
    });

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

cleanupOldRequests();

/* ================= ПРОДУКШЕН МАРШРУТЫ API ================= */

// 📞 Форма "Перезвоните"
app.post('/api/callback', async (req, res) => {
  console.log('\n📞 ===== НОВАЯ ЗАЯВКА CALLBACK =====');
  console.log('📞 Тело запроса:', req.body);

  try {
    const { phone } = req.body;

    if (!phone) {
      console.error('📞 Ошибка: телефон не указан');
      return res.status(400).json({
        success: false,
        error: 'Phone number is required',
      });
    }

    console.log('📞 Создание заявки в БД...');
    const request = await Request.create({
      type: 'callback',
      phone,
    });

    console.log('📞 Заявка создана, ID:', request.id);

    const message = `📞 Новая заявка на звонок\n\n📞 Телефон: ${phone}\n🆔 ID: ${request.id}\n🕐 Время: ${new Date().toLocaleString('ru-RU')}`;

    console.log('📤 Отправка уведомления в Telegram...');
    console.log('  - Admin ID:', ADMIN_ID);
    console.log('  - Message preview:', message.substring(0, 50) + '...');

    try {
      const sentMessage = await bot.sendMessage(ADMIN_ID, message, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
            [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
          ],
        },
      });
      console.log('✅ Уведомление отправлено, ID сообщения:', sentMessage.message_id);
    } catch (botError) {
      console.error('❌ Ошибка отправки в Telegram:', {
        message: botError.message,
        code: botError.code,
        response: botError.response?.body,
      });
    }

    res.json({
      success: true,
      message: 'Callback request received',
      requestId: request.id,
    });
  } catch (error) {
    console.error('❌ Ошибка обработки callback:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 🤝 Форма "Стать партнёром"
app.post('/api/partner', async (req, res) => {
  console.log('\n🤝 ===== НОВАЯ ЗАЯВКА PARTNER =====');
  console.log('🤝 Тело запроса:', req.body);

  try {
    const { firstName, lastName, middleName, phone, email, goal } = req.body;

    if (!phone || !firstName || !lastName) {
      console.error('🤝 Ошибка: обязательные поля не заполнены');
      return res.status(400).json({
        success: false,
        error: 'Required fields: firstName, lastName, phone',
      });
    }

    console.log('🤝 Создание заявки в БД...');
    const request = await Request.create({
      type: 'partner',
      firstName,
      lastName,
      middleName,
      phone,
      email,
      goal,
    });

    console.log('🤝 Заявка создана, ID:', request.id);

    const message = `🤝 Новая заявка партнёра\n\n👤 ФИО: ${lastName} ${firstName} ${middleName || ''}\n📞 Телефон: ${phone}\n📧 Email: ${email || 'Не указан'}\n🎯 Цель: ${
      goal === 'business' ? 'Бизнес' : goal === 'discount' ? 'Скидка' : goal || 'Не указана'
    }\n🆔 ID: ${request.id}\n🕐 Время: ${new Date().toLocaleString('ru-RU')}`;

    console.log('📤 Отправка уведомления в Telegram...');
    console.log('  - Admin ID:', ADMIN_ID);
    console.log('  - Message length:', message.length);

    try {
      const sentMessage = await bot.sendMessage(ADMIN_ID, message, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
            [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
          ],
        },
      });
      console.log('✅ Уведомление отправлено, ID сообщения:', sentMessage.message_id);
    } catch (botError) {
      console.error('❌ Ошибка отправки в Telegram:', {
        message: botError.message,
        code: botError.code,
        response: botError.response?.body,
      });
    }

    res.json({
      success: true,
      message: 'Partner request received',
      requestId: request.id,
    });
  } catch (error) {
    console.error('❌ Ошибка обработки partner:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
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

bot.onText(/\/start/, async (msg) => {
  console.log('\n🤖 Команда /start от пользователя:', msg.from?.username);
  try {
    const keyboard = await getMainKeyboard();
    await bot.sendMessage(msg.chat.id, '📋 Главное меню заявок:', keyboard);
    console.log('✅ Ответ на /start отправлен');
  } catch (error) {
    console.error('❌ Ошибка в /start:', error);
  }
});

bot.on('message', async (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    console.log('\n🤖 Сообщение от пользователя:', msg.text);
    try {
      const keyboard = await getMainKeyboard();
      await bot.sendMessage(msg.chat.id, '📋 Главное меню заявок:', keyboard);
    } catch (error) {
      console.error('❌ Ошибка обработки сообщения:', error);
    }
  }
});

bot.on('callback_query', async (query) => {
  console.log('\n🔄 Callback query:', query.data);
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  try {
    await bot.answerCallbackQuery(query.id).catch(() => {});

    if (data === 'main_menu') {
      const keyboard = await getMainKeyboard();
      await bot.editMessageText('📋 Главное меню заявок:', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboard.reply_markup,
      });
      return;
    }

    if (data === 'list_partner') {
      const requests = await Request.findAll({
        where: {
          type: 'partner',
          status: ['новая', 'просмотрена'],
        },
        order: [['created_at', 'DESC']],
      });

      if (requests.length === 0) {
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

      await bot.editMessageText('🤝 Заявки партнёрства:', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: keyboard },
      });
      return;
    }

    if (data === 'list_callback') {
      const requests = await Request.findAll({
        where: {
          type: 'callback',
          status: ['новая', 'просмотрена'],
        },
        order: [['created_at', 'DESC']],
      });

      if (requests.length === 0) {
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

      await bot.editMessageText('📞 Заявки на звонок:', {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: keyboard },
      });
      return;
    }

    if (data === 'history') {
      const doneRequests = await Request.findAll({
        where: { status: 'выполнена' },
        order: [['completed_at', 'DESC']],
        limit: MAX_COMPLETED_REQUESTS,
      });

      if (doneRequests.length === 0) {
        await bot.editMessageText('📜 История выполненных заявок пуста', {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
          },
        });
        return;
      }

      let historyText = `📜 История заявок (последние ${doneRequests.length}):\n\n`;
      doneRequests.forEach((r, index) => {
        const date = new Date(r.completed_at || r.created_at).toLocaleString('ru-RU');
        if (r.type === 'partner') {
          historyText += `${index + 1}. 🤝 ${r.lastName || ''} ${r.firstName || ''} - ${r.phone || r.email || 'Нет контакта'}\n   📅 ${date}\n\n`;
        } else {
          historyText += `${index + 1}. 📞 ${r.phone || 'Нет телефона'}\n   📅 ${date}\n\n`;
        }
      });

      await bot.editMessageText(historyText, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [[{ text: '⬅ Назад', callback_data: 'main_menu' }]],
        },
      });
      return;
    }

    if (data.startsWith('view_')) {
      const requestId = parseInt(data.replace('view_', ''));
      const request = await Request.findByPk(requestId);

      if (!request) {
        await bot.answerCallbackQuery(query.id, { text: '❌ Заявка не найдена', show_alert: true });
        return;
      }

      if (request.status === 'новая') {
        request.status = 'просмотрена';
        await request.save();
      }

      let text = '';
      let keyboard = [];

      if (request.type === 'callback') {
        text = `📞 Заявка на звонок\n\n📞 Телефон: <code>${request.phone || 'Не указан'}</code>\n⏰ Время: ${new Date(request.created_at).toLocaleString('ru-RU')}\n📊 Статус: ${request.status}\n🆔 ID: ${request.id}`;
        keyboard = [
          [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
          [{ text: '⬅ Назад', callback_data: 'list_callback' }],
        ];
      } else {
        text = `🤝 Заявка партнёра\n\n👤 ФИО: ${request.lastName || ''} ${request.firstName || ''} ${request.middleName || ''}\n📞 Телефон: <code>${request.phone || 'Не указан'}</code>\n📧 Email: <code>${request.email || 'Не указан'}</code>\n🎯 Цель: ${request.goal || 'Не указана'}\n⏰ Время: ${new Date(request.created_at).toLocaleString('ru-RU')}\n📊 Статус: ${request.status}\n🆔 ID: ${request.id}`;
        keyboard = [
          [{ text: '✅ Выполнено', callback_data: `done_${request.id}` }],
          [{ text: '⬅ Назад', callback_data: 'list_partner' }],
        ];
      }

      await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard },
      });
      return;
    }

    if (data.startsWith('done_')) {
      const requestId = parseInt(data.replace('done_', ''));
      const request = await Request.findByPk(requestId);

      if (!request) {
        await bot.answerCallbackQuery(query.id, { text: '❌ Заявка не найдена', show_alert: true });
        return;
      }

      request.status = 'выполнена';
      request.completed_at = new Date();
      await request.save();
      await cleanupOldRequests();

      await bot.answerCallbackQuery(query.id, { text: '✅ Заявка выполнена', show_alert: false });

      await bot.editMessageText(`✅ Заявка #${request.id} выполнена`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [{ text: '⬅ Назад к списку', callback_data: `list_${request.type}` }],
            [{ text: '📋 Главное меню', callback_data: 'main_menu' }],
          ],
        },
      });
      return;
    }
  } catch (error) {
    console.error('❌ Ошибка обработки callback:', error);
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 ===== СЕРВЕР ЗАПУЩЕН =====');
  console.log(`📡 Порт: ${PORT}`);
  console.log(`🤖 Admin ID: ${ADMIN_ID}`);
  console.log(`📊 Максимум заявок в истории: ${MAX_COMPLETED_REQUESTS}`);
  console.log(`🌐 API: ${WEBHOOK_BASE_URL}/api`);
  console.log(`🌍 Webhook: ${WEBHOOK_BASE_URL}/webhook/bot${BOT_TOKEN}`);
  console.log('================================\n');
});
