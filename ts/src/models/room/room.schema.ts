import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { TempUserSchema } from '../user/tempUser.schema';
import { IRoom } from '../../interfaces/room/room.interface';

const AutoIncrement = require('mongoose-sequence')(mongoose);

const options = { timestamps: true };

export const RoomSchema = new Schema(
  {
    name: {
      required: true,
      type: String,
    },
    password: {
      required: false,
      type: String,
    },
    locked: {
      type: Boolean,
      default: function() {
        if (this.password) {
          return true;
        }

        return false;
      },
    },
    tempUsers: [TempUserSchema],
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
  },
  options,
);

RoomSchema.pre<IRoom & mongoose.Document>('save', function(next) {
  if (!this.isModified('password') || this.password === undefined) {
    return next();
  }

  bcrypt.hash(this.password, 10).then((hash: string) => {
    this.password = hash;
    return next();
  });
});

RoomSchema.methods.comparePassword = function(plaintext: string) {
  return bcrypt.compare(plaintext, this.password);
};

RoomSchema.plugin(AutoIncrement, { inc_field: 'id' });

RoomSchema.index({ id: 1 }, { unique: true });

RoomSchema.methods.toJSON = function() {
  const room = this.toObject();

  delete room.password;

  return room;
};

export const Room = {
  name: 'Room',
  model: mongoose.model<IRoom & Document>('Room', RoomSchema),
};
