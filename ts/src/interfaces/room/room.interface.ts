import { ITempUser } from '../user/tempUser.interface';
import { IItem } from '../item/item.interface';
import { Document } from 'mongoose';

export interface IRoom extends Document {
  _id: string;
  id: number;
  name: string;
  password: string;
  locked: boolean;
  tempUsers: ITempUser[];
  items: IItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoomDTO {
  name: string;
  password: string;
  locked: boolean;
  user: ITempUser;
}
