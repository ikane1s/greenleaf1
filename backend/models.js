import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

export const Request = sequelize.define(
  'Request',
  {
    phone: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'новая' },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    completed_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: 'requests',
    timestamps: false,
  },
);

export async function initDB() {
  await sequelize.sync();
}
