const express = require( 'express' );
const mongoose = require( 'mongoose' );

const app = express();

const bodyParser = require( 'body-parser' );
const config = require( './config/config' );

// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: false } ) );

// parse application/json
app.use( bodyParser.json() );

mongoose.connect( process.env.MONGO_URI, config.mongooseOptions, ( err ) => {
  if ( err ) throw err;

  console.log( `MongoDB: \x1b[32m%s\x1b[0m`, 'ONLINE' );
} );

app.listen( process.env.PORT, () => console.log( `Express server on port ${ process.env.PORT }: \x1b[32m%s\x1b[0m`, 'online' ) );
