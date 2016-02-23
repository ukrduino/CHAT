var crypto = require('crypto');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;
var async = require('async');
var util = require('util');
var AuthError = require('../error').AuthError;

// define the userSchema
var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    dateOfCreation: {
        type: Date,
        default: Date.now()
    }
});

userSchema.virtual("password")
    .set(function (password) {
            this._plainPassword = password;
            this.salt = Math.random() + '';
            this.hashedPassword = this.encryptPassword(password);
        }
    ).get(function () {
    return this._plainPassword;
});

userSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest("hex");
};

userSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.statics.authorize = function (username, password, callback) {
    var User = this;
    async.waterfall([
        function (callback) {
            User.findOne({username: username}, callback);
        },
        function (user, callback) {
            if (user) {
                if (user.checkPassword(password)) {
                    callback(null, user);
                } else {
                    callback(new AuthError("Wrong password"));
                }
            } else {
                user = new User({username: username, password: password});
                user.save(function (err) {
                    if (err)return callback(err);
                    callback(null, user);
                });
            }
        }
    ], callback);
};
// Export the User model
exports.User = mongoose.model('User', userSchema);

