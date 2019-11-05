import { Request } from 'express';
export interface IRoomAuthRequest extends Request {
  user: {
    _id: string;
    username: string;
    lastLogin: Date;
    admin: boolean;
  };
}
