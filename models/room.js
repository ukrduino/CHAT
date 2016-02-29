var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');
var Message = require('../models/message').Message;


// define the roomSchema
var roomSchema = new Schema({
    roomName: {
        type: String,
        unique: true,
        required: true
    },
    roomAuthor: {
        type: String,
        required: true
    },

    numberOfMessages: {
        type: Number,
        default: 0
    },
    roomDate: {
        type: Date,
        default: Date.now()
    }
});

roomSchema.methods.updateNumberOfMessages = function (callback) {
    var room = this;
    Message.find({messageRoom: room._id}, function () {
        room.numberOfMessages = arguments[1].length;
        room.save();
        callback();
    })
};

// Export the Room model
exports.Room = mongoose.model('Room', roomSchema);

