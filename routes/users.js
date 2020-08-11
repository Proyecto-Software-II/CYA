const express = require('express');
const UsersService = require('../services/users');
const jwt = require('jsonwebtoken');

const usersApi = (app) => {
  const router = express.Router();
  app.use('/', router);

  const usersService = new UsersService();

  router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    try {
      const user = await usersService.getUser(username);
      if (user === undefined || user.PASSWORD !== password) {
        return res.status(400).json({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Username or password incorrect',
        });
      } else {
        jwt.sign({ user }, 'secretKey', (err, token) => {
          if (err) next(err);
          return res.status(200).json({
            statusCode: 200,
            message: 'User logged',
            token,
          });
        });
      }
    } catch (error) {
      next(error);
    }
  });
};

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split('')[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).json({
      statusCode: 403,
      error: 'Forbidden',
      message: 'You must provide a token',
    });
  }
};

module.exports = usersApi;
