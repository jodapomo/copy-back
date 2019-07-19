import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config/config';
import routes from './routes/index.routes';
import sockets from './sockets/index.sockets';

const app = express();
const server = http.Server( app );
const io = require( 'socket.io' )( server );


// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// parse application/json
app.use( bodyParser.json() );

// enable CORS
app.use( cors( config.corsOptions ) );

// redirect root to /api/v1
app.get( '/', ( req, res ) => res.redirect( '/api/v1' ) );

// mount all routes on /api/v1 path
app.use( '/api/v1', routes );

// sockets
sockets( io );

mongoose.connect( process.env.MONGO_URI, config.mongooseOptions, ( err ) => {
    if ( err ) throw err;

    console.log( `MongoDB: ONLINE` );
} );

server.listen( process.env.PORT, () => console.log( `Express server on port ${ process.env.PORT }: ONLINE` ) );
