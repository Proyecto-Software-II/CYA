const express = require('express');
const { getUsers } = require('../lib/mysql');
const { config } = require('../config');

const usersApi = (app) => {
  const router = express.Router();
  app.use('/', router);
  router.get('/login', async (req, res) => {
    try {
      getUsers();
      res.status(200).json({
        statusCode: 200,
        message: 'users logged',
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = usersApi;
