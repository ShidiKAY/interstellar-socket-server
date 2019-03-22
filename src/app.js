const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const documents = {};
const workflow = {};


io.on('connection', socket => {
    let previousId;
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    }

    socket.on('chat', message => { // message arg
      console.log('message : ', message);
      io.emit('chate', message); // event
    });

    socket.on('addWork', work => {
      workflow[work.id] = work;
      safeJoin(work.id);
      io.emit('workflow', Object.keys(workflow));
      socket.emit('workflow', work);
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

    socket.on('addDoc', doc => {
        documents[doc.id] = doc;
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
    console.log('Listening on port 4444');
});
