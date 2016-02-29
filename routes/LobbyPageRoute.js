/* GET lobby page. */
var Room = require('../models/room').Room;
var async = require('async');
var HttpError = require('../error').HttpError;
var MongoError = require('../node_modules/mongodb-core/lib/error.js');

exports.get = function (req, res, next) {
    Room.find({}, function (err, rooms) {
        if (err) return next(err);
        if (!rooms) return next(404);
        async.forEach(rooms, function (room, callback) {
                room.updateNumberOfMessages(callback)
            },
            res.render('LobbyPage.ejs', {rooms: rooms}))
    })
};

exports.post = function (req, res, next) {
    Room({
        roomName: req.body.newRoomName,
        roomAuthor: req.user._id,
    }).save(function (err) {
        if (err) {
            if (err instanceof MongoError) {
                console.log(err.message);
                return next(new HttpError(409, "Room with such name already exists"));
            } else {
                return next(err);
            }
        }
        res.redirect('/lobby')
    });
};
