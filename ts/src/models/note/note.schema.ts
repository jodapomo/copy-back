import { Schema } from 'mongoose';

const options = { timestamps: true };

export const NoteSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  options,
);
