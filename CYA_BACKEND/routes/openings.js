const express = require('express');
const moment = require('moment');
const OpeningsService = require('../services/openings');
const jwt = require('jsonwebtoken');
const verifyTokenMiddleware = require('../utils/middleware/verifyTokenMiddleware');

const { cancellationOrder, updateCancellation } = require('../utils/email');

const { config } = require('../config');

const OpeningApi = (app) => {
  const router = express.Router();
  app.use('/openings', router);

  const openingsService = new OpeningsService();

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
        //TODO: mandar email
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
        //TODO: enviar correos
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
