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

            const message = `${ socket.username } join the room with id: ${ socket.roomId }`;
            console.log( message );

            return socket.to( roomId ).emit( 'userJoin', user );

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

            const message = `${ socket.username } leave the room with id: ${ socket.roomId }`;
            console.log( message );

            return socket.to( roomId ).emit( 'userLeave', user );

        } );


    } catch ( error ) {

        return socket.to( socket.roomId ).emit( 'userLeave', null );

    }

};
