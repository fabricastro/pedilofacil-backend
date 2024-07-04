const mysql = require("mysql2/promise");
require('dotenv').config();

let pool;

async function connect() {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

connect();

function getConnection() {
  if (!pool) {
    throw new Error('Database connection not established.');
  }
  return pool;
}

module.exports = { getConnection };
