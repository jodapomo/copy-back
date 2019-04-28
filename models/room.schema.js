import mongoose, { Schema } from 'mongoose';
import { TempUserSchema } from './temp-user.schema';

const AutoIncrement = require( 'mongoose-sequence' )( mongoose );

const options = { timestamps: true };

export const RoomSchema = new Schema(
    {
        name: {
            required: true,
            type: String,
        },
        users: [TempUserSchema],
        items: [{
            type: Schema.Types.ObjectId,
            ref: 'Item',
        }],
    },
    options,
);

RoomSchema.plugin( AutoIncrement, { inc_field: 'id' } );

export const Room = mongoose.model( 'Room', RoomSchema );
