var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');
var User = require('./models/user').User;
var Room = require('./models/room').Room;
var Message = require('./models/message').Message;
var stringsForMessages = [];
var roomsIds = [];
var usersIds = [];


async.series([open,
    dropDataBase,
    requireModels,
    createUsers,
    createRooms,
    prepareCreateMessages,
    createMessages,
    updateNumberOfMessages
], function (err) {
    mongoose.disconnect();
});

//Opening connection to db
function open(callback) {
    mongoose.connection.on('open', callback);
}

//Deleting db
function dropDataBase(callback) {
    var db = mongoose.connection.db;
    if (mongoose.connection.readyState == 1) {
        console.log('mongoose connected to DB')
    }
    db.dropDatabase(callback);
}

// Creating indexes for each model
function requireModels(callback) {
    require('./models/user');
    require('./models/room');
    require('./models/message');
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

// Creating Users
function createUsers(callback) {
    var users = [
        {username: 'Вася', email: 'vasia@mail.ru', password: 'secret'},
        {username: 'Петя', email: 'petya@mail.ru', password: 'badguy'},
        {username: 'Админ', email: 'admin@mail.ru', password: 'hero'}
    ];

    async.each(users,
        function (userDetails, callback) {
            var user = new User(userDetails);
            user.save(callback);
        },
        callback);
}

// Creating rooms
function createRooms(callback) {

    async.waterfall([
        function (callback) {
            User.findOne({username: 'Вася'}, callback);
        },
        function (user, callback) {
            new Room({roomName: 'Васина комната', roomAuthor: user._id}).save();
            callback();
        },
        function (callback) {
            User.findOne({username: 'Петя'}, callback);
        },
        function (user, callback) {
            new Room({roomName: 'Петина комната', roomAuthor: user._id}).save();
            callback();
        },
        function (callback) {
            User.findOne({username: 'Админ'}, callback);
        },
        function (user, callback) {
            new Room({roomName: 'Администраторская', roomAuthor: user._id}).save();
            callback();
        }
    ], callback);
}

// Preparing data for creating messages
function prepareCreateMessages(callback) {
    for (var i = 0, t = 40; i < t; i++) {
        stringsForMessages.push(Math.random().toString(36).slice(-12))
    }
    async.parallel(
        {
            users: function (callback) {
                User.find({}, function (err, users) {
                    callback(err, users);
                });
            },
            rooms: function (callback) {
                Room.find({}, function (err, rooms) {
                    callback(err, rooms);
                });
            }
        },
        function (e, results) {
            getUsersAndRoomsIds(results.users, results.rooms, callback)
        },
        callback);
}

function getUsersAndRoomsIds(users, rooms, callback) {
    for (var i = 0; i < users.length; i++) {
        usersIds.push(users[i]._id);
    }
    for (var j = 0; j < rooms.length; j++) {
        roomsIds.push(rooms[j]._id);
    }
    callback();
}

function createMessages(callback) {
    async.each(stringsForMessages, function (string, callback) {
            var message = new Message({
                messageText: string,
                messageRoom: roomsIds[randomInt(0, roomsIds.length - 1)],
                messageUser: usersIds[randomInt(0, usersIds.length - 1)]
            });
            message.save(callback);
        },
        callback);
}

function updateNumberOfMessages(callback) {
    Room.find({}, function (err, rooms) {
        async.each(rooms, function (room, callback) {
                room.updateNumberOfMessages(callback);
            },
            callback);
    });
}

// random integer in range {min, max}, including min and max
function randomInt(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
