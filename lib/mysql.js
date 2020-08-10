var mysql = require('mysql');
var { config } = require('../config');
var connection = mysql.createConnection({
  host: config.databaseHostName,
  user: config.databaseUser,
  password: config.databasePassword,
  database: config.databaseName,
});

const getUsers = () => {
  connection.connect();
  connection.query('Select * from USERS', (err, rows, fields) => {
    if (err) throw err;
    console.log(rows);
  });
  connection.end();
};

module.exports = { getUsers };
