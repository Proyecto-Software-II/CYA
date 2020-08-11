const express = require('express');
const CancellationsService = require('../services/cancellations');
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware = require('../utils/middleware/verifyTokenMiddleware');

const { cancellationOrder } = require('../utils/email');

const { config } = require('../config');

const cancellationsApi = (app) => {
  const router = express.Router();
  app.use('/cancellations', router);

  const cancellationsService = new CancellationsService();

  router.post('/', verifyTokenMiddleware, async (req, res, next) => {
    const { subjectId } = req.body;
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        const { user } = authData;
        const order = {
          ID_USER: user.ID,
          ID_SUBJECT: subjectId,
        };
        await cancellationsService.createCancellationOrder({ order });
        cancellationOrder();
        res.status(201).json({
          statusCode: 201,
          message: 'Cancellation order created',
        });
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = cancellationsApi;
