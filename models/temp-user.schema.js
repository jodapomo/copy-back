import { Schema } from 'mongoose';

const options = { timestamps: true };

export const TempUserSchema = new Schema(
    {
        username: {
            required: true,
            type: String,
        },
        online: {
            required: true,
            type: Boolean,
            default: true,
        },
        last_login: {
            type: Date,
            default: Date.now,
        },
    },
    options,
);
