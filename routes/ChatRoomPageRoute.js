/* GET chat room page. */
var Message = require('../models/message').Message;
var Room = require('../models/room').Room;
var ObjectID = require('mongodb').ObjectID;


exports.get = function (req, res, next) {
    try {
        var id = new ObjectID(req.params.id);
    } catch (e) {
        return next(404);
    }
    Room.findById(id, function (err, room) {
        if (err) return next(err);
        if (!room) {
            return next(404);
        }
        Message.find({messageRoom: id}, function (err, messages) {
            if (err) return next(err);
            res.render('ChatRoomPage.ejs', {room: room, messages: messages});
        })
    })
};
