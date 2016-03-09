var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');

// define the messageSchema
var messageSchema = new Schema({
    messageText: {
        type: String,
        default: null
    },
    messageRoom: {
        type: String,
        required: true
    },
    messageUser: {
        type: String,
        required: true
    },
    messageUserColor: {
        type: String,
        required: true
    },
    messageDate: {
        type: Date,
        default: Date.now()
    },
    messageFile: {
        type: String,
        default: null
    }
});

// Export the Message model
exports.Message = mongoose.model('Message', messageSchema);

