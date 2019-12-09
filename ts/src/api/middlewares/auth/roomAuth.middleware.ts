import jwt from 'jsonwebtoken';
import config from '../../../config';
import { ITokenDecoded } from './interfaces/decodedToken.interface';
import { ApiError } from '../../errors/apiError';
import { Action } from 'routing-controllers';

export const verifyRoomToken = async (action: Action, roles: string[]) => {
  let token = action.request.headers['Authorization'];

  if (token) {
    token = token.replace('Bearer ', '').trim();

    const { roomId } = action.request.params;

    jwt.verify(token, config.jwtSecretKey, (err: any, decoded: ITokenDecoded) => {
      if (err || Number(decoded.roomId) !== Number(roomId)) {
        throw new ApiError(401, 'Unauthorized.', err);
      }

      action.request.user = decoded.user;

      return true;
    });
  } else {
    throw new ApiError(401, 'Unauthorized.');
  }
  return false;
};
