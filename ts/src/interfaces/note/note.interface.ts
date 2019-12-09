import { Document } from 'mongoose';

export interface INote extends Document {
  _id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INoteDTO {
  content: string;
}
