const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'focusforge_super_secret_jwt_key_2026',
  jwtExpiresIn: '7d',
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'focusforge',
    port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
    connectTimeout: 1500
  },
  sqlite: {
    dbPath: path.join(__dirname, '../db/focusforge.sqlite')
  }
};
