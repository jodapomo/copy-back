import { userJoin, userLeave, newItem, disconnect } from './room.sockets';

export default io => {
  io.on('connection', socket => {
    socket.on('userJoin', data => userJoin(socket, data));

    socket.on('userLeave', () => userLeave(socket));

    socket.on('newItem', item => newItem(socket, item));

    socket.on('disconnect', () => {
      disconnect(socket);
    });
  });
};
