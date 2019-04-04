const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

var cheatsheet = require('./services/cheatsheet.io')(http);


const documents = {};
const workflow = {};
const chats = {};

/*var io_testes = io
.of('/testes')
.on('connection', socket => {
  socket.on('test_msg', message => {
    socket.emit('test', 'Message : ' + message)
  });
});

var io_messages = io
.of('/messages')
.on('connection', socket => {
  socket.on('test_msg', message => {
    socket.emit('test', 'Message : ' + message)
  });
});*/

app.get('/test', function (req, res) {
  console.log("accès à /test")
  res.send("Hello world test");
});


io.on('connection', socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        console.log('curentId :', currentId)
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    }

    socket.on('getDocumentsJson', message => { // message arg
      console.log('documents : ', documents);
      io.emit('documents', documents); // event
    });


    socket.on('chat', message => { // message arg
      console.log('message : ', message);
      io.emit('chate', message); // event
    });


    socket.on('sendMessage', message => { // message arg
      console.log('message : ', message);
      documents[message.idChannel].messages = message;
      socket.to(message.idChannel).emit('document', documents[message.idChannel]);
    });

    socket.on('addWork', work => {
      workflow[work.id] = work;
      safeJoin(work.id);
      io.emit('workflow', Object.keys(workflow));
      socket.emit('workflow', wor.k);
    });

    socket.on('getWork', workId => {
      safeJoin(workId);
      socket.emit('workflow', workflow[workId]);
    });

    socket.on('editWork', work => {
      workflow[work.id] = work;
      socket.to(work.id).emit('workflow', work);
    });

    io.emit('worfklow', Object.keys(workflow));

    // documents

    socket.on('getDoc', docId => {
        safeJoin(docId);
        socket.emit('document', documents[docId]);
    });

    socket.on('addDoc', doc => {        documents[doc.id] = doc;
        safeJoin(doc.id);
        io.emit('documents', Object.keys(documents));
        socket.emit('document', doc);
    });

    socket.on('editDoc', doc => {
        documents[doc.id] = doc;
        socket.to(doc.id).emit('document', doc);
    });

    io.emit('documents', Object.keys(documents));

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, () => {
    console.log('Server écoute sur 4444');
});
