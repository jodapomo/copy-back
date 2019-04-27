import mongoose, { Schema } from 'mongoose';

const validTypes = ['link', 'text', 'file', 'img', 'video'];

const options = { discriminatorKey: 'type', _id: false };

export const ItemSchema = new Schema(
    {
        type: {
            required: true,
            type: String,
            enum: validTypes,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'Room.users',
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
    },
    options,
);

export const Item = mongoose.model( 'Item', ItemSchema );
