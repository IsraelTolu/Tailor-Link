import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || 'tailor_link';
const dbUser = process.env.DB_USER || 'toby';
const dbPass = process.env.DB_PASS || 'emmanuel';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;

export const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: false,
});

export async function connectDB() {
  await sequelize.authenticate();
}