import mongoose, { Schema } from 'mongoose';
import { TempUserSchema } from './temp-user.schema';
import { ItemSchema } from './item.schema';

const AutoIncrement = require( 'mongoose-sequence' )( mongoose );

export const RoomSchema = new Schema(
    {
        name: {
            required: true,
            type: String,
        },
        users: [TempUserSchema],
        items: [ItemSchema],
    },
    {
        timestamps: true,
    },
);

RoomSchema.plugin( AutoIncrement, { inc_field: 'id' } );

export const Room = mongoose.model( 'Room', RoomSchema );
