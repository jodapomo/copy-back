import mongoose from 'mongoose';
import config from '../config';

export default async (): Promise<typeof mongoose> => {
  return mongoose.connect(config.databaseURL, config.mongooseOptions);
};
