import mongoose, { Schema } from 'mongoose';
import { NoteSchema } from '../note/note.schema';
import { LinkItemSchema } from './types/linkItem.schema';
import { TextItemSchema } from './types/textItem.schema';
import { IItem } from '../../interfaces/item/item.interface';

const options = { discriminatorKey: 'type', timestamps: true };

export const ItemSchema = new Schema(
  {
    user: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Room.tempUsers',
      },
      username: {
        type: String,
      },
      admin: {
        type: Boolean,
        default: false,
      },
    },
    notes: [NoteSchema],
  },
  options,
);

export const Item = mongoose.model<IItem & mongoose.Document>('Item', ItemSchema);

export const LinkItem = Item.discriminator('link', LinkItemSchema);
export const TextItem = Item.discriminator('text', TextItemSchema);
