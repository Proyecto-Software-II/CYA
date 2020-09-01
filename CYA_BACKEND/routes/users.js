const express = require('express');
const UsersService = require('../services/users');
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware = require('../utils/middleware/verifyTokenMiddleware');

const { config } = require('../config');

const usersApi = (app) => {
  const router = express.Router();
  app.use('/users', router);

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
        jwt.sign({ user }, config.secretKey, (err, token) => {
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

  router.get('/subjects', verifyTokenMiddleware, async (req, res, next) => {
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        const { user } = authData;
        const subjects = await usersService.getSubjects(user.ID);
        res.status(200).json({
          statusCode: 200,
          message: 'Subjects listed',
          subjects,
        });
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/info', verifyTokenMiddleware, async (req, res, next) => {
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        const { user } = authData;
        res.status(200).json({
          statusCode: 200,
          message: 'User info',
          user,
        });
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = usersApi;
