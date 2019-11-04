import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const envFound = dotenv.config();

if (envFound.error) {
  console.error("Couldn't find .env file");
  process.exit(1);
}

export default {
  port: parseInt(process.env.PORT, 10),
  databaseURL: process.env.MONGODB_URI,
  mongooseOptions: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
  },
  jwtSecretKey: process.env.JWT_SECRET,
  jwtOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  corsOptions: {
    origin: process.env.ORIGIN,
  },
};
