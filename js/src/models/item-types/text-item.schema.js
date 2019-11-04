import { Schema } from 'mongoose';

const options = { discriminatorKey: 'type' };

export const TextItemSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
    },
    options
);
