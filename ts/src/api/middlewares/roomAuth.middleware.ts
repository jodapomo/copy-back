import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { IRoomAuthRequest } from './interfaces/roomAuthRequest.interface';
import { ITokenDecoded } from './interfaces/decodedToken.interface';
import { ErrorHandler } from '../errors/errorHandler';

export const verifyRoomToken = (req: IRoomAuthRequest, res: Response, next: NextFunction) => {
  try {
    let token = req.header('Authorization');

    if (token) {
      token = token.replace('Bearer ', '').trim();

      const { roomId } = req.params;

      jwt.verify(token, config.jwtSecretKey, (err, decoded: ITokenDecoded) => {
        if (err || Number(decoded.roomId) !== Number(roomId)) {
          throw new ErrorHandler(401, 'Unauthorized.', err);
        }

        req.user = decoded.user;

        next();
      });
    } else {
      throw new ErrorHandler(401, 'Unauthorized.', { message: `Unauthorized.` });
    }
  } catch (error) {
    next(error);
  }
};
