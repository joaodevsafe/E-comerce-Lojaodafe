
const mysql = require('mysql2/promise');
require('dotenv').config();

// Use test database if in test environment
const DB_NAME = process.env.NODE_ENV === 'test' 
  ? `${process.env.DB_NAME}_test` 
  : process.env.DB_NAME;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: DB_NAME || 'lojaodafe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
