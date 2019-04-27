import { Schema } from 'mongoose';

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
);
