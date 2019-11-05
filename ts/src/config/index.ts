process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

const envFound = require('dotenv').config();

if (envFound.error) {
  console.error("Couldn't find .env file");
  process.exit(1);
}

export default {
  port: parseInt(process.env.PORT || '3000', 10),
  databaseURL: process.env.MONGODB_URI,
  mongooseOptions: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
  },
  jwtSecretKey: process.env.JWT_SECRET || 'secret-dev',
  jwtOptions: {
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  corsOptions: {
    origin: process.env.ORIGIN,
  },
};
