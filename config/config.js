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

if ( process.env.NODE_ENV === 'dev' ) {
    MONGO_URI = 'mongodb://localhost:27017/copy';
} else {
    MONGO_URI = process.env.MONGO_URI;
}

process.env.MONGO_URI = MONGO_URI;

module.exports.mongooseOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    // autoIndex: false, --> on prod
};
