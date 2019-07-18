import { Room } from '../models/room.schema';

export const userJoin = async ( socket, data ) => {

    try {

        socket.join( data.roomId, async () => {

            const roomId = data.roomId;
            const username = data.username;

            socket.username = username;
            socket.roomId = roomId;

            const room = await Room.findOne( { id: roomId } );

            if ( !room ) {
                socket.to( roomId ).emit( 'userJoin', null );
                return;
            }

            const tempUser = room.tempUsers.find( user => user.username === username );

            if ( tempUser ) {

                tempUser.online = true;

            } else {
                socket.to( roomId ).emit( 'userJoin', null );
                return;
            }

            await room.save();

            const user = {
                _id: tempUser._id,
                username: tempUser.username,
                lastLogin: tempUser.lastLogin,
                online: tempUser.online,
                admin: tempUser.admin,
            };

            return socket.in( roomId ).emit( 'userJoin', user );

        } );


    } catch ( error ) {

        return socket.to( data.roomId ).emit( 'userJoin', null );

    }

};

export const userLeave = async ( socket ) => {

    try {

        socket.leave( socket.roomId, async () => {

            const roomId = socket.roomId;
            const username = socket.username;

            const room = await Room.findOne( { id: roomId } );

            if ( !room ) {
                socket.to( roomId ).emit( 'userLeave', null );
                return;
            }

            const tempUser = room.tempUsers.find( user => user.username === username );

            if ( tempUser ) {

                tempUser.lastLogin = new Date();
                tempUser.online = false;

            } else {
                socket.to( roomId ).emit( 'userLeave', null );
                return;
            }

            await room.save();

            const user = {
                _id: tempUser._id,
                username: tempUser.username,
                lastLogin: tempUser.lastLogin,
                online: tempUser.online,
            };

            return socket.to( roomId ).emit( 'userLeave', user );

        } );


    } catch ( error ) {

        return socket.to( socket.roomId ).emit( 'userLeave', null );

    }

};

export const newItem = ( socket, item ) => {

    try {

        return socket.to( socket.roomId ).emit( 'newItem', item );

    } catch ( error ) {

        return socket.to( socket.roomId ).emit( 'newItem', null );

    }

};

export const disconnect = async ( socket ) => {

    try {

        const roomId = socket.roomId;
        const username = socket.username;

        if ( !roomId || !username ) {
            return;
        }

        const room = await Room.findOne( { id: roomId } );

        if ( !room ) {
            socket.to( roomId ).emit( 'userLeave', null );
            return;
        }

        const tempUser = room.tempUsers.find( user => user.username === username );

        if ( tempUser ) {

            tempUser.lastLogin = new Date();
            tempUser.online = false;

        } else {
            socket.to( roomId ).emit( 'userLeave', null );
            return;
        }

        await room.save();

        const user = {
            _id: tempUser._id,
            username: tempUser.username,
            lastLogin: tempUser.lastLogin,
            online: tempUser.online,
        };

        return socket.to( roomId ).emit( 'userLeave', user );


    } catch ( error ) {

        return socket.to( socket.roomId ).emit( 'userLeave', null );

    }

};
