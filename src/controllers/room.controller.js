import jwt from 'jsonwebtoken';
import { Room } from '../models/room.schema';
import { createItem } from './item.controller';
import config from '../config/config';

export const getRoomById = async ( req, res ) => {

    try {

        const skip = parseInt( req.query.skip ) || 0;
        const limit = parseInt( req.query.limit ) || 15;

        const roomId = req.params.roomId;

        const room = await Room.findOne( { id: roomId } )
            .populate( [
                {
                    path: 'items',
                    options: {
                        sort: { createdAt: -1 },
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

export const getItemsByRoomId = async ( req, res ) => {

    try {

        const page = parseInt( req.query.page ) || 1;
        const pageSize = parseInt( req.query.pageSize ) || 15;

        const skip = ( page - 1 ) * pageSize;

        const roomId = req.params.roomId;

        const items = await Room.findOne( { id: roomId } )
            .select( '-_id' )
            .select( 'items' )
            .populate( [
                {
                    path: 'items',
                    options: {
                        sort: { createdAt: -1 },
                        skip,
                        limit: pageSize,
                    },
                },
            ] );

        if ( !items ) {
            return res.status( 400 ).json( {
                ok: false,
                message: `The room with id ${ roomId } does not exist.`,
                errors: { message: `The room with id ${ roomId } does not exist.` },
            } );
        }

        return res.status( 200 ).json( {
            ok: true,
            items: items.items,
        } );

    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Error fetching items.',
            errors: error,
        } );

    }

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

export const addUser = async ( req, res ) => {

    try {

        const roomId = req.params.roomId;
        const body = req.body;

        let tempUser = { username: body.username };

        const room = await Room.findOne( { id: roomId } );

        tempUser = room.tempUsers.create( tempUser );
        room.tempUsers.push( tempUser );

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


export const addItem = async ( req, res ) => {

    try {

        const roomId = req.params.roomId;
        const user = {
            _id: req.user._id,
            username: req.user.username,
            admin: req.user.admin,
        };


        const item = await createItem( req.body, user );

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

const generateToken = ( roomId, tempUser ) => {

    const user = {
        _id: tempUser._id,
        username: tempUser.username,
        lastLogin: tempUser.lastLogin,
        admin: tempUser.admin,
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

                    return res.status( 400 ).json( {
                        ok: false,
                        message: `Incorrect password for the room with id ${ roomId }.`,
                        errors: { message: `Incorrect password for the room with id ${ roomId }.` },
                    } );

                }

            } else {

                return res.status( 400 ).json( {
                    ok: false,
                    message: `Room is locked and password have not been passed.`,
                    errors: { message: `Room is locked and password have not been passed.` },
                } );

            }

        }

        let tempUser = room.tempUsers.find( user => user.username === body.username );

        if ( tempUser ) {

            tempUser.lastLogin = new Date();
            tempUser.online = true;

        } else {

            tempUser = { username: body.username };
            tempUser = room.tempUsers.create( tempUser );
            room.tempUsers.push( tempUser );

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

export const createRoomAndLogin = async ( req, res ) => {

    try {

        const body = req.body;

        let tempUser = { username: body.username, admin: true };

        let room = new Room( { name: body.name, password: body.password } );

        tempUser = room.tempUsers.create( tempUser );
        room.tempUsers.push( tempUser );

        room = await room.save();

        const [user, token] = generateToken( room.id, tempUser );

        return res.status( 201 ).json( {
            ok: true,
            roomId: room.id,
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

export const checkCredentials = async ( req, res ) => {

    try {

        const roomId = req.params.roomId;
        const body = req.body;

        const room = await Room.findOne( { id: roomId }, 'locked password tempUsers' );

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

            return res.status( 400 ).json( {
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

export const getAuthUser = ( req, res ) => {
    try {

        const user = req.user;

        return res.status( 200 ).json( {
            ok: true,
            user,
        } );


    } catch ( error ) {

        return res.status( 500 ).json( {
            ok: false,
            message: 'Server error.',
            errors: error,
        } );

    }
};
