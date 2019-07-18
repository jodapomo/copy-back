import urlMetadata from 'url-metadata';

export const inspectUrl = async ( req, res ) => {

    try {

        const url = req.params[0];

        const metadata = await urlMetadata( url );

        res.status( 200 ).json( {
            ok: true,
            metadata,
        } );

    } catch ( error ) {

        res.status( 500 ).json( {
            ok: false,
            error,
        } );

    }
};
