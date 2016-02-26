var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');

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
    roomDate: {
        type: Date,
        default: Date.now()
    }
});

// Export the Room model
exports.Room = mongoose.model('Room', roomSchema);

