import http from 'http';
import sockets from '../services/sockets';

export default (server: http.Server) => {
  const io = require('socket.io')(server);
  sockets(io);
};
