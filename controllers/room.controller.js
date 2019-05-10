import { Room } from '../models/room.schema';
import { createItem } from './item.controller';

export const getRooms = async ( req, res ) => {

    try {

        const skip = parseInt( req.query.skip ) || 0;
        const limit = parseInt( req.query.limit ) || 5;

        const rooms = await Room.find( {} )
            .populate( [
                {
                    path: 'items',
                    options: {
                        sort: { },
                        skip,
                        limit,
                    },
                },
            ] );

        return res.status( 200 ).json( {
            ok: true,
            rooms,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error loading rooms.',
            errors: error,
        } );

    }

};

export const createRoom = async ( req, res ) => {

    try {

        const body = req.body;

        const tempUser = { username: body.username };

        let room = new Room( { name: body.name } );

        room.temp_users.push( tempUser );

        room = await room.save();

        return res.status( 201 ).json( {
            ok: true,
            room,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error creating the room.',
            errors: error,
        } );

    }

};

export const addUser = async ( req, res ) => {

    try {

        const body = req.body;
        const id = req.params.id;

        let tempUser = { username: body.username };

        const room = await Room.findOne( { id } );

        tempUser = room.temp_users.create( tempUser );
        room.temp_users.push( tempUser );

        await room.save();

        return res.status( 201 ).json( {
            ok: true,
            user: tempUser,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error adding new user.',
            errors: error,
        } );

    }

};

export const getRoomById = async ( req, res ) => {

    try {

        const skip = parseInt( req.query.skip ) || 0;
        const limit = parseInt( req.query.limit ) || 5;

        const id = req.params.id;

        const room = await Room.findOne( { id } )
            .populate( [
                {
                    path: 'items',
                    options: {
                        sort: { },
                        skip,
                        limit,
                    },
                },
            ] );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${id} does not exist.`,
                errors: { message: `The room with id ${id} does not exist.` },
            } );
        }

        return res.status( 200 ).json( {
            ok: true,
            room,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error finding room.',
            errors: error,
        } );

    }

};

export const addItem = async ( req, res ) => {

    try {

        const roomId = req.params.id;

        const item = await createItem( req.body );

        await Room.updateOne( { id: roomId }, { $push: { items: item._id } } );

        return res.status( 201 ).json( {
            ok: true,
            item,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error adding the item.',
            errors: error,
        } );

    }

};
