module.exports = function (server) {
    var io = require('socket.io')(server);
    io.sockets.on('connection', function (socket) {
        console.log('a user connected');
        socket.on('chat message', function (msg, cb) {
            msg.messageUser = "Guy";
            console.log('message: ' + msg.messageText);
            console.log('message: ' + msg.messageUser);
            socket.broadcast.emit('chat message', msg);
            cb("Received");
        });
    });
};
