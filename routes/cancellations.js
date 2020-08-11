const express = require('express');
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware = require('../utils/middleware/verifyTokenMiddleware');

const { config } = require('../config');

const cancellationsApi = (app) => {
  const router = express.Router();
  app.use('/cancellations', router);

  router.post('/', verifyTokenMiddleware, async (req, res, next) => {
    try {
      jwt.verify(req.token, config.secretKey, (err, authData) => {
        if (err) next(err);
        res.status(200).json({
          authData,
        });
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = cancellationsApi;
