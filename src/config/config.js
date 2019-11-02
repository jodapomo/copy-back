// ==============================
// Port
// ==============================
process.env.PORT = process.env.PORT || 3000;

// ==============================
// Environment
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============================================
// Mongo config
// ============================================
let MONGO_URI;

if (process.env.NODE_ENV === 'dev') {
    MONGO_URI = 'mongodb://localhost:27017/copy';
} else {
    // eslint-disable-next-line prefer-destructuring
    MONGO_URI = process.env.MONGO_URI;
}

process.env.MONGO_URI = MONGO_URI;

module.exports.mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
};

// ============================================
// CORS options
// ============================================
const allowedOrigins = ['http://localhost:4200'];

if (process.env.ORIGIN) {
    allowedOrigins.push(process.env.ORIGIN);
}

module.exports.corsOptions = {
    origin: allowedOrigins,
};

// ============================================
// JWT config
// ============================================
module.exports.jwtSecretKey = process.env.JWT_SECRET || 'secret-dev';

module.exports.jwtOptions = {
    expiresIn: '365d',
};
