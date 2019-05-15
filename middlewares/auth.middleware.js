import jwt from 'jsonwebtoken';
import config from '../config/config';

export const verifyToken = ( req, res, next ) => {

    const token = req.header( 'Authorization' ).split( ' ' )[1];


    jwt.verify( token, config.jwtSecretKey, ( err, decoded ) => {
        console.log( decoded );
        console.log( err );
    } );

    next();
};
