// Sockets

module.exports = function(io) {
  io.on('connection', socket => {
    console.log('*****************************************');
    console.log('SOCKET CONNECTED');
    socket.emit('connected');

    socket.on('user_change', (state) => {
      socket.emit('user_change', state);
    });
  });
}
