var cookie = require('cookie');
var async = require('async');
var cookieParser = require('cookie-parser');
var sessionStore = require('../libs/sessionStore');
var config = require('../config');
var User = require('../models/user').User;
var Message = require('../models/message').Message;
var Room = require('../models/room').Room;
var fs = require('fs');
var path = require('path');
var HttpError = require('../error').HttpError;


module.exports = function (server) {
    var io = require('socket.io')(server);
    var ss = require('socket.io-stream');
    io.set('authorization', function (handshake, accept) {
        async.waterfall([
            // get sid cookie from handshake
            function (callback) {
                handshake.cookies = cookie.parse(handshake.headers.cookie || '');
                var sidCookie = handshake.cookies[config.get('session:key')];
                var sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
                loadSession(sid, callback);
            },
            // load session to handshake.session
            function (session, callback) {
                if (!session) {
                    callback(new HttpError(401, "No session"));
                }
                handshake.session = session;
                loadUser(session, callback);
            },
            // load user to handshake.headers.user
            function (user, callback) {
                if (!user) {
                    callback(new HttpError(403, "Anonymous session may not connect"));
                }

                handshake.headers.user = user;
                callback(null);
            }
        ], function (err) {
            if (!err) {
                // accept connection
                return accept(null, true);
            }
            // refuse connection
            if (err instanceof HttpError) {
                return accept(null, false);
            }
            callback(err);
        });

    });

    io.sockets.on('connection', function (socket) {
        var messageUserColor = socket.handshake.headers.user.color;
        var username = socket.handshake.headers.user.username;

        console.log('user ' + username + ' connected');
        socket.on('new message', function (msg, cb) {
            Room.findOne({roomName: msg.messageRoom}, function (err, room) {
                if (err) {
                    console.log(err);
                }
                var message = new Message({
                    messageText: msg.messageText,
                    messageRoom: room._id,
                    messageUser: username,
                    messageUserColor: messageUserColor,
                    messageFile: msg.messageFile
                });
                message.save(function (err, message) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(message);
                    socket.broadcast.emit('chat message', message);
                    cb("Received");
                });
            });
        });
        ss(socket).on('file upload', function (stream, fileName) {
            stream.pipe(fs.createWriteStream("./static/uploadedFiles/" + fileName));
        });
        //ss(socket).on('file download', function(stream, fileName) {
        //    fs.createReadStream("./static/uploadedFiles/" + fileName).pipe(stream);
        //});
    });
};

function loadSession(sid, callback) {
    sessionStore.get(sid, function (err, session) {
        if (arguments.length == 0) {
            // no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function loadUser(session, callback) {
    if (!session) {
        return callback(null, null);
    }
    if (!session.user) {
        console.log("Session %s is anonymous", session.id);
        return callback(null, null);
    }
    //console.log("retrieving user by id:  ", session.user);
    User.findById(session.user, function (err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }
        //console.log("user findbyId result: " + user.username);
        callback(null, user);
    });
}