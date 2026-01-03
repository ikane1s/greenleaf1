import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

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
