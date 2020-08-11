const mysql = require('mysql');
const { config } = require('../config');

module.exports = mysql.createPool({
  host: config.databaseHostName,
  user: config.databaseUser,
  password: config.databasePassword,
  database: config.databaseName,
  insecureAuth: true,
});
