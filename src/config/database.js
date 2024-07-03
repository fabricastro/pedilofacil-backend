const mysql = require("mysql2");
require('dotenv').config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  secret: process.env.DB_SECRET,
});

module.exports = conn;
