var crypto = require('crypto');
var mongoose = require('libs/mongoose');
var Schema = mongoose.Schema;

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

// Export the User model
exports.User = mongoose.model('User', userSchema);
