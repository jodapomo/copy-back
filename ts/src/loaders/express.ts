import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from '../config';
import { handleError } from '../api/middlewares/handleError.middleware';
import { Container } from 'typedi';
import RoomService from '../services/rooms/rooms.service';

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

  // enable CORS
  app.use(cors(config.corsOptions));

  // redirect root to /api/v1
  app.get('/', (req, res) => res.redirect('/api/v1'));

  app.get('/api/v1', async (req, res) => {
    const roomService = Container.get(RoomService);
    const rooms = await roomService.getRooms();
    res.status(200).json({ rooms });
  });

  // mount all routes on /api/v1 path
  // app.use('/api/v1', routes);

  // Error handler
  app.use(handleError);
};
