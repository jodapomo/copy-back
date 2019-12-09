import { INote } from '../note/note.interface';
import { Document } from 'mongoose';

export interface IItem extends Document {
  _id: string;
  user: {
    _id: string;
    username: string;
    admin: boolean;
  };
  notes: INote[];
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IItemDTO {
  user: string;
  notes: INote[];
}
