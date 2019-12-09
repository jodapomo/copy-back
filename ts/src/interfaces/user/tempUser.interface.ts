import { Document } from 'mongoose';

export interface ITempUser extends Document {
  _id: string;
  username: string;
  online: string;
  lastLogin: Date;
  admin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITempUserDTO {
  username: string;
  admin: boolean;
}
