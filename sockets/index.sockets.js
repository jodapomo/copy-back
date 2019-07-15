import { userJoin, userLeave } from './room.sockets';

export default ( io ) => {

    io.on( 'connection', ( socket ) => {
        console.log( 'User connected' );

        socket.on( 'userJoin', data => userJoin( socket, data ) );

        socket.on( 'userLeave', () => userLeave( socket ) );


        socket.on( 'disconnect', () => {
            console.log( 'User disconnected' );
        } );

    } );

};
