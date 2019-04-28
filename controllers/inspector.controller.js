import urlMetadata from 'url-metadata';

export const inspectUrl = ( req, res ) => {

    const url = req.params[0];

    urlMetadata( url )
        .then( ( metadata ) => { // success handler
            res.status( 200 ).json( {
                ok: true,
                metadata,
            } );
        },
        ( error ) => { // failure handler
            console.log( error );
            res.status( 500 ).json( {
                ok: false,
                error,
            } );
        } );
};
