
export default ( io ) => {

    io.on( 'connection', ( socket ) => {
        console.log( 'User connected' );

        socket.on( 'userJoin', ( data ) => {

            socket.join( data.roomId, () => {
                const rooms = Object.keys( socket.rooms );
                console.log( 'ROOMS:', rooms );

                socket.username = data.username;
                socket.roomId = data.roomId;

                const message = `${ socket.username } join the room with id: ${ socket.roomId }`;
                console.log( message );
                socket.to( data.roomId ).emit( 'userJoin', message );
            } );

        } );

        socket.on( 'userLeave', () => {

            socket.leave( socket.roomId, () => {
                const rooms = Object.keys( socket.rooms );
                console.log( 'ROOMS:', rooms );

                const message = `${ socket.username } leave the room with id: ${ socket.roomId }`;
                console.log( message );
                socket.to( socket.roomId ).emit( 'userLeave', message );
            } );

        } );

        socket.on( 'disconnect', () => {
            console.log( 'User disconnected' );
        } );
    } );

};
