import { Sequelize, DataTypes } from 'sequelize';

// Настройка подключения к PostgreSQL
// DATABASE_URL должен быть в формате: postgresql://user:password@host:port/database
const getSequelizeConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL не установлен. Убедитесь, что переменная окружения DATABASE_URL настроена.',
    );
  }

  // Определяем, нужен ли SSL (обычно нужен для облачных БД, не нужен для локальной)
  const needsSSL =
    databaseUrl.includes('railway') ||
    databaseUrl.includes('render') ||
    databaseUrl.includes('heroku');

  return {
    dialect: 'postgres',
    dialectOptions: needsSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  };
};

const sequelize = new Sequelize(process.env.DATABASE_URL, getSequelizeConfig());

export const Request = sequelize.define(
  'Request',
  {
    type: {
      type: DataTypes.STRING,
      allowNull: false, // callback | partner
    },

    phone: DataTypes.STRING,

    // данные партнёра
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    email: DataTypes.STRING,
    goal: DataTypes.TEXT,

    status: {
      type: DataTypes.STRING,
      defaultValue: 'новая', // новая | просмотрена | выполнена
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },

    completed_at: DataTypes.DATE,
  },
  {
    tableName: 'requests',
    timestamps: false,
  },
);

export async function initDB() {
  await sequelize.sync();
}
