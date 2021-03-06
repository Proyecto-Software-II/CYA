require('dotenv').config();

const config = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
  databaseHostName: process.env.DB_HOSTNAME,
  databaseUser: process.env.DB_USER,
  databasePassword: process.env.DB_PASSWORD,
  databaseName: process.env.DB_NAME,
  secretKey: process.env.SECRET_KEY,
  emailHost: process.env.EMAIL_HOST,
  emailPort: process.env.EMAIL_PORT,
  emailUser: process.env.EMAIL_USER,
  emailAdmin: process.env.EMAIL_ADMIN,
  emailPassword: process.env.EMAIL_PASSWORD,
};

module.exports = { config };
