import jwt from 'jsonwebtoken';
import { Room } from '../models/room.schema';
import { createItem } from './item.controller';
import config from '../config/config';

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

        let tempUser = { username: body.username };

        let room = new Room( { name: body.name, password: body.password } );

        tempUser = room.temp_users.create( tempUser );
        room.temp_users.push( tempUser );

        room = await room.save();

        const [user, token] = generateToken( room.id, tempUser );

        return res.status( 201 ).json( {
            ok: true,
            roomId: room.id,
            room,
            user,
            token,
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

        const roomId = req.params.roomId;
        const body = req.body;

        let tempUser = { username: body.username };

        const room = await Room.findOne( { id: roomId } );

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

        const roomId = req.params.roomId;

        const room = await Room.findOne( { id: roomId } )
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
                message: `The room with id ${ roomId } does not exist.`,
                errors: { message: `The room with id ${ roomId } does not exist.` },
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

        const roomId = req.params.roomId;

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

        const roomId = req.params.roomId;

        const room = await Room.findOne( { id: roomId }, 'locked' );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${ roomId } does not exist.`,
                errors: { message: `The room with id ${ roomId } does not exist.` },
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

export const login = async ( req, res ) => {

    try {

        const roomId = req.params.roomId;
        const body = req.body;

        const room = await Room.findOne( { id: roomId } );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${ roomId } does not exist.`,
                errors: { message: `The room with id ${ roomId } does not exist.` },
            } );
        }

        if ( room.locked ) {

            if ( body.password && body.password.length > 0 ) {

                const match = await room.comparePassword( body.password );

                if ( !match ) {

                    return res.status( 403 ).json( {
                        ok: false,
                        message: `Incorrect password for the room with id ${ roomId }.`,
                        errors: { message: `Incorrect password for the room with id ${ roomId }.` },
                    } );

                }

            } else {

                return res.status( 403 ).json( {
                    ok: false,
                    message: `Room is locked and password have not been passed.`,
                    errors: { message: `Room is locked and password have not been passed.` },
                } );

            }

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

        const [user, token] = generateToken( roomId, tempUser );

        return res.status( 200 ).json( {
            ok: true,
            roomId,
            user,
            token,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error login room.',
            errors: error,
        } );

    }

};

export const checkCredentials = async ( req, res ) => {

    try {

        const roomId = req.params.roomId;
        const body = req.body;

        const room = await Room.findOne( { id: roomId }, 'locked password temp_users' );

        if ( !room ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${ roomId } does not exist.`,
                errors: { message: `The room with id ${ roomId } does not exist.` },
            } );
        }

        if ( room.locked && body.password ) {

            const match = await room.comparePassword( body.password );

            if ( match ) {

                return res.status( 200 ).json( {
                    ok: true,
                } );

            }

            return res.status( 403 ).json( {
                ok: false,
                message: `Incorrect password for the room with id ${ roomId }.`,
                errors: { message: `Incorrect password for the room with id ${ roomId }.` },
            } );

        }

        return res.status( 400 ).json( {
            ok: false,
            message: `Error authenticating room.`,
            errors: { message: `Error authenticating room.` },
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error authenticating room.',
            errors: error,
        } );

    }

};
