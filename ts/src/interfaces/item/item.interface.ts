import { INote } from '../note/note.interface';

export interface IItem {
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
