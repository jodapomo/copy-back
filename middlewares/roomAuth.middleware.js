import jwt from 'jsonwebtoken';
import config from '../config/config';

export const verifyRoomToken = ( req, res, next ) => {

    let token = req.header( 'Authorization' );

    if ( token ) {

        token = token.split( ' ' )[1];
        const roomId = req.params.roomId;

        jwt.verify( token, config.jwtSecretKey, ( err, decoded ) => {

            if ( err || decoded.roomId !== roomId ) {
                return res.status( 401 ).json( {
                    ok: false,
                    message: `Unauthorized.`,
                    errors: err,
                } );
            }

            req.user = decoded.user;

            next();

        } );

    } else {

        return res.status( 401 ).json( {
            ok: false,
            message: `Unauthorized.`,
            errors: { message: `Unauthorized.` },
        } );

    }

};
