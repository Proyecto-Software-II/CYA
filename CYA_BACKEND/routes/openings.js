const express = require('express');
const moment = require('moment');
const OpeningsService = require('../services/openings');
const jwt = require('jsonwebtoken');
var fs = require('fs').promises;
const verifyTokenMiddleware = require('../utils/middleware/verifyTokenMiddleware');

const { openingOrder, updateOpening } = require('../utils/email');

const { config } = require('../config');

const OpeningApi = (app) => {
  const router = express.Router();
  app.use('/openings', router);

  const openingsService = new OpeningsService();

  router.put('/message', verifyTokenMiddleware, async (req, res, next) => {
    const { message } = req.body;
    try {
      jwt.verify(req.token, config.secretKey, async (err, authData) => {
        if (err) next(err);
        await fs.writeFile('./openingMessage.txt', message);
        res.status(200).json({
          statusCode: 200,
          message: 'Opening message updated',
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
        fs.readFile('./openingMessage.txt', {
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
        pdf.mv('./files/openings/' + fileName);
        const { user } = authData;
        const order = {
          ID_USER: user.ID,
          ID_SUBJECT: subjectId,
          FILE_NAME: fileName,
        };
        await openingsService.createOpeningOrder({ order });
        openingOrder(user);
        res.status(201).json({
          statusCode: 201,
          message: 'Opening order created',
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
        const openings = await openingsService.getOpenings();
        res.status(201).json({
          statusCode: 201,
          message: 'Openings listed',
          openings,
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
        const opening = await openingsService.getOpening({ id });
        res.status(201).json({
          statusCode: 201,
          message: 'Opening order listed',
          opening,
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
        await openingsService.updateOpening({ id, state });
        const opening = await openingsService.getOpening({ id });
        if (state === 'A') {
          updateOpening(
            opening[0].EMAIL,
            opening[0].USERNAME,
            'Tu solicitud ha sido aceptada'
          );
        } else if (state === 'D') {
          updateOpening(
            opening[0].EMAIL,
            opening[0].USERNAME,
            'Tu solicitud ha sido denegada'
          );
        }
        res.status(201).json({
          statusCode: 201,
          message: 'Opening updated',
          opening,
        });
      });
    } catch (error) {
      next(error);
    }
  });
};

module.exports = OpeningApi;
