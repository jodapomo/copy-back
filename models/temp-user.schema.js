import { Schema } from 'mongoose';

const options = { discriminatorKey: 'type', timestamps: true };

export const TempUserSchema = new Schema(
    {
        username: {
            required: true,
            type: String,
        },
        online: {
            required: true,
            type: Boolean,
            default: false,
        },
        last_login: {
            type: Date,
        },
    },
    options,
);
