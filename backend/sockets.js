// Sockets

module.exports = function(io) {

  const colors = [ 'BACKGROUND_RED', 'BACKGROUND_ORANGE', 'BACKGROUND_YELLOW',
    'BACKGROUND_GREEN', 'BACKGROUND_BLUE', 'BACKGROUND_INDIGO', 'BACKGROUND_VIOLET' ]
  let currentColor = 0;

  io.on('connection', socket => {

    socket.doc = null;
    socket.user = null;

    console.log('*****************************************');
    console.log('SOCKET CONNECTED');
    socket.emit('connected');

    socket.on('join_doc', ({currentDoc, currentUser}) => {
      if (!currentDoc) {
        return socket.emit('errorMessage', 'No doc!');
      }
      if (!currentUser) {
        // uncomment next line and remove everything after when axios call always works
        // return socket.emit('errorMessage', 'No user!');
        socket.emit('errorMessage', 'NOT erroring now, but NO user!');
        socket.user = 'Sammy the Socket';
      } else {
        socket.user = currentUser.name;
      }

      // set current doc to be this doc
      socket.doc = currentDoc;
      console.log('set socket.doc', socket.doc);
      socket.join(socket.doc, () => {
        console.log('reached join doc on server');
        // emit to everyone in doc that new user joined
        socket.emit('joined_doc', colors[currentColor]);
        socket.to(socket.doc).emit('user_joined', socket.user);
        console.log('emitted join to socket doc');
        currentColor = (currentColor === colors.length-1) ? 0 : currentColor+1;
      });

    });

    // listener for editor change by user; emit to all in same doc
    socket.on('editor_change', (state) => {
      socket.to(socket.doc).emit('editor_change', state);
    });

    socket.on('disconnect', ()  => {
      socket.leave(socket.doc);
      console.log('disconnected');
      socket.to(socket.doc).emit('user_left', socket.user);
    });
  });
}
