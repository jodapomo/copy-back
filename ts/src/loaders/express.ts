import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from '../config';
import { ErrorHandler } from '../api/middlewares/errors/errorHandler.middleware';
import { Container } from 'typedi';
import { useExpressServer, useContainer } from 'routing-controllers';
import RoomService from '../services/rooms/rooms.service';
import { verifyRoomToken } from '../api/middlewares/auth/roomAuth.middleware';

export default ({ app, logger }: { app: express.Application; logger: any }) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  app.use(logger);

  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());

  // redirect root to /api/v1
  app.get('/', (req, res) => res.redirect('/api/v1'));

  app.get('/api/v1', async (req, res) => {
    const roomService = Container.get(RoomService);
    const rooms = await roomService.getRooms();
    res.status(200).json({
      app: 'Copy API',
      message: `Server OK running on ${process.env.NODE_ENV} mode.`,
      version: process.env.npm_package_version,
    });
  });

  useContainer(Container);

  useExpressServer(app, {
    cors: config.corsOptions,
    routePrefix: '/api/v1',
    controllers: [__dirname + '/../api/controllers/**/*.controller.ts'],
    middlewares: [ErrorHandler],
    defaultErrorHandler: false,
    authorizationChecker: verifyRoomToken,
  });
};
