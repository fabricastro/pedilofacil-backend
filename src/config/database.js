const mysql = require("mysql2");
require('dotenv').config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

function handleDisconnect() {
  conn.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      setTimeout(handleDisconnect, 2000); // Reintentar la conexión después de 2 segundos
    } else {
      console.log('Connected to the database');
    }
  });

  conn.on('error', err => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      handleDisconnect(); // Reintentar la conexión
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = conn;
