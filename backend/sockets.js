// Sockets

module.exports = function(io) {
  io.on('connection', socket => {
    console.log('*****************************************');
    console.log('SOCKET CONNECTED');
    socket.emit('hi');
    
    socket.on('typing', msg => {
      socket.emit('newMessage', "I got your msg " + msg)
    });
  });
}
