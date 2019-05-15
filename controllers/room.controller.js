import jwt from 'jsonwebtoken';
import { Room } from '../models/room.schema';
import { createItem } from './item.controller';
import config from '../config/config';

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

        let room = new Room( { name: body.name, password: body.password } );

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

        const id = req.params.id;
        const body = req.body;

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

export const isLocked = async ( req, res ) => {

    try {

        const id = req.params.id;

        const room = await Room.findOne( { id }, 'locked' );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${id} does not exist.`,
                errors: { message: `The room with id ${id} does not exist.` },
            } );
        }

        return res.status( 200 ).json( {
            ok: true,
            locked: room.locked,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error finding room.',
            errors: error,
        } );

    }

};

const generateToken = ( roomId, tempUser ) => {

    const user = {
        id: tempUser._id,
        username: tempUser.username,
        last_login: tempUser.last_login,
    };

    const token = jwt.sign(
        {
            user,
            roomId,
        },
        config.jwtSecretKey,
        config.jwtOptions,
    );

    return [user, token];
};

export const login = async ( req, res ) => {

    try {

        const id = req.params.id;
        const body = req.body;

        const room = await Room.findOne( { id } );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${id} does not exist.`,
                errors: { message: `The room with id ${id} does not exist.` },
            } );
        }

        let tempUser = room.temp_users.find( user => user.username === body.username );

        if ( tempUser ) {

            tempUser.last_login = new Date();
            tempUser.login = true;

        } else {

            tempUser = { username: body.username };
            tempUser = room.temp_users.create( tempUser );
            room.temp_users.push( tempUser );

        }

        await room.save();

        const [user, token] = generateToken( id, tempUser );

        return res.status( 200 ).json( {
            ok: true,
            roomId: id,
            user,
            token,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error finding room.',
            errors: error,
        } );

    }

};

export const checkCredentials = async ( req, res ) => {

    try {

        const id = req.params.id;
        const body = req.body;

        const room = await Room.findOne( { id }, 'locked password temp_users' );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${id} does not exist.`,
                errors: { message: `The room with id ${id} does not exist.` },
            } );
        }

        if ( room.locked && body.password ) {

            room.comparePassword( body.password, ( err, match ) => {

                if ( err ) {
                    throw new Error( 'Error authenticating the password' );
                }

                if ( match ) {

                    return res.status( 200 ).json( {
                        ok: true,
                    } );

                }

                return res.status( 403 ).json( {
                    ok: false,
                    message: `Incorrect password for the room with id ${ id }`,
                    errors: { message: `Incorrect password for the room with id ${ id }` },
                } );

            } );

        } else {

            return res.status( 400 ).json( {
                ok: false,
                message: `Error authenticating room.`,
                errors: { message: `Error authenticating room.` },
            } );

        }

        return null;


    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error authenticating room.',
            errors: error,
        } );

    }

};
