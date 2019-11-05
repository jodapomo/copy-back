import { Schema } from 'mongoose';

const options = { discriminatorKey: 'type' };

export const LinkItemSchema = new Schema(
  {
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  options,
);
