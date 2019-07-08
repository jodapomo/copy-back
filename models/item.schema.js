import mongoose, { Schema } from 'mongoose';
import { NoteSchema } from './note.schema';

import { LinkItemSchema } from './item-types/link-item.schema';
import { TextItemSchema } from './item-types/text-item.schema';

// const validTypes = ['link', 'text', 'file', 'img', 'video'];

const options = { discriminatorKey: 'type', timestamps: true };

export const ItemSchema = new Schema(
    {
        user: {
            id: {
                type: Schema.Types.ObjectId,
                ref: 'Room.tempUsers',
            },
            username: {
                type: String,
            },
        },
        notes: [NoteSchema],
    },
    options,
);

export const Item = mongoose.model( 'Item', ItemSchema );

export const LinkItem = Item.discriminator( 'link', LinkItemSchema );
export const TextItem = Item.discriminator( 'text', TextItemSchema );
