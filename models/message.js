var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');

// define the messageSchema
var messageSchema = new Schema({
    messageText: {
        type: String,
        required: true
    },
    messageRoom: {
        type: String,
        required: true
    },
    messageUser: {
        type: String,
        required: true
    },
    messageDate: {
        type: Date,
        default: Date.now()
    }
});

// Export the Message model
exports.Message = mongoose.model('Message', messageSchema);

