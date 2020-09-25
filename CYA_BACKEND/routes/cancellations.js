const express = require('express');
const moment = require('moment');
const CancellationsService = require('../services/cancellations');
const jwt = require('jsonwebtoken');
var fs = require('fs').promises;
const verifyTokenMiddleware = require('../utils/middleware/verifyTokenMiddleware');

const { cancellationOrder, updateCancellation } = require('../utils/email');

const { config } = require('../config');

const cancellationsApi = (app) => {
  const router = express.Router();
  app.use('/cancellations', router);

  const cancellationsService = new CancellationsService();

  router.put('/message', verifyTokenMiddleware, async (req, res, next) => {
    const { message } = req.body;
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        await fs.writeFile('./cancelationMessage.txt', message);
        res.status(200).json({
          statusCode: 200,
          message: 'Cancellation message updated',
        });
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/message', verifyTokenMiddleware, async (req, res, next) => {
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        let message;
        fs.readFile('./cancelationMessage.txt', {
          encoding: 'utf-8',
        })
          .then((response) => {
            message = response;
            res.status(200).json({
              statusCode: 200,
              message,
            });
          })
          .catch((e) => {
            res.status(404).json({
              statusCode: 404,
            });
          });
      });
    } catch (error) {
      next(error);
    }
  });

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
        cancellationOrder(user);
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
        const { user } = authData;
        if (err) next(err);
        await cancellationsService.updateCancellation({ id, state });
        const cancellation = await cancellationsService.getCancellation({ id });
        if (state === 'A') {
          updateCancellation(
            cancellation[0].EMAIL,
            cancellation[0].USERNAME,
            'Tu solicitud ha sido aceptada'
          );
        } else if (state === 'D') {
          updateCancellation(
            cancellation[0].EMAIL,
            cancellation[0].USERNAME,
            'Tu solicitud ha sido denegada'
          );
        }
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
