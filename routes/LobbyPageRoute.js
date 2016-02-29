/* GET lobby page. */
var Room = require('../models/room').Room;
var async = require('async');

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
