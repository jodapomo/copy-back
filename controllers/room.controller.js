import { Room } from '../models/room.schema';

export const getRooms = ( req, res ) => {

    Room.find( {} ).exec()
        .then( ( rooms ) => {
            return res.status( 200 ).json( {
                ok: true,
                rooms,
            } );
        } )
        .catch( ( error ) => {
            return res.status( 500 ).json( {
                ok: false,
                message: 'Error loading rooms',
                errors: error,
            } );
        } );
};

export const createRoom = ( req, res ) => {

    const body = req.body;

    const tempUser = {
        username: body.username,
    };

    const room = new Room( {
        name: body.name,
    } );

    room.temp_users.push( tempUser );

    room.save()
        .then( ( newRoom ) => {
            return res.status( 201 ).json( {
                ok: true,
                room: newRoom,
            } );
        } )
        .catch( ( error ) => {
            return res.status( 500 ).json( {
                ok: false,
                message: 'Error creating the room',
                errors: error,
            } );
        } );
};

export const getRoomById = ( req, res ) => {

    const id = req.params.id;

    Room.findOne( { id } ).exec()
        .then( ( room ) => {
            return res.status( 201 ).json( {
                ok: true,
                room,
            } );
        } )
        .catch( ( error ) => {
            return res.status( 500 ).json( {
                ok: false,
                message: 'Error finding room',
                errors: error,
            } );
        } );
};
