import mongoose, { Schema, Document } from 'mongoose';
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

const ItemModel = mongoose.model<IItem & Document>('Item', ItemSchema);

export const Item = {
  name: 'Item',
  model: ItemModel,
};

export const LinkItem = ItemModel.discriminator('link', LinkItemSchema);
export const TextItem = ItemModel.discriminator('text', TextItemSchema);
