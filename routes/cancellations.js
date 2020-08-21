const express = require('express');
const moment = require('moment');
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
        const fileName = moment().format('DD_MM_YY_hh_mm_ss') + '.pdf';
        let pdf = req.files.pdf;
        pdf.mv('./files/' + fileName);
        const { user } = authData;
        const order = {
          ID_USER: user.ID,
          ID_SUBJECT: subjectId,
          FILE_NAME: fileName,
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

  router.get('/', verifyTokenMiddleware, async (req, res, next) => {
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        const cancellations = await cancellationsService.getCancellations();
        res.status(201).json({
          statusCode: 201,
          message: 'Cancellations listed',
          cancellations,
        });
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', verifyTokenMiddleware, async (req, res, next) => {
    const { id } = req.params;
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        const cancellation = await cancellationsService.getCancellation({ id });
        res.status(201).json({
          statusCode: 201,
          message: 'Cancellation order listed',
          cancellation,
        });
      });
    } catch (error) {
      next(error);
    }
  });

  router.put('/:id', verifyTokenMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const { state } = req.body;
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        await cancellationsService.updateCancellation({ id, state });
        //TODO: informar del cambio por correo
        const cancellation = await cancellationsService.getCancellation({ id });
        res.status(201).json({
          statusCode: 201,
          message: 'Cancellation updated',
          cancellation,
        });
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = cancellationsApi;
